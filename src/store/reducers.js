import C from '../constants'
import { combineReducers } from 'redux'
import { twoPlacedFloat } from '../timeHelpers';

/*
** sets app.timerProps
*/

const numIntervals = (state=0, action) => {
	switch (action.type) {
		case C.CLEAR_TIMER_FORM:
			return ""
		case C.SET_NUM_INTERVALS:
			return +action.payload;
		case C.EDIT_TIMER: case C.CHOOSE_TIMER:
			return +action.payload.numIntervals
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.timerProps.numIntervals;
		default:
			return state;
	}
}

const intervalTime = (state=0, action) => {
	switch (action.type) {
		case C.CLEAR_TIMER_FORM:
			return "";
		case C.SET_INTERVAL_TIME:
			return +twoPlacedFloat(action.payload);
		case C.EDIT_TIMER: case C.CHOOSE_TIMER:
			return +twoPlacedFloat(action.payload.intervalTime);
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.timerProps.intervalTime;			
		default:
			return state;
	}
}

const restTime = (state=0, action) => {
	switch (action.type) {
		case C.CLEAR_TIMER_FORM:
			return "";
		case C.SET_REST_TIME:
			return +(action.payload);
		case C.EDIT_TIMER: case C.CHOOSE_TIMER:
			return +(action.payload.restTime)
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.timerProps.restTime;
		default:
			return state;
	}
}

const restIncrement = (state=0, action) => {
	switch (action.type) {
		case C.CLEAR_TIMER_FORM:
			return "";
		case C.SET_REST_INCREMENT:
			return +(action.payload);
		case C.EDIT_TIMER: case C.CHOOSE_TIMER:
			return +(action.payload.restIncrement)
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.timerProps.restIncrement;
		default:
			return state;
	}
}

const defaultNumIntervals = (state=0, action) => {
	switch (action.type) {
		case C.SET_DEFAULT_NUM_INTERVALS:
			return action.payload;
		default:
			return state;
	}
}

const defaultIntervalTime = (state=0, action) => {
	switch (action.type) {
		case C.SET_DEFAULT_INTERVAL_TIME:
			return action.payload;
		default:
			return state;
	}
}

const defaultRestTime = (state=0, action) => {
	switch (action.type) {
		case C.SET_DEFAULT_REST_TIME:
			return action.payload;
		default:
			return state;
	}
}

const defaultRestIncrement = (state=0, action) => {
	switch (action.type) {
		case C.SET_DEFAULT_REST_INCREMENT:
			return action.payload;
		default:
			return state;
	}
}

// array of objects with timer configurations
const timers = (state=[], action) => {	
	switch (action.type) {
		case C.SAVE_TIMER:
			return [
			...state,
			action.payload
			];
		case C.EDIT_TIMER:
			const { timerName } = action.payload;
			return state.filter(timers => timers.timerName !== timerName)
		case C.DELETE_TIMER:
			const { timerName: name } = action.payload;

			return state.filter(timers => timers.timerName !== name)
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.timerProps.timers;
		default:
			return state
	}
}

const timerName = (state="", action) => {
	switch (action.type) {
		case C.CLEAR_TIMER_FORM:
			return "";
		case C.SET_TIMER_NAME:
			return action.payload;
		case C.EDIT_TIMER: case C.CHOOSE_TIMER:
			return action.payload.timerName
		case C.SET_INITIAL_STATE:		
			return action.payload.app.user.timerProps.timerName
		default:
			return state;
	}
}

const totalTime = (state=0, action) => {
	switch (action.type) {
		case C.SET_TOTAL_TIME:
			return action.payload;
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.currentTimer.timerData.totalTime;
		default:
			return state
	}
}

/*
** sets app.currentTimer
** reference for app.runningTimer
*/

const timerData = (state={}, action) => {
	switch (action.type) {
		case C.CHOOSE_TIMER:
			return action.payload;
		case C.SET_INITIAL_STATE:
			return action.payload.app.user.currentTimer.timerData;
		default:
			return state;
	}
}

const timerSwitch = (state=0, action) => {
	switch (action.type) {
		case C.START_TIMER:
			return action.payload;
		case C.STOP_TIMER:
			clearInterval(state);
			return state;
		case C.CLEAR_TIMER:
			clearInterval(state);
			return 0;
		default:
			return state;
	}
}

const completedIntervals = (state=0, action) => {
	switch (action.type) {
		case C.INCREMENT_INTERVALS:
			return state + 1;
		case C.SET_INITIAL_INTERVAL:
			return 0;
		default:
			return state;
	}
}

const loggedIn = (state=false, action) => {
	switch (action.type) {
		case C.SET_LOGIN_UID: case C.SET_INITIAL_STATE:
			return true
		case C.LOGOUT:
			return false;
		default:
			return state;
	}
}

const uid = (state="", action) => {
	switch (action.type) {
		case C.SET_LOGIN_UID:
			return action.payload;
		case C.LOGOUT:
			return "";
		case C.SET_INITIAL_STATE:
			return localStorage['workout-timer-uid'];
		default:
			return state;
	}
}

const fullName = (state="", action) => {
	switch (action.type) {
		case C.SET_FULLNAME:
			return action.payload
		// case SET_INITIAL_STATE:
		// 	return 
		default:
			return state;
	}
}

const email = (state="", action) => {
	switch (action.type) {
		case C.SET_EMAIL:
			return action.payload
		default:
			return state;
	}
}

const photoURL = (state="", action) => {
	switch (action.type) {
		case C.SET_PHOTO_URL:
			return action.payload
		default:
			return state;
	}
}

const rootReducer = (state, action) => {
	switch (action.type) {
		case C.LOGOUT:
			return mainReducer(undefined, action);
		default:
			return state;
	}
}

/**/

const mainReducer = combineReducers({
	app: combineReducers({
		loggedIn,
		user: combineReducers({
			details: combineReducers({
				fullName,
				email,
				photoURL,
				uid
			}),
			timerProps: combineReducers({
				defaults: combineReducers({
					defaultNumIntervals,
					defaultIntervalTime,
					defaultRestTime,
					defaultRestIncrement
				}),
				numIntervals,
				intervalTime,
				restTime,
				restIncrement,
				timerName,
				timers
			}),
			currentTimer: combineReducers({
				timerData,
				timerSwitch,
				completedIntervals
			})	
		})
	})
});

export default mainReducer;
