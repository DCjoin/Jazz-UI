'use strict';

import React from 'react';
import { CircularProgress, FontIcon, IconButton, IconMenu, DropDownMenu, Checkbox } from 'material-ui';
import classnames from "classnames";
import moment from 'moment';
import Regex from '../../constants/Regex.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import OrigamiPanel from '../../controls/OrigamiPanel.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import Customer from './CustomerIdentity.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Delete from '../../controls/OperationTemplate/Delete.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import assign from 'object-assign';

const DIALOG_TYPE = {
  DELETE: "cancel",
  SEND_EMAIL: "send_email",
  ERROR: 'error',
  RESET: 'reset'
};

let PlatformContent = React.createClass({
  propTypes: {
    provider: React.PropTypes.object,
    infoTabNo: React.PropTypes.number,
  },
  _onError: function() {
    var error = PlatformStore.getError();

    if (error === null) {
      this.setState({
        providerIdError: null
      });
    } else {
      error = error.substring(error.length - 5, error.length);
      this.setState({
        dialogType: DIALOG_TYPE.ERROR
      });
    }

  },
  _onCustomerChanged: function() {
    this.setState({
      customer: PlatformStore.getCustomerIdentity()
    });
    this.props.handleCancel();
  },
  _onMergeCustomerChanged: function() {
    this.setState({
      customer: PlatformStore.getCustomerIdentity()
    });
  },
  _handleResetDefault: function() {
    this.setState({
      dialogType: DIALOG_TYPE.RESET
    });
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
    var provider = assign({}, this.props.provider);
    provider.Telephone = null;
    if (!!this.props.provider.Id) {
      PlatformAction.modifyServiceProvider(provider);
    } else {
      PlatformAction.createServiceProvider(provider);
    }
  },
  _handleSaveCustomer: function() {
    var customer;
    if (!!this.state.customer.SpId) {
      customer = assign({}, this.state.customer);
      PlatformAction.modifyCustomer(customer);
    } else {
      customer = assign({
        SpId: this.props.provider.Id
      }, this.state.customer);
      PlatformAction.createCustomer(customer);
    }
  },
  _handleSave: function() {
    switch (this.props.infoTabNo) {
      case 1:
        this._handleSaveUser();
        break;
      case 2:
        this._handleSaveCustomer();
        break;
    }
  },
  _handleCancel: function() {
    switch (this.props.infoTabNo) {
      case 1:
        PlatformAction.cancelSave();
        break;
      case 2:
        PlatformAction.cancelSaveCustomer();
        break;
    }
  },
  _handleSendEmail: function() {
    PlatformAction.sendInitPassword(this.props.provider.Id);
  },
  _onSendEmailSuccess: function() {
    this.setState({
      dialogType: DIALOG_TYPE.SEND_EMAIL
    });
  },
  _renderHeader: function(isView, isAdd) {
    var that = this;
    var providerNameProps = {
      isViewStatus: isView || this.props.infoTabNo === 2,
      title: I18N.Platform.ServiceProvider.SPName,
      defaultValue: this.props.provider.Name,
      isRequired: true,
      didChanged: value => {
        PlatformAction.mergeProvider({
          value: value,
          path: "Name"
        });
      }
    };
    var tab = null;
    if (!isAdd) {
      tab = (<div className="pop-user-detail-tabs" style={{
        width: '375px',
        minWidth: '375px'
      }}>
        <span className={classnames({
        "pop-user-detail-tabs-tab": true,
        "selected": that.props.infoTabNo === 1
      })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Platform.ServiceProvider.SPInfo}</span>
        <span className={classnames({
        "pop-user-detail-tabs-tab": true,
        "selected": that.props.infoTabNo === 2
      })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Platform.ServiceProvider.Customer}</span>
  </div>);
    }
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames({
        "pop-customer-detail-name": true,
        "pop-manage-detail-header-name": true,
        "jazz-platform-header": true,
        "jazz-header": true
      })}>
          <ViewableTextField {...providerNameProps} />
          {tab}
        </div>
      </div>
      );
  },
  _renderContent: function(isView, isAdd) {
    var content,
      that = this;
    switch (this.props.infoTabNo) {
      case 1:
        content = that._renderInfo(isView, isAdd);
        break;
      case 2:
        content = <Customer provider={this.props.provider} formStatus={this.props.formStatus} customer={this.state.customer}/>;
        break;
    }
    return (
      <div style={{
        display: 'flex',
        flex: '1',
      //overflow: 'auto' //自定义标志页面会出现不该出来的滚动条
      }}>
    {content}
  </div>
      );
  },
  _renderInfo: function(isView, isAdd) {
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
        value: this._getDateInput(StartDate),
        isRequired: true,
        // regex: Regex.CommonTextNotNullRule,
        // errorMessage: "请输入客户地址",
        onChange: value => {
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
  _renderFooter: function(isView) {
    var that = this;
    var sendPasswordButton = null,
      resetDefaultButton = null,
      saveButtonDisabled = false;
    var {Name, UserName, Domain, Address, Telephone, Email, StartDate, LoginUrl, LogOutUrl} = this.props.provider;
    var {SpId, FullName, Abbreviation, AboutLink, Logo, HomeBackground, LogoContent, HomeBackgroundContent} = this.state.customer;
    // if (
    //   Name && Name.length < 200 &&
    //   UserName && UserName.length < 200 &&
    //   Domain && Domain.length < 200 &&
    //   Address &&
    //   Telephone &&
    //   Email &&
    //   StartDate
    // ) {
    //   saveButtonDisabled = false;
    // }
    if (this.props.infoTabNo === 1) {
      if (
        !Name ||
        Name.length > 200 ||
        !UserName ||
        UserName.length > 200 ||
        !Domain ||
        Domain.length > 200 ||
        !Address ||
        !Email || !Regex.Email.test(Email) || Email.length > 254 ||
        !StartDate
      ) {
        saveButtonDisabled = true;
      }
      if (!!LoginUrl && !Regex.UrlRule.test(LoginUrl)) {
        saveButtonDisabled = true;
      }
      if (!!LogOutUrl && !Regex.UrlRule.test(LogOutUrl)) {
        saveButtonDisabled = true;
      }
    } else if (this.props.infoTabNo === 2) {
      if (!FullName ||
        FullName.length > 200 ||
        !Abbreviation ||
        Abbreviation.length > 200 ||
        !AboutLink || !Regex.UrlRule.test(AboutLink) ||
        (!LogoContent && !Logo) ||
        (!HomeBackgroundContent && !HomeBackground)
      ) {
        saveButtonDisabled = true;
      }
    }
    if (isView) {
      sendPasswordButton = (
        <FlatButton secondary={true}  label={I18N.Platform.ServiceProvider.SendEmail} style={{
          borderRight: '1px solid #ececec',
          color: '#abafae'
        }} onClick={
        that._handleSendEmail
        }/>
      );
      if (!!this.state.customer.SpId) {
        resetDefaultButton = (
          <FlatButton secondary={true}  label={I18N.Platform.ServiceProvider.ResetDefault} style={{
            borderRight: '1px solid #ececec',
            color: '#abafae'
          }} onClick={
          that._handleResetDefault
          }/>
        );
      }
    }
    return (
      <FormBottomBar
      transition={true}
      customButton={this.props.infoTabNo === 1 ? sendPasswordButton : resetDefaultButton}
      enableSave={!saveButtonDisabled}
      allowDelete={this.props.infoTabNo === 1}
      status={this.props.formStatus}
      onSave={this._handleSave}
      onDelete={function() {
        that.setState({
          dialogType: DIALOG_TYPE.DELETE
        });
      }}
      onCancel={this._handleCancel}
      onEdit={ () => {
        that.props.setEditStatus();
      }}/>
      );
  },
  _getDeleteDialog: function() {
    var that = this;
    var _onDeleteProvider = function() {
      var dto = {
        Id: that.props.provider.Id,
        Version: that.props.provider.Version
      };
      PlatformAction.deleteServiceProvider(dto);
    };
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      });
    };
    var props = {
      type: I18N.Platform.ServiceProvider.SP,
      name: this.props.provider.Name,
      onFirstActionTouchTap: _onDeleteProvider,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    };
    return (
      <Delete {...props}></Delete>
      );
  },
  _getSendEmailDialog: function() {
    var that = this;
    var _onConfirm = function() {
      that.setState({
        dialogType: ''
      });
    };
    var props = {
      title: I18N.Platform.ServiceProvider.SendEmail,
      firstActionLabel: I18N.Mail.Send.Ok,
      content: I18N.Platform.ServiceProvider.SendEmailSuccess,
      onDismiss: _onConfirm,
      onFirstActionTouchTap: _onConfirm
    };

    return (
      <Dialog {...props}/>
      );
  },
  _getErrorDialog: function() {
    var that = this;

    var error = PlatformStore.getError();
    error = error.substring(error.length - 5, error.length);
    var content;
    var _onConfirm = function() {
      that.setState({
        dialogType: ''
      });
      if (error.indexOf('002') < 0 && error.indexOf('007') < 0) {
        PlatformAction.getServiceProviders();
      }
    };
    if (error.indexOf('001') > -1) {
      content = I18N.Platform.ServiceProvider.Error001;
    } else {
      if (error.indexOf('002') > -1) {
        content = I18N.Platform.ServiceProvider.Error002;
      } else if (error.indexOf('007') > -1) {
        content = I18N.Platform.ServiceProvider.Error007;
      } else {
        content = I18N.Platform.ServiceProvider.Error003;
      }
    }
    var props = {
      title: I18N.Platform.ServiceProvider.ErrorNotice,
      firstActionLabel: I18N.Mail.Send.Ok,
      content: content,
      onDismiss: _onConfirm,
      onFirstActionTouchTap: _onConfirm
    };

    return (
      <Dialog {...props}/>
      );
  },
  _getResetDialog: function() {
    var that = this;
    var _onDeleteCustomer = function() {
      PlatformAction.deleteCustomer(that.props.provider.Id);
    };
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      });
    };
    var props = {
      title: I18N.Platform.ServiceProvider.ResetDefault,
      content: I18N.Platform.ServiceProvider.ResetContent,
      firstActionLabel: I18N.Platform.ServiceProvider.Reset,
      secondActionLabel: I18N.Common.Button.Cancel,
      onFirstActionTouchTap: _onDeleteCustomer,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    };
    return (
      <Dialog {...props}/>
      );
  },
  componentDidMount: function() {
    PlatformStore.addErrorChangeListener(this._onError);
    PlatformStore.addSendEmailListener(this._onSendEmailSuccess);
    PlatformStore.addCustomerChangeListener(this._onCustomerChanged);
    PlatformStore.addMergeCustomerChangeListener(this._onMergeCustomerChanged);
  },
  componentWillUnmount: function() {
    PlatformStore.removeErrorListener(this._onError);
    PlatformStore.removeSendEmailListener(this._onSendEmailSuccess);
    PlatformStore.removeCustomerChangeListener(this._onCustomerChanged);
    PlatformStore.removeMergeCustomerChangeListener(this._onMergeCustomerChanged);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.provider.Id != this.props.provider.Id) {
      this.setState({
        providerIdError: '',
      });

    }
  },

  getInitialState: function() {
    return {
      providerIdError: '',
      dialogType: '',
      customer: PlatformStore.getCustomerIdentity()
    };
  },
  render: function() {
    var that = this,
      isView = this.props.formStatus === formStatus.VIEW,
      isEdit = this.props.formStatus === formStatus.EDIT,
      isAdd = this.props.formStatus === formStatus.ADD;
    var collapseButton = (
    <div className="fold-btn pop-framework-right-actionbar-top-fold-btn" style={{
      "color": "#939796"
    }}>
  				<FontIcon className={classnames("icon", "icon-column-fold")} onClick={this.props._toggleList}/>
  			</div>
    );
    var header = this._renderHeader(isView, isAdd);
    var footer = this._renderFooter(isView);
    var content = this._renderContent(isView, isAdd);
    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.DELETE:
        dialog = this._getDeleteDialog();
        break;
      case DIALOG_TYPE.SEND_EMAIL:
        dialog = this._getSendEmailDialog();
        break;
      case DIALOG_TYPE.ERROR:
        dialog = this._getErrorDialog();
        break;
      case DIALOG_TYPE.RESET:
        dialog = this._getResetDialog();
        break;
    }
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }} className={classnames({
        'jazz-content': true,
        "jazz-framework-right-expand": !this.props.showLeft
      })}>
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
      {dialog}
    </div>
    </div>
      );
  },
});
module.exports = PlatformContent;
