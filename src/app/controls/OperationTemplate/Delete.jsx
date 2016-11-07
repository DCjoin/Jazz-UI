'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Dialog, FlatButton, TextField, Paper } from 'material-ui';

var Delete = React.createClass({
  propTypes: {
    type: React.PropTypes.string, //文件夹 or 图表
    name: React.PropTypes.string,
    onFirstActionTouchTap: React.PropTypes.func,
    onSecondActionTouchTap: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
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
          <Dialog {...dialogProps}>
            <div style={{
        'word-wrap': 'break-word',
        'word-break': 'break-all'
      }}>
              {content}
            </div>

          </Dialog>
        </div>
      </div>
      )
  }
});

module.exports = Delete;
