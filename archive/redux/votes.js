import axios from 'axios';
import { URL } from '../../src/serverUrl';

// ACTION TYPES ========================================
const THUMBS_UP = 'THUMBS_UP';
const THUMBS_DOWN = 'THUMBS_DOWN';

// ACTION CREATORS =====================================
const thumbsUp = () => ({
	type: THUMBS_UP
});

const thumbsDown = () => ({
	type: THUMBS_DOWN
});

// THUNK CREATORS ======================================
export const voteThumbsUp = () => async (dispatch) => {
	try {
		await axios.post(`${URL}/api/movies/thumbsUp`);
	} catch (error) {
		console.error(error);
	}
};

// INITIAL STATE =======================================
const initialState = [];

// REDUCER =============================================
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_DOCTORS:
			return action.doctors;
	}
	return state;
};

export default reducer;
