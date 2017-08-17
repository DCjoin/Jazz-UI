import {Map, List} from 'immutable'
export function binarySearch(compare, data, baseIdx = 0) {
	console.log(baseIdx);
	if( !data ) {
		return null;
	}
	if( data instanceof List ) {
		let length = data.size;
		if( length === 0 ) {
			return null;
		} 
		let flag = Math.ceil(length / 2);
		console.log(flag);
		switch( compare(data.get(flag - 1)) ) {
			case -1:
				if( flag !== 1 ) {
					return binarySearch(compare, data.slice(0, flag));
				}
				return null;
			case 1:
				if( flag !== length ) {
					return binarySearch(compare, data.slice(flag, length), baseIdx + flag);
				}
				return null;
			case 0:
				return Map({
					data: data.get(flag - 1),
					index: baseIdx +flag - 1,
				});
		}
	} else if( data instanceof Array ) {
		let length = data.length;
		if( length === 0 ) {
			return null;
		}
		let flag = Math.ceil(length / 2);

		switch( compare(data[flag - 1]) ) {
			case -1:
				if( flag !== 1 ) {
					return binarySearch(compare, data.slice(0, flag));
				}
				return null;
			case 1:
				if( flag !== length ) {
					return binarySearch(compare, data.slice(flag, length), baseIdx + flag);
				}
				return null;
			case 0:
				return {
					data: data[flag - 1],
					index: baseIdx + flag - 1,
				};
		}
	}
}