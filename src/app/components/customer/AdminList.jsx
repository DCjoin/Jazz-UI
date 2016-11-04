'use strict';

import React from 'react';

import assign from 'object-assign';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import NewDialog from '../../controls/NewDialog.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import SectionPanel from '../../controls/SectionPanel.jsx';
import Regex from '../../constants/Regex.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import { dataStatus } from '../../constants/DataStatus.jsx';
import Immutable from 'immutable';
// let {
//   FlatButton
// } = mui;

import _forIn from 'lodash/object/forIn';
import _isEmpty from 'lodash/lang/isEmpty';
import _trim from 'lodash/string/trim';
var _ = {
  forIn: _forIn,
  isEmpty: _isEmpty,
  trim: _trim
};
var AdminList = React.createClass({
  propTypes: {
    status: React.PropTypes.string,
    admins: React.PropTypes.array,
    dataDidChanged: React.PropTypes.func
  },

  getInitialState: function() {
    var state = Immutable.fromJS({
      showDialog: false,
      inAdd: false,
      dialogContent: null
    });
    return {
      state
    }; //for some reason, can't return an immutable object
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    if (this.props.status === nextProps.status && this.props.admins === nextProps.admins && this.state.state === nextState) {
      return false;
    }
    return true;
  },

  _handleClickAddAdmin: function(event) {

    this._showDialog({
      Name: "",
      Title: "",
      Telephone: "",
      Email: ""
    }, true);

  },
  _notifyDataChanged(type, admin, index) {
    this.props.dataDidChanged(type, admin, index);
  },
  _didChanged(admin, index) {
    if (this.state.state.get('inAdd')) {
      this._notifyDataChanged(dataStatus.NEW, admin, index);
    } else {
      this._notifyDataChanged(dataStatus.UPDATED, admin, index);
    }
  },
  _deleteAdmin(admin, index) {
    this._notifyDataChanged(dataStatus.DELETED, admin, index);

  },
  _showDialog(admin, inAdd, index) {
    var state = Immutable.fromJS({
      index: index,
      showDialog: true,
      dialogContent: admin,
      inAdd: !!inAdd
    });
    this.setState({
      state
    }/*, () => {
      if (this.refs.adminDialog) {
        this.refs.adminDialog.show();
      }
    }*/);
  },
  _dismissDialog() {
    this.setState(this.getInitialState());
  },



  render: function() {
    var adminData = this.props.admins || [];
    var status = this.props.status;
    var that = this;
    var admins = adminData.map((item, index) => {
      return (
        <Admin lang={window.currentLanguage} admin={item} deleteAdmin={this._deleteAdmin} index={index} key={"admin-index-" + index} showDialog={that._showDialog} status={status}/>
        );
    });

    var sectionPanelProps = {
      title: I18N.Setting.CustomerManagement.Administrator,
      hasAction: status !== formStatus.VIEW,
      onAction: this._handleClickAddAdmin,
      actionLabel: I18N.Common.Button.Add
    };
    var dialog = null;
    var state = this.state.state;
    // if (state.get('showDialog')) {
      var dialogProp = {
        ref: "adminDialog",
        didChanged: this._didChanged,
        admins: adminData,
        show: state.get('showDialog'),
        dismissDialog: that._dismissDialog,
        showDialog: that._showDialog,
      };
      if (state.get('dialogContent')) {
        dialogProp.admin = state.get('dialogContent');
      }
      dialogProp.index = state.get('index');
      dialog = (
        <AdminDialog {...dialogProp}/>
      );
    // }

    return (
      <SectionPanel className="pop-admins" {...sectionPanelProps}>
        {adminData.size > 0 ? (
        <div className="pop-admin-container" style={{
          marginTop: '25px'
        }}>
              {admins}
            </div>
        ) : null}
          {dialog}
      </SectionPanel>
      );
  }
});

var Admin = React.createClass({
  propTypes: {
    status: React.PropTypes.string,
    admin: React.PropTypes.object,
    index: React.PropTypes.number,
    deleteAdmin: React.PropTypes.func,
    showDialog: React.PropTypes.func
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    if (this.props.status === nextProps.status && this.props.admin === nextProps.admin && this.props.lang === nextProps.lang) {
      return false;
    }
    return true;
  },

  _handleDeleteAdmin: function(event) {
    this.props.deleteAdmin(this.props.admin, this.props.index);
  },

  _handleAdmin: function(event) {
    if (this.props.status === formStatus.VIEW) {
      return;
    }
    if (event.target.tagName !== 'A') {
      this.props.showDialog(this.props.admin, false, this.props.index);
    }
  },



  render: function() {
    var deleteBtn = null;
    if (this.props.status !== formStatus.VIEW) {
      deleteBtn = (
        <div className="pop-admin-btn">
          <a onClick={this._handleDeleteAdmin}>{I18N.Common.Button.Delete}</a>
        </div>
      );
    }

    return (
      <div className="pop-admin">
        <ul onClick={this._handleAdmin}>
          <li>
            <span className="pop-admin-name" title={this.props.admin.get('Manager')}>{this.props.admin.get('Manager')}</span>
            <span className="pop-admin-title" title={this.props.admin.get('title')}>{this.props.admin.get('title')}</span>
          </li>
          <li className="pop-admin-other">{this.props.admin.get('Telephone')}</li>
          <li className="pop-admin-other">
            <a href={"mailto:" + this.props.admin.get('Email')}>{this.props.admin.get('Email')}</a>
          </li>
        </ul>
        {deleteBtn}
      </div>
      );
  }
});

