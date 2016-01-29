'use strict';

import React from 'react';
import { Dialog } from 'material-ui';

import util from '../util/util.jsx';

import FlatButton from './FlatButton.jsx';
import _assign from "lodash/object/assign";
var _ = {
  assign: _assign
};

var timeoutHandler = null;

var CustomDialog = React.createClass({

  propTypes: {
    rightActions: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      loadingStatus: 0,
    };
  },

  getDefaultProps: function() {
    return {
      actions: [],
      rightActions: false
    };
  },

  _handleResize() {

    if (timeoutHandler != null) {
      clearTimeout(timeoutHandler);
    }
    timeoutHandler = setTimeout(() => {
      this._positionMaxHeight();
    }, 400);

  },


  _getAction: function(actionJSON, key) {
    var styles = {
      marginRight: 8
    };
    var props = {
      key: key,
      // secondary: true,
      onClick: actionJSON.onClick,
      onTouchTap: () => {
        if (actionJSON.onTouchTap) {
          actionJSON.onTouchTap.call(undefined);
        }
        if (!(actionJSON.onClick || actionJSON.onTouchTap)) {
          this.dismiss();
        }
      },
      label: actionJSON.text,
      style: styles
    };
    if (actionJSON.ref) {
      props.ref = actionJSON.ref;
      props.keyboardFocused = actionJSON.ref === this.props.actionFocus;
    }

    return (
      <FlatButton
      {...props} />
      );
  },

  _getActionsContainer: function(actions) {
    var actionContainer;
    var actionObjects = [];
    var actionStyle = {
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(s0,0,0,0)',
      padding: 8,
      paddingLeft: 16,
      paddingTop: 24,
      margin: -24,
      marginTop: 0
    };

    _.assign(actionStyle, this.props.actionStyle);

    if (this.props.rightActions) {
      actionStyle.textAlign = 'right';
      actionStyle.paddingLeft = 8;
      actionStyle.paddingRight = 16;
    }

    if (actions.length) {
      for (var i = 0; i < actions.length; i++) {
        var currentAction = actions[i];

        if (!React.isValidElement(currentAction)) {
          currentAction = this._getAction(currentAction, i);
        }

        if (!currentAction.DisabledClose) {
          var rawClick = currentAction.props.onClick;
          ((rawClick) => {
            currentAction.props.onClick = (e) => {
              this.dismiss();
              setTimeout(() => {
                if (rawClick) {
                  rawClick(e);
                }
              }, 450);
            };
          });
        }

        var props = currentAction.props || {};
        props.inDialog = true;
        if (i > 0) {
          props.style = _.assign({}, props.style, {
            marginLeft: 20
          });
        }

        actionObjects.push(React.cloneElement(currentAction, props));
      }

      actionContainer = (
        <div style={actionStyle}>
          {actionObjects}
        </div>
      );
    }

    return actionContainer;
  },

  dismiss: function() {
    if (this.refs.dialog) {
      this.refs.dialog.dismiss();
      setTimeout(() => {
        if (this.props.onClose) {
          this.props.onClose();
        }
      }, 450);
    } else {
      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  },

  show: function() {
    this.refs.dialog.show();
  },

  _onShow: function() {
    this._positionMaxHeight();
    if (this.props._onShow) {
      this.props._onShow();
    }
  },

  _positionMaxHeight() {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let dialogContentMaxHeight = (clientHeight < 600 ? 600 : clientHeight) / 4 * 3;

    let dialog = this.refs["dialog"];
    if (dialog) {
      let dialogScrollDom = dialog.getDOMNode().querySelector(".dialog-scroll");
      if (dialogScrollDom) {
        let dialogOtherHeight = dialog.getDOMNode().querySelector(".dialog-content").clientHeight - dialogScrollDom.clientHeight;
        dialogScrollDom.style.maxHeight = `${dialogContentMaxHeight - dialogOtherHeight}px`;
        dialog._positionDialog();
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener('resize', this._handleResize);
    if (this.props.openImmediately) {
      this.refs.dialog.show();
    }
    this._positionMaxHeight();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this._positionMaxHeight();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._handleResize);
  },

  render: function() {
    var other = util.merge(true, {}, this.props, {
        onShow: this._onShow
      }),
      actions = this._getActionsContainer(other.actions || []),
      closeIcon = null;

    delete other.actions;
    delete other.openImmediately;

    var contentStyle = _.assign({}, this.props.contentStyle);

    if (this.props.modal !== true) {
      closeIcon = (<div className="dialog-close-icon icon-close" onClick={this.dismiss}></div>);
      other.onClickAway = this.dismiss;
    }

    return (
      <Dialog ref="dialog" {...other} contentClassName="dialog-content" contentStyle={contentStyle}>
        {closeIcon}
				<div style={{
        wordWrap: 'break-word',
        wordBreak: 'break-all'
      }}>{this.props.children}</div>

        {actions}
      </Dialog>

      );
  }
});

module.exports = CustomDialog;
