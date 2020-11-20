import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import './App.css';

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

	const handleSubmitSearch = (e) => {
		e.preventDefault();
		setTitles([]);
		setTitle({});
		setLoadingTitles(true);
		axios
			.request(options('search', searchInput))
			.then(function(response) {
				setTitles(response.data.titles);
				console.log('titles--->', titles);
				setLoadingTitles(false);
			})
			.catch(function(error) {
				console.error(error);
			});

		setSearchInput('');
	};

	const handleDisplayMovieInfo = (id) => {
		setTitle({});
		setLoadingTitleInfo(true);
		axios
			.request(options('film', id))
			.then(function(response) {
				setTitle(response.data);
				console.log('title--->', response.data);
				setLoadingTitleInfo(false);
			})
			.catch(function(error) {
				console.error(error);
			});
	};

	const handleUpVote = () => {
		if (!title.upVote) setTitle((prevTitle) => ({ ...prevTitle, upVote: 1 }));
		else setTitle((prevTitle) => ({ ...prevTitle, upVote: prevTitle.upVote++ }));
	};

	const handleDownVote = () => {
		if (!title.downVote) setTitle((prevTitle) => ({ ...prevTitle, downVote: 1 }));
		else setTitle((prevTitle) => ({ ...prevTitle, downVote: prevTitle.downVote++ }));
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
							<p>Total IMDB Votes: {title.rating_votes}</p>
							<div className="voteBtnContainer">
								<button onClick={handleUpVote} className="voteBtns">
									<FontAwesomeIcon icon={faThumbsUp} />
								</button>
								<p>{title.upVote}</p>
								<button onClick={handleDownVote} className="voteBtns">
									<FontAwesomeIcon icon={faThumbsDown} />
								</button>
								<p>{title.downVote}</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Movies;
