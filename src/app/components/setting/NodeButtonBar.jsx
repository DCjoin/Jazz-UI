'use strict'

import React from 'react';
import { TextField, Dialog, RaisedButton, FlatButton } from 'material-ui';
import { formStatus } from '../../constants/FormStatus.jsx';




var NodeButtonBar = React.createClass({


  propTypes: {
    onEdit: React.PropTypes.func,
    onSave: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    status: React.PropTypes.string,
    customButton: React.PropTypes.object
  },

  getInitialState: function() {
    return {

      inAjax: false
    };
  },



  _handleEditBtn: function() {
    this.props.onEdit();
  },

  _handleCancelBtn: function() {
    this.props.onCancel();

  },

  _handleSaveBtn: function() {
    this.setState({
      isAjax: true
    });
    this.props.onSave();
  },

  _handleDeleteBtn: function() {
    this.setState({
      isAjax: true
    });
    this.props.onDelete();
  },

  render: function() {
    var viewBtnClass = "pop-node-detail-btn";
    var editBtnClass = "pop-node-detail-btn";
    if (this.props.status == formStatus.VIEW) {
      viewBtnClass += " pop-node-detail-btn-hide";
    } else {
      editBtnClass += " pop-node-detail-btn-hide";
    }
    // save button
    var saveBtnProps = {};
    var cancelBtnProps = {};
    if (this.state.isAjax) {
      saveBtnProps = {
        label: I18N.Setting.NodeBtn.Saving,
        disabled: true
      };
      cancelBtnProps = {
        disabled: true
      };
    } else {
      saveBtnProps = {
        label: I18N.Setting.NodeBtn.Save
      };
    }
    var saveButton = <FlatButton style={{
      borderRight: '1px solid #ececec',
      color: '#1ca8dd'
    }} onClick={this._handleSaveBtn} {...saveBtnProps} secondary={true}/>;
    // delete button
    var deleteBtnProps = {};
    var editBtnProps = {};
    if (this.state.isAjax) {
      deleteBtnProps = {
        label: I18N.Setting.NodeBtn.Deleting,
        disabled: true
      };
      editBtnProps = {
        disabled: true
      };
    } else {
      deleteBtnProps = {
        label: I18N.Setting.NodeBtn.Delete,
      };
    }
    var deleteButton = <FlatButton className="pop-node-detail-btn-delete" onClick={this._handleDeleteBtn} {...deleteBtnProps} primary={true} />;

    var editButton = <FlatButton label={I18N.Baseline.Button.Edit} style={{
      borderRight: '1px solid #ececec',
      color: '#1ca8dd'
    }} onClick={this._handleEditBtn} {...editBtnProps} secondary={true}/>;
    var cancelButton = <FlatButton label={I18N.Baseline.Button.Cancel} onClick={this._handleCancelBtn} {...cancelBtnProps}   />;

    return (
      <div className="pop-node-detail-btn-bar">
                <div className={editBtnClass}>
                    {editButton}
                    {deleteButton}
                    {this.props.customButton}
                </div>
                <div className={viewBtnClass}>
                    {saveButton}
                    {cancelButton}


                </div>
            </div>
      );
  }
});

module.exports = NodeButtonBar;
