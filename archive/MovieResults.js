import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import { URL } from '../src/serverUrl';

const imdbOptions = (method, str) => ({
	method: 'GET',
	url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/${method}/${str}`,
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_IMDB_API_KEY,
		'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
	}
});

const MovieResults = ({ title }) => {
	const [ loadingTitleInfo, setLoadingTitleInfo ] = useState(false);
	const [ title, setTitle ] = useState({});

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

		// update local state for quick re-render
		setTitle((prevTitle) => ({ ...prevTitle, thumbsUp: prevTitle.thumbsUp++ }));
	};

	const handleThumbsDown = async () => {
		await axios.put(`${URL}/api/movies/thumbsDown`, {
			imdbId: title.id,
			title: title.title
		});

		// update local state for quick re-render
		setTitle((prevTitle) => ({ ...prevTitle, thumbsDown: prevTitle.thumbsDown++ }));
	};

	return (
		<div className="singleMovie">
			{loadingTitleInfo && <p>Loading...</p>}
			{title.title && (
				<div className="movieCard">
					<img src={`${title.poster}`} className="movieImg" />

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
						{/* VOTE BTNS */}
						<div className="voteBtnContainer">
							<button onClick={handleThumbsUp} className="voteBtns">
								<FontAwesomeIcon icon={faThumbsUp} />
							</button>
							<p>{title.thumbsUp}</p>
							<button onClick={handleThumbsDown} className="voteBtns">
								<FontAwesomeIcon icon={faThumbsDown} />
							</button>
							<p>{title.thumbsDown}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MovieResults;
