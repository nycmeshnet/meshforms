import json
import logging
from os import listdir
import pathlib
from typing import Any
from jsondiff import diff
import jsondiff
from googletrans import Translator

logging.basicConfig(level=logging.INFO)

def strip_values(d: dict[str, Any]) -> dict[str, Any]:
    r = {}
    for k, v in d.items():
        if type(v) == dict:
            r[k] = strip_values(v)
        else:
            r[k] = ""

    return r

class AutoTranslator():
    def __init__(self, src: str, dest: str) -> None:
        self.src = src
        self.dest = dest

    def auto_translate_parent_locale_into_patched_locale(self, patched_locale, parent_locale) -> dict[Any, Any]:
        r = {}
        translator = Translator()
        for k, v in patched_locale.items():
            if type(v) == dict:
                r[k] = self.auto_translate_parent_locale_into_patched_locale(v, parent_locale[k])
            elif v == "":
                # TODO: pass locale
                auto_translated_text = translator.translate(parent_locale[k], src=self.src, dest=self.dest).text
                logging.info(f"Translated missing text: '{parent_locale[k]}' -> '{auto_translated_text}'")
                r[k] = auto_translated_text
            else:
                r[k] = v

        return r

def main():
    # TODO: Argparse and logging
    # Parse the en.json (TODO optionally pass another locale to use as source
    # of truth)
    parent_locale_file = "en.json"
    parent_locale_name = pathlib.Path(parent_locale_file).stem
    locale_files = listdir("./messages")
    locale_files.remove(parent_locale_file)
    parent_locale = json.load(open(f"./messages/{parent_locale_file}"))

    # We're just interested in comparing what keys are missing from the translation file
    parent_locale_stripped = strip_values(parent_locale)

    print(locale_files)
    for locale_file in locale_files:
        locale_name = pathlib.Path(locale_file).stem

        logging.info(f"{parent_locale_name} -> {locale_name}")
        locale = json.load(open(f"./messages/{locale_file}"))

        # FIXME (wdn): There's a bug in here where it won't preserve values that have
        # moved.
        locale_stripped = strip_values(locale)
        d = diff(locale_stripped, parent_locale_stripped)

        patched_locale = jsondiff.patch(locale, d)

        at = AutoTranslator(parent_locale_name, locale_name)
        translated_locale = at.auto_translate_parent_locale_into_patched_locale(patched_locale, parent_locale)

        logging.info("Writing translations to file...")
        with open(f"./messages/{locale_file}", 'w') as f:
            json.dump(translated_locale, f)

        break # TODO: Remove break


    

if __name__ == "__main__":
    main()
