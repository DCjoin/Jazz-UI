'use strict';

import React from "react";
import classnames from "classnames";
import moment from "moment";
import Detail from '../customer/CustomerDetail.jsx';
import { CircularProgress, Checkbox } from 'material-ui';
import Regex from '../../constants/Regex.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import CommonFuns from '../../util/Util.jsx';
import ImageUpload from '../../controls/ImageUpload.jsx';
import AdminList from '../customer/AdminList.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';

var CustomerForHierarchy = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    closedList: React.PropTypes.bool,
    toggleList: React.PropTypes.func,
    selectedNode: React.PropTypes.object,
    handlerCancel: React.PropTypes.func,
    handleSave: React.PropTypes.func,
    handleDelete: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    merge: React.PropTypes.func,
    infoTabNo: React.PropTypes.number,
  },
  getInitialState: function() {
    return {
      isLoading: false,
      customer: HierarchyStore.getSelectedCustomer(),
      dialogStatus: false,
      editBtnDisabled: this.props.formStatus === formStatus.ADD ? true : false
    };
  },
  _update: function() {
    this.forceUpdate();
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
  _setEditBtnStatus: function(status) {
    this.setState({
      editBtnDisabled: status
    });
  },
  _handleSave: function() {},
  _renderInfoTab: function() {
    var {customer} = this.state,
      adminList = null,
      isView = this.props.formStatus === formStatus.VIEW,
      {Code, Address, StartTime, LinkMans, Comment, CalcStatus} = customer.toJS();

    //props
    var customerCodeProps = {
      isViewStatus: isView,
      title: I18N.Setting.CustomerManagement.Label.Code,
      defaultValue: Code,
      regex: Regex.CustomerCode,
      errorMessage: I18N.Setting.CustomerManagement.CodeError,
      isRequired: true,
      didChanged: value => {
        this.props.merge({
          value,
          path: "Code"
        })
      }
    };

    var customerAddressProps = {
      isViewStatus: isView,
      title: I18N.Setting.CustomerManagement.Label.Address,
      defaultValue: Address,
      isRequired: true,
      maxLen: -1,
      didChanged: value => {
        this.props.merge({
          value,
          path: "Address"
        })
      }
    };

    var customerStartTimeProps = {
      isViewStatus: isView,
      title: I18N.Setting.CustomerManagement.Label.OperationStartTime,
      defaultValue: this._getDateInput(StartTime),
      isRequired: true,
      regex: Regex.CommonTextNotNullRule,
      errorMessage: "请输入客户地址",
      lang: window.currentLanguage,
      didChanged: value => {
        var d2j = CommonFuns.DataConverter.DatetimeToJson;
        this.props.merge({
          value: d2j(new Date(value)),
          path: "StartTime"
        })
      }
    };
    var imageProps = {
      clip: false,
      background: 'customer-background-logo',
      imageId: customer.get('LogoId'),
      imageSource: {
        hierarchyId: customer.get('Id')
      },
      isViewState: isView,
      imageDidChanged: value => {
        this.props.merge({
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
        this.props.merge({
          value,
          path: "Comment"
        });
      }
    };
    var calStatusProps = {
      checked: (CalcStatus != true && CalcStatus != false) ? true : CalcStatus,
      disabled: isView,
      label: I18N.Platform.ServiceProvider.CalcStatus,
      onCheck: (event, checked) => {
        this.props.merge({
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
          this.props.merge({
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
      <div className="pop-manage-detail-content">
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
  _renderHeader: function() {
    var that = this,
      {selectedNode} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      NameProps = {
        isViewStatus: isView || this.props.infoTabNo !== 1,
        title: I18N.Setting.Labeling.CustomerName,
        defaultValue: selectedNode.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          this.props.merge({
            value,
            path: "Name"
          });
        }
      };
    return (
      <div className="pop-manage-detail-header" style={{
        marginTop: '-12px'
      }}>
  <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
    <ViewableTextField  {...NameProps} />

        <div className="pop-user-detail-tabs" style={{
        width: '375px',
        minWidth: '375px'
      }}>
  <span className={classnames({
        "pop-user-detail-tabs-tab": true,
        "selected": that.props.infoTabNo === 1
      })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
  <span className={classnames({
        "pop-user-detail-tabs-tab": true,
        "selected": that.props.infoTabNo === 2
      })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Setting.Organization.AssociateTag}</span>
</div>

  </div>
</div>
      );

  },
  _renderContent: function() {
    // var tagProps = {
    //     ref: 'jazz_Org_tag',
    //     formStatus: this.props.formStatus,
    //     isDim: false,
    //     hierarchyId: this.props.selectedNode.get('Id'),
    //     onUpdate: this._update
    //   };
    var content,
      that = this;
    switch (this.props.infoTabNo) {
      case 1:
        content = that._renderInfoTab();
        break;
      case 2:
        //content = <MonitorTag {...tagProps}/>;
        break;

    }
    return (
      <div style={{
        display: 'flex',
        flex: '1',
        overflow: 'auto'
      }}>
    {content}
  </div>

      );
  },
  _renderFooter: function() {
    var disabledSaveButton = this.state.editBtnDisabled,
      {selectedNode} = this.props,
      that = this,
      editBtnProps = {
        label: I18N.Common.Button.Add
      };
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSave}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      allowDelete={that.props.infoTabNo === 1}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus();
      }}
      editBtnProps={editBtnProps}/>

      );
  },
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    if (!this.state.dialogStatus) {
      return null;
    } else {
      var selectedNode = that.props.selectedNode,
        title = selectedNode.get('Type') === 0 ? I18N.Common.Glossary.Organization : I18N.Common.Glossary.Site;

      return (

        <Dialog openImmediately={this.state.dialogStatus} title={I18N.format(I18N.Setting.Hierarchy.DeleteTitle, title)} modal={true} actions={[
          <FlatButton
          label={I18N.Template.Delete.Delete}
          primary={true}
          onClick={() => {
            that.props.handleDelete(selectedNode);
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Template.Delete.Cancel}
          onClick={closeDialog} />
        ]}>
    {I18N.format(I18N.Setting.Hierarchy.DeleteContent, title, selectedNode.get('Name'), title)}
  </Dialog>
        );
    }
  },
  _onChange: function() {
    this.setState({
      customer: HierarchyStore.getSelectedCustomer(),
      isLoading: false,
    });
  },
  componentDidMount: function() {
    HierarchyStore.addCustomerChangeListener(this._onChange);
    if (this.state.customer.size === 0) {
      HierarchyAction.getCustomersByFilter(this.props.selectedNode.get('Id'));
      this.setState({
        isLoading: true
      });
    }
  },
  componentWillUnmount: function() {
    HierarchyStore.removeCustomerChangeListener(this._onChange);
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent();
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
        <CircularProgress  mode="indeterminate" size={2} />
      </div>
        );
    } else {
      return (
        <div className={classnames({
          "jazz-framework-right-expand": that.props.closedList,
          "jazz-framework-right-fold": !that.props.closedList
        })}>
      <Panel onToggle={this.props.toggleList}>
        {header}
        {content}
        {this.props.infoTabNo === 1 ? null : this._renderFooter()}
      </Panel>
      {that._renderDialog()}
    </div>);
    }
  },
});
module.exports = CustomerForHierarchy;