var AdminDialog = React.createClass({
  propTypes: {
    showDialog: React.PropTypes.func,
    dismissDialog: React.PropTypes.func,
    didChanged: React.PropTypes.func,
    admin: React.PropTypes.object,
    index: React.PropTypes.number
  },

  getInitialState: function() {
    if(!this.props.admin) {
      return {};
    }
    return {
      name: this.props.admin.get("Manager"),
      title: this.props.admin.get("title"),
      telephone: this.props.admin.get("Telephone"),
      email: this.props.admin.get("Email")
    };
  },

  show: function() {
    this.props.showDialog();
    // this.refs.dialog1.show();
    // if (this.refs.name) {
    //   this.refs.name.focus();
    // }
  },

  handleClickFinish: function(event) {
    this.props.dismissDialog();
    // this.refs.dialog1.dismiss();
    this.props.didChanged({
      Manager: this.state.name,
      title: this.state.title,
      Telephone: this.state.telephone,
      Email: this.state.email
    }, this.props.index);
  },

  _checkValid() {
    if (!this.refs.name) {
      return false;
    }
    var admin = this.state;

    var noEmptyValue = true;
    _.forIn(admin, (value) => {
      if (_.isEmpty(_.trim(value))) {
        noEmptyValue = false;
      }
    });
    if (!noEmptyValue) {
      return false;
    }

    if (admin.name.length > 200 || admin.title.length > 200 || admin.telephone.length > 200 || admin.email.length > 254) {
      return false;
    }

    // if (!Regex.NameRule.test(admin.name)) {
    //   return false;
    // }

    // if (!Regex.NameRule.test(admin.title)) {
    //   return false;
    // }

    // if (!Regex.TelephoneRule.test(admin.telephone)) {
    //   return false;
    // }

    if (!Regex.Email.test(admin.email)) {
      return false;
    }

    return true;
  },
  _onChanged() {
    var admin = assign({}, {
      name: this.refs.name.getValue(),
      telephone: this.refs.phone.getValue(),
      email: this.refs.email.getValue(),
      title: this.refs.title.getValue()
    });
    this.setState(admin);

  },
  handleClickCancel: function(event) {
    // this.refs.dialog1.dismiss();
    this.props.dismissDialog();
  },

  componentDidMount: function() {
    if (this.refs.name) {
      this.refs.name.focus();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var newState = {};
    if(nextProps.admin) {
      newState = {
        name: nextProps.admin.get("Manager"),
        title: nextProps.admin.get("title"),
        telephone: nextProps.admin.get("Telephone"),
        email: nextProps.admin.get("Email")
      };
    }
    this.setState(newState);
  },

  render: function() {
    if(!this.props.admin) {
      return null;
    }
    var nameProps = {
      defaultValue: this.state.name || "",
      isRequired: true,
      didChanged: this._onChanged,
      title: I18N.Template.User.Name,
      autoFocus: true
    };
    var name = (
    <ViewableTextField isViewStatus={false} ref="name" {...nameProps}/>
    );

    var titleProps = {
      title: I18N.Setting.CustomerManagement.Title,
      defaultValue: this.state.title || "",
      isRequired: true,
      didChanged: this._onChanged,
    };
    var title = (
    <ViewableTextField ref="title" {...titleProps}/>
    );

    var phoneNumberProps = {
      defaultValue: this.state.telephone || "",
      isRequired: true,
      didChanged: this._onChanged,
      title: I18N.Setting.UserManagement.Telephone
    };
    var phoneNumber = (
    <ViewableTextField ref="phone" {...phoneNumberProps}/>
    );

    var emailProps = {
      defaultValue: this.state.email || "",
      errorMessage: I18N.Platform.ServiceProvider.EmailError,
      regex: Regex.Email,
      isRequired: true,
      didChanged: this._onChanged,
      title: I18N.Setting.UserManagement.Email,
      maxLen: 254
    };
    var email = (
    <ViewableTextField ref="email" {...emailProps}/>
    );

    var disabled = !this._checkValid();
    var saveButtonTitle = I18N.Common.Button.Add;
    var operationTitle = I18N.Setting.CustomerManagement.AddAdministrator;
    if (this.props.admin.get("Manager")) {
      saveButtonTitle = I18N.Platform.Password.Confirm;
      operationTitle = I18N.Setting.CustomerManagement.EditAdministrator;
    }

    return (
      <NewDialog 
        actions={[
          <FlatButton 
            label={saveButtonTitle}
            disabled={disabled}
            onTouchTap = {this.handleClickFinish} />, 
          <FlatButton
            label={I18N.Common.Button.Cancel}
            onTouchTap={
            this.handleClickCancel
            }/>]} 
        dismissOnClickAway={false} 
        modal={true} 
        open={true} 
        ref="dialog1" 
        style={{
          zIndex: 200
        }}>
        <div className="pop-admin-window">
          <div className="admin-title">{operationTitle}</div>
          <ul>
            <li>{name}</li>
            <li>{title}</li>
            <li>{phoneNumber}</li>
            <li>{email}</li>
          </ul>
        </div>
      </NewDialog>
      );
  }
});

module.exports = AdminList;
