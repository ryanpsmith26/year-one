import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import { URL } from '../serverUrl';

const options = (method, str) => ({
	method: 'GET',
	url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/${method}/${str}`,
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_IMDB_API_KEY,
		'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
	}
});

const Movies = ({}) => {
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
			const res = await axios.request(options('search', searchInput));
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
			const res = await axios.request(options('film', id));
			setTitle(res.data);
			const movie = await axios.get(`${URL}/api/movies/${id}`);
			const thumbsUp = movie.data.thumbsUp;
			const thumbsDown = movie.data.thumbsDown;
			setTitle((prevTitle) => ({ ...prevTitle, thumbsUp, thumbsDown }));
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingTitleInfo(false);
		}
	};

	const handleUpVote = async () => {
		await axios.put(`${URL}/api/movies/thumbsUp`, {
			imdbId: title.id,
			title: title.title
		});

		// for local state
		setTitle((prevTitle) => ({ ...prevTitle, thumbsUp: prevTitle.thumbsUp++ }));
	};

	const handleDownVote = async () => {
		await axios.put(`${URL}/api/movies/thumbsDown`, {
			imdbId: title.id,
			title: title.title
		});

		// for local state
		setTitle((prevTitle) => ({ ...prevTitle, thumbsDown: prevTitle.thumbsDown++ }));
	};

	return (
		<div className="App">
			<header className="App-header" />
			<form onSubmit={handleSubmitSearch}>
				<label>
					Search for your next flick!
					<input
						type="text"
						placeholder="Enter Movie Title"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>
			<div className="allMovies">
				{loadingTitles && <p>Loading...</p>}
				{titles &&
					titles.map((title, i) => {
						// fix key
						return (
							<button key={i} onClick={() => handleDisplayMovieInfo(title.id)}>
								{title.title}
							</button>
						);
					})}
			</div>
			<div className="singleMovie">
				{loadingTitleInfo && <p>Loading...</p>}
				{title.title && (
					<div className="movieCard">
						<img src={`${title.poster}`} className="movieImg" />

						<div className="movieData">
							<p>Title: {title.title}</p>
							<p>Year: {title.year}</p>
							<p>Length: {title.length}</p>
							<p>IMDB Rating: {title.rating}</p>
							<div className="voteBtnContainer">
								<button onClick={handleUpVote} className="voteBtns">
									<FontAwesomeIcon icon={faThumbsUp} />
								</button>
								<p>{title.thumbsUp}</p>
								<button onClick={handleDownVote} className="voteBtns">
									<FontAwesomeIcon icon={faThumbsDown} />
								</button>
								<p>{title.thumbsDown}</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Movies;
