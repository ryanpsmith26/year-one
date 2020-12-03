const imdbOptions = (method, str) => ({
	method: 'GET',
	url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/${method}/${str}`,
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_IMDB_API_KEY,
		'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
	}
});

export default imdbOptions;
