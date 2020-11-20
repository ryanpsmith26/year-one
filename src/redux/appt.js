import axios from 'axios';
import { URL } from './serverUrl';

// ACTION TYPES ========================================
const GET_APPTS = 'GET_APPTS';

// ACTION CREATORS =====================================
const gotAppts = (appts) => ({
	type: GET_APPTS,
	appts
});

// THUNK CREATORS ======================================
export const getAppts = () => async (dispatch) => {
	try {
		const { data: appts } = await axios.get(`${URL}/api/appts`);
		dispatch(gotAppts(appts));
	} catch (error) {
		console.error(error);
	}
};

// INITIAL STATE =======================================
const initialState = [];

// REDUCER =============================================
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_APPTS:
			return action.appts;
	}
	return state;
};

export default reducer;
