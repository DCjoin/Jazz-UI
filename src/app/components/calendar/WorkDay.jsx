'use strict';

import React from "react";
import { CircularProgress, Dialog } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import CalendarAction from '../../actions/CalendarAction.jsx';
import CalendarStore from '../../stores/CalendarStore.jsx';
import FromEndDateGroup from './FromEndDateGroup.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Immutable from 'immutable';

var calendarType = 0;
var WorkDay = React.createClass({
  getInitialState: function() {
    return {
      isLeftLoading: true,
      isRightLoading: true,
      formStatus: formStatus.VIEW,
      enableSave: true,
      showDeleteDialog: false
    };
  },
  _onWorkdayListChange: function() {
    var workdayList = CalendarStore.getCalendarList();
    this.setState({
      workdayList: workdayList,
      isLeftLoading: false
    });
  },
  _onSelectedItemChange: function() {
    if (this.refs.workdayTitleId) {
      this._clearAllErrorText();
    }
    var selectedIndex = CalendarStore.getSelectedCalendarIndex();
    var selectedData = CalendarStore.getSelectedCalendar();
    this.setState({
      isRightLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedData: selectedData
    });
  },
  _onItemClick: function(index) {
    CalendarAction.setSelectedCalendarIndex(index);
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _onCancel: function() {
    this._clearAllErrorText();
    CalendarAction.cancelSaveCalendar();
  },
  _onSave: function() {
    this._clearAllErrorText();
    var selectedData = this.state.selectedData.toJS();
    if (selectedData.Id === null) {
      CalendarAction.createCalendar(selectedData, calendarType);
    } else {
      CalendarAction.modifyCalendar(selectedData, calendarType);
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
      onClick={this._deleteWorkday} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={true}
      actions={dialogActions}
      modal={true}>
        {I18N.format(I18N.Setting.Calendar.DeleteMessage, this.state.selectedData.get('Name'))}
      </Dialog>);
  },
  _deleteWorkday() {
    var selectedData = this.state.selectedData;
    CalendarAction.deleteCalendarById(selectedData.get('Id'), selectedData.get('Version'));
  },
  _addWorkday() {
    var workday = {
      Name: '',
      Type: calendarType,
      Version: null,
      Id: null,
      Items: [{
        Type: 0,
        StartFirstPart: -1,
        StartSecondPart: -1,
        EndFirstPart: -1,
        EndSecondPart: -1,
      }]
    };
    this.setState({
      selectedIndex: null,
      selectedData: Immutable.fromJS(workday),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _clearAllErrorText() {
    this.refs.workdayTitleId.clearErrorText();
  },
  _isValid() {
    var isTitleValid = this.refs.workdayTitleId.isValid();
    var isDateValid = this.refs.workdayGroup.isValid();
    return isTitleValid && isDateValid;
  },
  _addWorkdayData: function() {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    var item = {
      StartFirstPart: -1,
      StartSecondPart: -1,
      EndFirstPart: -1,
      EndSecondPart: -1,
      Type: 0
    };
    items = items.unshift(Immutable.fromJS(item));
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData,
      enableSave: false
    });
  },
  _deleteWorkdayData: function(index) {
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
  _onTypeChange(index, value) {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.setIn([index, 'Type'], value);
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _onDateChange(index, value) {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.setIn([index, 'StartFirstPart'], value.startMonth);
    items = items.setIn([index, 'StartSecondPart'], value.startDay);
    items = items.setIn([index, 'EndFirstPart'], value.endMonth);
    items = items.setIn([index, 'EndSecondPart'], value.endDay);
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
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
  _renderHeader: function(isView) {
    var me = this;
    let selectedData = me.state.selectedData;
    var titleProps = {
      ref: 'workdayTitleId',
      isViewStatus: isView,
      didChanged: me._onNameChange,
      defaultValue: selectedData.get('Name'),
      title: I18N.Common.Glossary.Name,
      isRequired: true
    };
    return (
      <div className="jazz-calendar-header">
        <div className='jazz-calendar-title'>
          <ViewableTextField {...titleProps}></ViewableTextField>
        </div>
      </div>
      );
  },
  _renderContent: function(isView) {
    var me = this;
    let selectedData = me.state.selectedData;
    var workdayText = (<div className='jazz-calendar-text'>{I18N.Setting.Calendar.DefaultWorkDay}</div>);
    var addWorkdayDataButton = null;
    if (!isView) {
      addWorkdayDataButton = (<div className="jazz-calendar-add">
      <div className="jazz-calendar-add-text">{I18N.Setting.Calendar.AdditionalDay}</div>
      <div className="jazz-calendar-add-button"><FlatButton label={I18N.Common.Button.Add} onClick={me._addWorkdayData} /></div>
      </div>);
    }
    var workdayGroup = <FromEndDateGroup ref='workdayGroup' type={calendarType} items={selectedData.get('Items')} isViewStatus={isView} onDeleteDateData={me._deleteWorkdayData} onDateChange={me._onDateChange} onTypeChange={me._onTypeChange}></FromEndDateGroup>;
    return (
      <div className={"jazz-calendar-content"}>
        {workdayText}
        {addWorkdayDataButton}
        {workdayGroup}
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
    CalendarAction.getCalendarListByType(calendarType);
    CalendarStore.addCalendarListChangeListener(this._onWorkdayListChange);
    CalendarStore.addSelectedCalendarChangeListener(this._onSelectedItemChange);
  },
  componentWillUnmount: function() {
    CalendarStore.removeCalendarListChangeListener(this._onWorkdayListChange);
    CalendarStore.removeSelectedCalendarChangeListener(this._onSelectedItemChange);
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let displayedDom = null;
    let items = [];
    var workdayList = me.state.workdayList;
    if (workdayList && workdayList.size !== 0) {
      items = workdayList.map(function(item, i) {
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
      var header = me._renderHeader(isView);
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
        <SelectablePanel addBtnLabel={I18N.Setting.Calendar.WorkdaySetting}
      isViewStatus={isView}
      isLoading={this.state.isLeftLoading}
      contentItems={items} onAddBtnClick={me._addWorkday}/>
        <Panel>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = WorkDay;
