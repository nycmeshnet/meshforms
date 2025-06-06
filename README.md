# meshforms

[![Deployment Status](https://github.com/WillNilges/meshforms/actions/workflows/publish-and-deploy.yaml/badge.svg)](https://github.com/WillNilges/meshforms/actions/workflows/publish-and-deploy.yaml)

Forms for [meshdb](https://github.com/nycmeshnet/meshdb). Live version hosted at https://forms.nycmesh.net/

This repo currently powers three separate forms:

- Join Form, used to collect contact information from interested future mesh members
- NN Assign form, used by mesh volunteers to provision network numbers for new installs
- Query form, a legacy interface used by mesh volunteers to query information from meshDB
  (use of https://db.nycmesh.net/admin/) is recommended instead for new workflows

# Development

You will either need a copy of `meshdb` running locally, or point your local copy of this package to the beta/production
endpoints in order to do development:

- To setup against beta/prod, continue to the next section and use `https://devdb.nycmesh.net` as the value for `MESHDB_URL`
- To setup a local copy of meshdb, follow the instructions in the readme [there](https://github.com/nycmeshnet/meshdb) first.  
   Then continue to the next section below and use the value `http://127.0.0.1:8000` for `MESHDB_URL`

To get started with this package, first, create your own copy of the `.env` file:

```
cp .env.sample .env
```

Edit the `MESHDB_URL` value based on your choice above in your favorite text editor. For example:

```
nano .env
# Press Ctrl-X and then y to exit
```

Next run the following commands to run the nextjs app on your local machine:

```
npm install

npm run dev
```

Finally, open `http://127.0.0.1:3000` in your web browser to interact with your copy of the application

## Formatting

We use [Prettier](https://prettier.io/docs/en/install) for formatting our code. 
There is a GitHub check that will get mad at you if you don't format your code
correctly.

To appease it, run `npx prettier . --write`

# Testing

> [!WARNING]  
> Make sure you run playwright from the root of the repo, otherwise you will get some
> errors about invalid URLs.

We use `playwright` to do integration tests. You can run them with the following instructions:

1. Setup a dev instance of [meshdb](https://github.com/nycmeshnet/meshdb)

2. Copy `.env.sample` into `.env.local` (`.env` will not work!) and fill it out

3. Run the integration tests with `npx playwright test`

## Tips for Testing

### UI Mode

Run with `npx playwright test --ui` to get a nice UI to see your tests with.

https://playwright.dev/docs/running-tests#run-tests-in-ui-mode

### Headed Mode

Playwright will show you the browser window it is using with `--headed`,
and you can pause a test to examine the browser by inserting `page.pause()`
in your test.

### Running a specific test

To run a specific test, you can use `-g`:

`npx playwright test -g 'missing name'`

See the [docs](https://playwright.dev/docs/running-tests) for more information about playwright.

### Troubleshooting Tests

If you get an error like this one:

```
[WebServer] [Error: ENOENT: no such file or directory, open '/home/wilnil/Code/nycmesh/meshforms/.next/BUILD_ID'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/home/wilnil/Code/nycmesh/meshforms/.next/BUILD_ID'
}

Error: Process from config.webServer was not able to start. Exit code: 1
```

Try running `npm run build`

## Internationalization

> [!NOTE]
> Do you speak a language besides English? Please help us by adding more languages,
> validating our existing translations, or translating more of Meshforms!

We use `next-intl` as a library for internationalization. 

To add a new language:
- Copy an existing language from `messages/` directory
- Translate the messages into your language
- Add your [language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) to `middleware.ts` and `src/i18n/routing.ts`
- Add a case to the switch statement in `src/i18n/request.ts`
- Update the "locale" key in every file in the `messages/` directory (this one: `"locale": "{locale, select, en {🇺🇸 English} es {🇪🇸 Español} fr {🇫🇷 Français} ht {🇭🇹 Haitian Creole} zh {🇨🇳 中文} other {Unknown}}"`)
- Add some tests to ensure that your language shows up in the Join Form properly

> [!WARNING]
> Please keep the language codes alphabetical!

Thank you for your contributions!

### `translate.py`

We have a script located at `scripts/translate.py` that will use Google Translate
to automatically translate additional strings added in (by default) `en.json`.

To use it,

1. Make a venv

```
python -m venv .venv
source .venv/bin/activate"
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. Create translation commits
```
python scripts/translate.py -g
```

4. Push to your GitHub branch
```
git push
```

5. Work with translators to validate Google's translations.
