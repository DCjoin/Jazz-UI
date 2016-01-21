'use strict';

import React from 'react';



import classnames from 'classnames';
import BackgroundImage from '../controls/BackgroundImage.jsx';
import util from '../util/util.jsx';
import AjaxDialog from '../controls/AjaxDialog.jsx';


const FILE_TYPE_IMAGE_REG = /(image\/png|image\/jpe?g|image\/bmp|image\/gif)/;
const DEFAULT_IMAGE_SIZE_MAX = 1024 * 1000 * 2;
const DEFAULT_WRAPPER_WIDTH = 480;
const DEFAULT_WRAPPER_HEIGHT = 320;
const ENABLE_FILE_LIMIT = false;

let ImageUpload = React.createClass({



	propTypes: {
		tips: React.PropTypes.string,
		updateTips: React.PropTypes.string,
		isViewState: React.PropTypes.bool,
		clip: React.PropTypes.bool,
		clipRatioWidth: React.PropTypes.number,
		clipRatioHeight: React.PropTypes.number,
		background:React.PropTypes.string,
		imageSource: React.PropTypes.string,
		imageSizeMax: React.PropTypes.number,
		wrapperWidth: React.PropTypes.number,
		wrapperHeight: React.PropTypes.number,
		clipMode:React.PropTypes.string
	},

	_handleClick(){
		this.refs.pop_image_upload_button.getDOMNode().value='';
	},
	_handlerChangeImageUpload(event) {
		let that = this,
			files = event.target.files;
		if(files.length > 0) {
			let file = files[0];

			if(!FILE_TYPE_IMAGE_REG.test(file.type)) {
				this.refs.errorDialog._error('照片添加失败','图片文件格式为PNG，JPG，BMP和GIF，请重新选择。');
			} else if(ENABLE_FILE_LIMIT && file.size > that.props.imageSizeMax) {
				this.refs.errorDialog._error('照片添加失败','图片文件超过了2M的上限，请重新选择。');
			}
			else if(file.size === 0) {
				this.refs.errorDialog._error('照片添加失败','图片文件大小为0，请重新选择。');
			}
			 else {
				let render = new FileReader();
				render.readAsDataURL(file);

				render.onload = function () {
					var ret = this.result;
					var imgChecker = new Image();
					imgChecker.onerror = function(argument) {

						that.refs.errorDialog._error('照片添加失败','图片已损坏，请重新选择。');
					};

					imgChecker.onload = function(){

						let result = util.setImageUploadSource(ret);

						that.props.imageDidChanged(result);
					};

					imgChecker.src = ret;


				};
			}
		}
	},


	getDefaultProps() {
		return {
			tip: "",
			isViewState: true,
			imageId: "",
			imageSource: "",
			imageSizeMax: DEFAULT_IMAGE_SIZE_MAX,
			wrapperWidth: DEFAULT_WRAPPER_WIDTH,
			wrapperHeight: DEFAULT_WRAPPER_HEIGHT,
			clip: true,
			clipRatioWidth: 3, // clip width
			clipRatioHeight: 2, // clip height
			clipMode:"cover"
		};
	},

	getInitialState() {
		return {

		};
	},

    componentWillReceiveProps: function(nextProps) {
		this.forceUpdate();
    },
    shouldComponentUpdate (nextProps, nextState) {
    	return this.props.isViewState !== nextProps.isViewState;
    },

    componentWillUnmount() {
    },

	render() {
		// let that = this,
		// 	containerStyle = {
		// 		width: that.props.wrapperWidth,
		// 		height: that.props.wrapperHeight,
		// 		backgroundImage:'url(data:image/*;base64,'+this.props.imageSource+')',
		// 		backgroundRepeat: "no-repeat"
		// 	};
		// if(!that.props.clip) {
		// 	containerStyle["background-origin"] = "border-box";
		// 	containerStyle["background-position"] = "100% 0";
		// 	containerStyle["background-size"] = "contain";
		// }
		var tips=null,
			backGroundStyle = {
				width: this.props.wrapperWidth,
				height: this.props.wrapperHeight
			};

		if(!this.props.clip) {
			backGroundStyle.backgroundOrigin = "border-box";
			backGroundStyle.backgroundSize = "contain";
		}
		if(!this.props.imageSource && !this.props.imageId) {

			tips = (<div  className="pop-image-tips">
							<div>未配置任何照片</div>

						</div>);
		}
		if(!this.props.isViewState){
			var c = classnames({
				"pop-image-tips":true,
				"pop-hide":(this.props.imageSource || this.props.imageId)
				});
			tips = (<div className={c}>
							<div>{this.props.updateTips}</div>
							<span>请上传文件不大于2M的图片</span>
						</div>);
		}

		var baseClassName = classnames({
			'pop-hide':(!this.props.imageSource && !this.props.imageId && this.props.isViewState)
		});

		var labelClassName = "pop-image-upload";
		if( this.props.background ) {
			labelClassName += " " + this.props.background;
		}
		if (!this.props.imageSource && !this.props.imageId){
			labelClassName += " blank-img";
		}

		var borderStyle = null;

		if(this.props.isViewState){
			borderStyle={border:'none'};
		}else{
			borderStyle={cursor:'pointer'};
		}
		return (
			<div className={baseClassName}>
				<label className={labelClassName} style={borderStyle} htmlFor="pop_image_upload_button">
					<BackgroundImage width={this.props.wrapperWidth} height={this.props.wrapperHeight} style={backGroundStyle} mode={this.props.clipMode} imageId={this.props.imageId} imageContent={this.props.imageSource} background={this.props.background} >
						{tips}
						<input id="pop_image_upload_button" ref="pop_image_upload_button" type="file" disabled={this.props.isViewState} style={{opacity:0}} onClick={this._handleClick} onChange={this._handlerChangeImageUpload} accept="images/*"/>
					</BackgroundImage>
				</label>
				<AjaxDialog ref="errorDialog"/>

			</div>

		);
	}



});

module.exports = ImageUpload;
