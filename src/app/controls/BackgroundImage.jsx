'use strict';

import React from 'react';

import _assign from 'lodash/object/assign';


import Path from '../constants/Path.jsx';
var _ = {
  assign: _assign
};



var BackgroudImage = React.createClass({

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    imageId: React.PropTypes.string,
    url: React.PropTypes.string,
    imageContent: React.PropTypes.string,
    background: React.PropTypes.string,
    mode: React.PropTypes.string, //contain,cover
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  render: function() {
    var style = _.assign({
      backgroundSize: this.props.mode || "contain",
      width: "100%",
      height: "100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center"
    }, this.props.style);
    var url;

    if (this.props.imageContent) {
      var parmas = "?hierarchyId=" + this.props.imageContent.hierarchyId;
      if (this.props.width && this.props.height) {
        parmas += "&width=" + this.props.width + "&height=" + this.props.height;
        parmas += "&mode=" + (this.props.mode == 'cover' ? 2 : 1);
        parmas += "&random=" + Math.random();
      }
      url = "url(/webhost/Logo.aspx" + parmas + ")";
    } else if (this.props.imageId) {
      var parmas = "?logoId=" + this.props.imageId;
      if (this.props.width && this.props.height) {
        parmas += "&width=" + this.props.width + "&height=" + this.props.height;
        parmas += "&mode=" + (this.props.mode == 'cover' ? 2 : 1);
      }
      url = "url(/webhost/Logo.aspx" + parmas + ")";
    } else {
      url = this.props.url || "url()";
    }

    // IE error in customer, move to parent node
    // if(this.props.background){
    //     url += "," + this.props.background;
    // }
    style.backgroundImage = url;
    return (
      <div className={"pop-image"} style={style}>{this.props.children}</div>
      );
  }

});

module.exports = BackgroudImage;
