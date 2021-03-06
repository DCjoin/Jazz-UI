'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import Panel from '../../controls/MainContentPanel.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import CalendarAction from '../../actions/CalendarAction.jsx';
import CalendarStore from '../../stores/CalendarStore.jsx';
import FromEndTimeGroup from './FromEndTimeGroup.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import NewDialog from '../../controls/NewDialog.jsx';
import Immutable from 'immutable';
var createReactClass = require('create-react-class');
var calendarType = 3;
var Daynight = createReactClass({
  getInitialState: function() {
    return {
      isLoading: true,
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
  _onDaynightListChange: function() {
    var daynightList = CalendarStore.getCalendarList();
    this.setState({
      daynightList: daynightList
    });
  },
  _onSelectedItemChange: function() {
    if (this.refs.daynightTitleId) {
      this._clearAllErrorText();
    }
    var selectedIndex = CalendarStore.getSelectedCalendarIndex();
    var selectedData = CalendarStore.getSelectedCalendar();
    this.setState({
      isLoading: false,
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
    this.setState({
      isLoading: true
    });
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
  _onError: function() {
    this.setState({
      isLoading: false
    });
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _renderDeleteDialog() {
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      inDialog={true}
      primary={true}
      onClick={this._deleteDaynight} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<NewDialog
      ref="deleteDialog"
      open={this.state.showDeleteDialog}
      title={I18N.Setting.Calendar.DeleteDaynight}
      actions={dialogActions}
      modal={true}>
        <div className='jazz-calendar-delete'>{I18N.format(I18N.Setting.Calendar.DeleteDaynightContent, this.state.selectedData.get('Name'))}</div>
      </NewDialog>);
  },
  _deleteDaynight() {
    var selectedData = this.state.selectedData;
    CalendarAction.deleteCalendarById(selectedData.get('Id'), selectedData.get('Version'));
  },
  _addDaynight() {
    var daynight = {
      Name: '',
      Type: calendarType,
      Version: null,
      Id: null,
      Items: [{
        Type: 6,
        StartFirstPart: -1,
        StartSecondPart: -1,
        EndFirstPart: -1,
        EndSecondPart: -1,
      }]
    };
    this.setState({
      selectedIndex: null,
      selectedData: Immutable.fromJS(daynight),
      enableSave: false,
      formStatus: formStatus.ADD
    });
  },
  _clearAllErrorText() {
    this.refs.daynightTitleId.clearErrorText();
  },
  _isValid() {
    var isTitleValid = this.refs.daynightTitleId.isValid();
    var isTimeValid = this.refs.daynightGroup.isValid();
    return isTitleValid && isTimeValid;
  },
  _addDaynightData: function() {
    var selectedData = this.state.selectedData;
    var items = selectedData.get('Items');
    var item = {
      StartFirstPart: -1,
      StartSecondPart: -1,
      EndFirstPart: -1,
      EndSecondPart: -1,
      Type: 6
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
  _deleteDaynightData: function(index) {
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
      ref: 'daynightTitleId',
      isViewStatus: isView,
      didChanged: me._onNameChange,
      defaultValue: selectedData.get('Name'),
      title: I18N.Setting.Calendar.DaynightName,
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
    var daynightText = (<div className='jazz-calendar-text'>{I18N.Setting.Calendar.DefaultDayNight}</div>);
    var addDaynightDataButton = null;
    if (!isView) {
      addDaynightDataButton = (<div className="jazz-calendar-add-button"><FlatButton label={I18N.Common.Button.Add} onClick={me._addDaynightData} /></div>);
    }
    var addDaynightData = (<div className="jazz-calendar-add">
    <div className="jazz-calendar-add-text">{I18N.Setting.Calendar.Day}</div>
    {addDaynightDataButton}
    </div>);
    var daynightGroup = <FromEndTimeGroup ref='daynightGroup' items={selectedData.get('Items')} isViewStatus={isView} onDeleteTimeData={me._deleteDaynightData} onTimeChange={me._onTimeChange}></FromEndTimeGroup>;
    return (
      <div className={"jazz-calendar-content"}>
        {daynightText}
        {addDaynightData}
        {daynightGroup}
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
    CalendarStore.addCalendarListChangeListener(this._onDaynightListChange);
    CalendarStore.addSelectedCalendarChangeListener(this._onSelectedItemChange);
    CalendarStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    CalendarStore.removeCalendarListChangeListener(this._onDaynightListChange);
    CalendarStore.removeSelectedCalendarChangeListener(this._onSelectedItemChange);
    CalendarStore.removeErrorChangeListener(this._onError);
    CalendarAction.setSelectedCalendarIndex(null);
  },


  render: function() {
    let me = this,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    let rightPanel = null;
    let items = [];
    var daynightList = me.state.daynightList;
    if (daynightList && daynightList.size !== 0) {
      items = daynightList.map(function(item, i) {
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
    if (me.state.isLoading) {
      return (<div className='jazz-calendar-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={80} /></div></div>);
    } else if (selectedData !== null) {
      var header = me._renderHeader(isView);
      var content = me._renderContent(isView);
      var footer = me._renderFooter();
      var deleteDialog = me._renderDeleteDialog();
      rightPanel = (
        <Panel onToggle={this._onToggle}>
          <div className="jazz-calendar-container">
            {header}
            {content}
            {footer}
            {deleteDialog}
          </div>
        </Panel>
      );
    }
    var leftProps = {
      addBtnLabel: I18N.Setting.Calendar.DaynightSetting,
      isAddStatus: isAdd,
      isLoading: false,
      contentItems: items,
      onAddBtnClick: me._addDaynight
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

module.exports = Daynight;
