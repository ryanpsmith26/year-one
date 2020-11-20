import axios from 'axios';
import { URL } from './serverUrl';

// ACTION TYPES ========================================
const GET_DOCTORS = 'GET_DOCTORS';

// ACTION CREATORS =====================================
const gotDoctors = (doctors) => ({
	type: GET_DOCTORS,
	doctors
});

// THUNK CREATORS ======================================
export const getDoctors = () => async (dispatch) => {
	try {
		const { data: doctors } = await axios.get(`${URL}/api/doctors`);
		dispatch(gotDoctors(doctors));
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
