'use strict';

import React from "react";
import classnames from "classnames";
import { isFunction } from "lodash/lang";
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import Basic from './OrganizationBasic.jsx';
import MonitorTag from '../MonitorTag.jsx';
import Calendar from '../Calendar.jsx';
import HierarchyAction from '../../../actions/hierarchySetting/HierarchyAction.jsx';

var Organization = React.createClass({

  propTypes: {
    formStatus: React.PropTypes.string,
    infoTabNo: React.PropTypes.number,
    selectedNode: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSave: React.PropTypes.func,
    handleDelete: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
    closedList: React.PropTypes.bool,
    merge: React.PropTypes.func,
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  getInitialState: function() {
    return {
      dialogStatus: false,
      editBtnDisabled: this.props.formStatus === formStatus.ADD ? true : false
    };
  },
  _update: function() {
    this.forceUpdate();
  },
  // _clearErrorText: function() {
  //   var basic = this.refs.jazz_vee_basic,
  //     tag = this.refs.jazz_vee_tag;
  //   if (basic && isFunction(basic.clearErrorTextBatchViewbaleTextFiled)) {
  //     basic.clearErrorTextBatchViewbaleTextFiled();
  //   }
  //   if (tag && isFunction(tag.clearErrorTextBatchViewbaleTextFiled)) {
  //     tag.clearErrorTextBatchViewbaleTextFiled();
  //   }
  // },
  _setEditBtnStatus: function(status) {
    this.setState({
      editBtnDisabled: status
    });
  },
  _handleSave: function() {
    if (this.props.infoTabNo === 1) {
      this.props.handleSave(this.props.selectedNode);
    } else if (this.props.infoTabNo === 2) {
      if (this.refs.jazz_Org_tag) {
        let tags = this.refs.jazz_Org_tag._handlerSave(),
          tagIds = [];
        tags.forEach(tag => {
          tagIds.push({
            Id: tag.get('Id'),
            Version: tag.get('Version')
          });
        });
        this.props.handleSave({
          hierarchyId: this.props.selectedNode.get('Id'),
          tags: tagIds
        });
      }
    } else if (this.props.infoTabNo === 3) {
      if (this.refs.jazz_Org_calendar) {
        let calendar = this.refs.jazz_Org_calendar._handlerSave();
        this.props.handleSave({
          HierarchyId: this.props.selectedNode.get('Id'),
          Version: calendar.Version,
          CalendarItemGroups: calendar.CalendarItemGroups
        });
      }
    }
  },
  _renderHeader: function() {
    var that = this,
      {selectedNode} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      title = selectedNode.get('Type') === 0 ? I18N.Common.Glossary.Organization : I18N.Common.Glossary.Site,
      NameProps = {
        isViewStatus: isView || this.props.infoTabNo !== 1,
        title: I18N.format(I18N.Setting.Organization.Name, title),
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
        {
      isAdd ? null :
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
        <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTabNo === 3
        })} data-tab-index="3" onClick={that.props.handlerSwitchTab}>{I18N.Setting.Organization.HierarchyNodeCalendarProperties}</span>
  </div>
      }
    </div>
  </div>
      );

  },
  _renderContent: function() {
    var basicProps = {
        ref: 'jazz_Org_basic',
        selectedNode: this.props.selectedNode,
        merge: this.props.merge,
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        key: this.props.selectedNode.get('Id') === null ? Math.random() : this.props.selectedNode.get('Id'),
      },
      tagProps = {
        ref: 'jazz_Org_tag',
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        isDim: false,
        hierarchyId: this.props.selectedNode.get('Id'),
        onUpdate: this._update
      },
      calendarProps = {
        ref: 'jazz_Org_calendar',
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        hierarchyId: this.props.selectedNode.get('Id')
      };
    var content;
    switch (this.props.infoTabNo) {
      case 1:
        content = <Basic {...basicProps}/>;
        break;
      case 2:
        content = <MonitorTag {...tagProps}/>;
        break;
      case 3:
        content = <Calendar {...calendarProps}/>;
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
      editBtnProps;
    if (this.props.infoTabNo === 1) {
      if (!selectedNode.get('Name') || selectedNode.get('Name').length > 200) {
        disabledSaveButton = true;
      }
    } else {
      if (this.props.infoTabNo === 2) {
        editBtnProps = {
          label: I18N.Common.Button.Add
        };
      }
    }
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
      onCancel={this._handlerCancel}
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
  _handlerCancel: function() {
    this.props.handlerCancel();
    if (this.props.infoTabNo === 2) {
      if (this.refs.jazz_Org_tag) {
        this.refs.jazz_Org_tag._resetFilterObj();
      }
    } else if (this.props.infoTabNo === 3) {
      HierarchyAction.cancelSaveCalendar();
    }
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
    this.clearErrorTextBatchViewbaleTextFiled();
  },
  componentWillUnmount: function() {
    this.clearErrorTextBatchViewbaleTextFiled();
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
      {footer}
    </Panel>
    {that._renderDialog()}
  </div>
      );
  },
});
module.exports = Organization;
