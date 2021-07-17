# musicquery
A task project that queries songs of albums from searched artists using the graphbrainz API.

Built in React.js (create-react-app) using a standalone Node.js server offered by graphbrainz.
Every query to the graphbrainz API is done with GraphQL through the @apollo/client package.

## Install
This project uses [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).
The Node.js version must be 14 or higher.

<br>In the root of the project, run:
```
npm install
```

### Environment variables
<br>Create a .env file in the graphbrainz directory and add in there:
```
GRAPHBRAINZ_CORS_ORIGIN=*
```
It is needed for testing purposes in order to not get your requests blocked by CORS.

## Usage
<br>To start the graphbrainz server, navigate into the graphbrainz directory and run:
```
node cli.js
```
<br>To start the react app, navigate into the root of the project and run:
```
npm start
```

## References
[graphbrainz](https://github.com/exogen/graphbrainz)
[@apollo/client](https://www.apollographql.com/docs/react/)


## License

MIT © Mei Meçaj