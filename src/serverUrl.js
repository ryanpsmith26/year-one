// this file is for development purposes of year-one-server to fetch data from a local dev server
// warning: making calls to the dev server may create 'Access-Control-Allow-Origin' error

const PORT = 8080;
const LOCALHOST = `http://localhost:${PORT}`;
const HEROKU = 'https://year-one-server.herokuapp.com';

export const URL = LOCALHOST;
// export const URL = HEROKU;
