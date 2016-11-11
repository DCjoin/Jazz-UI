'use strict';

import React from 'react';
// import DefaultRawTheme from '../../../node_modules/material-ui/lib/styles/raw-themes/light-raw-theme.js';
// import ThemeManager from '../../../node_modules/material-ui/lib/styles/theme-manager.js';
// import Transition from '../../../node_modules/material-ui/lib/styles/transitions.js';
import { Mixins, Styles, ClearFix, StylePropable, EnhancedButton, FlatButton } from 'material-ui';

let ItemButton = React.createClass({

  //mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    item: React.PropTypes.object,
    height: React.PropTypes.number,
    onTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      selected: false,
      disabled: false,
    };
  },

  getInitialState() {
    return {
      hover: false,
      muiTheme: this.context.muiTheme,
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme
    });
  },
  getTheme() {
    return this.state.muiTheme.datePicker;
  },
  render() {

    let styles = {
      root: {
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        float: 'left',
        width: 60,
        height: this.props.height,
        fontSize: '14px',
        padding: '0px'
      },

      label: {
        position: 'relative',
        color: this.state.muiTheme.rawTheme.palette.textColor
      },

      buttonState: {
        position: 'absolute',
        height: 32,
        width: 60,
        opacity: 0,
        transform: 'scale(0)',
        // transition: Transition.easeOut(),
        backgroundColor: this.getTheme().selectColor,
      },
    };
    if (this.state.hover) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = '0.6';
      styles.buttonState.transform = 'scale(1)';
    }

    if (this.props.selected) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = 1;
      styles.buttonState.transform = 'scale(1)';
    } else if (this.props.disabled) {
      styles.root.opacity = '0.6';
    }

    return this.props.item ? (
      <EnhancedButton
      style={styles.root}
      hoverStyle={styles.hover}
      disabled={this.props.disabled}
      disableFocusRipple={true}
      disableTouchRipple={true}
      onMouseEnter={this._handleMouseEnter}
      onMouseLeave={this._handleMouseLeave}
      onTouchTap={this._handleTouchTap}
      onKeyboardFocus={this._handleKeyboardFocus}>
        <div style={styles.buttonState} />
        <span style={styles.label}>{this.props.item.text}</span>
      </EnhancedButton>
      ) : (
      <span style={styles.root} />
      );
  },

  _handleMouseEnter() {
    this.setState({
      hover: true
    });
  },

  _handleMouseLeave() {
    this.setState({
      hover: false
    });
  },

  _handleTouchTap(e) {
    if (this.props.onTouchTap) this.props.onTouchTap(e, this.props.item);
  },

  _handleKeyboardFocus(e, keyboardFocused) {
    if (this.props.onKeyboardFocus) this.props.onKeyboardFocus(e, keyboardFocused, this.props.item);
  },

});

module.exports = ItemButton;
