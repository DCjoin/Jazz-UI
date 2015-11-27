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
import Regex from '../constants/Regex.jsx';

let MenuItem = require('material-ui/lib/menus/menu-item');
var f = lang.f;
const MAX_LENGTH = 200;
const MAX_LENGTH_ERROR = "请输入不超过200字符的内容";

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
    if (error.indexOf('09812') > -1) {
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
    //UserActionCreator.updateUserProfile(this.state.tempData);
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
      }} isViewStatus={true} title="用户名" defaultValue={user.Name} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._editPassword} label="修改密码"/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title="显示名称" defaultValue={user.RealName} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.DISPLAY_NAME)} label="编辑"/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title="职务" defaultValue={CurrentUserStore.getUserTitle()[user.Title]} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TITLE)} label="编辑"/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title="功能权限角色" defaultValue={ isSuperAdmin ? "服务商初始管理员" : user.UserTypeName} />
                        <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._showFuncAuth} label="查看功能权限角色详情"/>
                        </div>
                    </li>

                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title="电话" defaultValue={user.Telephone} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TELE_PHONE)} label="编辑"/>
                        </div> }
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title="电子邮件" defaultValue={user.Email} />
                        {!user.DemoStatus && <div>
                          <LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.EMAIL)} label="编辑"/>
                        </div> }
                    </li>
                </ul>
            </div>
            <div className="sidebar-bottom-action" >
                <CustomFlatButton className="pop-userprofile-logout" label="退出" primary={true} onClick={this._showLogout} style={{
        color: '#abafae',
        height: '48px',
        width: '100%'
      }} />
            </div>
        </SideNav>);
  },
  _getAboutNav: function() {
    return (<SideNav open={true} onClose={this._onClose}  side="right">
          <div className="sidebar-title" >
              关于千里眼
          </div>
          <div className="sidebar-content">
            <div className="pop-userprofile-auth">
              <span>千里眼是施耐德电气自主研发的配电设备和关键电力资产的托管服务管理开放平台，平台通过对完整的配电资产、配电设备、环境、人员操作的数据和信息进行采集、存储、分析和可视化，
              并对客户服务业务流程和资产管理流程进行有效支撑， 为客户提供低成本、高可靠、高效的配电系统远程维护管理服务平台。</span>
            </div>
            <div className="pop-userprofile-auth">
              <h3>千里眼移动端二维码</h3>
              <h3>IOS客户端</h3>
                <div className="pop-qrCode">
                </div>
            </div>
            <div className="pop-userprofile-auth">
              <h3>联系我们</h3>
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
  _onLangSwitch: function() {},
  _getEditPasswordDialog: function(customError) {
    var {oldPassword, newPassword, confirmNewPassword} = this.state.tempData,

      oldPasswordProps = {
        floatingLabelText: "原始密码",
        value: oldPassword,
        onChange: this._bindMergeTemp("oldPassword")
      },
      newPasswordProps = {
        floatingLabelText: "新密码",
        value: newPassword,
        onChange: this._bindMergeTemp("newPassword")
      },
      confirmNewPasswordProps = {
        floatingLabelText: "确认新密码",
        value: confirmNewPassword,
        onChange: this._bindMergeTemp("confirmNewPassword")
      },
      saveButtonDisabled = false;

    if (!oldPassword) {
      oldPasswordProps.errorText = "请填写原始密码";
      saveButtonDisabled = true;
    } else if (oldPassword.length > MAX_LENGTH) {
      oldPasswordProps.errorText = MAX_LENGTH_ERROR;
      saveButtonDisabled = true;
    }

    if (!newPassword) {
      newPasswordProps.errorText = "请填写新密码";
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
      confirmNewPasswordProps.errorText = "2次输入密码不一致";
      saveButtonDisabled = true;
    }

    if (customError) {
      oldPasswordProps.errorText = "原始密码错误";
      saveButtonDisabled = true;
    }

    var actions = [
      <CustomFlatButton
      disabled={saveButtonDisabled}
      label="完成"
      secondary={true}
      onClick={this._savePassword} />,
      <CustomFlatButton
      label="放弃"
      secondary={true}
      onClick={this._onClose} />
    ];

    return (<Dialog actions={actions} openImmediately={true} title="修改密码" modal={true} >
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
  _getEditUserDialog: function() {
    var that = this,
      user = this.state.tempData,
      actions = [
        <CustomFlatButton
        label="完成"
        secondary={true}
        disabled={
        !Regex.Email.test(user.Email) ||
        user.Telephone.length > 200 ||
        user.RealName.length > 200 ||
        user.Email.length > 200
        }
        onClick={this._saveUser} />,
        <CustomFlatButton
        label="放弃"
        secondary={true}
        onClick={this._onClose} />
      ],

      titleSelectedIndex = 0,
      titleItems = CurrentUserStore.getUserTitle().map((title, index) => {
        if (index == user.Title) {
          titleSelectedIndex = index;
        }
        return {
          text: title
        };
      }),
      titleProps = {
        ref: "title",
        isViewStatus: false,
        title: "职务",
        selectedIndex: titleSelectedIndex,
        textField: "text",
        dataItems: titleItems
      };
    return (<Dialog actions={actions} openImmediately={true} title="编辑个人信息" modal={true} >
      <ul className="pop-userprofile-edit">
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("RealName")} maxLen={200} ref="name" isViewStatus={false} title="显示名称" defaultValue={user.RealName} />
          </li>
          <li style={{
        paddingTop: 5
      }}>
              <ViewableDropDownMenu didChanged={function(idx) {
        var title = userTitle[idx];
        that._mergeTemp("Title", title);
      }} {...titleProps} />
          </li>
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("Telephone")} maxLen={200} ref="telephone"  isViewStatus={false} title="电话" defaultValue={user.Telephone} />
          </li>
          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("Email")} maxLen={200} ref="email" errorMessage={"电子邮箱格式不正确"} regex={Regex.Email} isViewStatus={false} title="电子邮箱" defaultValue={user.Email} />
          </li>
      </ul>
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
  },
  componentWillUnmount: function() {
    CurrentUserStore.removeCurrentUserListener(this._onRefresh);
    CurrentUserStore.removePasswordErrorListener(this._onError);
    CurrentUserStore.removePasswordSuccessListener(this._onSuccess);
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
    }

    // render dialog
    switch (dialogType) {
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
    return (
      <div className="jazz-mainmenu">
                <div className="jazz-logo">
                  {logo}
                  {title}
                </div>
                <div className="jazz-menu">
                    <MainMenu items={this.props.items} params={params}  onClick={this._onClick}/>
                      <div className="jazz-mainmenu-info">
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
