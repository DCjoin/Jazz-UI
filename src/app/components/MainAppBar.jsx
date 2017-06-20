'use strict';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import classnames from "classnames";
import assign from 'lodash-es/assign';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import isObject from 'lodash-es/isObject';
import SelectCustomer from './SelectCustomer.jsx';
import lang from '../lang/lang.jsx';
import MainMenu from '../controls/MainMenu.jsx';
import SideNav from '../controls/SideNav.jsx';
import NewDialog from '../controls/NewDialog.jsx';
import LinkButton from '../controls/LinkButton.jsx';
import ViewableTextField from '../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../controls/ViewableDropDownMenu.jsx';
import CustomFlatButton from '../controls/FlatButton.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import Regex from '../constants/Regex.jsx';
import MailConfirmDialog from '../controls/OperationTemplate/BlankDialog.jsx';
import MailStore from '../stores/MailStore.jsx';
import FolderAction from '../actions/FolderAction.jsx';
import FolderStore from '../stores/FolderStore.jsx';
import Config from 'config';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import RoutePath from '../util/RoutePath.jsx';
import privilegeUtil from '../util/privilegeUtil.jsx';

var f = lang.f;
const MAX_LENGTH = 200;
let lastLink = null;


const SIDE_BAR_TYPE = {
  USER_INFO: "user_info",
  ABOUT: "about"
};

