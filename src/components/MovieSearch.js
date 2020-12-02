import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import { URL } from '../serverUrl';
import logo from '../images/clapperboard.jpeg';

const imdbOptions = (method, str) => ({
	method: 'GET',
	url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/${method}/${str}`,
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_IMDB_API_KEY,
		'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
	}
});

const MovieSearch = () => {
	const [ loadingTitles, setLoadingTitles ] = useState(false);
	const [ loadingTitleInfo, setLoadingTitleInfo ] = useState(false);
	const [ searchInput, setSearchInput ] = useState('');
	const [ titles, setTitles ] = useState([]);
	const [ title, setTitle ] = useState({});

	const handleSubmitSearch = async (e) => {
		e.preventDefault();
		setTitles([]);
		setTitle({});
		setLoadingTitles(true);
		setSearchInput('');
		try {
			const res = await axios.request(imdbOptions('search', searchInput));
			setTitles(res.data.titles);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingTitles(false);
		}
	};

	const handleDisplayMovieInfo = async (id) => {
		setTitle({});
		setLoadingTitleInfo(true);
		try {
			// get movie info from IMDB and put on state
			const res = await axios.request(imdbOptions('film', id));
			setTitle(res.data);
			// get vote data from our DB and add it to state
			const { data: movie } = await axios.get(`${URL}/api/movies/${id}`);
			const { thumbsUp, thumbsDown } = movie;
			setTitle((prevTitle) => ({ ...prevTitle, thumbsUp, thumbsDown }));
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingTitleInfo(false);
		}
	};

	const handleThumbsUp = async () => {
		await axios.put(`${URL}/api/movies/thumbsUp`, {
			imdbId: title.id,
			title: title.title
		});

		// update local state for re-render
		setTitle((prevTitle) => ({ ...prevTitle, thumbsUp: prevTitle.thumbsUp++ }));
	};

	const handleThumbsDown = async () => {
		await axios.put(`${URL}/api/movies/thumbsDown`, {
			imdbId: title.id,
			title: title.title
		});

		// update local state for re-render
		setTitle((prevTitle) => ({ ...prevTitle, thumbsDown: prevTitle.thumbsDown++ }));
	};

	return (
		<div className="App">
			{/* HEADER / SEARCH ========================================== */}
			<header className="header">
				<div className="headerLogo">
					<img src={logo} alt="" className="logoImg" />
					<h1>IMDB Movie Lookup!</h1>
				</div>
				<form onSubmit={handleSubmitSearch} className="movieSearchForm">
					<input
						type="text"
						placeholder="Enter Movie Title"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<button type="submit">
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</form>
			</header>
			{/* MOVIE SEARCH RESULTS =================================== */}
			<div className="allMoviesResults">
				{!titles.length && !loadingTitles && <h2>Search for your next film!</h2>}
				{loadingTitles && <h2>Loading...</h2>}
				{titles &&
					titles.map((title) => {
						return (
							<button key={title.id} onClick={() => handleDisplayMovieInfo(title.id)}>
								<img src={title.image} alt="Poster for movie result" className="allMoviesImg" />
							</button>
						);
					})}
			</div>
			<div className="selectedMovie">
				{loadingTitleInfo && <h2>Loading...</h2>}
				{title.title && (
					<div className="movieCard">
						<img src={`${title.poster}`} alt="Poster for selected movie" className="selectedMovieImg" />

						<div className="movieData">
							<p>
								<strong>Title:</strong> {title.title}
							</p>
							<p>
								<strong>Release Year:</strong> {title.year}
							</p>
							<p>
								<strong>Length:</strong> {title.length}
							</p>
							<p>
								<strong>IMDB Rating:</strong> {title.rating}
							</p>
							<p>
								<strong>Plot:</strong> {title.plot}
							</p>
							<button onClick={handleThumbsUp} className="voteBtns">
								<FontAwesomeIcon icon={faThumbsUp} />
							</button>
							<span className="thumbsUpNum">{title.thumbsUp}</span>
							<button onClick={handleThumbsDown} className="voteBtns">
								<FontAwesomeIcon icon={faThumbsDown} />
							</button>
							<span>{title.thumbsDown}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MovieSearch;
