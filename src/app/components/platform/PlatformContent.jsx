'use strict';

import React from 'react';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu, Dialog, DropDownMenu, Checkbox } from 'material-ui';
import classnames from "classnames";
import moment from 'moment';
import Regex from '../../constants/Regex.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import OrigamiPanel from '../../controls/OrigamiPanel.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../controls/ViewableTextFieldUtil.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';


let PlatformContent = React.createClass({
  //mixins: [ViewableTextFieldUtil],
  propTypes: {
    provider: React.PropTypes.object,
  },
  _getDateInput: function(time) {
    if (!time) {
      return "";
    }
    var m = moment(time);
    if (!m.isValid()) {
      m = moment();
    }
    return m.format('YYYY/MM/DD');
  },
  _handleSaveUser: function() {
    PlatformAction.modifyServiceProvider(this.props.provider);
  },
  _renderHeader: function(isView) {
    var providerNameProps = {
      isViewStatus: isView,
      title: "服务商名称",
      defaultValue: this.props.provider.Name,
      isRequired: true,
      didChanged: value => {
        PlatformAction.mergeProvider({
          value: value,
          path: "Name"
        });
      }
    };
    return (
      <div className="pop-manage-detail-header">
        <div className="pop-customer-detail-name">
          <ViewableTextField {...providerNameProps} />
        </div>
      </div>
      )
  },
  _renderInfo: function(isView) {
    var {UserName, Domain, Address, Telephone, Email, StartDate, LoginUrl, LogOutUrl, Comment, Stauts, CalcStatus} = this.props.provider;
    var providerCodeProps = {
        isViewStatus: isView,
        title: "服务商ID",
        defaultValue: UserName || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "UserName"
          })
        }
      },
      providerDomainProps = {
        isViewStatus: isView,
        title: "服务商子域名",
        defaultValue: Domain || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Domain"
          })
        }
      },
      providerAddressProps = {
        isViewStatus: isView,
        title: "地址",
        defaultValue: Address || "",
        isRequired: true,
        maxLen: -1,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Address"
          })
        }
      },
      providerTelephoneProps = {
        isViewStatus: isView,
        title: "电话",
        defaultValue: Telephone || "",
        isRequired: true,
        // regex: Regex.TelephoneRule,
        // errorMessage: "允许数字和中划线，但中划线不能连续出现或做为开头和结尾",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Telephone"
          })
        }
      },
      providerEmailProps = {
        isViewStatus: isView,
        title: "电子邮箱",
        defaultValue: Email || "",
        isRequired: true,
        regex: Regex.Email,
        errorMessage: "请按照\"user@example.com\"的格式输入",
        maxLen: 254,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Email"
          })
        }
      },
      providerBackToUrlProps = {
        isViewStatus: isView,
        title: "登录失败返回页面",
        defaultValue: LoginUrl || "",
        regex: Regex.UrlRule,
        errorMessage: "请填写地址，登录失败后页面会自动跳转至所填网址",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "LoginUrl"
          })
        }
      },
      providerLogOutUrlProps = {
        isViewStatus: isView,
        title: "退出页面",
        defaultValue: LogOutUrl || "",
        regex: Regex.UrlRule,
        errorMessage: "请填写地址，退出系统时会自动跳转至所填网址",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "LogOutUrl"
          })
        }
      },
      providerStartTimeProps = {
        isViewStatus: isView,
        title: "运营时间",
        defaultValue: this._getDateInput(StartDate),
        isRequired: true,
        regex: Regex.CommonTextNotNullRule,
        errorMessage: "请输入客户地址",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "StartDate"
          })
        }
      },
      providerCommentProps = {
        isViewStatus: isView,
        title: "备注",
        defaultValue: Comment || "",
        multiLine: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Comment"
          })
        }
      },
      titleItems = [{
        payload: 0,
        text: '暂停'
      },
        {
          payload: 1,
          text: '正常'
        }],
      providerStatusProps = {
        isViewStatus: isView,
        title: '运营状态',
        selectedIndex: Stauts,
        textField: "text",
        dataItems: titleItems,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Stauts"
          })
        }
      },
      providerCalStatusProps = {
        checked: CalcStatus || false,
        disabled: isView,
        label: '能与能效标识大数据计算',
        onCheck: (event, checked) => {
          PlatformAction.mergeProvider({
            value: checked,
            path: "CalcStatus"
          })
        }
      };
    return (
      <div className={"pop-user-detail-content"}>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerCodeProps} />
        </div>

          <div className="pop-user-detail-content-item" style={{
        'flex-direction': 'row'
      }}>
            <ViewableTextField {...providerDomainProps} />
            <div className={classnames({
        "jazz-platform-viewstatus": isView,
        "jazz-platform-editstatus": !isView
      })}>.energymost.com</div>

        </div>

        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerAddressProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerTelephoneProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerEmailProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ViewableDatePicker {...providerStartTimeProps} />
        </div>
        <div className="pop-user-detail-content-item">
        <ViewableDropDownMenu {...providerStatusProps} />
      </div>
        <div className={classnames({
        "pop-user-detail-content-item": true,
        "jazz-hide": isView & !LoginUrl
      })}>
          <ViewableTextField {...providerBackToUrlProps} />
        </div>
        <div className={classnames({
        "pop-user-detail-content-item": true,
        "jazz-hide": isView & !LogOutUrl
      })}>
          <ViewableTextField {...providerLogOutUrlProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <Checkbox {...providerCalStatusProps} />
        </div>
        <div className={classnames({
        "pop-user-detail-content-item": true,
        "jazz-hide": isView & !Comment
      })}>
        <ViewableTextField {...providerCommentProps} />
        </div>

        </div>
      )

  },
  _renderFooter: function(isView) {
    var that = this;
    var sendPasswordButton = null,
      saveButtonDisabled = true;
    var {Name, UserName, Domain, Address, Telephone, Email, StartDate} = this.props.provider;
    if (
      Name && Name.length < 200 &&
      UserName && UserName.length < 200 &&
      Domain && Domain.length < 200 &&
      Address &&
      Telephone &&
      Email &&
      StartDate
    ) {
      saveButtonDisabled = false;
    }
    if (isView) {
      sendPasswordButton = (
        <FlatButton secondary={true}  label="发送邮件" style={{
          borderRight: '1px solid #ececec',
          color: '#abafae'
        }} onClick={that.props._handleResetPassword}/>
      );
    }
    return (
      <FormBottomBar
      transition={true}
      customButton={sendPasswordButton}
      enableSave={!saveButtonDisabled}
      status={this.props.formStatus}
      onSave={this._handleSaveUser}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      onCancel={this.props.handleCancel}
      onEdit={ () => {
        //  that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus()
      }}/>
      );
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},

  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var that = this,
      isView = this.props.formStatus === formStatus.VIEW,
      isEdit = this.props.formStatus === formStatus.EDIT,
      isAdd = this.props.formStatus === formStatus.ADD;
    var collapseButton = (
    <div className="fold-tree-btn" style={{
      "color": "#939796"
    }}>
  				<FontIcon className={classnames("icon", "icon-column-fold")} onClick={this.props._toggleList}/>
  			</div>
    );
    var header = this._renderHeader(isView);
    var footer = this._renderFooter(isView);
    var content = this._renderInfo(isView);
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        'flex-direction': 'column'
      }} className='jazz-content'>
      <div className="pop-framework-right-actionbar">
          <div className="pop-framework-right-actionbar-top">
            <OrigamiPanel />
            {collapseButton}
          </div>
      </div>
          {header}
        <div className="pop-manage-detail-content">

      {content}
      {footer}
    </div>
    </div>
      )
  },
});
module.exports = PlatformContent;
