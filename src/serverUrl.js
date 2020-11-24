const PORT = 8080;
const LOCALHOST = `http://localhost:${PORT}`;
const HEROKU = 'https://year-one-server.herokuapp.com';

// comment out before Heroku deployment:
// export const URL = LOCALHOST;

// comment in before Heroku deployment:
export const URL = HEROKU;
