import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Ajax from '../ajax/Ajax.jsx';

const UPLOAD_IFRAME = 'UPLOAD_IFRAME';

export default class UploadForm extends Component {
	upload(params = {}, onLoad) {
		// let newInputs = [];
		// if( typeof params === 'object' ) {
		// 	Object.keys(params).forEach( (key) => {
		// 		let input = document.createElement('input');
		// 		input.type = 'hidden';
		// 		input.name = key;
		// 		input.value = params[key];
		// 		newInputs.push(input);
		// 		ReactDOM.findDOMNode(this).appendChild(input);
		// 	} )
		// }
		let {method, action, onload, onError} = this.props;
        var reader = new FileReader();
        reader.readAsDataURL(this._file);
        reader.onload = function(){
        	params.content = this.result;

        	Ajax[method](action, {
        	    params: params,
        	    success: function(data){
       	    		onload && onload(data);
        	    },
        	    error: function(err, res){
       	    		onError && onError(data);
        	    }
        	});
        }
		// let iframe = document.createElement('iframe');
		// iframe.setAttribute('style', {
		// 	display: 'none'
		// });
		// iframe.name = 'UPLOAD_IFRAME';

		// document.body.appendChild(iframe);
		// ReactDOM.findDOMNode(this).enctype = this.props.enctype || 'multipart/form-data';
		// ReactDOM.findDOMNode(this).submit();
		// iframe.onload = () => {
		// 	this.props.onload(iframe);
		// 	document.body.removeChild(iframe);
		// };
		// this.forceUpdate();
		// newInputs.forEach( input => ReactDOM.findDOMNode(this).removeChild(input) )
	}
	reset() {
		this.refs.fileInput.value = '';
	}
	render() {
		let {action, fileName, method, onChangeFile, id, inputProps} = this.props;
		return (
			<form target={UPLOAD_IFRAME} style={{display: 'inline'}}
				action={'http://web-api-dev.energymost.com/' + action} 
				method={method} >
				<input {...inputProps} id={id} name={id} type='file' ref='fileInput' 
					style={{
					    cursor: 'pointer',
					    position: 'absolute',
					    top: 0,
					    bottom: 0,
					    right: 0,
					    left: 0,
					    width: '100%',
					    opacity: 0
					}}
					onChange={(event) => {
						this._file = event.target.files[0];
						onChangeFile.call(this, event);
					}} 
					name={fileName}/>
				{this.props.children}
			</form>
		);
	}
}

UploadForm.propTypes = {
	action: PropTypes.string.isRequired,
	fileName: PropTypes.string.isRequired,
	enctype: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	onload: PropTypes.func.isRequired,
	onChangeFile: PropTypes.func.isRequired,
}
