'use strict';
import PropTypes from 'prop-types';
import React from "react";
import classnames from "classnames";
import Panel from 'controls/MainContentPanel.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from 'controls/ViewableTextFieldUtil.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import MonitorTag from '../MonitorTag.jsx';
import Basic from './BuildingBasic.jsx';
import HierarchyStore from 'stores/hierarchySetting/HierarchyStore.jsx';
import HierarchyAction from 'actions/hierarchySetting/HierarchyAction.jsx';
import Calendar from '../Calendar.jsx';
import Cost from '../Cost.jsx';
import Property from './Property.jsx';
var createReactClass = require('create-react-class');
var Building = createReactClass({

  propTypes: {
    formStatus: PropTypes.string,
    infoTabNo: PropTypes.number,
    selectedNode: PropTypes.object,
    setEditStatus: PropTypes.func,
    handlerCancel: PropTypes.func,
    handleSave: PropTypes.func,
    handleDelete: PropTypes.func,
    handlerSwitchTab: PropTypes.func,
    toggleList: PropTypes.func,
    closedList: PropTypes.bool,
    merge: PropTypes.func,
    consultants: PropTypes.array,
  },
  //mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  getInitialState: function() {
    return {
      dialogStatus: false,
      editBtnDisabled: this.props.formStatus === formStatus.ADD ? true : false,
      footerShow: true
    };
  },
  _update: function() {
    this.forceUpdate();
  },
  _onShowFooter: function(status) {
    this.setState({
      footerShow: status
    });
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
      let node = this.props.selectedNode;
      // if (!node.get('IndustryId')) {
      //   node = node.set('IndustryId', HierarchyStore.getAllIndustries()[0].Id);
      // }
      // if (!node.get('ZoneId')) {
      //   node = node.set('ZoneId', HierarchyStore.getAllZones()[0].Id);
      // }
      if (node.get('CalcStatus') !== true && node.get('CalcStatus') !== false) {
        node = node.set('CalcStatus', true);
      }
      if(node.getIn(['Location','Address'])===null){
        node=node.set('Location',null)
      }
      this.props.handleSave(node);
    } else if (this.props.infoTabNo === 2) {
      if (this.refs.jazz_building_tag) {
        let tags = this.refs.jazz_building_tag._handlerSave(),
          tagIds = [];
        tags.forEach(tag => {
          tagIds.push({
            Id: tag.get('Id'),
            Version: tag.get('Version')
          });
        });
        this.props.handleSave({
          hierarchyId: this.props.selectedNode.get('Id'),
          tags: tagIds,
          associationType: 1
        });
      }
    } else if (this.props.infoTabNo === 3) {
      if (this.refs.jazz_building_calendar) {
        let calendar = this.refs.jazz_building_calendar._handlerSave();
        this.props.handleSave({
          HierarchyId: this.props.selectedNode.get('Id'),
          Version: calendar.Version,
          CalendarItemGroups: calendar.CalendarItemGroups
        });
      }
    } else if (this.props.infoTabNo === 5) {
      if (this.refs.jazz_building_property) {
        let property = this.refs.jazz_building_property._handlerSave();
        this.props.handleSave(property);
      }
    } else if (this.props.infoTabNo === 4) {
      let cost = this.refs.jazz_building_cost._handlerSave();
      this.props.handleSave(cost);
    }
  },
  _handlerSwitchTabForCost: function(event) {
    this.props.handlerSwitchTab(event);
    this._onShowFooter(false);
  },
  _renderHeader: function() {
    var that = this,
      {selectedNode} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      NameProps = {
        ref: 'building_head',
        isViewStatus: isView || this.props.infoTabNo !== 1,
        title: I18N.format(I18N.Setting.Organization.Name, I18N.Common.Glossary.Building),
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
        <div className="jazz-building-tabs">
    <span className={classnames({
          "jazz-building-tabs-tab": true,
          "selected": that.props.infoTabNo === 1
        })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
    <span className={classnames({
          "jazz-building-tabs-tab": true,
          "selected": that.props.infoTabNo === 2
        })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Setting.Organization.AssociateTag}</span>
        <span className={classnames({
          "jazz-building-tabs-tab": true,
          "selected": that.props.infoTabNo === 3
        })} data-tab-index="3" onClick={that.props.handlerSwitchTab}>{I18N.Setting.Organization.HierarchyNodeCalendarProperties}</span>
        <span className={classnames({
          "jazz-building-tabs-tab": true,
          "selected": that.props.infoTabNo === 4
        })} data-tab-index="4" onClick={that._handlerSwitchTabForCost}>{I18N.Setting.Building.HierarchyNodeCostProperties}</span>
        <span className={classnames({
          "jazz-building-tabs-tab": true,
          "selected": that.props.infoTabNo === 5
        })} data-tab-index="5" onClick={that.props.handlerSwitchTab}>{I18N.Setting.Building.HierarchyNodePopulationNAreaProperties}</span>
  </div>
      }
    </div>
  </div>
      );

  },
  _renderContent: function() {
    var basicProps = {
        ref: 'jazz_building_basic',
        selectedNode: this.props.selectedNode,
        merge: this.props.merge,
        consultants: this.props.consultants,
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        key: this.props.selectedNode.get('Id') === null ? Math.random() : this.props.selectedNode.get('Id'),
      },
      tagProps = {
        ref: 'jazz_building_tag',
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        isDim: false,
        hierarchyId: this.props.selectedNode.get('Id'),
        onUpdate: this._update
      },
      calendarProps = {
        ref: 'jazz_building_calendar',
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        hierarchyId: this.props.selectedNode.get('Id')
      },
      propertyProps = {
        ref: 'jazz_building_property',
        formStatus: this.props.formStatus,
        setEditBtnStatus: this._setEditBtnStatus,
        hierarchyId: this.props.selectedNode.get('Id')
      },
      costProps = {
        ref: 'jazz_building_cost',
        formStatus: this.props.formStatus,
        hierarchyId: this.props.selectedNode.get('Id'),
        setEditBtnStatus: this._setEditBtnStatus,
        name: this.props.selectedNode.get('Name'),
        onUpdate: this._update,
        onShowFooter: this._onShowFooter
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
      case 4:
        content = <Cost {...costProps}/>;
        break;
      case 5:
        content = <Property {...propertyProps}/>;
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
    } else if (this.props.infoTabNo === 2) {
      editBtnProps = {
        label: I18N.Common.Button.Add
      };
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
        //that.clearErrorTextBatchViewbaleTextFiled();
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
      var selectedNode = that.props.selectedNode;

      return (

        <Dialog open={this.state.dialogStatus} title={I18N.format(I18N.Setting.Hierarchy.DeleteTitle, I18N.Common.Glossary.Building)} modal={true} actions={[
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
      {I18N.format(I18N.Setting.Hierarchy.DeleteContent, I18N.Common.Glossary.Building, selectedNode.get('Name'), I18N.Common.Glossary.Building)}
    </Dialog>
        );
    }
  },
  _handlerCancel: function() {
    this.props.handlerCancel();
    if (this.props.infoTabNo === 2) {
      if (this.refs.jazz_building_tag) {
        this.refs.jazz_building_tag._resetFilterObj();
      }
    } else if (this.props.infoTabNo === 3) {
      HierarchyAction.cancelSaveCalendar();
    } else if (this.props.infoTabNo === 5) {
      HierarchyAction.cancelSaveProperty();
    }
  },
  // componentWillMount: function() {
  //   this.initBatchViewbaleTextFiled();
  //   this.clearErrorTextBatchViewbaleTextFiled();
  // },
  componentDidMount: function() {
    if (this.props.formStatus === formStatus.ADD) {
      this.refs.building_head.focus();
    }
  },
  // componentWillUnmount: function() {
  //   this.clearErrorTextBatchViewbaleTextFiled();
  // },
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
      {this.state.footerShow ? footer : null}
    </Panel>
    {that._renderDialog()}
  </div>
      );
  },
});
module.exports = Building;
