import flatten from 'lodash-es/flatten';
import util from 'util/Util.jsx';

function flattenStoresListeners(stores) {
	return stores.map( store => {
		if(store.store) {
			let realStore = store.store;
			return {
				add: store.add.map( add => realStore[add].bind(realStore) ),
				remove: store.remove.map( remove => realStore[remove].bind(realStore) ),
			}
		}
		return {
			add: [store.addChangeListener.bind(store)],
			remove: [store.removeChangeListener.bind(store)],
		}
	} );

}

function addListeners(stores) {
	return flatten(flattenStoresListeners(stores).map(store => store.add));
}
function removeListeners(stores) {
	return flatten(flattenStoresListeners(stores).map(store => store.remove));
}
function actionWithListener(cb) {
	return (listener) => {
		listener(cb);
	}
}

function ReduxDecorator(Base) {

	class ContainerClass extends Base {

		constructor(props, context) {
			super(props, context);

			this._onChange = this._onChange.bind(this);

			this.state = {...this.state, ...Base.calculateState(this.state, props, context,undefined)};
			addListeners(Base.getStores()).map(actionWithListener(this._onChange));
		};

		componentWillReceiveProps(nextProps, nextContext) {
			if (super.componentWillReceiveProps) {
				super.componentWillReceiveProps(nextProps, nextContext);
			}
		}

		shouldComponentUpdate(nextProps, nextState) {
			return ( !util.shallowEqual(this.props, nextProps) || !util.shallowEqual(this.state, nextState) );
		}

		componentWillUnmount() {
			if (super.componentWillUnmount) {
				super.componentWillUnmount();
			}

			removeListeners(Base.getStores()).map(actionWithListener(this._onChange));
		}

		_onChange(param) {
			let {state, props, context} = this;
			if( !util.shallowEqual(state, Base.calculateState(state, props, context,param)) ) {
				this.setState(() => {
					return Base.calculateState(state, props, context,param)
				});
			}
		}

	}

	return ContainerClass;

}

module.exports = ReduxDecorator;