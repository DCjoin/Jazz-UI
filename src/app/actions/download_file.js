import Ajax from '../ajax/Ajax.jsx';
import Util from 'util/Util.jsx';

export default {
	post: (path, params) => {
		Ajax.post(path, {
			params, 
			// dataType: 'application/octet-stream',
			success: (res) => {
				console.log(res);
			},
			error: (err) => {
				console.error(err);
			}
		});
		// window.open('http://web-api-dev.energymost.com/api' + path);
	},

	get: (path) => {
		// window.open('http://web-api-dev.energymost.com/api' + path);
		Ajax.get(path, {
			// dataType: 'application/octet-stream',
			success: (res) => {
				// window.open(res);
				// Util.openTab(res);

				let iframe = document.createElement('iframe');
				iframe.setAttribute('style', {
					display: 'none'
				});
				iframe.src = res;
				// iframe.name = 'UPLOAD_IFRAME';

				document.body.appendChild(iframe);
				// ReactDOM.findDOMNode(this).enctype = this.props.enctype || 'multipart/form-data';
				// ReactDOM.findDOMNode(this).submit();
				iframe.onload = () => {
					// this.props.onload(iframe);
					document.body.removeChild(iframe);
				};
			},
			error: (err) => {
				console.error(err);
			}
		});
	},
}