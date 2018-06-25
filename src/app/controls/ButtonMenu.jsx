'use strict';

var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

import React from "react";
import { Mixins, RaisedButton, FontIcon } from 'material-ui';
let Events = {

  once(el, type, callback) {
    let typeArray = type.split(' ');
    let recursiveFunction = (e) => {
      e.target.removeEventListener(e.type, recursiveFunction);
      return callback(e);
    };

    for (let i = typeArray.length - 1; i >= 0; i--) {
      this.on(el, typeArray[i], recursiveFunction);
    }
  },

  on(el, type, callback) {
    if (el.addEventListener) {
      el.addEventListener(type, callback);
    }
    else {
      // IE8+ Support
      el.attachEvent('on' + type, () => {
        callback.call(el);
      });
    }
  },

  off(el, type, callback) {
    if (el.removeEventListener) {
      el.removeEventListener(type, callback);
    }
    else {
      // IE8+ Support
      el.detachEvent('on' + type, callback);
    }
  },

  isKeyboard(e) {
    return [
      'keydown',
      'keypress',
      'keyup',
    ].indexOf(e.type) !== -1;
  },
};
import  Menu from 'material-ui/Menu';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');
var ButtonMenu = createReactClass({
  //displayName: 'IconMenu',

  // //mixins: [Mixins.StylePropable, Mixins.ClickAwayable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    iconButtonElement: PropTypes.element.isRequired,
    onItemKeyboardActivate: PropTypes.func,
    onItemTouchTap: PropTypes.func,
    onKeyboardFocus: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func,
    onTouchTap: PropTypes.func,
    menuStyle: PropTypes.object,
    touchTapCloseDelay: PropTypes.number,
    closeOnItemTouchTap: PropTypes.bool,
    disabled: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {

      onItemKeyboardActivate: function onItemKeyboardActivate() {},
      onItemTouchTap: function onItemTouchTap() {},
      onKeyboardFocus: function onKeyboardFocus() {},
      onMouseDown: function onMouseDown() {},
      onMouseOut: function onMouseOut() {},
      onMouseOver: function onMouseOver() {},
      onMouseUp: function onMouseUp() {},
      onTouchTap: function onTouchTap() {},
      touchTapCloseDelay: 200,
      closeOnItemTouchTap: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      menuInitiallyKeyboardFocused: false,
      open: false
    };
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  },

  componentClickAway: function componentClickAway() {
    this.close();
  },

  render: function render() {
    var _this = this;

    var _props = this.props;
    var iconButtonElement = _props.iconButtonElement;
    var onItemTouchTap = _props.onItemTouchTap;
    var onKeyboardFocus = _props.onKeyboardFocus;
    var onMouseDown = _props.onMouseDown;
    var onMouseOut = _props.onMouseOut;
    var onMouseOver = _props.onMouseOver;
    var onMouseUp = _props.onMouseUp;
    var onTouchTap = _props.onTouchTap;
    var menuStyle = _props.menuStyle;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['iconButtonElement', 'onItemTouchTap', 'onKeyboardFocus', 'onMouseDown', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onTouchTap', 'menuStyle', 'style']);

    var open = this.state.open;

    var styles = {
      root: {
        display: 'inline-block',
        position: 'relative'
      },

      menu: {
        top: 37,
        left: 0,
        zIndex:10000
      }
    };

    var mergedRootStyles = Object.assign({}, styles.root, style);
    var mergedMenuStyles = Object.assign({},styles.menu, menuStyle);

    var menuButton = <RaisedButton style={{
      maxWidth: '140px',
      height: '32px',
      marginBottom: '5px'
    }} label={this.props.label} onClick={this._onButtonClick} disabled={this.props.disabled}>
                      <FontIcon className="icon-arrow-down" style={{
      fontSize: '10px',
      marginRight: '10px',
      marginLeft: '-5px'
    }}
    hoverColor='yellow'/>
                    </RaisedButton>;

    var menu = open ? React.createElement(
      Menu,
      _extends({}, other, {
        initiallyKeyboardFocused: this.state.menuInitiallyKeyboardFocused,
        onEscKeyDown: this.close,
        onItemTouchTap: this._handleItemTouchTap,
        style: mergedMenuStyles
      }),
      this.props.children
    ) : null;

    return React.createElement(
      'div',
      {
        onMouseDown: onMouseDown,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        onMouseUp: onMouseUp,
        onTouchTap: onTouchTap,
        style: mergedRootStyles
      },
      menuButton,
      menu
    );
  },
  _onButtonClick() {
    if (this.props.onButtonClick) {
      this.props.onButtonClick();
    } else if (!this.state.disabled) {
      this._onDropdownIconClick();
    }
  },
  _onDropdownIconClick() {
    this.open(false);
    return false;
  },
  close: function close(isKeyboard) {
    var _this2 = this;

    if (this.state.open) {
      this.setState({
        open: false
      }, function() {});
    }
  },

  open: function open(menuInitiallyKeyboardFocused) {
    if (!this.state.open) {
      this.setState({
        open: true,
        menuInitiallyKeyboardFocused: menuInitiallyKeyboardFocused
      });
    }
  },

  _handleItemTouchTap: function _handleItemTouchTap(e, child) {
    var _this3 = this;

    if (this.props.closeOnItemTouchTap) {
      (function() {
        var isKeyboard = Events.isKeyboard(e);

        _this3._timeout = setTimeout(function() {
          _this3.close(isKeyboard);
        }, _this3.props.touchTapCloseDelay);
      })();
    }

    this.props.onItemTouchTap(e, child);
  }
});

module.exports = ButtonMenu;
