import React from 'react';
import {Paper, Overlay, WindowListenable, StylePropable} from 'material-ui';

// http://stackoverflow.com/questions/1187518/javascript-array-difference
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

var extend = function(object, overrides) {
  var mergeObject = {};

  function isNull(value) { return value === '' || value === null; }

  Object.keys(object).forEach(function(currentKey) {

    var overridesIsValidObject = object[currentKey] && !Array.isArray(object[currentKey]);

    if (typeof(object[currentKey]) === 'object' && overridesIsValidObject) {
      mergeObject[currentKey] = extend(object[currentKey], overrides[currentKey]);
    } else {
      if (overrides && (overrides[currentKey] || isNull(overrides[currentKey]))) {
        mergeObject[currentKey] = overrides[currentKey];
      } else {
        mergeObject[currentKey] = object[currentKey];
      }
    }
  });

  if (overrides && typeof(overrides) === 'object' && !Array.isArray(overrides)) {
    Object.keys(overrides).diff(Object.keys(object)).forEach(function(currentDiff) {
      mergeObject[currentDiff] = overrides[currentDiff];
    });
  }

  return mergeObject;
};

let Dialog = React.createClass({

  closeable: false,

  mixins: [WindowListenable, StylePropable],

  _testSupportedProps: function(props) {
    var i,
      el = document.createElement('div');

    for (i in props) {
      if (props.hasOwnProperty(i) && el.style[i] !== undefined) {
        return props[i];
      }
    }
  },

  all: function(styles) {
    var prefixedStyle = {};
    for (var key in styles) {
      prefixedStyle[key] = styles[key];
    }
    return prefixedStyle;
  },

  propTypes: {
    title: React.PropTypes.node,
    width: React.PropTypes.number,
    onDismiss: React.PropTypes.func,
    onShow: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      repositionOnUpdate: true,
      modal: false
    };
  },

  getInitialState: function() {
    return {
      open: false
    };
  },

  mergeStyles: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var base = args[0];
    for (var i = 1; i < args.length; i++) {
      if (args[i]) base = extend(base, args[i]);
    }
    return base;
  },

  mergeAndPrefix: function() {
    var mergedStyles = this.mergeStyles.apply(this, arguments);
    var prefixedStyle = {};
    for (var key in mergedStyles) {
      prefixedStyle[key] = mergedStyles[key];
    }
    return prefixedStyle;
	},

  _onShow: function() {
    if (this.props.onShow) this.props.onShow();
  },
  _onDismiss: function() {
    if (this.props.onDismiss) this.props.onDismiss();
  },

  dismiss: function() {
    //debugger;
    if (this.closeable) {
      this.setState({ open: false });
      this._onDismiss();
    }
  },

  show: function() {
    //debugger;
    setTimeout(function(){this.closeable = true;}.bind(this), 250);
    this.setState({ open: true });
    this._onShow();
  },

  getTheme: function() {
    //debugger;
    return this.context.muiTheme;
  },

  getSpacing: function() {
    //debugger;
    return this.context.muiTheme.spacing;
  },

  getWinStyles: function() {
    //debugger;
    var styles = {
      root: {
        background: 'rgba(23,25,25,0.7)',
        fontFamily: 'Microsoft YaHei',
        position: 'fixed',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        zIndex: 10,
        top: 0,
        left: -10000,
        width: '100%',
        height: '100%',
      },
      contents: {
       fontFamily: 'Microsoft YaHei',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        width: '830px',
        height: '650px',
        margin: '0 auto',
        zIndex: 10,
        opacity: 0,
        borderRadius: 0,

        top: '50%',
        transform: 'translateY(-50%)'
      },
      rootWhenOpen: {
        left: 2
      },
      contentsWhenOpen: {
        //opacity: 1,
        top: 0
      }
    };
    return styles;
  },

  getTitleStyle: function () {
    var styles = {
      root:{
        margin: 0,
        padding: '19px 24px 24px 50px',

        color: '#464949',
        fontSize: '20px',
        fontFamily: 'Microsoft YaHei',
      },
      buttons:{
        position: 'absolute',
        zIndex: 100,
        fontSize: 38,
        fontFamily: 'Microsoft YaHei',
        float: 'right',
        top: 0,
        background: 'transparent',
        border: 0,
        padding: '5px 24px 11px 0px',
        width: 40,
        right: 6,
        cursor: 'pointer',
        color: '#666'
      }
    };
    return styles;
  },

  getCttStyles: function() {
    var gutter = 24 + 'px ';
    var styles = {
      title: {
        margin: 0,
        padding: gutter + gutter + '0 ' + gutter,
        fontFamily: 'Microsoft YaHei',
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: '400',
        width: '830px',
      },
      content: {
        padding: 24
      }
    };
    return styles;
  },

  render: function() {
    var cttstyles = this.getCttStyles();
    var winstyles = this.getWinStyles();
    var titlestyles = this.getTitleStyle();
    var title;
    var paper=null;
    if (this.props.title) {
      title = Object.prototype.toString.call(this.props.title) === '[object String]' ?
        <h3 style={cttstyles.title}>{this.props.title}</h3> :
        this.props.title;
    }
    if(this.state.open){
      paper=(
        <Paper zDepth={5}
          ref="dialogWindow"
          style={this.mergeAndPrefix(winstyles.contents, this.props.contentStyle, this.state.open && winstyles.contentsWhenOpen)}
          className={this.props.contentClassName}
          >
          <div style={this.mergeAndPrefix(titlestyles.root,this.props.titleStyle)}>
            <div>{this.props.title}</div>
            <button style={titlestyles.buttons} onClick={this.dismiss}>×</button>
          </div>
          <div ref="dialogContent">
            {this.props.children}
          </div>
        </Paper>
      )
    }
    return (
      <div ref="container"  style={this.mergeAndPrefix(winstyles.root, this.props.style, this.state.open && winstyles.rootWhenOpen)}>
        {paper}
      </div>
    );
  },
});

module.exports = Dialog;
