import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import doctors from './doctor';
// import patients from './patient';
import appts from './appt';

const appReducer = combineReducers({
	doctors,
	// patients,
	appts
});

const store = createStore(appReducer, applyMiddleware(thunkMiddleware));
export default store;

export * from './doctor';
export * from './appt';
// export * from './patient';
