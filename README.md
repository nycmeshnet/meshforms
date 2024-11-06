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

- To setup against beta/prod, continue to the next section and use `https://db.nycmesh.net` as the value for `NEXT_PUBLIC_MESHDB_URL`
- To setup a local copy of meshdb, follow the instructions in the readme [there](https://github.com/nycmeshnet/meshdb) first.  
   Then continue to the next section below and use the value `http://127.0.0.1:8000` for `NEXT_PUBLIC_MESHDB_URL`

To get started with this package, first, create your own copy of the `.env` file:

```
cp .env.sample .env
```

Edit the `NEXT_PUBLIC_MESHDB_URL` based on your choice above in your favorite text editor. For example:

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

2. Copy `.env.sample` into `.env.local` and fill it out

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
