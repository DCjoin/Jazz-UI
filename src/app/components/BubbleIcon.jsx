'use strict';

import React from 'react';
import assign from 'object-assign';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');

var BubbleIcon = createReactClass({

    propTypes: {
        number:PropTypes.number,
        style:PropTypes.object,
        numberStyle:PropTypes.object,
    },

    getDefaultProps: function() {
      return {
        style:{}
      };
    },

    render(){
        var n = this.props.number;
        var className = " bubble-icon ";
        var styles = assign({border:"none",boxShadow:"none"},this.props.style);
        if (n!=null && n > 99){
          n = "99+";
          className += "xlg";
        }else if(n!=null){
          className += "lg";
        }
        return (
            <div style={styles} className={className}><span style={this.props.numberStyle}>{n}</span></div>
        );
    }
});


module.exports = BubbleIcon;
