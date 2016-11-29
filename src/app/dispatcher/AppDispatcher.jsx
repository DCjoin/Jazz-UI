import flux from 'flux';

let { Dispatcher } = flux;

let queuePayload = [];

let AppDispatcher = new Dispatcher();

let oldDispatch = AppDispatcher.dispatch;
let oldStopDispatching = AppDispatcher._stopDispatching;

AppDispatcher.dispatch = function(payload) {
	if(AppDispatcher.isDispatching()) {
		queuePayload.push(payload);
	} else {
		oldDispatch.call(this, payload);
	}
};
AppDispatcher._stopDispatching = function(payload) {
	for(let i = 0; i < queuePayload.length; i++) {
		AppDispatcher.dispatch(queuePayload[i]);
	}
	queuePayload = [];	
};

module.exports = AppDispatcher;
