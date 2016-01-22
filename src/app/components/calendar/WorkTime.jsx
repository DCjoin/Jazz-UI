'use strict';

import React from "react";
import classnames from "classnames";
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
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
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
    CalendarAction.deleteCalendarById(selectedData.get('Id'), selectedData.get('Version'));
  },
  _addWorktime() {
    var worktime = {
      Name: '',
      Type: calendarType,
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
      selectedData: Immutable.fromJS(worktime),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _clearAllErrorText() {
    this.refs.worktimeTitleId.clearErrorText();
  },
  _isValid() {
    var isTitleValid = this.refs.worktimeTitleId.isValid();
    var isTimeValid = this.refs.worktimeGroup.isValid();
    return isTitleValid && isTimeValid;
  },
  _addWorktimeData: function() {
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
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _deleteWorktimeData: function(index) {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    items = items.delete(index);
    selectedData = selectedData.set('Items', items);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
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
    var selectedData = this.state.selectedData;
    selectedData = selectedData.set('Name', value);
    this.setState({
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
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
      title: I18N.Setting.Calendar.WorktimeName,
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
    var worktimeText = (<div className='jazz-calendar-text'>{I18N.Setting.Calendar.DefaultWorkTime}</div>);
    var addWorktimeDataButton = null;
    if (!isView) {
      addWorktimeDataButton = (<div className="jazz-calendar-add">
      <div className="jazz-calendar-add-text">{I18N.Setting.Calendar.WorkTime}</div>
      <div className="jazz-calendar-add-button"><FlatButton label={I18N.Common.Button.Add} onClick={me._addWorktimeData} /></div>
      </div>);
    }
    var worktimeGroup = <FromEndTimeGroup ref='worktimeGroup' items={selectedData.get('Items')} isViewStatus={isView} onDeleteTimeData={me._deleteWorktimeData} onTimeChange={me._onTimeChange}></FromEndTimeGroup>;
    return (
      <div className={"jazz-calendar-content"}>
        {worktimeText}
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
    CalendarAction.setSelectedCalendarIndex(null);
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
      }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
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
    var leftProps = {
      addBtnLabel: I18N.Setting.Calendar.WorktimeSetting,
      isViewStatus: isView,
      isLoading: this.state.isLeftLoading,
      contentItems: items,
      onAddBtnClick: me._addWorktime
    };
    var leftPanel = (this.state.showLeft) ? <div style={{
      display: 'flex'
    }}><SelectablePanel {...leftProps}/></div> : <div style={{
      display: 'none'
    }}><SelectablePanel {...leftProps}/></div>;
    return (
      <div className={classnames({
        "jazz-framework-right-expand": !me.state.showLeft,
        "jazz-framework-right-fold": me.state.showLeft
      })}>
        {leftPanel}
        <Panel onToggle={this._onToggle}>
          {displayedDom}
        </Panel>
        {deleteDialog}
    </div>
      );
  }
});

module.exports = WorkTime;
