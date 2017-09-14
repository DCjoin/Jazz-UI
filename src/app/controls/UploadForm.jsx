import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Ajax from '../ajax/Ajax.jsx';
import util from 'util/Util.jsx';

const UPLOAD_IFRAME = 'UPLOAD_IFRAME';

export default class UploadForm extends Component {
	upload(params = {}, onLoad) {
		let {method, action, onload, onError} = this.props;
        var fileName = this._file.name,
        reader = new FileReader();
        reader.readAsDataURL(this._file);
        reader.onload = function(){
        	params.content = util.setUploadSource(this.result);
        	params.FileName = fileName;

        	Ajax[method](action, {
        	    params: params,
        	    commonErrorHandling: false,
        	    success: function(data){
       	    		onload && onload(data);
        	    },
        	    error: function(err, res){
       	    		onError && onError(err, res);
        	    }
        	});
        }
	}
	reset() {
		this.refs.fileInput.value = '';
	}
	render() {
		let {action, fileName, method, onChangeFile, id, inputProps} = this.props;
		return (
			<form target={UPLOAD_IFRAME} style={{display: 'inline'}}
				action={'http://web-api-dev.energymost.com/api' + action} 
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
