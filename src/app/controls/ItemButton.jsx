'use strict';

import React from 'react';
import {Mixins,Styles,ClearFix,StylePropable,EnhancedButton,FlatButton} from 'material-ui';


let ItemButton = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    item: React.PropTypes.object,
    onTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      selected: false
    };
  },

  getInitialState() {
    return {
      hover: false,
    };
  },
  getTheme() {
    return this.context.muiTheme.component.datePicker;
  },
  render() {
    let {
      item,
      onTouchTap,
      selected
    } = this.props;

    let styles = {
      root: {
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        float: 'left',
        width: 60,
        fontSize: '14px',
        padding: '0px'
      },

      label: {
        position: 'relative',
        color: this.context.muiTheme.palette.textColor
      },

      buttonState: {
        position: 'absolute',
        height: 32,
        width: 60,
        opacity: 0,
        transform: 'scale(0)',
        backgroundColor: this.getTheme().selectColor
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
    this.setState({hover: true});
  },

  _handleMouseLeave() {
    this.setState({hover: false});
  },

  _handleTouchTap(e) {
    if (this.props.onTouchTap) this.props.onTouchTap(e, this.props.item);
  },

  _handleKeyboardFocus(e, keyboardFocused) {
    if (this.props.onKeyboardFocus) this.props.onKeyboardFocus(e, keyboardFocused, this.props.item);
  },

});

module.exports = ItemButton;
