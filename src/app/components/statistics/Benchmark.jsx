'use strict';

import React from "react";
import { CircularProgress, Dialog } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import LabelMenuAction from '../../actions/LabelMenuAction.jsx';
import BenchmarkAction from '../../stores/BenchmarkAction.jsx';
import BenchmarkStore from '../../stores/BenchmarkStore.jsx';
import FromEndTimeGroup from './FromEndTimeGroup.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Immutable from 'immutable';

var Benchmark = React.createClass({
  getInitialState: function() {
    return {
      isLeftLoading: true,
      isRightLoading: true,
      formStatus: formStatus.VIEW,
      enableSave: true,
      showDeleteDialog: false
    };
  },
  _onBenchmarkListChange: function() {
    var benchmarkList = BenchmarkStore.getBenchmarkData();
    this.setState({
      benchmarkList: benchmarkList,
      isLeftLoading: false
    });
  },
  _onIndustryDataChange: function() {
    var industyData = BenchmarkStore.getIndustryData();
    this.setState({
      industyData: industyData
    });
  },
  _onZoneDataChange: function() {
    var zoneData = BenchmarkStore.getZoneData();
    this.setState({
      zoneData: zoneData
    });
  },
  _onSelectedItemChange: function() {
    var selectedIndex = BenchmarkStore.getSelectedBenchmarkIndex();
    var selectedData = BenchmarkStore.getSelectedBenchmark();
    this.setState({
      isRightLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedData: selectedData
    });
  },
  _onItemClick: function(index) {
    BenchmarkAction.setSelectedBenchmarkIndex(index);
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _onCancel: function() {
    BenchmarkAction.cancelSaveBenchmark();
  },
  _onSave: function() {
    var selectedData = this.state.selectedData.toJS();
    if (selectedData.IndustryId === -1) {
      BenchmarkAction.createBenchmark(selectedData);
    } else {
      BenchmarkAction.modifyBenchmark(selectedData);
    }
  },
  _onDelete: function() {
    this.setState({
      showDeleteDialog: true
    });
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _renderDeleteDialog() {
    if (!this.state.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      onClick={this._deleteBenchmark} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={true}
      actions={dialogActions}
      modal={true}>
        {I18N.format(I18N.Setting.Calendar.DeleteMessage, this.state.selectedData.get('IndustryComment'))}
      </Dialog>);
  },
  _deleteBenchmark() {
    var selectedData = this.state.selectedData;
    BenchmarkAction.deleteBenchmarkById(selectedData.get('IndustryId'), selectedData.get('Version'));
  },
  _addBenchmark() {
    var benchmark = {
      Name: '',
      Version: null,
      Id: null,
      Items: [{
        Type: 2,
        StartFirstPart: -1,
        StartSecondPart: -1,
        EndFirstPart: -1,
        EndSecondPart: -1,
      }]
    };
    this.setState({
      selectedIndex: null,
      selectedData: Immutable.fromJS(benchmark),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _isValid() {
    var isValid = this.refs.benchmarkTitleId.isValid();
    isValid = isValid && this.refs.benchmarkGroup.isValid();
    return isValid;
  },
  _addBenchmarkData: function() {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    var item = {
      StartFirstPart: -1,
      StartSecondPart: -1,
      EndFirstPart: -1,
      EndSecondPart: -1,
      Type: 2
    };
    items = items.unshift(Immutable.fromJS(item));
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData,
      enableSave: false
    });
  },
  _deleteBenchmarkData: function(index) {
    var me = this;
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.delete(index);
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: me._isValid()
      });
    });
  },
  _onNameChange(value) {
    var me = this;
    var selectedData = me.state.selectedData;
    selectedData = selectedData.set('Name', value);
    me.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: me._isValid()
      });
    });
  },
  _renderHeader: function(isAdd) {
    var me = this;
    let selectedData = me.state.selectedData;
    var titleTextProps = {
      ref: 'benchmarkTitleText',
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('IndustryComment'),
      title: ''
    };
    var titleDropProps = {

    };
    return (
      <div className="jazz-benchmark-header">
        <div className='jazz-benchmark-title-text'>
          <ViewableTextField {...titleTextProps}></ViewableTextField>
        </div>
      </div>
      );
  },
  _renderContent: function(isView) {
    var me = this;
    let selectedData = me.state.selectedData;
    var benchmarkText = (<div className='jazz-benchmark-text'>{I18N.Setting.Calendar.DefaultWorkTime}</div>);
    return (
      <div className={"jazz-calendar-content"}>
        {benchmarkText}
      </div>
      );
  },
  _renderFooter: function() {
    var me = this;
    return (
      <FormBottomBar isShow={true} allowDelete={true} allowEdit={true} enableSave={me.state.enableSave} ref="actionBar" status={me.state.formStatus} onSave={this._onSave} onEdit={this._onEdit} onDelete={this._onDelete} onCancel={this._onCancel} />
      );
  },

  componentDidMount: function() {
    LabelMenuAction.getAllBenchmarks();
    LabelMenuAction.getAllIndustries();
    LabelMenuAction.getAllZones();
    BenchmarkStore.addBenchmarkDataChangeListener(this._onBenchmarkListChange);
    BenchmarkStore.addIndustryDataChangeListener(this._onIndustryDataChange);
    BenchmarkStore.addZoneDataChangeListener(this._onZoneDataChange);
    BenchmarkStore.addSelectedBenchmarkChangeListener(this._onSelectedItemChange);
  },
  componentWillUnmount: function() {
    BenchmarkStore.removeBenchmarkDataChangeListener(this._onBenchmarkListChange);
    BenchmarkStore.removeIndustryDataChangeListener(this._onIndustryDataChange);
    BenchmarkStore.removeZoneDataChangeListener(this._onZoneDataChange);
    BenchmarkStore.removeSelectedBenchmarkChangeListener(this._onSelectedItemChange);
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let displayedDom = null;
    let items = [];
    var benchmarkList = me.state.benchmarkList;
    if (benchmarkList && benchmarkList.size !== 0) {
      items = benchmarkList.map(function(item, i) {
        let props = {
          index: i,
          label: item.get('Name'),
          selectedIndex: me.state.selectedIndex,
          onItemClick: me._onItemClick
        };
        return (
          <Item {...props}/>
          );
      });
    }
    let selectedData = me.state.selectedData;
    if (me.state.isRightLoading) {
      displayedDom = (<div className='jazz-calendar-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={1} /></div></div>);
    } else if (selectedData !== null) {
      var header = me._renderHeader(isAdd);
      var content = me._renderContent(isView);
      var footer = me._renderFooter();
      displayedDom = (
        <div className="jazz-calendar-container">
          {header}
          {content}
          {footer}
        </div>
      );
    }
    var deleteDialog = me._renderDeleteDialog();
    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
        <SelectablePanel addBtnLabel={I18N.Setting.Calendar.WorktimeSetting}
      isViewStatus={isView}
      isLoading={this.state.isLeftLoading}
      contentItems={items} onAddBtnClick={me._addBenchmark}/>
        <Panel>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = Benchmark;
