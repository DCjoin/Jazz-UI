'use strict';

import React from 'react';
import { CircularProgress, FontIcon, IconButton, IconMenu, DropDownMenu, Checkbox } from 'material-ui';
import classnames from "classnames";
import moment from 'moment';
import Regex from '../../constants/Regex.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../controls/ViewableTextFieldUtil.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Delete from '../../controls/OperationTemplate/Delete.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import assign from 'object-assign';


let CustomerIdentity = React.createClass({
  mixins: [ViewableTextFieldUtil],
  propTypes: {
    provider: React.PropTypes.object,
  },
  _onCustomerChanged: function() {
    this.setState({
      customerIdentity: PlatformStore.getCustomerIdentity()
    });
  },
  _handleSaveUser: function() {
    var provider = assign({}, this.props.provider);
    provider.Telephone = null;
    if (!!this.props.provider.Id) {
      PlatformAction.modifyServiceProvider(provider);
    } else {
      PlatformAction.createServiceProvider(provider);
    }
  },
  _handleCancel: function() {
    PlatformAction.cancelSave();
  },
  _renderContent: function(isView, isAdd) {
    var {UserName, Domain, Address, Telephone, Email, StartDate, LoginUrl, LogOutUrl, Comment, Status, CalcStatus} = this.props.provider;
    var providerCodeProps = {
        isViewStatus: (isAdd) ? isView : true,
        title: I18N.Platform.ServiceProvider.SPID,
        errorText: this.state.providerIdError,
        defaultValue: UserName || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "UserName"
          });
        }
      },
      providerDomainProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.SPDomain,
        defaultValue: Domain || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Domain"
          });
        }
      },
      providerAddressProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Address,
        defaultValue: Address || "",
        isRequired: true,
        maxLen: -1,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Address"
          });
        }
      },
      providerTelephoneProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Telephone,
        defaultValue: Telephone || "",
        isRequired: true,
        // regex: Regex.TelephoneRule,
        // errorMessage: "允许数字和中划线，但中划线不能连续出现或做为开头和结尾",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Telephone"
          });
        }
      },
      providerEmailProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Email,
        defaultValue: Email || "",
        isRequired: true,
        regex: Regex.Email,
        errorMessage: I18N.Platform.ServiceProvider.EmailError,
        maxLen: 254,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Email"
          });
        }
      },
      providerBackToUrlProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.LoginUrl,
        defaultValue: LoginUrl || "",
        regex: Regex.UrlRule,
        errorMessage: I18N.Platform.ServiceProvider.LoginUrlError,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "LoginUrl"
          });
        }
      },
      providerLogOutUrlProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.LogOutUrl,
        defaultValue: LogOutUrl || "",
        regex: Regex.UrlRule,
        errorMessage: I18N.Platform.ServiceProvider.LogOutUrlError,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "LogOutUrl"
          });
        }
      },
      providerStartTimeProps = {
        isViewStatus: (isAdd) ? isView : true,
        title: I18N.Platform.ServiceProvider.StartDate,
        defaultValue: this._getDateInput(StartDate),
        isRequired: true,
        // regex: Regex.CommonTextNotNullRule,
        // errorMessage: "请输入客户地址",
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "StartDate"
          });
        }
      },
      providerCommentProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Comment,
        defaultValue: Comment || "",
        multiLine: true,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Comment"
          });
        }
      },
      titleItems = [{
        payload: 0,
        text: I18N.Platform.ServiceProvider.PauseStatus
      },
        {
          payload: 1,
          text: I18N.Platform.ServiceProvider.NormalStatus
        }],
      providerStatusProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Status,
        selectedIndex: Status,
        textField: "text",
        dataItems: titleItems,
        didChanged: value => {
          PlatformAction.mergeProvider({
            value: value,
            path: "Status"
          });
        }
      },
      providerCalStatusProps = {
        checked: CalcStatus || false,
        disabled: isView,
        label: I18N.Platform.ServiceProvider.CalcStatus,
        onCheck: (event, checked) => {
          PlatformAction.mergeProvider({
            value: checked,
            path: "CalcStatus"
          });
        }
      };
    return (
      <div className={"pop-user-detail-content"}>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerCodeProps} />
        </div>

          <div className="pop-user-detail-content-item" style={{
        flexDirection: 'row'
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
      );

  },
  componentWillMount: function() {
    PlatformAction.getCustomerIdentity(this.props.provider.Id);
    this.initBatchViewbaleTextFiled();
  },
  componentDidMount: function() {
    PlatformStore.addCustomerChangeListener(this._onCustomerChanged);
  },
  componentWillUnmount: function() {
    PlatformStore.removeCustomerChangeListener(this._onCustomerChanged);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.provider.Id != this.props.provider.Id) {
      this.clearErrorTextBatchViewbaleTextFiled();

    }
  },

  getInitialState: function() {
    return {
      customerIdentity: PlatformStore.getCustomerIdentity()
    };
  },
  render: function() {
    var that = this,
      isView = this.props.formStatus === formStatus.VIEW,
      isEdit = this.props.formStatus === formStatus.EDIT,
      isAdd = this.props.formStatus === formStatus.ADD;

    var content = this._renderContent(isView, isAdd);
    return content;
  },
});
module.exports = CustomerIdentity;
