# meshforms

[![Deployment Status](https://github.com/WillNilges/meshforms/actions/workflows/publish-and-deploy.yaml/badge.svg)](https://github.com/WillNilges/meshforms/actions/workflows/publish-and-deploy.yaml)

Forms for [meshdb](https://github.com/nycmeshnet/meshdb). Live version hosted at https://forms.grandsvc.mesh.nycmesh.net/

This repo currently powers three separate forms:
- Join Form, used to collect contact information from interested future mesh members
- NN Assign form, used by mesh volunteers to provision network numbers for new installs
- Query form, a legacy interface used by mesh volunteers to query information from meshDB
   (use of https://db.grandsvc.mesh.nycmesh.net/admin/) is recommended instead for new workflows

# Development

You will either need a copy of `meshdb` running locally, or point your local copy of this package to the beta/production
endpoints in order to do development:
- To setup against beta/prod, continue to the next section and use `https://db.grandsvc.mesh.nycmesh.net` as the value for `NEXT_PUBLIC_MESHDB_URL`
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