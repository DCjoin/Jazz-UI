'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import { Menu, Mixins, IconButton, FlatButton, FontIcon, TextField, Dialog } from 'material-ui';
import { assign, get, set } from "lodash/object";
import { isObject } from "lodash/lang";
import lang from '../lang/lang.jsx';
import ButtonMenu from '../controls/ButtonMenu.jsx';
import MainMenu from '../controls/MainMenu.jsx';
import SideNav from '../controls/SideNav.jsx';
import LinkButton from '../controls/LinkButton.jsx';
import ViewableTextField from '../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../controls/ViewableDropDownMenu.jsx';
import CustomFlatButton from '../controls/FlatButton.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import LanguageAction from '../actions/LanguageAction.jsx';
import Regex from '../constants/Regex.jsx';

let MenuItem = require('material-ui/lib/menus/menu-item');
var f = lang.f;
const MAX_LENGTH = 200;


const SIDE_BAR_TYPE = {
  USER_INFO: "user_info",
  ABOUT: "about"
};

const DIALOG_TYPE = {
  LOGOUT: "logout",
  MODIIFY_PASSWORD: "modiify_password",
  MODIIFY_INFO: "modiify_info"
};

const MODIFY_TYPE = {
  DISPLAY_NAME: "display_name",
  TITLE: "title",
  TELE_PHONE: "tele_phone",
  EMAIL: "email"
};
function currentUser() {
  return CurrentUserStore.getCurrentUser();
}
var MainAppBar = React.createClass({
  mixins: [Navigation, State],
  _onChange: function() {},
  _onError: function() {
    var error = CurrentUserStore.getError();
    if (error.indexOf('12003') > -1) {
      this.setState({
        customError: error
      });
    }
  },
  _onSuccess: function() {
    this._onClose();
  },
  // ************* Action Start *************
  _bindMergeTemp: function(path) {
    return this._mergeTemp.bind(this, path);
  },
  _mergeTemp: function(path, event, value = "") {

    if (!isObject(event)) {
      value = event;
    } else {
      value = get(event, "target.value");
      if (isObject(value)) {
        value = value.text;
      }
    }

    var tempData = assign({}, this.state.tempData);
    if (tempData) {
      set(tempData, path, value);
      this.setState({
        customError: "",
        modifyType: "",
        tempData
      });
    }
  },
  _bindEditButton: function(modifyType) {
    return this._editUser.bind(this, modifyType);
  },
  _savePassword: function() {
    var user = currentUser();
    var data = {
      Id: user.Id,
      Password: this.state.tempData.oldPassword,
      NewPassword: this.state.tempData.newPassword,
      Version: user.Version
    };
    CurrentUserAction.resetPassword(data);
  // this._onClose();
  },
  _onClose: function() {
    this.setState(this.getInitialState());
  },
  _saveUser: function() {
    CurrentUserAction.modifyProfile(this.state.tempData);
    this._onClose();
  },
  // ************* Action End *************
  _onClick: function() {
    GlobalErrorMessageAction.ClearGlobalErrorMessage();
  },
  _onRefresh: function() {
    this.forceUpdate();
  },
  // ************* Change State Start *************
  _showFuncAuth: function() {
    this.setState(assign({}, this.getInitialState(), {
      sidebarType: SIDE_BAR_TYPE.FUNC_ROLE
    }));
  },
  _showUserInfo: function() {
    this.setState(assign({}, this.getInitialState(), {
      sidebarType: SIDE_BAR_TYPE.USER_INFO
    }));
  },
  _showIntroducer: function(e) {

    this.setState(assign({}, this.getInitialState(), {
      sidebarType: SIDE_BAR_TYPE.ABOUT
    }));

  },
  _editUser: function(modifyType) {
    this.setState(assign({}, this.getInitialState(), {
      dialogType: DIALOG_TYPE.MODIIFY_INFO,
      tempData: currentUser() || {},
      modifyType
    }));
  },
  _editPassword: function() {
    this.setState(assign({}, this.getInitialState(), {
      dialogType: DIALOG_TYPE.MODIIFY_PASSWORD
    }));
  },
  _showLogout: function() {
    this.setState(assign({}, this.getInitialState(), {
      dialogType: DIALOG_TYPE.LOGOUT
    }));
  },
  // ************* Change State End *************
  // ************* Render Component Start *************
  _getUserInfo: function() {
    var user = currentUser() || {},
      isSuperAdmin = user.UserType == -1;
    // var associatedCustomers = user.Customers.filter((item) => {
    //   return item.CustomerId >= 0;
    // });
    return (<SideNav ref="nav" open={true} side="right" onClose={this._onClose} >
            <div className="sidebar-title" >
                <FontIcon className="icon-user" color="white" style={{
        fontSize: '18px',
        marginRight: '8px'
      }} />
                <span style={{
        fontSize: '16px',
        lineHeight: '16px'
      }} >{user.RealName}</span>
            </div>
            <div className="sidebar-content">
                <ul >
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Name} defaultValue={user.Name} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._editPassword} label={I18N.Platform.User.ResetPassword}/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.RealName} defaultValue={user.RealName} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.DISPLAY_NAME)} label={I18N.Platform.User.Edit}/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Position} defaultValue={CurrentUserStore.getUserTitle()[user.Title]} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TITLE)} label={I18N.Platform.User.Edit}/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Role} defaultValue={ isSuperAdmin ? I18N.Platform.User.ServerManager : user.UserTypeName} />
                        <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._showFuncAuth} label={I18N.Platform.User.ShowFuncAuth }/>
                        </div>
                    </li>

                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Telephone} defaultValue={user.Telephone} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TELE_PHONE)} label={I18N.Platform.User.Edit}/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Email} defaultValue={user.Email} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.EMAIL)} label={I18N.Platform.User.Edit}/>
                        </div> }
                    </li>
                </ul>
            </div>
        </SideNav>);
  },
  _getAboutNav: function() {
    return (<SideNav open={true} onClose={this._onClose}  side="right">
          <div className="sidebar-title" >
              {I18N.Platform.About.Title}
          </div>
          <div className="sidebar-content">
            <div className="pop-userprofile-auth">
              <h3>{I18N.Platform.About.QrCode}</h3>
              <h3>{I18N.Platform.About.ipadQrCode}</h3>
                <div className="pop-qrCode">
                </div>
                <h3>{I18N.Platform.About.WeChatQrCode}</h3>
                  <div className="pop-qrCode">
                  </div>
            </div>
            <div className="pop-userprofile-auth">
              <h3>{I18N.Platform.About.ContactUs}</h3>
              <div><span>云晓旭 商务经理</span></div>
              <div><span>18611757398</span></div>
              <div><span>xiaoxu-bean.yun@schneider-electric.com</span></div>
              <h3></h3>
              <div><span>郭全 商务经理</span></div>
              <div><span>18611257740</span></div>
              <div><span>quan.guo@schneider-electric.com  </span></div>
            </div>
          </div>
    </SideNav>);
  },
  _onLangSwitch: function() {
    LanguageAction.switchLanguage();
  },
  _onMailLoaded: function() {
    var params = this.getParams();
    this.transitionTo('mail', params);
  },
  _getEditPasswordDialog: function(customError) {
    var MAX_LENGTH_ERROR = I18N.Platform.MaxLengthError;
    var {oldPassword, newPassword, confirmNewPassword} = this.state.tempData,

      oldPasswordProps = {
        floatingLabelText: I18N.Platform.Password.OldPassword,
        value: oldPassword,
        onChange: this._bindMergeTemp("oldPassword")
      },
      newPasswordProps = {
        floatingLabelText: I18N.Platform.Password.NewPassword,
        value: newPassword,
        onChange: this._bindMergeTemp("newPassword")
      },
      confirmNewPasswordProps = {
        floatingLabelText: I18N.Platform.Password.confirmNewPassword,
        value: confirmNewPassword,
        onChange: this._bindMergeTemp("confirmNewPassword")
      },
      saveButtonDisabled = false;

    if (!oldPassword) {
      oldPasswordProps.errorText = I18N.Platform.Password.Error01;
      saveButtonDisabled = true;
    } else if (oldPassword.length > MAX_LENGTH) {
      oldPasswordProps.errorText = MAX_LENGTH_ERROR;
      saveButtonDisabled = true;
    }

    if (!newPassword) {
      newPasswordProps.errorText = I18N.Platform.Password.Error02;
      saveButtonDisabled = true;
    } else if (newPassword.length > MAX_LENGTH) {
      newPasswordProps.errorText = MAX_LENGTH_ERROR;
      saveButtonDisabled = true;
    } /*else if( !confirmNewPassword ) {
    confirmNewPasswordProps.errorText = "请确认新密码";
  } else if( Util.getPasswordError( confirmNewPassword ) ) {
    confirmNewPasswordProps.errorText = "请输入6-20位密码，需要包含数字和字母，允许_、!、@、#、$、%、^、&、*、(、)";
  } else */
    if (newPassword !== confirmNewPassword) {
      confirmNewPasswordProps.errorText = I18N.Platform.Password.Error03;
      saveButtonDisabled = true;
    }

    if (customError) {
      oldPasswordProps.errorText = I18N.Platform.Password.Error04;
      saveButtonDisabled = true;
    }

    var actions = [
      <CustomFlatButton
      disabled={saveButtonDisabled}
      label={I18N.Platform.Password.Confirm}
      secondary={true}
      onClick={this._savePassword} />,
      <CustomFlatButton
      label={I18N.Platform.Password.Cancel}
      secondary={true}
      onClick={this._onClose} />
    ];

    return (<Dialog actions={actions} openImmediately={true} title={I18N.Platform.Password.Title} modal={true} >
      <ul className="pop-userprofile-edit">
          <li>
              <TextField {...oldPasswordProps}>
                <input type="password" />
              </TextField>
          </li>
          <li>
              <TextField {...newPasswordProps}>
                <input type="password" />
              </TextField>
          </li>
          <li>
              <TextField {...confirmNewPasswordProps}>
                <input type="password" />
              </TextField>
          </li>
      </ul>
  </Dialog>);
  },
  _getFuncAuthNav: function() {
    var user = currentUser() || {};
    var codeList = CurrentUserStore.getCurrentPrivilege();
    var commonPrivilege = CurrentUserStore.getCommonPrivilegeList();
    var role = CurrentUserStore.getRolePrivilegeList(),
      rolePrivilege = [];

    // commonPrivilege = commonPrivilege.filter((item) => {
      //   if (item.Readonly && codeList.indexOf(item.Readonly.toString()) >= 0) {
      //     return true;
      //   }
      //   return false;
      // });

    var commonPrivilegeList = commonPrivilege.map((item) => {
      return (<div  className="pop-userprofile-authitem">{item}</div>);
    });

    codeList.map((item) => {
      var index = parseInt(item);
      rolePrivilege.push(role[index]);
    });

    var rolePrivilegeList = rolePrivilege.map((item) => {
      return (<div  className="pop-userprofile-authitem">{item}</div>);
    });

    return (<SideNav open={true} side="right" onClose={this._onClose} >
          <div className="sidebar-title" >
              {user.RealName}
          </div>
          <div className="sidebar-content">
              <div className="pop-userprofile-authcommon">
                  <h3>{I18N.Privilege.Common.Common}</h3>
                  {commonPrivilegeList}
              </div>
              <div className="pop-userprofile-authrole">
                  <h3>{I18N.Privilege.Role.Role}</h3>
                  {rolePrivilegeList}
              </div>
          </div>
      </SideNav>);
  },
  _getEditUserDialog: function() {
    var that = this,
      user = this.state.tempData,
      actions = [
        <CustomFlatButton
        label={I18N.Platform.Password.Confirm}
        secondary={true}
        disabled={
        !Regex.Email.test(user.Email) ||
        user.Telephone.length > 200 ||
        user.RealName.length > 200 ||
        user.Email.length > 200
        }
        onClick={this._saveUser} />,
        <CustomFlatButton
        label={I18N.Platform.Password.Cancel}
        secondary={true}
        onClick={this._onClose} />
      ],

      titleSelectedIndex = 0,
      titleItems = CurrentUserStore.getUserTitle().map((title, index) => {
        if (index != 3) {
          if (index == user.Title) {
            titleSelectedIndex = index;
          }
          return {
            text: title
          };
        }

      }),
      titleProps = {
        ref: "title",
        isViewStatus: false,
        title: I18N.Platform.User.Position,
        selectedIndex: titleSelectedIndex,
        textField: "text",
        dataItems: titleItems
      };
    return (<Dialog actions={actions} openImmediately={true} title={I18N.Platform.User.EditPersonalInfo} modal={true} >
      <ul className="pop-userprofile-edit">
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("RealName")} maxLen={200} ref="name" isViewStatus={false} title={I18N.Platform.User.ShowName} defaultValue={user.RealName} />
          </li>
          <li style={{
        paddingTop: 5
      }}>
              <ViewableDropDownMenu didChanged={function(idx) {
        var title = CurrentUserStore.getUserTitle()[idx];
        that._mergeTemp("Title", idx);
      }} {...titleProps} />
          </li>
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("Telephone")} maxLen={200} ref="telephone"  isViewStatus={false} title={I18N.Platform.User.Telephone} defaultValue={user.Telephone} />
          </li>
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("Email")} maxLen={200} ref="email" errorMessage={I18N.Platform.User.EmailError} regex={Regex.Email} isViewStatus={false} title={I18N.Platform.User.Email} defaultValue={user.Email} />
          </li>
      </ul>
  </Dialog>);
  },
  _getLogoutDialog: function() {
    var actions = [
      <CustomFlatButton
      label={I18N.Platform.User.Logout}
      primary={true}
      onClick={this._logout} />,
      <CustomFlatButton
      label={I18N.Platform.Password.Cancel}
      onClick={this._cancelLogout} />
    ];

    return (<Dialog actions={actions} title={I18N.Platform.User.Logout} openImmediately={true} modal={true} >
      <div>您将退出，并返回登录页。</div>
  </Dialog>);
  },
  // ************* Render Component End *************
  getInitialState: function() {
    return {
      customError: "",
      sidebarType: "",
      dialogType: "",
      editType: "",
      tempData: {}
    };
  },
  componentDidMount: function() {
    CurrentUserStore.addCurrentUserListener(this._onRefresh);
    CurrentUserStore.addPasswordErrorListener(this._onError);
    CurrentUserStore.addPasswordSuccessListener(this._onSuccess);
    CurrentUserStore.addCurrentrivilegeListener(this._onRefresh);
  },
  componentWillUnmount: function() {
    CurrentUserStore.removeCurrentUserListener(this._onRefresh);
    CurrentUserStore.removePasswordErrorListener(this._onError);
    CurrentUserStore.removePasswordSuccessListener(this._onSuccess);
    CurrentUserStore.removeCurrentrivilegeListener(this._onRefresh);
  },
  render: function() {
    var user = currentUser() || {};
    var params = this.getParams();
    var leftNav = null,
      dialog = null;
    var {sidebarType, dialogType, customError} = this.state;
    // render side bar
    switch (sidebarType) {
      case SIDE_BAR_TYPE.USER_INFO:
        leftNav = this._getUserInfo();
        break;
      case SIDE_BAR_TYPE.ABOUT:
        leftNav = this._getAboutNav();
        break;
      case SIDE_BAR_TYPE.FUNC_ROLE:
        leftNav = this._getFuncAuthNav();
        break;
    }

    // render dialog
    switch (dialogType) {
      case DIALOG_TYPE.LOGOUT:
        dialog = this._getLogoutDialog();
        break;
      case DIALOG_TYPE.MODIIFY_PASSWORD:
        dialog = this._getEditPasswordDialog(customError);
        break;
      case DIALOG_TYPE.MODIIFY_INFO:
        dialog = this._getEditUserDialog();
        break;
    }

    var nameLableStyle = {
        padding: '0 10px',
        display: 'inline-block',
        'width': '70',
        'whiteSpace': 'nowrap',
        'textOverflow': 'ellipsis',
        'overflow': 'hidden',
        'wordBreak': 'keep-all',
      },
      langLabelStyle = {
        paddingRight: '10px',
      };
    var logo = (!!this.props.logoUrl) ? <div className='jazz_logo_img' style={{
      backgroundImage: 'url(' + this.props.logoUrl + ')'
    }}></div> : null;
    var title = (!!this.props.title) ? <div className='jazz-title'>{this.props.title}</div> : null;
    var mail = (!!this.props.title) ? (      <div className="jazz-mainmenu-user" style={{
      display: 'flex'
    }}>
          <FlatButton label='平台邮件' labelStyle={langLabelStyle} onClick={this._onMailLoaded} style={{
      backgroundColor: 'transparent',
      color: 'white',
      lineHeight: '16px'
    }} linkButton={true}>
          </FlatButton>
        </div>) : null;
    return (
      <div className="jazz-mainmenu">
                <div className="jazz-logo">
                  {logo}
                  {title}
                </div>
                <div className="jazz-menu">
                    <MainMenu items={this.props.items} params={params}  onClick={this._onClick}/>
                      <div className="jazz-mainmenu-info">
                        {mail}
      <div className="jazz-mainmenu-user" style={{
        display: 'flex'
      }}>
      <FlatButton label={I18N.Platform.InEnglish} labelStyle={langLabelStyle} onClick={this._onLangSwitch} style={{
        backgroundColor: 'transparent',
        color: 'white',
        lineHeight: '16px'
      }} linkButton={true}>
      </FlatButton>
    </div>
    <div className="jazz-mainmenu-user" style={{
        display: 'flex'
      }}>
      <FlatButton label={user.RealName} labelStyle={nameLableStyle} onClick={this._showUserInfo} style={{
        backgroundColor: 'transparent',
        color: 'white',
        lineHeight: '16px'
      }} linkButton={true} title={user.RealName}>
          <FontIcon className="icon-user" color="white" style={{
        fontSize: '14px',
        float: 'left'
      }} />
      </FlatButton>

      </div>
      <div style={{
        display: 'flex'
      }}>
          <em className="icon-schneider-style" onClick={this._showIntroducer}>
              <div className="icon-schneider-en"></div>
          </em>

      </div>

  </div>
                </div>
                {leftNav}
                {dialog}
            </div>

      );
  }

});

module.exports = MainAppBar;
