import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import votes from './votes';

const appReducer = combineReducers({
	votes
});

const store = createStore(appReducer, applyMiddleware(thunkMiddleware));
export default store;

export * from './votes';
