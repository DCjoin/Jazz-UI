import Ajax from '../ajax/Ajax.jsx';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Util from 'util/Util.jsx';

function downloadByStream(res) {
	let filename = '';
	let disposition = res.header['content-disposition'];
	if (disposition && disposition.indexOf('attachment') !== -1) {
	    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	    let matches = filenameRegex.exec(disposition);
	    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
	}
	let type = res.header['content-type'];
	let blob = null;
	try {
		blob = new Blob([res], { type: type });
	} catch( e ) {
		if (e.name == 'InvalidStateError') {
          let bb = new MSBlobBuilder();
          bb.append(res);
          blob = bb.getBlob(type);
        } else {
        	console.log(e);
        }
	}
	if( !blob ) {
		console.log('Can not create blob. Please dead.');
		return;
	}
	if (typeof window.navigator.msSaveBlob !== 'undefined') {
	    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
	    window.navigator.msSaveBlob(blob, filename);
	} else {
	    let URL = window.URL || window.webkitURL;
	    let downloadUrl = URL.createObjectURL(blob);

	    if (filename) {
	        // use HTML5 a[download] attribute to specify filename
	        let a = document.createElement('a');
	        // safari doesn't support this yet
	        if (typeof a.download === 'undefined') {
	            window.location = downloadUrl;
	        } else {
	            a.href = downloadUrl;
	            a.download = filename;
	            document.body.appendChild(a);
	            a.click();
	        }
	    } else {
	        window.location = downloadUrl;
	    }

	    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
	}
}

function downloadByOss(res) {
	window.open(res);
}

function successFunc(isStream) {
	return (res) => {
		if( isStream ) {
			downloadByStream(res);
		} else {
			downloadByOss(res);
		}		
		AppDispatcher.dispatch({
		     type: 'DOWNLOAD_FILE_SUCCESS'
		});
	}
}

function errorFunc(err) {
	console.log(err);
	AppDispatcher.dispatch({
	     type: 'DOWNLOAD_FILE_ERROR'
	});
}

function download(func) {
	return (path, params, isStream) => {
		return func(path, {
			params, 
			success: successFunc(isStream), 
			error: errorFunc, 
			noParseRes: isStream,
		});
	}
}

export default {
	post: download(Ajax.post),
	get: download(Ajax.get),
}
export function getOssPath(path, success) {
	Ajax.get(path, {success});
}