import json
from os import listdir
from typing import Any
from jsondiff import diff
import jsondiff


def strip_values(d: dict[str, Any]) -> dict[str, Any]:
    r = {}
    for k, v in d.items():
        if type(v) == dict:
            r[k] = strip_values(v)
        else:
            r[k] = ""

    return r

def translate_diff():
    pass

def main():
    # TODO: Argparse and logging
    # Parse the en.json (TODO optionally pass another locale to use as source
    # of truth)
    parent_locale_file = "en.json"
    locale_files = listdir("./messages")
    locale_files.remove(parent_locale_file)
    parent_locale = json.load(open(f"./messages/{parent_locale_file}"))

    # We're just interested in comparing what keys are missing from the translation file
    parent_locale_stripped = strip_values(parent_locale)

    print(locale_files)
    for locale_file in locale_files:
        locale = json.load(open(f"./messages/{locale_file}"))

        locale_stripped = strip_values(locale)
        d = diff(locale_stripped, parent_locale_stripped)

        patched = jsondiff.patch(locale, d)

        print(patched)
        break # TODO: Remove break

        # Maybe i could just merge the json and call the google translate API.
        #merged = {**parent_locale, **locale}
        #print(json.dumps(merged))
        break


    

if __name__ == "__main__":
    main()
