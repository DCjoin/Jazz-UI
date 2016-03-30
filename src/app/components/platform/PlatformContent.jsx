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
import ViewableTextFieldUtil from '../../controls/ViewableTextFieldUtil.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Delete from '../../controls/OperationTemplate/Delete.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import assign from 'object-assign';

const DIALOG_TYPE = {
  DELETE: "cancel",
  SEND_EMAIL: "send_email",
  ERROR: 'error'
};

let PlatformContent = React.createClass({
  mixins: [ViewableTextFieldUtil],
  propTypes: {
    provider: React.PropTypes.object,
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
  _handleCancel: function() {
    PlatformAction.cancelSave();
  },
  _handleSendEmail: function() {
    PlatformAction.sendInitPassword(this.props.provider.Id);
  },
  _onSendEmailSuccess: function() {
    this.setState({
      dialogType: DIALOG_TYPE.SEND_EMAIL
    });
  },
  _renderHeader: function(isView) {
    var providerNameProps = {
      isViewStatus: isView,
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
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames({
        "pop-customer-detail-name": true,
        "jazz-platform-header": true
      })}>
          <ViewableTextField {...providerNameProps} />
        </div>
      </div>
      )
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
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
      )

  },
  _renderFooter: function(isView) {
    var that = this;
    var sendPasswordButton = null,
      saveButtonDisabled = false;
    var {Name, UserName, Domain, Address, Telephone, Email, StartDate, LoginUrl, LogOutUrl} = this.props.provider;
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
    if (isView) {
      sendPasswordButton = (
        <FlatButton secondary={true}  label={I18N.Platform.ServiceProvider.SendEmail} style={{
          borderRight: '1px solid #ececec',
          color: '#abafae'
        }} onClick={
        that._handleSendEmail
        }/>
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
          dialogType: DIALOG_TYPE.DELETE
        });
      }}
      onCancel={this._handleCancel}
      onEdit={ () => {
        that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus()
      }}/>
      );
  },
  _getDeleteDialog: function() {
    var that = this;
    var _onDeleteProvider = function() {
      var dto = {
        Id: that.props.provider.Id,
        Version: that.props.provider.Version
      }
      PlatformAction.deleteServiceProvider(dto)
    };
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      })
    };
    var props = {
      type: I18N.Platform.ServiceProvider.SP,
      name: this.props.provider.Name,
      onFirstActionTouchTap: _onDeleteProvider,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Delete {...props}></Delete>
      )
  },
  _getSendEmailDialog: function() {
    var that = this;
    var _onConfirm = function() {
      that.setState({
        dialogType: ''
      })
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
      )
  },
  _getErrorDialog: function() {
    var that = this;

    var error = PlatformStore.getError();
    error = error.substring(error.length - 5, error.length);
    var content;
    var _onConfirm = function() {
      that.setState({
        dialogType: ''
      })
      if (error.indexOf('002') < 0) {
        PlatformAction.getServiceProviders();
      }
    };
    if (error.indexOf('001') > -1) {
      content = I18N.Platform.ServiceProvider.Error001
    } else {
      if (error.indexOf('002') > -1) {
        content = I18N.Platform.ServiceProvider.Error002
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
      )
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },
  componentDidMount: function() {
    PlatformStore.addErrorChangeListener(this._onError);
    PlatformStore.addSendEmailListener(this._onSendEmailSuccess);
  },
  componentWillUnmount: function() {
    PlatformStore.removeErrorListener(this._onError);
    PlatformStore.removeSendEmailListener(this._onSendEmailSuccess);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.provider.Id != this.props.provider.Id) {
      this.clearErrorTextBatchViewbaleTextFiled();
      this.setState({
        providerIdError: '',
      })

    }
  },

  getInitialState: function() {
    return {
      providerIdError: '',
      dialogType: ''
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
    var header = this._renderHeader(isView);
    var footer = this._renderFooter(isView);
    var content = this._renderInfo(isView, isAdd);
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


    }
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
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
      {dialog}
    </div>
    </div>
      )
  },
});
module.exports = PlatformContent;
