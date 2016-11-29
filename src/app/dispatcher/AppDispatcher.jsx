import flux from 'flux';

let { Dispatcher } = flux;

let queuePayload = [];

let AppDispatcher = new Dispatcher();

let oldDispatch = AppDispatcher.dispatch;

AppDispatcher.dispatch = function(payload) {
	if(AppDispatcher.isDispatching()) {
		setTimeout( function() {
			AppDispatcher.dispatch(payload);
		}, 0);
	} else {
		oldDispatch.call(this, payload);
	}
};

module.exports = AppDispatcher;
