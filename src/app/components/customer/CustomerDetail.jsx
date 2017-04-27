'use strict';

import React from "react";
import classnames from "classnames";
import moment from "moment";
import { CircularProgress, Checkbox } from 'material-ui';
import Regex from 'constants/Regex.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import { dataStatus } from 'constants/DataStatus.jsx';
import CustomerAction from 'actions/CustomerAction.jsx';
import CustomerStore from 'stores/CustomerStore.jsx';
import Panel from 'controls/MainContentPanel.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import ImageUpload from 'controls/ImageUpload.jsx';
import AdminList from './AdminList.jsx';
import CommonFuns from 'util/Util.jsx';

var CustomerDetail = React.createClass({

  propTypes: {
    formStatus: React.PropTypes.bool,
    infoTab: React.PropTypes.bool,
    customer: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveCustomer: React.PropTypes.func,
    handleDeleteCustomer: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
    isFromHierarchy: React.PropTypes.bool,
    handleEnergyInfoChanged: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dialogStatus: false,
      energyInfo: null
    };
  },
  _onEnergyInfoChanged: function() {
    var isView = this.props.formStatus === formStatus.VIEW;
    this.setState({
      energyInfo: CustomerStore.getEnergyInfo(isView)
    });
  },
  _handleSaveCustomer: function() {
    var {customer} = this.props,
      customerData;
    if (this.props.infoTab) {
      customerData = customer.toJS();
      if (customerData.CalcStatus !== true && customerData.CalcStatus !== false) {
        customerData.CalcStatus = true;
      }
    } else {
      customerData = CustomerStore.getUpdatingEnergyInfo().toJS();
      this.setState({
        energyInfo: null
      });
    }
    this.props.handleSaveCustomer(customerData);
  },
  _handlerSwitchTab: function(event) {
    if (event.target.getAttribute("data-tab-index") == 2) {
      CustomerAction.GetCustomerEnergyInfos(this.props.customer.get('Id'));
    } else {
      this.setState({
        energyInfo: null
      });
    }
    this.props.handlerSwitchTab(event);
  },
  _handleEnergyInfoClick: function(e) {
    var value = e.currentTarget.id;
    CustomerAction.mergeEnergy({
      value,
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
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    var customer = that.props.customer;

    return (

      <NewDialog open={this.state.dialogStatus} title={I18N.Setting.CustomerManagement.DeleteTitle} modal={true} actions={[
        <FlatButton
        label={I18N.Common.Button.Delete}
        inDialog={true}
        primary={true}
        onClick={() => {
          that.props.handleDeleteCustomer(customer);
          closeDialog();
        }} />,
        <FlatButton
        label={I18N.Common.Button.Cancel}
        onClick={closeDialog} />
      ]}>
      {I18N.format(I18N.Setting.CustomerManagement.DeleteContent, customer.get('Name'))}
    </NewDialog>
      );
  },
  _renderHeader: function() {
    var that = this,
      {customer} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD;
    var {Name} = customer.toJS();
    var customerNameProps = {
      isViewStatus: isView || !this.props.infoTab,
      title: I18N.Setting.Labeling.CustomerName,
      defaultValue: Name,
      isRequired: true,
      key: 'name_' + isView,
      didChanged: value => {
        CustomerAction.merge({
          value,
          path: "Name"
        })
      }
    };
    return (
      <div className="pop-manage-detail-header">
      <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
        <ViewableTextField  {...customerNameProps} />
          {
      isAdd || this.props.isFromHierarchy ? null :
        <div className="pop-user-detail-tabs">
      <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTab
        })} data-tab-index="1" onClick={that._handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
      <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !that.props.infoTab
        })} data-tab-index="2" onClick={that._handlerSwitchTab}>{I18N.Setting.CustomerManagement.Label.MapPageInfo}</span>
    </div>
      }
      </div>
    </div>
      )

  },
  _renderInfoTab: function() {
    var {customer, consultants} = this.props,
      adminList = null,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      {Code, Address, StartTime, LinkMans, Comment, CalcStatus, ConsultantId} = customer.toJS();

    if( !isAdd && !consultants) {
      return (<div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>);
    }

    //props
    var customerCodeProps = {
      isViewStatus: isView,
      key: 'code_' + isView,
      title: I18N.Setting.CustomerManagement.Label.Code,
      defaultValue: Code,
      regex: Regex.CustomerCode,
      errorMessage: I18N.Setting.CustomerManagement.CodeError,
      isRequired: true,
      didChanged: value => {
        CustomerAction.merge({
          value,
          path: "Code"
        })
      }
    };

    var customerAddressProps = {
      isViewStatus: isView,
      key: 'address_' + isView,
      title: I18N.Setting.CustomerManagement.Label.Address,
      defaultValue: Address,
      isRequired: true,
      maxLen: -1,
      didChanged: value => {
        CustomerAction.merge({
          value,
          path: "Address"
        })
      }
    };

    var customerStartTimeProps = {
      isViewStatus: isView,
      key: 'starttime_' + isView,
      title: I18N.Setting.CustomerManagement.Label.OperationStartTime,
      value: this._getDateInput(StartTime),
      isRequired: true,
      regex: Regex.CommonTextNotNullRule,
      errorMessage: "请输入运营时间",
      lang: window.currentLanguage,
      onChange: value => {
        var d2j = CommonFuns.DataConverter.DatetimeToJson;
        CustomerAction.merge({
          value: d2j(new Date(value)),
          path: "StartTime"
        })
      }
    };
    var imageProps = {
      clip: false,
      background: (customer.get('Id') || customer.get('LogoId') || customer.getIn(['LogoId', 'hierarchyId'])) && 'customer-background-logo',
      // background: 'customer-background-logo',
      imageId: customer.get('LogoId'),
      imageSource: {
        hierarchyId: customer.get('Id')
      },
      isViewState: isView,
      updateTips: I18N.Setting.CustomerManagement.LogoUploadInfo,
      imageDidChanged: value => {
        CustomerAction.merge({
          value: value.logoId,
          path: "LogoId"
        })
      },
      wrapperWidth: 420,
      wrapperHeight: 140,
      uploadUrl: 'LogoUpload.aspx'
    };
    var userCommentProps = {
      isViewStatus: isView,
      title: I18N.Setting.UserManagement.Comment,
      defaultValue: Comment || "",
      multiLine: true,
      maxLen: -1,
      didChanged: value => {
        CustomerAction.merge({
          value,
          path: "Comment"
        });
      }
    };
    var customerConsultantsProps = {
      isViewStatus: isView,
      title: I18N.Setting.Building.Consultant,
      defaultValue: ConsultantId || 0,
      valueField: 'Id',
      textField: 'RealName',
      dataItems: !isAdd && consultants.unshift({
        Id: 0,
        RealName: I18N.Common.Label.CommoEmptyText
      }).toJS(),
      didChanged: (value) => {
        CustomerAction.merge({
          value,
          path: 'ConsultantId'
        })
      }
    };
    var calStatusProps = {
      checked: (CalcStatus != true && CalcStatus != false) ? true : CalcStatus,
      disabled: isView,
      label: I18N.Platform.ServiceProvider.CalcStatus,
      onCheck: (event, checked) => {
        CustomerAction.merge({
          value: checked,
          path: "CalcStatus"
        })
      }
    };

    if (!isView || (LinkMans && LinkMans.length > 0)) {
      var adminProps = {
        status: this.props.formStatus,
        admins: customer.get("LinkMans"),
        dataDidChanged: (status, value, index) => {
          var path = "LinkMans";
          if (status !== dataStatus.NEW) {
            path += "." + index;
          }
          CustomerAction.merge({
            status,
            value,
            path,
            index
          })
        }
      };

      adminList = (
        <AdminList {...adminProps}/>
      );
    }

    return (
      <div>
        <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...customerCodeProps} />
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...customerAddressProps} />
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDatePicker {...customerStartTimeProps} />
          </div>
          {!isAdd && (!isView || ConsultantId ) && consultants.length !== 0 && <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...customerConsultantsProps} />
          </div>}
          <div className="pop-user-detail-content-item">
            <Checkbox {...calStatusProps} />
          </div>
          {Comment || !isView ? <div className={classnames("pop-user-detail-content-item", "jazz-customer-comment")}>
                    <ViewableTextField {...userCommentProps}/>
                  </div> : null}

        </div>
        <div className="pop-customer-detail-content-right pop-customer-detail-info-logo">
          <ImageUpload {...imageProps} />
        </div>
      </div>
      {adminList}
      </div>

      )

  },
  _renderMapInfoTab: function() {
    var isView = this.props.formStatus === formStatus.VIEW;
    if (!!this.state.energyInfo) {
      let infos = [];
      let flag = CustomerStore.getUpdatingEnergyInfo().get('EnergyInfoIds').size < 5;
      this.state.energyInfo.forEach((info) => {
        var liStyle = {};

        if (isView && !info.isChecked) {
          liStyle.display = "none";
        }
        infos.push(
          <li className="pop-user-detail-customer-subcheck-block-item" style={liStyle}>
        <div className="pop-user-detail-customer-subcheck-block-item-left" id={info.Id} onClick={this._handleEnergyInfoClick}>
          <Checkbox
          ref=""
          defaultChecked={info.isChecked}
          disabled={isView || !(flag || info.isChecked)}
          style={{
            width: "auto",
            display: "block"
          }}
          />
          <label
          title={info.Name}
          className={classnames("pop-user-detail-customer-subcheck-block-item-label", {
            "disabled": isView
          })}>
            {info.Name}
          </label>
        </div>
      </li>
        );
      });
      return (
        <div className="pop-role-detail-content-permission">
          <div className='jazz-tariff-infoTab-notice'>
            {I18N.Setting.CustomerManagement.Label.SelectTip}
          </div>
          <div className='jazz-tariff-infoTab-notice' style={{
          marginTop: '10px',
          marginBottom: '25px'
        }}>
            {I18N.Setting.CustomerManagement.Label.AtleastOneAtMostFive}
          </div>
    <ul className="pop-role-detail-content-permission-content">
      <ul className="pop-user-detail-customer-subcheck-block">
      {infos}
    </ul>
    </ul>
  </div>
        )

    } else {
      return (
        <CircularProgress  mode="indeterminate" size={80} />
        )
    }

  },
  _renderContent: function() {
    return (
      <div className="pop-manage-detail-content">
        {this.props.infoTab ? this._renderInfoTab() : this._renderMapInfoTab()}
      </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = true,
      {customer} = this.props,
      that = this;
    var {Id, Name, Code, Address, StartTime, LogoId} = customer.toJS();
    if (this.props.infoTab) {
      if (
        Name && Name.length <= 200 &&
        Code && Code.length <= 200 && Regex.CustomerCode.test(Code) &&
        Address && Address.trim() &&
        StartTime &&
        (Id || LogoId)
      ) {
        disabledSaveButton = false;
      }
    } else {
      if (!!CustomerStore.getUpdatingEnergyInfo()) {
        if (CustomerStore.getUpdatingEnergyInfo().get('EnergyInfoIds').size > 0) {
          disabledSaveButton = false;
        }
      }

    }

    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveCustomer}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      allowDelete={that.props.infoTab}
      onCancel={
      () => {
        if (!that.props.infoTab) {
          that.setState({
            energyInfo: CustomerStore.getEnergyInfo(true)
          })
        }

        that.props.handlerCancel();
      }}
      onEdit={ () => {
        // that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus()
      }}/>

      )
  },
  componentWillMount: function() {
    // this.initBatchViewbaleTextFiled();
    if (!this.props.infoTab) {
      CustomerAction.GetCustomerEnergyInfos(this.props.customer.get('Id'));
    }
  },
  componentDidMount: function() {
    CustomerStore.addEnergyInfoChangeListener(this._onEnergyInfoChanged);
  },
  componentWillUnmount: function() {
    CustomerStore.removeEnergyInfoListener(this._onEnergyInfoChanged);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.infoTab) {
      this.setState({
        energyInfo: null
      })
    }
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
      <Panel onToggle={this.props.toggleList}>
        {header}
        {content}
        {this.props.isFromHierarchy ? null : footer}
      </Panel>
{that._renderDialog()}
    </div>
      )
  },
});

module.exports = CustomerDetail;
