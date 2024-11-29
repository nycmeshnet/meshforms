from ast import parse
import json
import logging
from os import listdir
import pathlib
from typing import Any
from jsondiff import diff
import jsondiff
from googletrans import Translator
import argparse
from git import Repo

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

    parser = argparse.ArgumentParser(
        prog="next-intl diff auto translator",
        description="Takes a diff of your parent locale's messages against another locale and fills in the gaps with Google Translate.",
        epilog="WARNING: May clobber existing translations, always have an expert look over the diff.",
    )

    parser.add_argument("-p", "--parent-locale", default="en", help="Parent locale to diff and translate from. Defaults to English.")
    parser.add_argument("-t", "--target-locale", default="", help="Target locale to diff and translate to. Defaults to all locales.")

    parser.add_argument("-w", "--write", action="store_true", help="Enables writing translations to file. This program prints them by default.")

    parser.add_argument("-g", "--git-commits", action="store_true", help="Creates a commit for each translation. Implies -w")

    args = parser.parse_args()

    # TODO: Argparse and logging
    # Parse the en.json (TODO optionally pass another locale to use as source
    # of truth)

    # TODO: Print translations instead of wirting to file
    parent_locale_name = args.parent_locale
    parent_locale_file = f"{parent_locale_name}.json"
    locale_files = listdir("./messages")
    locale_files.remove(parent_locale_file)

    parent_locale = json.load(open(f"./messages/{parent_locale_file}"))
    # We're just interested in comparing what keys are missing from the translation file
    parent_locale_stripped = strip_values(parent_locale)

    if args.git_commits:
        repo = Repo()
    
    if args.target_locale:
        locale_files = [f"{args.target_locale}.json"]
    logging.info(f"Locales to translate: {locale_files}")
    for locale_file in locale_files:
        locale_name = pathlib.Path(locale_file).stem
        locale_path = f"./messages/{locale_file}"

        logging.info(f"{parent_locale_name} -> {locale_name}")
        locale = json.load(open(locale_path))

        # FIXME (wdn): There's a bug in here where it won't preserve values that have
        # moved.
        locale_stripped = strip_values(locale)
        d = diff(locale_stripped, parent_locale_stripped)

        patched_locale = jsondiff.patch(locale, d)

        at = AutoTranslator(parent_locale_name, locale_name)
        translated_locale = at.auto_translate_parent_locale_into_patched_locale(patched_locale, parent_locale)

        if args.write or args.git_commits:
            logging.info("Writing translations to file...")
            with open(locale_path, 'w') as f:
                json.dump(translated_locale, f, ensure_ascii=False, indent=4)
            
            if args.git_commits:
                repo.index.add(locale_path)
                repo.index.commit(f"Add translations to {locale_file}")
        else:
            print(json.dumps(translated_locale, ensure_ascii=False, indent=4))

if __name__ == "__main__":
    main()
