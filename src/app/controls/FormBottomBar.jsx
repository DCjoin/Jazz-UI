'use strict';

import React from 'react';

import { formStatus } from '../constants/FormStatus.jsx';
//import { FlatButton } from 'material-ui';
import FlatButton from 'controls/FlatButton.jsx';
import _assign from 'lodash-es/assign';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';

var _ = {
  assign: _assign
};

var FormBottomBar = createReactClass({

  propTypes: {
    transition: PropTypes.bool,
    onEdit: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    status: PropTypes.string,
    customButton: PropTypes.object,
    allowDelete: PropTypes.bool,
    enableSave: PropTypes.bool,

    editBtnProps: PropTypes.object,
    saveBtnProps: PropTypes.object,
    deleteBtnProps: PropTypes.object,
    cancelBtnProps: PropTypes.object,
    isShow: PropTypes.bool
  },


  _handleEditBtn: function() {
    this.props.onEdit();
  },

  _handleCancelBtn: function() {
    this.props.onCancel();
  },

  _handleSaveBtn: function() {
    this.props.onSave();
  },

  _handleDeleteBtn: function() {
    this.props.onDelete();
  },

  render: function() {
    var viewBtnClass = "form-bottom-bar-btn",
      editBtnClass = "form-bottom-bar-btn",
      addBtnClass = "form-bottom-bar-btn",
      formBottomBarClassName = "form-bottom-bar",
      {status, enableSave, allowDelete, allowEdit, customButton, editBtnProps, saveBtnProps, deleteBtnProps, cancelBtnProps} = this.props;

    if (this.props.status === formStatus.VIEW) {
      editBtnClass += " form-bottom-bar-hide";
      addBtnClass += " form-bottom-bar-hide";
    } else if (this.props.status === formStatus.EDIT) {
      viewBtnClass += " form-bottom-bar-hide";
      addBtnClass += " form-bottom-bar-hide";
    } else if (this.props.status === formStatus.ADD) {
      viewBtnClass += " form-bottom-bar-hide";
      editBtnClass += " form-bottom-bar-hide";
    }

    if (this.props.transition) {
      formBottomBarClassName += " transition";
    }

    // save button
    saveBtnProps = _.assign({
      label: I18N.Common.Button.Save
    }, saveBtnProps);

    var saveButtonStyle = {
      borderRight: '1px solid #ececec',
      height:'56px'
    };
    if (enableSave) {
      saveBtnProps.disabled = false;
    // saveButtonStyle.color = '#32ad3c';
    } else {
      saveBtnProps.disabled = true;
    }
    var saveButton = <FlatButton style={saveButtonStyle} secondary={true} onClick={this._handleSaveBtn} {...saveBtnProps} />;

    // delete button
    deleteBtnProps = _.assign({
      label: I18N.Common.Button.Delete,
      style: {
        color: '#abafae',
        height:'56px'
      }
    }, deleteBtnProps);
    deleteBtnProps.className += " form-bottom-bar-deletebtn";

    var deleteButton = <FlatButton onClick={this._handleDeleteBtn} {...deleteBtnProps} primary={true} />;

    if (allowDelete === false) {
      deleteButton = null;
    }
    var editButton = (
    <FlatButton secondary={true}  label={I18N.Common.Button.Edit} style={{
      borderRight: '1px solid #ececec',
      color: '#abafae',
      height:'56px'
    }} onClick={this._handleEditBtn} {...editBtnProps}/>
    );
    // var editButton = <FlatButton label="编辑" secondary={true} style={{
    //   borderRight: '1px solid #ececec'
    // }} onClick={this._handleEditBtn} {...editBtnProps} />;
    if (allowEdit === false) {
      editButton = null;
    }

    var cancelButton = <FlatButton label={I18N.Common.Button.Cancel} secondary={true} className="form-bottom-bar-cancelbtn" style={{
      borderRight: '1px solid #ececec',
      height:'56px'
    }} onClick={this._handleCancelBtn} {...cancelBtnProps}   />;

    return (
    this.props.isShow === false ? null :
      <div className="form-bottom">
          <div className={formBottomBarClassName} >
            <div className="form-bottom-bar-content" >
              <div className={viewBtnClass}>
                <div style={{
        "float": "left",
        "height": "100%"
      }}>
                  {editButton}
                  {customButton}
                </div>
                <div style={{
        "float": "right",
        "height": "100%"
      }}>
                  {deleteButton}
                </div>
                <div style={{
        "clear": "both"
      }}></div>
              </div>

              <div className={addBtnClass}>
                <div style={{
        "float": "left",
        "height": "100%"
      }}>
                  {saveButton}
                  {cancelButton}
                </div>
                <div style={{
        "float": "right",
        "height": "100%"
      }}>
                </div>
                <div style={{
        "clear": "both"
      }}></div>
              </div>

              <div className={editBtnClass}>
                <div style={{
        "float": "left",
        "height": "100%"
      }}>
                  {saveButton}
                  {cancelButton}
                </div>
                <div style={{
        "float": "right",
        "height": "100%"
      }}>
                  {deleteButton}
                </div>
                <div style={{
        "clear": "both"
      }}></div>
              </div>
            </div>
        </div>
        </div>
    );
  }
});

module.exports = FormBottomBar;
