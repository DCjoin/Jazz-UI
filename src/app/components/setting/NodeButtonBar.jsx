'use strict'
import PropTypes from 'prop-types';
import React from 'react';
import { TextField, Dialog, RaisedButton, FlatButton } from 'material-ui';
import { formStatus } from '../../constants/FormStatus.jsx';
var createReactClass = require('create-react-class');



var NodeButtonBar = createReactClass({


  propTypes: {
    onEdit: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    status: PropTypes.string,
    customButton: PropTypes.object
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
      color: '#32ad3c'
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
      color: '#32ad3c'
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
