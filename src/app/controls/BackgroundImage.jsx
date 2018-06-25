'use strict';

import React from 'react';

import _assign from 'lodash-es/assign';

import Config from 'config';
import PropTypes from 'prop-types';
import Path from 'constants/Path.jsx';
import {getOssPath} from 'actions/download_file.js';
var _ = {
  assign: _assign
};

var createReactClass = require('create-react-class');

var BackgroudImage = createReactClass({

  //mixins: [React.addons.PureRenderMixin],
  propTypes: {
    imageId: PropTypes.string,
    url: PropTypes.string,
    imageContent: PropTypes.string,
    background: PropTypes.string,
    mode: PropTypes.string, //contain,cover
    width: PropTypes.number,
    height: PropTypes.number
  },
  componentWillMount() {
    if( !this.props.url || this.props.url.indexOf('url(') !== 0 ) {

      var url;

      if (this.props.imageContent) {
        var parmas = "?hierarchyId=" + this.props.imageContent.hierarchyId;

        if (this.props.width && this.props.height) {
          parmas += "&width=" + this.props.width + "&height=" + this.props.height;
          parmas += "&mode=" + 1;
        }
        url = "/common/logo" + parmas;
      } else if (this.props.imageId) {
        var parmas = "?logoId=" + this.props.imageId;
        if (this.props.width && this.props.height) {
          parmas += "&width=" + this.props.width + "&height=" + this.props.height;
          parmas += "&mode=" + 1;
        }
        url = "/common/logo" + parmas;
      } else {
        url = this.props.url;
      }

      getOssPath(url, (ossURL) => {
        this.setState({ossURL});
      });
    }
  },
  componentWillReceiveProps(nextProps) {
    if( !nextProps.url || this.props.url !== nextProps.url || nextProps.url.indexOf('url(') !== 0 ) {

      var url;

      if (nextProps.imageContent) {
        var parmas = "?hierarchyId=" + nextProps.imageContent.hierarchyId;

        if (nextProps.width && nextProps.height) {
          parmas += "&width=" + nextProps.width + "&height=" + nextProps.height;
          parmas += "&mode=" + 1;
        }
        url = "/common/logo" + parmas;
      } else if (nextProps.imageId) {
        var parmas = "?logoId=" + nextProps.imageId;
        if (nextProps.width && nextProps.height) {
          parmas += "&width=" + nextProps.width + "&height=" + nextProps.height;
          parmas += "&mode=" + 1;
        }
        url = "/common/logo" + parmas;
      } else {
        url = nextProps.url;
      }

      getOssPath(url, (ossURL) => {
        this.setState({ossURL});
      });
    }    
  },
  render: function() {
    let {url, mode, style, children, ...other} = this.props,
    newStyle = _.assign({
      backgroundSize: this.props.mode || "contain",
      width: "100%",
      height: "100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center"
    }, style);

    if( url && url.indexOf('url(') === 0 ) {
      newStyle.backgroundImage = url;
    } else {
      if( this.state && this.state.ossURL ) {
        newStyle.backgroundImage = 'url(' + this.state.ossURL + ')';
      }
    }
    return (
        <div {...other} className={"pop-image"} style={newStyle}>{children}</div>
      );
  }

});

module.exports = BackgroudImage;
