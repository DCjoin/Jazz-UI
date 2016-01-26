'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress, Dialog } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import YearPicker from '../../controls/YearPicker.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import LabelingAction from '../../actions/LabelingAction.jsx';
import LabelingStore from '../../stores/LabelingStore.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Immutable from 'immutable';

var map = {};
var Labeling = React.createClass({
  getInitialState: function() {
    var zoneItems = [{
      payload: -1,
      text: I18N.Setting.Benchmark.Label.ClimateZone,
      disabled: true
    }];
    return {
      isLoading: true,
      formStatus: formStatus.VIEW,
      enableSave: true,
      showDeleteDialog: false,
      showLeft: true,
      zoneItems: zoneItems
    };
  },
  _onToggle: function() {
    var showLeft = this.state.showLeft;
    this.setState({
      showLeft: !showLeft
    });
  },
  _onLabelingListChange: function() {
    var labelingList = LabelingStore.getLabelingData();
    this.setState({
      labelingList: labelingList
    });
  },
  _onIndustryDataChange: function() {
    var industryData = LabelingStore.getIndustryData();
    this.setState({
      industryData: industryData
    });
  },
  _onZoneDataChange: function() {
    var zoneData = LabelingStore.getZoneData();
    this.setState({
      zoneData: zoneData
    });
  },
  _onSelectedItemChange: function() {
    var selectedIndex = LabelingStore.getSelectedLabelingIndex();
    var selectedData = LabelingStore.getSelectedLabeling();
    this.setState({
      isLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedData: selectedData
    });
  },
  _onItemClick: function(index) {
    LabelingAction.setSelectedLabelingIndex(index);
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _onCancel: function() {
    LabelingAction.cancelSaveLabeling();
  },
  _onSave: function() {
    var selectedData = this.state.selectedData;
    var curFormStatus = this.state.formStatus;
    var labeling = {
      IndustryId: selectedData.get('IndustryId'),
      ZoneId: selectedData.get('ZoneId'),
      Version: selectedData.get('Version'),
      Grade: selectedData.get('Grade'),
      StartYear: selectedData.get('StartYear'),
      EndYear: selectedData.get('EndYear')
    };
    if (curFormStatus === formStatus.ADD) {
      LabelingAction.createLabeling(labeling);
    } else if (curFormStatus === formStatus.EDIT) {
      LabelingAction.modifyLabeling(labeling);
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
      onClick={this._deleteLabeling} />,

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
  _deleteLabeling() {
    var selectedData = this.state.selectedData;
    LabelingAction.deleteLabelingById(selectedData.get('IndustryId'), selectedData.get('ZoneId'), selectedData.get('Version'));
  },
  _addLabeling() {
    let date = new Date();
    let thisYear = date.getFullYear();
    var labeling = {
      IndustryId: -1,
      ZoneId: -1,
      Version: null,
      Grade: 3,
      StartYear: thisYear - 2,
      EndYear: thisYear
    };
    this.setState({
      selectedIndex: null,
      selectedData: Immutable.fromJS(labeling),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _isValid() {
    var selectedData = this.state.selectedData;
    if (selectedData.get('IndustryId') === -1 || selectedData.get('ZoneId') === -1) {
      return false;
    }
    return true;
  },
  _onIndustryChange(value) {
    var selectedData = this.state.selectedData;
    selectedData = selectedData.set('IndustryId', value);
    var zoneItems = map[value];
    this.setState({
      selectedData: selectedData,
      zoneItems: zoneItems
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _onItemChange(name, value) {
    var selectedData = this.state.selectedData;
    selectedData = selectedData.set(name, value);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _getIndustryItems() {
    var labelingList = this.state.labelingList;
    var industryData = this.state.industryData;
    var zoneData = this.state.zoneData;
    var industryItems = [{
      payload: -1,
      text: I18N.Setting.Labeling.Label.Industry,
      disabled: true
    }];
    map = {};
    if (industryData && industryData.size !== 0) {
      industryData.forEach((industry) => {
        var existIndustry = labelingList.filter((item) => {
          if (industry.get('Id') === item.get('IndustryId')) {
            return true;
          }
        });
        var zoneItems = [{
          payload: -1,
          text: I18N.Setting.Benchmark.Label.ClimateZone,
          disabled: true
        }];
        if (zoneData && industryData.size !== 0) {
          zoneData.forEach((zone) => {
            var index = existIndustry.findIndex((item) => {
              if (zone.get('Id') === item.get('ZoneId')) {
                return true;
              }
            });
            if (index === -1) {
              zoneItems.push({
                payload: zone.get('Id'),
                text: zone.get('Comment')
              });
            }
          });
        }
        if (zoneItems.length > 1) {
          industryItems.push({
            payload: industry.get('Id'),
            text: industry.get('Comment')
          });
          map[industry.get('Id')] = zoneItems;
        }
      });
    }
    return industryItems;
  },
  _renderHeader: function(isAdd) {
    var me = this;
    let selectedData = me.state.selectedData;
    var industryDom = null;
    var zoneDom = null;
    if (isAdd) {
      var industryItems = this._getIndustryItems();
      var zoneItems = this.state.zoneItems;
      var industryDropProps = {
        ref: 'industryTitleDrop',
        dataItems: industryItems,
        isViewStatus: !isAdd,
        defaultValue: selectedData.get('IndustryId'),
        title: '',
        textField: 'text',
        didChanged: me._onIndustryChange
      };
      var zoneDropProps = {
        ref: 'zoneTitleDrop',
        dataItems: zoneItems,
        isViewStatus: !isAdd,
        defaultValue: selectedData.get('ZoneId'),
        title: '',
        textField: 'text',
        didChanged: me._onItemChange.bind(null, 'ZoneId')
      };
      industryDom = (<div className='jazz-labeling-header-dropdown'>
        <ViewableDropDownMenu {...industryDropProps}></ViewableDropDownMenu>
      </div>);
      zoneDom = (<div className='jazz-labeling-header-dropdown'>
        <ViewableDropDownMenu {...zoneDropProps}></ViewableDropDownMenu>
      </div>);
    } else {
      industryDom = (<div className='jazz-labeling-header-text'>
        {selectedData.get('IndustryComment')}
      </div>);
      zoneDom = (<div className='jazz-labeling-header-text'>
        {selectedData.get('ZoneComment')}
      </div>);
    }
    return (
      <div className="jazz-labeling-header">
        {industryDom}
        <div className='jazz-labeling-header-to'>{'-'}</div>
        {zoneDom}
      </div>
      );
  },
  _renderContent: function(isView) {
    var me = this;
    var selectedData = me.state.selectedData;
    var uom = I18N.Setting.CustomizedLabeling.Grade;
    var gradeItems = [
      {
        payload: 3,
        text: I18N.format(uom, 3)
      },
      {
        payload: 4,
        text: I18N.format(uom, 4)
      },
      {
        payload: 5,
        text: I18N.format(uom, 5)
      },
      {
        payload: 6,
        text: I18N.format(uom, 6)
      },
      {
        payload: 7,
        text: I18N.format(uom, 7)
      },
      {
        payload: 8,
        text: I18N.format(uom, 8)
      }
    ];
    var gradeProps = {
      ref: 'grade',
      dataItems: gradeItems,
      isViewStatus: isView,
      defaultValue: selectedData.get('Grade'),
      title: I18N.Setting.Labeling.Label.LabelingGrade,
      textField: 'text',
      didChanged: me._onItemChange.bind(null, 'Grade')
    };
    var startYearProps = {
      ref: "startYear",
      isViewStatus: isView,
      selectedYear: selectedData.get('StartYear'),
      onYearPickerSelected: me._onItemChange.bind(null, 'StartYear'),
      style: {
        width: '90px'
      }
    };
    var endYearProps = {
      ref: "endYear",
      isViewStatus: isView,
      selectedYear: selectedData.get('EndYear'),
      onYearPickerSelected: me._onItemChange.bind(null, 'EndYear'),
      style: {
        width: '90px'
      }
    };
    var grade = (<div className="jazz-labeling-content-grade">
      <ViewableDropDownMenu {...gradeProps}></ViewableDropDownMenu>
    </div>);
    var startYear = (<div className="jazz-labeling-content-year-item">
      <YearPicker {...startYearProps}></YearPicker>
    </div>);
    var endYear = (<div className="jazz-labeling-content-year-item">
      <YearPicker {...endYearProps}></YearPicker>
    </div>);
    var labelingText = (<div className='jazz-labeling-content-text'>{I18N.Setting.Labeling.Label.DataYear}</div>);
    return (
      <div className="jazz-labeling-content">
        {grade}
        {labelingText}
        <div className="jazz-labeling-content-year">
          {startYear}
          <div className="jazz-labeling-content-year-to">{'-'}</div>
          {endYear}
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
    LabelingAction.getAllIndustries();
    LabelingAction.getAllZones();
    LabelingAction.getAllLabelings();
    LabelingStore.addLabelingDataChangeListener(this._onLabelingListChange);
    LabelingStore.addIndustryDataChangeListener(this._onIndustryDataChange);
    LabelingStore.addZoneDataChangeListener(this._onZoneDataChange);
    LabelingStore.addSelectedLabelingChangeListener(this._onSelectedItemChange);
  },
  componentWillUnmount: function() {
    LabelingStore.removeLabelingDataChangeListener(this._onLabelingListChange);
    LabelingStore.removeIndustryDataChangeListener(this._onIndustryDataChange);
    LabelingStore.removeZoneDataChangeListener(this._onZoneDataChange);
    LabelingStore.removeSelectedLabelingChangeListener(this._onSelectedItemChange);
    LabelingAction.setSelectedLabelingIndex(null);
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let rightPanel = null;
    let items = [];
    var labelingList = me.state.labelingList;
    if (labelingList && labelingList.size !== 0) {
      items = labelingList.map(function(item, i) {
        let props = {
          index: i,
          label: item.get('IndustryComment') + '-' + item.get('ZoneComment'),
          selectedIndex: me.state.selectedIndex,
          onItemClick: me._onItemClick
        };
        return (
          <Item {...props}/>
          );
      });
    }
    let selectedData = me.state.selectedData;
    if (me.state.isLoading) {
      return (<div className='jazz-labeling-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
    } else if (selectedData !== null) {
      var header = me._renderHeader(isAdd);
      var content = me._renderContent(isView);
      var footer = me._renderFooter();
      var deleteDialog = me._renderDeleteDialog();
      rightPanel = (
        <Panel onToggle={this._onToggle}>
          <div className="jazz-labeling">
            {header}
            {content}
            {footer}
            {deleteDialog}
          </div>
        </Panel>
      );
    }
    var industryItems = this._getIndustryItems();
    var canAdd = true;
    if (industryItems.length === 1) {
      canAdd = false;
    }
    var leftProps = {
      addBtnLabel: I18N.Setting.Labeling.Label.Labeling,
      isViewStatus: isView && canAdd,
      isLoading: false,
      contentItems: items,
      onAddBtnClick: me._addLabeling
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
        <div className={classnames({
        "jazz-framework-right-expand": !me.state.showLeft,
        "jazz-framework-right-fold": me.state.showLeft
      })}>
          {rightPanel}
        </div>
      </div>
      );
  }
});

module.exports = Labeling;
