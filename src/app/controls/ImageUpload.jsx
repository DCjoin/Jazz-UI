'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';

import util from 'util/Util.jsx';
import BackgroundImage from 'controls/BackgroundImage.jsx';
import AjaxDialog from 'controls/AjaxDialog.jsx';
import UploadForm from 'controls/UploadForm.jsx';


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
    background: React.PropTypes.string,
    imageSource: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    imageSizeMax: React.PropTypes.number,
    wrapperWidth: React.PropTypes.number,
    wrapperHeight: React.PropTypes.number,
    clipMode: React.PropTypes.string,
    uploadAction: React.PropTypes.string,
  },

  _handleClick() {
    // ReactDOM.findDOMNode(this.refs.pop_image_upload_button).value = '';
    this.refs.pop_image_upload_button.reset();
  },
  _handlerChangeImageUpload(event) {
    let that = this,
      files = event.target.files;
    if (files.length > 0) {
      let file = files[0];

      if (!FILE_TYPE_IMAGE_REG.test(file.type)) {
        this.refs.errorDialog._error(I18N.Setting.CustomerManagement.LogoUploadErrorTitle, I18N.Setting.CustomerManagement.LogoUploadErrorTypeContent);
      } else if (file.size === 0) {
        this.refs.errorDialog._error(I18N.Setting.CustomerManagement.LogoUploadErrorTitle, I18N.Setting.CustomerManagement.LogoUploadErrorSizeContent);
      } else {
        if (this.props.uploadAction === null) {
          let render = new FileReader();
          render.readAsDataURL(file);

          render.onload = function() {
            var ret = this.result;
            var imgChecker = new Image();
            imgChecker.onerror = function(argument) {

              that.refs.errorDialog._error('照片添加失败', '图片已损坏，请重新选择。');
            };

            imgChecker.onload = function() {


              let result = util.setUploadSource(ret);

              that.props.imageDidChanged(result);
            };

            imgChecker.src = ret;


          };
        } else {
          this.refs.pop_image_upload_button.upload({
            FileName: file.name
          });
        }

      }
    }
  },


  getDefaultProps() {
    return {
      tip: "",
      isViewState: true,
      imageId: "",
      imageUrl: '',
      imageSource: "",
      imageSizeMax: DEFAULT_IMAGE_SIZE_MAX,
      wrapperWidth: DEFAULT_WRAPPER_WIDTH,
      wrapperHeight: DEFAULT_WRAPPER_HEIGHT,
      clip: true,
      clipRatioWidth: 3, // clip width
      clipRatioHeight: 2, // clip height
      clipMode: "cover"
    };
  },

  getInitialState() {
    return {

    };
  },

  componentWillReceiveProps: function(nextProps) {
    //this.forceUpdate();
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps;
  },

  componentWillUnmount() {},

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
    var tips = null,
      backGroundStyle = {
        width: this.props.wrapperWidth,
        height: this.props.wrapperHeight
      };

    if (!this.props.clip) {
      backGroundStyle.backgroundOrigin = "border-box";
      backGroundStyle.backgroundSize = "contain";
    }
    if (!(this.props.imageSource && this.props.imageSource.hierarchyId) && !this.props.imageId && !this.props.imageUrl) {

      tips = (<div  className="pop-image-tips">
							<div>未配置任何照片</div>

						</div>);
    }
    if (!this.props.isViewState) {
      var c = classnames({
        "pop-image-tips": true,
        "pop-hide": ((this.props.imageSource && this.props.imageSource.hierarchyId) || this.props.imageId || this.props.imageUrl)
      });
      tips = (<div className={c}>
						<div>{this.props.updateTips}</div>
						</div>);
    }

    var baseClassName = classnames({
      'pop-hide': (!(this.props.imageSource && this.props.imageSource.hierarchyId) && !this.props.imageId && !this.props.imageUrl && this.props.isViewState)
    });

    var labelClassName = "pop-image-upload";
    if (this.props.background) {
      labelClassName += " " + this.props.background;
    }
    if (!(this.props.imageSource && this.props.imageSource.hierarchyId) && !this.props.imageId && !this.props.imageUrl) {
      labelClassName += " blank-img";
    }

    var borderStyle = null;

    if (this.props.isViewState) {
      borderStyle = {
        border: 'none'
      };
    } else {
      borderStyle = {
        cursor: 'pointer'
      };
    }
    return (
      <div className={baseClassName}>
				<label
      className={labelClassName}
      style={borderStyle}
      ref="fileInputLabel"
      htmlFor={this.props.id || "pop_image_upload_button"}>
					<BackgroundImage
      url={this.props.imageUrl}
      width={this.props.wrapperWidth}
      height={this.props.wrapperHeight}
      style={backGroundStyle}
      mode={this.props.clipMode}
      imageId={this.props.imageId}
      imageContent={!!this.props.imageId ? null : this.props.imageSource}
      background={this.props.background} >
						{tips}
            <div style={{
              opacity: 0,
              position: 'absolute',
              display: 'none',
            }}>
              <UploadForm 
                id={this.props.id || 'pop_image_upload_button'}
                fileName={'imageFile'}
                ref={'pop_image_upload_button'}
                action={this.props.uploadAction}
                inputProps={{
                  disabled: this.props.isViewState,
                  accept: 'images/*'
                }}
                method={'post'}
                onClick={this._handleClick}
                onChangeFile={this._handlerChangeImageUpload}
                onload={(obj) => {
                  if (obj.Result) {
                    this.props.imageDidChanged(obj.Id);
                  } else {
                    console.log('fail');
                  }
                }}
              />
            </div>
          </BackgroundImage>
				</label>
				<AjaxDialog ref="errorDialog"/>

			</div>

      );
  }



});

module.exports = ImageUpload;