const DIALOG_TYPE = {
  LOGOUT: "logout",
  MODIIFY_PASSWORD: "modiify_password",
  MODIIFY_INFO: "modiify_info",
  MAIL_CONFIRM: "mail_confirm"
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
function push(router, name, params, query) {
  router.push( RoutePath[name]( assign({}, getParams(router), params) ), query );
}
function replaceWith(router, name, params, query) {
  router.replace( RoutePath[name]( assign({}, getParams(router), params) ), query );
}
function getParams(router) {
  return router.params;
}
function getQuery(router) {
  return router.location.query;
}
function getRoutes(router) {
  return router.routers;
}
function getCurrentPath(router) {
  return router.location.pathname;
}
var MainAppBar = React.createClass({
  //mixins: [Navigation, State],
  contextTypes: {
    router: React.PropTypes.object,
    loading:React.PropTypes.object
  },
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
  _showCustomerList: function() {
    // this.props.showCustomerList();
    let doned = false;
    FolderAction.checkWidgetUpdate(() => {
      if( !this.props.disabledSelectCustomer ) {
        this.setState({
          showCustomerList: true
        }, () => {
          FolderAction.alwaysUncheckSameWidget();
        });
      }
    }, null, () => {doned = true});
    if( !doned ) {
      if( !this.props.disabledSelectCustomer ) {
        this.setState({
          showCustomerList: true
        });
      }      
    }
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
  _logout: function() {
    LoginActionCreator.logout();
    this.context.router.push(RoutePath.login(this.context.router.params));
    // var _redirectFunc = this.context.router.replaceWith;
    // _redirectFunc('login', {
    //   lang: ((window.currentLanguage === 0) ? 'zh-cn' : 'en-us')
    // });
  },
  _cancelLogout: function() {
    this.setState(this.getInitialState());
  },
  // ************* Action End *************
  _onClick: function(event) {
    GlobalErrorMessageAction.ClearGlobalErrorMessage();
    if (lastLink === null || lastLink == I18N.MainMenu.Energy) {
      let selectedWidget = FolderStore.getSelectedNode();
      if (selectedWidget !== null && !selectedWidget.get('IsNew')) {
        if (selectedWidget.get('Type') == 7 && selectedWidget.get('ChartType') === null) {
          FolderAction.deleteItem(selectedWidget, true);
        }
      }

    }
    lastLink = event.target.textContent;
  },
  _onRefresh: function() {
    window.currentUser=currentUser();
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
    let doned = false   
    FolderAction.checkWidgetUpdate(() => {
      this.setState(assign({}, this.getInitialState(), {
        dialogType: DIALOG_TYPE.LOGOUT
      }));
    }, null, () => {doned = true});
    if( !doned ) {
      this.setState(assign({}, this.getInitialState(), {
        dialogType: DIALOG_TYPE.LOGOUT
      }));
    }

  },
  // ************* Change State End *************
  // ************* Render Component Start *************
  _getUserInfo: function() {
    var user = currentUser() || {},
      isSuperAdmin = user.UserType == -1;
    // var associatedCustomers = user.Customers.filter((item) => {
    //   return item.CustomerId >= 0;
    // });
    return (
      <SideNav ref="nav" open={true} side="right" onClose={this._onClose}>
            <div className="sidebar-title">
                <FontIcon className="icon-user" color="white" style={{
        fontSize: '18px',
        marginRight: '8px'
      }}/>
                <span style={{
        fontSize: '16px',
        lineHeight: '16px'
      }}>{user.RealName}</span>
            </div>
            <div className="sidebar-content">
                <ul >
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Name} defaultValue={user.Name}/> {!user.DemoStatus && <div>
                            {user.Name!=='se'?<LinkButton className="pop-userprofile-edit-button" onClick={this._editPassword} label={I18N.Platform.User.ResetPassword}/>:null}
                        </div>}
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.RealName} defaultValue={user.RealName}/> {!user.DemoStatus && <div>
                            {user.Name!=='se'?<LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.DISPLAY_NAME)} label={I18N.Platform.User.Edit}/>:null}
                        </div>}
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Position} defaultValue={CurrentUserStore.getUserTitle()[user.Title]}/> {!user.DemoStatus && <div>
                            {user.Name!=='se'?<LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TITLE)} label={I18N.Platform.User.Edit}/>:null}
                        </div>}
                    </li>
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Role} defaultValue={isSuperAdmin
        ? I18N.Platform.User.ServerManager
        : user.UserTypeName}/>
                        <div>
                            <LinkButton className="pop-userprofile-edit-button" onClick={this._showFuncAuth} label={I18N.Platform.User.ShowFuncAuth}/>
                        </div>
                    </li>

                    {isSuperAdmin
        ? null
        : <li className="sidebar-content-item">
                            <ViewableTextField style={{
          width: "auto"
        }} isViewStatus={true} title={I18N.Platform.User.Telephone} defaultValue={user.Telephone}/> {!user.DemoStatus && <div>
                                {user.Name!=='se'?<LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.TELE_PHONE)} label={I18N.Platform.User.Edit}/>:null}
                            </div>}
                        </li>}
                    <li className="sidebar-content-item">
                        <ViewableTextField style={{
        width: "auto"
      }} isViewStatus={true} title={I18N.Platform.User.Email} defaultValue={user.Email}/> {!user.DemoStatus && <div>
                            {user.Name!=='se'?<LinkButton className="pop-userprofile-edit-button" onClick={this._bindEditButton(MODIFY_TYPE.EMAIL)} label={I18N.Platform.User.Edit}/>:null}
                        </div>}
                    </li>
                </ul>
            </div>
            <div className="sidebar-bottom-action" >
                <CustomFlatButton className="pop-userprofile-logout" label={I18N.Login.Logout} primary={true} onClick={this._showLogout} style={{
        color: '#abafae',
        height: '48px',
        width: '100%'
      }} />
            </div>
        </SideNav>
      );
  },
  _getAboutNav: function() {
    return (<SideNav open={true} onClose={this._onClose}  side="right">
          <div className="sidebar-title" >
              {I18N.Platform.About.Title}
          </div>
          <div className="sidebar-content" style={{color: '#0d0d0d', paddingLeft: 30}}>
            <div style={{marginTop: 25}}>
              <div style={{fontSize: '16px'}}>{'云能效'}</div>
              <div>{'随时随地查看和分配节能方案'}</div>
              <div className="jazz-qrCode"/>
              <div style={{textAlign: 'center', fontSize: '12px'}}>{'扫描下载云能效客户端'}</div>
            </div>
            <div style={{position: 'absolute', bottom: 75, fontSize: '12px'}}>
              <div style={{fontSize: '14px'}}>{I18N.Platform.About.ContactUs}</div>
              <div style={{marginTop: 10}}><span style={{fontSize: '14px', marginRight: 30}}>孙琳</span>商务支持</div>
              <div>18611763140</div>
              <div>lin-lynn.sun@schneider-electric.com</div>
              <div style={{marginTop: 10}}><span style={{fontSize: '14px', marginRight: 30}}>郭玉锦</span>技术支持</div>
              <div>18616885310</div>
              <div>yujin.guo@schneider-electric.com</div>
            </div>
          </div>
    </SideNav>);
  },
  _onLangSwitch: function() {
    let {params, location, push} = this.context.router;
    let {protocol, host, pathname, hash} = document.location;
    push(
      location.pathname.replace(/(\w)+(-)?(\w)*/,
        (params.lang === 'en-us') ? 'zh-cn' : 'en-us')
      + location.search);
    setTimeout(() =>{ document.location.reload() }, 0);
    // document.location.reload();
  },
  _onMailLoaded: function() {
    var params = getParams(this.context.router);
    push(this.context.router, 'mail', params);
    this.setState({
      configSelected: false
    })
  },
  _onConfigLoaded: function() {
    var params = getParams(this.context.router);
    push(this.context.router, 'config', params);
    this.setState({
      configSelected: true
    })
  },
  _onConfigClick: function() {
    var mailInfo = MailStore.getMailView();
    var {receivers, template, subject, content, saveNewTemplate, newTemplateName, msgNoticeFlag} = mailInfo;
    if (receivers.size != 0 || template !== null || subject !== null
      || content !== null || saveNewTemplate == true || newTemplateName !== null || msgNoticeFlag == true) {
      this.setState({
        dialogType: DIALOG_TYPE.MAIL_CONFIRM,
      })
    } else {
      this._onConfigLoaded();
    }
  },
  _getEditPasswordDialog: function() {
    var MAX_LENGTH_ERROR = I18N.Platform.MaxLengthError;
    var {oldPassword, newPassword, confirmNewPassword} = this.state.tempData,

      oldPasswordProps = {
        title: I18N.Platform.Password.OldPassword,
        type: 'password',
        isRequired: true,
        maxLen: MAX_LENGTH,
        defaultValue: oldPassword,
        didChanged: this._bindMergeTemp("oldPassword"),
        regexFn: (confirmNewPassword) => {
          return this.state.customError && I18N.Platform.Password.Error04;
        },
      },
      newPasswordProps = {
        title: I18N.Platform.Password.NewPassword,
        type: 'password',
        isRequired: true,
        maxLen: MAX_LENGTH,
        defaultValue: newPassword,
        didChanged: this._bindMergeTemp("newPassword")
      },
      confirmNewPasswordProps = {
        title: I18N.Platform.Password.confirmNewPassword,
        type: 'password',
        isRequired: true,
        maxLen: MAX_LENGTH,
        defaultValue: confirmNewPassword,
        regexFn: (confirmNewPassword) => {
          return newPassword !== confirmNewPassword && I18N.Platform.Password.Error03;
        },
        didChanged: this._bindMergeTemp("confirmNewPassword")
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
    if (this.state.customError) {
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

    return (<NewDialog actions={actions} open={DIALOG_TYPE.MODIIFY_PASSWORD === this.state.dialogType} title={I18N.Platform.Password.Title} modal={true} >
      <ul className="pop-userprofile-edit">
          <li>
              <ViewableTextField {...oldPasswordProps}/>
          </li>
          <li>
              <ViewableTextField {...newPasswordProps}/>
          </li>
          <li>
              <ViewableTextField {...confirmNewPasswordProps}/>
          </li>
      </ul>
  </NewDialog>);
  },
  _getFuncAuthNav: function() {
    var user = currentUser() || {};
    var codeList = CurrentUserStore.getCurrentPrivilege();
    // var commonPrivilege = CurrentUserStore.getCommonPrivilegeList();
    var role = privilegeUtil.getRolePrivilegeList(),
      rolePrivilege = [];

    // commonPrivilege = commonPrivilege.filter((item) => {
      //   if (item.Readonly && codeList.indexOf(item.Readonly.toString()) >= 0) {
      //     return true;
      //   }
      //   return false;
      // });

    // var commonPrivilegeList = commonPrivilege.map((item) => {
    //   return (<div  className="pop-userprofile-authitem">{item}</div>);
    // });

    // codeList.map((item) => {
    //   var index = parseInt(item);
    //   rolePrivilege.push(role[index]);
    // });
    var rolePrivilegeList = role.filter(item => privilegeUtil.canView(item, CurrentUserStore.getCurrentPrivilege()))
                                .map( item => <div className="pop-userprofile-authitem">{item.getLabel()}</div> )


    // var rolePrivilegeList = rolePrivilege.map((item) => {
    //   return (<div  className="pop-userprofile-authitem">{item}</div>);
    // });

    return (<SideNav open={true} side="right" onClose={this._onClose} >
          <div className="sidebar-title" >
              {user.RealName}
          </div>
          <div className="sidebar-content">
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
      isSuperAdmin = user.UserType == -1,
      disabled = false;
    if (!Regex.Email.test(user.Email) ||
      !user.Telephone ||
      !user.RealName ||
      !user.Email ||
      user.RealName.length > 200 ||
      user.Email.length > 254) {
      disabled = true
    }
    if (!isSuperAdmin && (user.Telephone && user.Telephone.length > 200)) {
      disabled = true
    }
    var actions = [
        <CustomFlatButton
        label={I18N.Platform.Password.Confirm}
        secondary={true}
        disabled={
        disabled
        }
        onClick={this._saveUser} />,
        <CustomFlatButton
        label={I18N.Platform.Password.Cancel}
        secondary={true}
        onClick={this._onClose} />
      ],

      titleSelectedIndex = 0,
      titleItems = [];
    CurrentUserStore.getUserTitle().forEach((title, index) => {
      if (index != 3) {
        if (index == user.Title) {
          if (index < 3) {
            titleSelectedIndex = index ;
          } else {
            titleSelectedIndex = index - 1;
          }

        }
        titleItems.push({
          payload: index,
          text: title
        })
      }
    });
    var titleProps = {
      ref: "title",
      isViewStatus: false,
      title: I18N.Platform.User.Position,
      selectedIndex: titleSelectedIndex,
      textField: "text",
      dataItems: titleItems
    };
    return (<NewDialog actions={actions} open={DIALOG_TYPE.MODIIFY_INFO === this.state.dialogType} title={I18N.Platform.User.EditPersonalInfo} modal={true} >
      <ul className={classnames("pop-userprofile-edit", 'jazz-userprofile-edit')}>
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
          {isSuperAdmin ? null : <li>
                        <ViewableTextField didChanged={this._bindMergeTemp("Telephone")} maxLen={200} ref="telephone"  isViewStatus={false} title={I18N.Platform.User.Telephone} defaultValue={user.Telephone} />
                    </li>}

          <li>
              <ViewableTextField didChanged={this._bindMergeTemp("Email")} maxLen={254} ref="email" errorMessage={I18N.Platform.User.EmailError} regex={Regex.Email} isViewStatus={false} title={I18N.Platform.User.Email} defaultValue={user.Email} />
          </li>
      </ul>
  </NewDialog>);
  },
  _getMailConfigDialog: function() {
    var that = this;
    var onClose = function() {
      that.setState({
        dialogType: "",
      })
    };
    var props = {
      title: I18N.Mail.LeaveTitle,
      content: I18N.Mail.LeaveContent,
      firstActionLabel: I18N.Mail.LeaveConfirm,
      secondActionLabel: I18N.Mail.LeaveCancel,
      onFirstActionTouchTap: this._onConfigLoaded,
      onSecondActionTouchTap: onClose,
      onDismiss: onClose
    }
    return (
      <MailConfirmDialog {...props}/>
      )
  },
  _getLogoutDialog: function() {
    var actions = [
      <CustomFlatButton
      label={I18N.Platform.User.Logout}
      inDialog={true}
      primary={true}
      onClick={this._logout} />,
      <CustomFlatButton
      label={I18N.Platform.Password.Cancel}
      onClick={this._cancelLogout} />
    ];

  return (<NewDialog actions={actions} title={I18N.Platform.User.Logout} open={DIALOG_TYPE.LOGOUT === this.state.dialogType} modal={true} >
            <div>{I18N.Platform.User.LogoutTip}</div>
        </NewDialog>);
  },
  // ************* Render Component End *************
  getInitialState: function() {
    //console.log('xxxxxxxxxxxxx'+ JSON.stringify(window.currentUser,0,1));
    return {
      customError: "",
      sidebarType: "",
      dialogType: "",
      editType: "",
      tempData: {},
      configSelected: true,
      showCustomerList: false,
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
    var user = window.currentUser || currentUser() || {};
    var params = getParams(this.context.router);
    var leftNav = null,
      dialog = null;
    var {sidebarType, dialogType, customError} = this.state;
    var {topSelectHierarchy} = this.props;
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
      case DIALOG_TYPE.MAIL_CONFIRM:
        dialog = this._getMailConfigDialog();
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
      },
      configStyle = {
        cursor: 'pointer'
      };
    var logo = (!!this.props.logoUrl)
      ? <div className='jazz_logo_img' style={{
        backgroundImage: 'url(' + Config.ServeAddress + '/' + this.props.logoUrl + ')'
      }}
      onClick={this._showCustomerList}></div>
      : null;
    var title = (!!this.props.title)
      ? <div className='jazz-title' onClick={this._showCustomerList}>
                    {this.props.title}
                  </div>
      : null;
    var mainmenu;
    if (!!this.props.items) {
      mainmenu = ( this.props.items.length > 0 && this.props.items[0].name == 'config')
        ? <div className="jazz-menu">
          <div className={classnames({
          "jazz-mainmenu-main": true,
          "active": this.state.configSelected
        })} style={configStyle} onClick={this._onConfigClick}>
              {this.props.items[0].title}
          </div>
        </div>
        : <MainMenu items={this.props.items} params={params} onClick={this._onClick}/>;
    }
    ;
    var mail = (this.props.title === I18N.Platform.Title) ? (      <div className="jazz-mainmenu-user" style={{
      display: 'flex'
    }}>
          <FlatButton label={I18N.Mail.Mail} labelStyle={langLabelStyle} onClick={this._onMailLoaded} style={{
      backgroundColor: 'transparent',
      color: 'white',
      lineHeight: '16px'
    }} linkButton={true}>
          </FlatButton>
        </div>) : null;
    return (
      <div className="jazz-mainmenu">
        <div className="jazz-logo" style={{
          left: topSelectHierarchy && 20
        }}>
            {logo}
            {title}
        </div>
        {topSelectHierarchy}
        {mainmenu}
        <div className="jazz-mainmenu-info">
            {mail}
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
      }}/>
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

        {leftNav}
        {dialog}
        {this._getEditPasswordDialog()}
        {this._getEditUserDialog()}
        {this._getLogoutDialog()}
        {this.state.showCustomerList && (<SelectCustomer onClose={(hierarchyId) => {
          this.setState({
            showCustomerList: false
          });
          if(hierarchyId && this.props.changeHierarchy) {
            this.props.changeHierarchy(hierarchyId);
          }
        }}/>)}
    </div>

      );
  }

});

module.exports = MainAppBar;
