'use strict';

import React, {Component} from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import PropTypes from 'prop-types';
import { formStatus } from 'constants/FormStatus.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

import RoleAction from 'actions/RoleAction.jsx';
import RoleStore from 'stores/RoleStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

import Panel from 'controls/MainContentPanel.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';


class PrivilegeList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { title, privilegeList, isView, currentPrivilegeCodes, handleChange } = this.props;
    return (
      <div className="pop-role-detail-content-permission">
        <div className="pop-role-detail-content-permission-header-panel">
          <span className="pop-role-detail-content-permission-header-panel-title">{title}</span>
        </div>
        <ul className="pop-role-detail-content-permission-content">
          {privilegeList.map( codeObj => {
            return (
              <div key={codeObj.getLabel()} className='pop-role-detail-content-permission-content-item'>
                <div className='pop-role-detail-content-permission-content-item-left'>
                  {codeObj.getLabel()}
                </div>
                <RadioButtonGroup valueSelected={
                  privilegeUtil.getFullCode(codeObj, currentPrivilegeCodes) ||
                  privilegeUtil.getViewCode(codeObj, currentPrivilegeCodes) ||
                  0
                } style={{display: 'flex'}}
                  onChange={(e, value) => {
                    handleChange(privilegeUtil.changePrivilegeCodes(codeObj, currentPrivilegeCodes, value));
                  }}>
                  <RadioButton
                    value={0}
                    disabled={isView}
                    style={{width: 200}}
                    label={I18N.Privilege.None}
                  />
                  <RadioButton
                    disabled={isView || !codeObj.READONLY}
                    style={{width: 200}}
                    value={codeObj.READONLY || -1}
                    label={I18N.Privilege.Readonly}
                  />
                  <RadioButton
                    disabled={isView || !codeObj.FULL}
                    style={{width: 200}}
                    value={codeObj.FULL || -1}
                    label={I18N.Privilege.Full}
                  />
                </RadioButtonGroup>
              </div>
            )
          } )}
        </ul>
      </div>
    );
  }
}

PrivilegeList.propTypes= {
  title: PropTypes.string.isRequired,
  privilegeList: PropTypes.array.isRequired,
  currentPrivilegeCodes: PropTypes.array.isRequired,
  isView: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};
var createReactClass = require('create-react-class');

var RoleDetail = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    role: PropTypes.object,
    setEditStatus: PropTypes.func,
    handlerCancel: PropTypes.func,
    handleSaveRole: PropTypes.func,
    handleDeleteRole: PropTypes.func,
    toggleList: PropTypes.func,
  },
  getInitialState: function() {
    return {
      showPublicPanel: true,
      showPrivatePanel: true,
      dialogStatus: false
    };
  },
  _handleTogglePanel: function(type) {
    if (type) {
      var showPrivatePanel = !this.state.showPrivatePanel;
      this.setState({
        showPrivatePanel
      });
    }
    if (!type) {
      var showPublicPanel = !this.state.showPublicPanel;
      this.setState({
        showPublicPanel
      });
    }
  },
  _handlePrivilegeClick: function(e) {
    var value = e.currentTarget.id;
    RoleAction.merge({
      value,
      path: "PrivilegeCodes"
    });
  },
  _handleSaveRole: function() {
    this.props.handleSaveRole(this.props.role.toJS());
  },

  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    }

    var {Name} = that.props.role.toJS();
    return (

      <NewDialog open={this.state.dialogStatus} title={I18N.Setting.Role.DeleteTitle} modal={true} actions={[
        <FlatButton
        label={I18N.Template.Delete.Delete}
        primary={true}
        inDialog={true}
        onClick={() => {
          that.props.handleDeleteRole();
          closeDialog();
        }} />,
        <FlatButton
        label={I18N.Template.Delete.Cancel}
        onClick={closeDialog} />
      ]}>
				{I18N.format(I18N.Setting.Role.DeleteContent, Name)}
			</NewDialog>
      );
},

  render: function() {
    var that = this,
      {role} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      roleNameProps = {
        isViewStatus: isView,
        title: "角色名称",
        defaultValue: role.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          RoleAction.merge({
            value,
            path: "Name"
          })
        }
      },
      disabledSaveButton = !role.get("Name") || role.get("Name").length > 200;
    var footer = (
    <FormBottomBar
    enableSave={!disabledSaveButton}
    status={this.props.formStatus}
    onSave={this._handleSaveRole}
    onDelete={function() {
      that.setState({
        dialogStatus: true
      });
    }}
    onCancel={this.props.handlerCancel}
    onEdit={ () => {
      that.props.setEditStatus()
    }}/>
    );
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
      <Panel onToggle={this.props.toggleList}>
        <div className="pop-manage-detail-header">
          <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
            <ViewableTextField  {...roleNameProps} />
          </div>
        </div>
        {role.get('PrivilegeCodes')&&<div className="pop-manage-detail-content ">
          <PrivilegeList
            isView={isView}
            privilegeList={privilegeUtil.getRolePrivilegeList()}
            currentPrivilegeCodes={role.get('PrivilegeCodes').toJS()}
            handleChange={(value) => {
              RoleAction.merge({
                value,
                path: "PrivilegeCodes"
              })
            }}
            title={I18N.Privilege.Role.Role}/>
          {footer}
        </div>}
        	{that._renderDialog()}
        </Panel>
      </div>

      )
  },
});
module.exports = RoleDetail;
