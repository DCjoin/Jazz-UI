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
import FromEndTimeGroup from './FromEndTimeGroup.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Immutable from 'immutable';

var calendarType = 1;
var WorkTime = React.createClass({
  getInitialState: function() {
    return {
      isLeftLoading: true,
      isRightLoading: true,
      formStatus: formStatus.VIEW,
      enableSave: true,
      showDeleteDialog: false
    };
  },
  _onWorktimeListChange: function() {
    var worktimeList = CalendarStore.getCalendarList(calendarType);
    this.setState({
      worktimeList: worktimeList,
      isLeftLoading: false
    });
  },
  _onSelectedItemChange: function() {
    if (this.refs.worktimeTitleId) {
      this._clearAllErrorText();
    }
    var worktimeList = this.state.worktimeList;
    var selectedIndex = CalendarStore.getSelectedCalendarIndex(calendarType);
    var selectedData = CalendarStore.getSelectedCalendar(calendarType);
    this.setState({
      isRightLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedData: selectedData
    });
  },
  _onItemClick: function(index) {
    CalendarAction.setSelectedCalendarIndex(index, calendarType);
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _onCancel: function() {
    this._clearAllErrorText();
    CalendarAction.cancelSaveCalendar(calendarType);
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
      onClick={this._deleteWorktime} />,

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
  _deleteWorktime() {
    var selectedData = this.state.selectedData;
    CalendarAction.deleteCalendarById(selectedData.get('Id'), selectedData.get('Version'), calendarType);
  },
  _addWorktime() {
    var worktime = {
      Name: '',
      Type: 1,
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
      selectedData: Immutable.fromJS(worktime),
      enableSave: false,
      formStatus: formStatus.EDIT
    });
  },
  _clearAllErrorText() {
    this.refs.worktimeTitleId.clearErrorText();
    this.refs.worktimeGroup.clearErrorText();
  },
  _isValid() {
    var isValid = this.refs.worktimeTitleId.isValid();
    isValid = isValid && this.refs.worktimeGroup.isValid();
    return isValid;
  },
  _addWorkTimeData: function() {
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
  _deleteWorktimeData: function(index) {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.delete(index);
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData
    });
  },
  _onTimeChange(index, value) {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.setIn([index, 'StartFirstPart'], value.StartFirstPart);
    items = items.setIn([index, 'StartSecondPart'], value.StartSecondPart);
    items = items.setIn([index, 'EndFirstPart'], value.EndFirstPart);
    items = items.setIn([index, 'EndSecondPart'], value.EndSecondPart);
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
      ref: 'worktimeTitleId',
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
    var workTimeText = (<div className='jazz-calendar-text'>{I18N.Setting.Calendar.DefaultWorkTime}</div>);
    var addWorktimeDataButton = null;
    if (!isView) {
      addWorktimeDataButton = (<div className="jazz-calendar-add">
      <div>{I18N.Setting.Calendar.WorkTime}</div>
      <FlatButton label={I18N.Setting.Calendar.AddWorkTime} onClick={me._addWorkTimeData} />
      </div>);
    }
    var worktimeGroup = <FromEndTimeGroup ref='worktimeGroup' items={selectedData.get('Items')} isViewStatus={isView} onDeleteWorktimeData={me._deleteWorktimeData} onTimeChange={me._onTimeChange}></FromEndTimeGroup>;
    return (
      <div className={"jazz-calendar-content"}>
        {workTimeText}
        {addWorktimeDataButton}
        {worktimeGroup}
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
    CalendarStore.addCalendarListChangeListener(this._onWorktimeListChange);
    CalendarStore.addSelectedCalendarChangeListener(this._onSelectedItemChange);
  },
  componentWillUnmount: function() {
    CalendarStore.removeCalendarListChangeListener(this._onWorktimeListChange);
    CalendarStore.removeSelectedCalendarChangeListener(this._onSelectedItemChange);
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let displayedDom = null;
    let items = [];
    var worktimeList = me.state.worktimeList;
    if (worktimeList && worktimeList.size !== 0) {
      items = worktimeList.map(function(item, i) {
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
      contentItems={items} onAddBtnClick={me._addWorktime}/>
        <Panel>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = WorkTime;
