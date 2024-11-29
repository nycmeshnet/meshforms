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


class AutoTranslator:
    def __init__(self, src: str, dest: str) -> None:
        self.src = src
        self.dest = dest

        # Crappy hack to ensure we pick simplified Chinese
        # TODO: Remove this if we ever get more specific about our locale
        if self.dest == "zh":
            self.dest = "zh-cn"

    def auto_translate_parent_locale_into_patched_locale(
        self, patched_locale, parent_locale
    ) -> dict[Any, Any]:
        r = {}
        translator = Translator()
        for k, v in patched_locale.items():
            if type(v) == dict:
                r[k] = self.auto_translate_parent_locale_into_patched_locale(
                    v, parent_locale[k]
                )
            elif v == "":
                # TODO: pass locale
                auto_translated_text = translator.translate(
                    parent_locale[k], src=self.src, dest=self.dest
                ).text
                logging.info(
                    f"Translated missing text: '{parent_locale[k]}' -> '{auto_translated_text}'"
                )
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

    parser.add_argument(
        "-p",
        "--parent-locale",
        default="en",
        help="Parent locale to diff and translate from. Defaults to English.",
    )
    parser.add_argument(
        "-t",
        "--target-locale",
        default="",
        help="Target locale to diff and translate to. Defaults to all locales.",
    )

    parser.add_argument(
        "-w",
        "--write",
        action="store_true",
        help="Enables writing translations to file. This program prints them by default.",
    )

    parser.add_argument(
        "-g",
        "--git-commits",
        action="store_true",
        help="Creates a commit for each translation. Implies -w",
    )

    args = parser.parse_args()

    # Parent locale is based on args. Set up some variables for it.
    parent_locale_name = args.parent_locale
    parent_locale_file = f"{parent_locale_name}.json"

    # Load in the parent locale
    parent_locale = json.load(open(f"./messages/{parent_locale_file}"))

    # We're just interested in comparing what keys are missing from the
    # translation file. More on that later.
    parent_locale_stripped = strip_values(parent_locale)

    # Optionally set up Git
    if args.git_commits:
        repo = Repo()

    # If there's a target locale specified, then limit the list to that one.
    if args.target_locale:
        locale_files = [f"{args.target_locale}.json"]
    else:
        # Get the rest of the locales and remove the parent locale from the list.
        locale_files = listdir("./messages")
        locale_files.remove(parent_locale_file)

    logging.info(f"Locales to translate: {locale_files}")
    for locale_file in locale_files:
        # Set up variables for the current target locale
        locale_name = pathlib.Path(locale_file).stem
        locale_path = f"./messages/{locale_file}"

        logging.info(f"{parent_locale_name} -> {locale_name}")

        # Load current locale in
        locale = json.load(open(locale_path))

        # We strip the values out of the locales and focus on what keys are missing
        # from the target locale and patching them in. Also remove keys that the parent locale lacks.
        # FIXME (wdn): There's a bug in here where it won't preserve values that have
        # moved.

        # Strip values from the target locale
        locale_stripped = strip_values(locale)

        # Diff the keys
        d = diff(locale_stripped, parent_locale_stripped)

        if d == {}:
            logging.warning("Diff is empty, skipping this locale and moving on.")
            continue

        # Patch them in
        patched_locale = jsondiff.patch(locale, d)

        # Now that we know what keys are blank, we need to take that patched
        # locale and the parent locale and call Google Translate to fill in the
        # gaps.
        at = AutoTranslator(parent_locale_name, locale_name)
        translated_locale = at.auto_translate_parent_locale_into_patched_locale(
            patched_locale, parent_locale
        )

        # Write and commit the translations
        if args.write or args.git_commits:
            logging.info("Writing translations to file...")
            with open(locale_path, "w") as f:
                json.dump(translated_locale, f, ensure_ascii=False, indent=2)

            if args.git_commits:
                repo.index.add(locale_path.strip("./"))
                repo.index.commit(f"Add translations to {locale_file}")
        else:
            print(json.dumps(translated_locale, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
