export function curry(func) {
	let wrapper = (f, ...args) => {
		if( args.length < f.length ) {
			return (...newArg) => wrapper.apply(undefined, [f].concat[args].concat[newArg]);
		}
		return f(args)
	}
	return wrapper.apply(undefined, arguments);
}