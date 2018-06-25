'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { TextField, Paper } from 'material-ui';
import NewDialog from '../NewDialog.jsx';
import FlatButton from '../FlatButton.jsx';
var createReactClass = require('create-react-class');
var Delete = createReactClass({
  propTypes: {
    type: PropTypes.string, //文件夹 or 图表
    name: PropTypes.string,
    onFirstActionTouchTap: PropTypes.func,
    onSecondActionTouchTap: PropTypes.func,
    onDismiss: PropTypes.func,
  },

  _onFirstActionTouchTap: function() {
    // this.refs.dialog.dismiss();
    this.props.onDismiss();
    if (this.props.onFirstActionTouchTap) {
      this.props.onFirstActionTouchTap();
    }
  },
  _onSecondActionTouchTap: function() {
    // this.refs.dialog.dismiss();
    this.props.onDismiss();
    if (this.props.onSecondActionTouchTap) {
      this.props.onSecondActionTouchTap();
    }
  },
  render: function() {
    //style
    let titleStyle = {
      fontSize: '20px',
      color: '#464949',
      marginLeft: '26px'
    };

    let actions = [
      <FlatButton
      inDialog={true}
      primary={true}
      label={I18N.Template.Delete.Delete}
      onTouchTap={this._onFirstActionTouchTap}
      />,
      <FlatButton
      label={I18N.Template.Delete.Cancel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      title: I18N.format(I18N.Template.Delete.Title, this.props.type),
      actions: actions,
      modal: true,
      open: true,
      // onDismiss: this.props.onDismiss,
      titleStyle: titleStyle
    };
    let content;
    if (this.props.type == I18N.Mail.Template) {
      content = I18N.format(I18N.Mail.Delete, this.props.name);
    } else if (this.props.type == I18N.Platform.ServiceProvider.SP) {
      content = I18N.format(I18N.Platform.ServiceProvider.DeleteContent, this.props.name);
    } else {
      content = (this.props.type == I18N.Folder.FolderName) ? I18N.format(I18N.Template.Delete.FolderContent, this.props.name) : I18N.format(I18N.Template.Delete.WidgetContent, this.props.name);
    }
    return (
      <div className='jazz-copytemplate-dialog'>
        <div className='able'>
          <NewDialog {...dialogProps}>
            <div style={{
        'word-wrap': 'break-word',
        'word-break': 'break-all'
      }}>
              {content}
            </div>

          </NewDialog>
        </div>
      </div>
      )
  }
});

module.exports = Delete;
