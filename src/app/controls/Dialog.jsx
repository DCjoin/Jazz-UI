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

    // Arrays and null are also objects,
    var overridesIsValidObject = object[currentKey] && !Array.isArray(object[currentKey]);

    // Recursive call to next level
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

  // Overrides not defined in object are immediately added.
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

  //Returns the correct event name to use
  transitionEndEventName: function() {
    return this._testSupportedProps({
      'transition':'transitionend',
      'OTransition':'otransitionend',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    });
  },

  animationEndEventName: function() {
    return this._testSupportedProps({
      'animation': 'animationend',
      '-o-animation': 'oAnimationEnd',
      '-moz-animation': 'animationend',
      '-webkit-animation': 'webkitAnimationEnd'
    });
  },

  onTransitionEnd: function (el, callback) {
    var transitionEnd = this.transitionEndEventName();

    this.once(el, transitionEnd, function() {
      return callback();
    });
  },

  onAnimationEnd: function (el, callback) {
    var animationEnd = this.animationEndEventName();

    this.once(el, animationEnd, function() {
      return callback();
    });
  },

  all: function(styles) {
    var prefixedStyle = {};
    for (var key in styles) {
      prefixedStyle[this.single(key)] = styles[key];
    }
    return prefixedStyle;
  },

  set: function(style, key, value) {
    style[this.single(key)] = value;
  },

  single: function(key) {
    return  key;
  },

  singleHyphened: function(key) {
    var str = this.single(key);

    return !str ? key : str.replace(/([A-Z])/g, function(str,m1){
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
  },


  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    title: React.PropTypes.node,
    width: React.PropTypes.number,
    onDismiss: React.PropTypes.func,
    onShow: React.PropTypes.func
  },

  windowListeners: {
    'resize': '_positionDialog'
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
  once: function(el, type, callback) {
    var typeArray = type.split(' ');
    var recursiveFunction = function(e){
      e.target.removeEventListener(e.type, recursiveFunction);
      return callback(e);
    };

    for (var i = typeArray.length - 1; i >= 0; i--) {
      this.on(el, typeArray[i], recursiveFunction);
    }
  },

  // IE8+ Support
  on: function(el, type, callback) {
    if(el.addEventListener) {
      el.addEventListener(type, callback);
    } else {
      el.attachEvent('on' + type, function() {
        callback.call(el);
      });
    }
  },

  // IE8+ Support
  off: function(el, type, callback) {
    if(el.removeEventListener) {
      el.removeEventListener(type, callback);
    } else {
      el.detachEvent('on' + type, callback);
    }
  },

  /**
   * loops through all properties defined in the first argument, so overrides
   * of undefined properties will not take place.
   */
  mergeAndPrefix: function() {
    var mergedStyles = this.mergeStyles.apply(this, arguments);
    return this.all(mergedStyles);
	},

  componentDidUpdate: function(prevProps, prevState) {
    //debugger;
    this._positionDialog();
  },

  _onShow: function() {
    if (this.props.onShow) this.props.onShow();
  },
  _onDismiss: function() {
    if (this.props.onDismiss) this.props.onDismiss();
  },

  _positionDialog: function() {
    //debugger;
    var container = React.findDOMNode(this);
    var dialogWindow = React.findDOMNode(this.refs.dialogWindow);
    var containerHeight = container.offsetHeight;
    var dialogWindowHeight = dialogWindow.offsetHeight;

    //Reset the height in case the window was resized.
    dialogWindow.style.height = '';

    var paddingTop = Math.max(((containerHeight - dialogWindowHeight) / 2) - 64, 0);

    //Vertically center the dialog window, but make sure it doesn't
    //transition to that position.
    if (this.props.repositionOnUpdate || !container.style.paddingTop) {
      container.style.paddingTop = paddingTop + 'px';
    }
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
  getCttStyles: function() {
    var gutter = 24 + 'px ';
    var styles = {
      title: {
        margin: 0,
        padding: gutter + gutter + '0 ' + gutter,
        color: this.context.muiTheme.palette.textColor,
        fontFamily: 'Microsoft YaHei',
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: '400',
      },
      content: {
        padding: 24
      }
    };
    return styles;
  },

  getWinStyles: function() {
    //debugger;
    var styles = {
      root: {
       fontFamily: 'Microsoft YaHei',
        position: 'fixed',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        zIndex: 10,
        top: 0,
        left: -10000,
        width: '100%',
        height: '100%',
      },
      contents: {
       fontFamily: 'Microsoft YaHei',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        width: '75%',
        margin: '0 auto',
        zIndex: 10,
        opacity: 0
      },
      rootWhenOpen: {
        left: 2
      },
      contentsWhenOpen: {
        opacity: 1,
        top: 0
      }
    };
    return styles;
  },

  getTitleStyle: function () {
    var styles = {
      root:{
        margin: 0,
        padding: '12px 0 0 12px',
        height: '30px',
        background: '#ccc',
        fontWeight: 'bold',
        fontFamily: 'Microsoft YaHei',
      },
      buttons:{
        position: 'absolute',
        zIndex: 100,
        fontSize: 32,
        fontFamily: 'Microsoft YaHei',
        float: 'right',
        top: 0,
        background: 'transparent',
        border: 0,
        padding: 3,
        width: 40,
        right: 0,
        cursor: 'pointer',
        color: '#666'
      }
    };
    return styles;
  },

  render: function() {
    var cttstyles = this.getCttStyles();
    var winstyles = this.getWinStyles();
    var titlestyles = this.getTitleStyle();
    var title;
    if (this.props.title) {
      title = Object.prototype.toString.call(this.props.title) === '[object String]' ?
        <h3 style={cttstyles.title}>{this.props.title}</h3> :
        this.props.title;
    }
    return (
      <div ref="container"  style={this.mergeAndPrefix(winstyles.root, this.props.style, this.state.open && winstyles.rootWhenOpen)}>
        <Paper zDepth={5}
          ref="dialogWindow"
          style={this.mergeAndPrefix(winstyles.contents, this.props.contentStyle, this.state.open && winstyles.contentsWhenOpen)}
          className={this.props.contentClassName}
          >
          <div style={titlestyles.root}>
            <div>{this.props.title}</div>
            <button style={titlestyles.buttons} onClick={this.dismiss}>×</button>
          </div>
          <div ref="dialogContent">
            {this.props.children}
          </div>
        </Paper>
      </div>
    );
  },
});

module.exports = Dialog;
