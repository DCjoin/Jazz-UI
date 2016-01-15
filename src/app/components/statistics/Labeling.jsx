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

var Labeling = React.createClass({
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
  _onLabelingListChange: function() {
    var labelingList = LabelingStore.getLabelingData();
    this.setState({
      labelingList: labelingList,
      isLeftLoading: false
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
      isRightLoading: false,
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
    });
  },
  _onCancel: function() {
    LabelingAction.cancelSavelabeling();
  },
  _onSave: function() {
    var selectedData = this.state.selectedData;
    var curFormStatus = this.state.formStatus;
    var labeling = {
      IndustryComment: '',
      IndustryId: selectedData.get('IndustryId'),
      Version: selectedData.get('Version'),
      ZoneComments: '',
      ZoneIds: selectedData.get('ZoneIds').toJS()
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
    LabelingAction.deleteLabelingById(selectedData.get('IndustryId'), selectedData.get('Version'));
  },
  _addLabeling() {
    var labeling = {
      IndustryComment: '',
      IndustryId: -1,
      Version: 0,
      ZoneComments: '',
      ZoneIds: []
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
  _getIndustryItems() {
    var industryItems = [{
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
          industryItems.push({
            payload: industry.get('Id'),
            text: industry.get('Comment')
          });
        }
      });
    }
    return industryItems;
  },
  _renderHeader: function(isAdd) {
    var me = this;
    var industryItems = this._getIndustryItems();
    var zoneItems = this.state.zoneItems;
    let selectedData = me.state.selectedData;
    var industryTextProps = {
      ref: 'industryTitleText',
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('IndustryComment'),
      title: ''
    };
    var industryDropProps = {
      ref: 'industryTitleDrop',
      dataItems: industryItems,
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('IndustryId'),
      title: '',
      textField: 'text',
      didChanged: me._onIndustryChange
    };
    var zoneTextProps = {
      ref: 'zoneTitleText',
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('ZoneComment'),
      title: ''
    };
    var zoneDropProps = {
      ref: 'zoneTitleDrop',
      dataItems: zoneItems,
      isViewStatus: !isAdd,
      defaultValue: selectedData.get('ZoneId'),
      title: '',
      textField: 'text',
      didChanged: me._onZoneChange
    };
    var industryDom = null;
    var zoneDom = null;
    if (isAdd) {
      industryDom = (<div className='jazz-labeling-header-dropdown'>
        <ViewableDropDownMenu {...industryDropProps}></ViewableDropDownMenu>
      </div>);
      zoneDom = (<div className='jazz-labeling-header-dropdown'>
        <ViewableDropDownMenu {...zoneDropProps}></ViewableDropDownMenu>
      </div>);
    } else {
      industryDom = (<div className='jazz-labeling-header-text'>
        <ViewableTextField {...industryTextProps}></ViewableTextField>
      </div>);
      zoneDom = (<div className='jazz-labeling-header-text'>
        <ViewableTextField {...zoneTextProps}></ViewableTextField>
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
      title: '',
      textField: 'text',
      didChanged: me._onGradeChange
    };
    var startYearProps = {
      ref: "startYear"
    };
    var endYearProps = {
      ref: "endYear"
    };
    var grade = (<div className="jazz-labeling-content-grade">
      <ViewableDropDownMenu {...gradeProps}></ViewableDropDownMenu>
    </div>);
    var startYear = (<div className="jazz-labeling-content-year">
      <YearPicker {...startYearProps}></YearPicker>
    </div>);
    var endYear = (<div className="jazz-labeling-content-year">
      <YearPicker {...startYearProps}></YearPicker>
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
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let displayedDom = null;
    let items = [];
    var labelingList = me.state.labelingList;
    if (labelingList && labelingList.size !== 0) {
      items = labelingList.map(function(item, i) {
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
      displayedDom = (<div className='jazz-labeling-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={1} /></div></div>);
    } else if (selectedData !== null) {
      var header = me._renderHeader(isAdd);
      var content = me._renderContent(isView);
      var footer = me._renderFooter();
      displayedDom = (
        <div className="jazz-labeling">
          {header}
          {content}
          {footer}
        </div>
      );
    }
    var deleteDialog = me._renderDeleteDialog();
    var leftProps = {
      addBtnLabel: I18N.Setting.Labeling.Label.Labeling,
      isViewStatus: isView,
      isLoading: this.state.isLeftLoading,
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
        <Panel onToggle={this._onToggle}>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = Labeling;
