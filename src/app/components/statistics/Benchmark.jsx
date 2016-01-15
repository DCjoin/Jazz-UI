'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress, Dialog, Checkbox } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import BenchmarkAction from '../../actions/BenchmarkAction.jsx';
import BenchmarkStore from '../../stores/BenchmarkStore.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Immutable from 'immutable';

var Benchmark = React.createClass({
  getInitialState: function() {
    return {
      isLeftLoading: true,
      isRightLoading: true,
      formStatus: formStatus.VIEW,
      enableSave: true,
      showDeleteDialog: false,
      showLeft: true
    };
  },
  _onToggle: function() {
    var showLeft = this.state.showLeft;
    this.setState({
      showLeft: !showLeft
    });
  },
  _onBenchmarkListChange: function() {
    var benchmarkList = BenchmarkStore.getBenchmarkData();
    this.setState({
      benchmarkList: benchmarkList,
      isLeftLoading: false
    });
  },
  _onIndustryDataChange: function() {
    var industryData = BenchmarkStore.getIndustryData();
    this.setState({
      industryData: industryData
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
    var selectedData = this.state.selectedData;
    var curFormStatus = this.state.formStatus;
    var benchmark = {
      IndustryComment: '',
      IndustryId: selectedData.get('IndustryId'),
      Version: selectedData.get('Version'),
      ZoneComments: '',
      ZoneIds: selectedData.get('ZoneIds').toJS()
    };
    if (curFormStatus === formStatus.ADD) {
      BenchmarkAction.createBenchmark(benchmark);
    } else if (curFormStatus === formStatus.EDIT) {
      BenchmarkAction.modifyBenchmark(benchmark);
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
      IndustryComment: '',
      IndustryId: -1,
      Version: 0,
      ZoneComments: '',
      ZoneIds: []
    };
    this.setState({
      selectedIndex: null,
      selectedData: Immutable.fromJS(benchmark),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _isValid() {
    var selectedData = this.state.selectedData;
    var zoneIds = selectedData.get('ZoneIds');
    if (selectedData.get('IndustryId') === -1 || zoneIds.size === 0) {
      return false;
    }
    return true;
  },
  _onIndustryChange(value) {
    var me = this;
    var selectedData = me.state.selectedData;
    selectedData = selectedData.set('IndustryId', value);
    me.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: me._isValid()
      });
    });
  },
  _handleZoneClick(e) {
    var me = this;
    var value = parseInt(e.currentTarget.id);
    var selectedData = me.state.selectedData;
    var zoneIds = selectedData.get('ZoneIds');
    var index = zoneIds.findIndex((item) => {
      if (item === value) {
        return true;
      }
    });
    if (index === -1) {
      zoneIds = zoneIds.push(value);
    } else {
      zoneIds = zoneIds.delete(index);
    }
    selectedData = selectedData.set('ZoneIds', zoneIds);
    me.setState({
      selectedData: selectedData
    }, () => {
      me.setState({
        enableSave: me._isValid()
      });
    });
  },
  _getBenchmarkItems() {
    var benchmarkItems = [{
      payload: -1,
      text: I18N.Setting.Labeling.Label.Industry,
      disabled: true
    }];
    var industryData = this.state.industryData;
    var benchmarkList = this.state.benchmarkList;
    if (industryData && industryData.size !== 0) {
      industryData.forEach((industry) => {
        var index = benchmarkList.findIndex((item) => {
          if (industry.get('Id') === item.get('IndustryId')) {
            return true;
          }
        });
        if (index === -1) {
          benchmarkItems.push({
            payload: industry.get('Id'),
            text: industry.get('Comment')
          });
        }
      });
    }
    return benchmarkItems;
  },
  _renderHeader: function(isAdd) {
    var me = this;
    var benchmarkItems = this._getBenchmarkItems();
    let selectedData = me.state.selectedData;
    var titleTextProps = {
      ref: 'benchmarkTitleText',
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('IndustryComment'),
      title: ''
    };
    var titleDropProps = {
      ref: 'benchmarkTitleDrop',
      dataItems: benchmarkItems,
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('IndustryId'),
      title: '',
      textField: 'text',
      didChanged: me._onIndustryChange
    };
    var title = null;
    if (isAdd) {
      title = (<div className='jazz-benchmark-header-dropdown'>
        <ViewableDropDownMenu {...titleDropProps}></ViewableDropDownMenu>
      </div>);
    } else {
      title = (<div className='jazz-benchmark-header-text'>
        <ViewableTextField {...titleTextProps}></ViewableTextField>
      </div>);
    }
    return (
      <div className="jazz-benchmark-header">
        {title}
      </div>
      );
  },
  _renderContent: function(isView) {
    var me = this;
    var zoneData = me.state.zoneData;
    var displayZones = [];
    //  var checked;
    if (zoneData && zoneData.size !== 0) {
      var selectedData = me.state.selectedData;
      var zoneIds = selectedData.get('ZoneIds');
      zoneData.forEach((zone) => {
        var checked = false;
        var index = zoneIds.findIndex((item) => {
          if (item === zone.get('Id')) {
            return true;
          }
        });
        var liStyle = {};
        if (index === -1) {
          if (isView) {
            liStyle.display = "none";
          }
          checked = false;
        } else {
          checked = true;
        }
        displayZones.push(
          <li className="jazz-benchmark-content-zone-list-item" style={liStyle}>
            <div className="jazz-benchmark-content-zone-list-item-left" id={zone.get('Id')} onClick={this._handleZoneClick}>
              <Checkbox
          defaultChecked={checked}
          disabled={isView}
          style={{
            width: "auto",
            display: "block"
          }}
          />
              <label
          title={zone.get('Comment')}
          className={classnames("jazz-benchmark-content-zone-list-item-label", {
            "disabled": isView
          })}>
                {zone.get('Comment')}
              </label>
            </div>
          </li>
        );
      });
    }
    var benchmarkText = (<div className='jazz-benchmark-content-text'>{I18N.Setting.Benchmark.Label.SelectTip}</div>);
    return (
      <div className="jazz-benchmark-content">
        {benchmarkText}
        <div className="jazz-benchmark-content-zone">
          <div className="jazz-benchmark-content-zone-text">
            {I18N.Setting.Benchmark.Label.ClimateZone}
          </div>
          <div className='jazz-benchmark-content-zone-list'>{displayZones}</div>
        </div>
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
    BenchmarkAction.getAllIndustries();
    BenchmarkAction.getAllZones();
    BenchmarkAction.getAllBenchmarks();
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
          label: item.get('IndustryComment'),
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
      displayedDom = (<div className='jazz-benchmark-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={1} /></div></div>);
    } else if (selectedData !== null) {
      var header = me._renderHeader(isAdd);
      var content = me._renderContent(isView);
      var footer = me._renderFooter();
      displayedDom = (
        <div className="jazz-benchmark">
          {header}
          {content}
          {footer}
        </div>
      );
    }
    var deleteDialog = me._renderDeleteDialog();
    var leftProps = {
      addBtnLabel: I18N.Setting.Benchmark.Label.IndustryBenchmark,
      isViewStatus: isView,
      isLoading: this.state.isLeftLoading,
      contentItems: items,
      onAddBtnClick: me._addBenchmark
    };
    var leftPanel = (this.state.showLeft) ? <div style={{
      display: 'flex'
    }}><SelectablePanel {...leftProps}/></div> : <div style={{
      display: 'none'
    }}><SelectablePanel {...leftProps}/></div>;
    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
        {leftPanel}
        <Panel onToggle={this._onToggle}>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = Benchmark;
