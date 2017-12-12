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
import FromEndDateGroup from './FromEndDateGroup.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import NewDialog from '../../controls/NewDialog.jsx';
import Immutable from 'immutable';
import Checkbox from 'material-ui/Checkbox';

var calendarType = 0;
var WorkDay = React.createClass({
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
  _onWorkdayListChange: function() {
    var workdayList = CalendarStore.getCalendarList();
    this.setState({
      workdayList: workdayList
    });
  },
  _onSelectedItemChange: function() {
    if (this.refs.workdayTitleId) {
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
      onClick={this._deleteWorkday} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<NewDialog
      ref="deleteDialog"
      open={this.state.showDeleteDialog}
      title={I18N.Setting.Calendar.DeleteWorkday}
      actions={dialogActions}
      modal={true}>
        <div className='jazz-calendar-delete'>{I18N.format(I18N.Setting.Calendar.DeleteWorkdayContent, this.state.selectedData.get('Name'))}</div>
      </NewDialog>);
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
      Items: [],
      WorkDays:[1,2,3,4,5]
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
    var workdays=this.state.selectedData.get('WorkDays');
    return isTitleValid && isDateValid && workdays.size!==0;
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
      selectedData: selectedData
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _deleteWorkdayData: function(index) {
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
      ref: 'workdayTitleId',
      isViewStatus: isView,
      didChanged: me._onNameChange,
      defaultValue: selectedData.get('Name'),
      title: I18N.Setting.Calendar.WorkdayName,
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
  _renderDefaultWorkDay(isView){
    var workdays=this.state.selectedData.get('WorkDays');
    var workArr=[{
      Id:1,
      Label:I18N.Common.Date.Monday
    },{
      Id:2,
      Label:I18N.Common.Date.Tuesday
    },{
      Id:3,
      Label:I18N.Common.Date.Wednesday
    },{
      Id:4,
      Label:I18N.Common.Date.Thursday
    },{
      Id:5,
      Label:I18N.Common.Date.Friday
    },{
      Id:6,
      Label:I18N.Common.Date.Saturday
    },{
      Id:0,
      Label:I18N.Common.Date.Sunday
    }]
    return(<div style={{paddingBottom:'10px'}}>
      <div style={{fontSize:'14px',color:'#464949',marginTop:'25px',marginBottom:'15px'}}>{I18N.Setting.Calendar.WorkDay}</div>

      <div style={{display:'flex'}}>{isView?
        workArr.map(work=>(
        workdays.includes(work.Id)?<div style={{marginRight:'35px',fontSize:'14px',color:'#767a7a'}}>{work.Label}</div>:null))
        :workArr.map(work=><Checkbox label={work.Label} iconStyle={{width:'16px',height:'16px',marginTop:'2px'}} labelStyle={{fontSize:'14px',color:'#505559',width:'30px'}} style={{marginRight:'35px',width:'60px'}} 
                            checked={workdays.includes(work.Id)}
                            onCheck={(e,isInputChecked)=>{
                              if(isInputChecked){
                                workdays=workdays.push(work.Id)
                              }else{
                                workdays=workdays.delete(workdays.findIndex(item=>item===work.Id))
                              }
                              this.setState({
                                selectedData:this.state.selectedData.set('WorkDays',workdays)
                              },()=>{
                                this.setState({
                                  enableSave: this._isValid()
                                })
                              })
                            }}/>)
                    }
                    </div>
    </div>)
  },
  _renderContent: function(isView) {
    var me = this;
    let selectedData = me.state.selectedData;
    // var workdayText = (<div className='jazz-calendar-text'>{I18N.Setting.Calendar.DefaultWorkDay}</div>);
    var addWorkdayDataButton = null;
    var addWorkdayData = null;
    if (!isView) {
      addWorkdayDataButton = (<div className="jazz-calendar-add-button"><FlatButton label={I18N.Common.Button.Add} onClick={me._addWorkdayData} /></div>);
    }
    if ((selectedData.get('Items').size !== 0 && isView) || !isView) {
      addWorkdayData = (<div className="jazz-calendar-add">
    <div className="jazz-calendar-add-text">{I18N.Setting.Calendar.AdditionalDay}</div>
    {addWorkdayDataButton}
    </div>);
    }
    var workdayGroup = <FromEndDateGroup ref='workdayGroup' type={calendarType} items={selectedData.get('Items')} isViewStatus={isView} onDeleteDateData={me._deleteWorkdayData} onDateChange={me._onDateChange} onTypeChange={me._onTypeChange}></FromEndDateGroup>;
    return (
      <div className={"jazz-calendar-content"}>
        {this._renderDefaultWorkDay(isView)}
        {addWorkdayData}
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
    document.title = I18N.Privilege.Role.SPManagement;
    CalendarAction.getCalendarListByType(calendarType);
    CalendarStore.addCalendarListChangeListener(this._onWorkdayListChange);
    CalendarStore.addSelectedCalendarChangeListener(this._onSelectedItemChange);
    CalendarStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    CalendarStore.removeCalendarListChangeListener(this._onWorkdayListChange);
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
      addBtnLabel: I18N.Setting.Calendar.WorkdaySetting,
      isAddStatus: isAdd,
      isLoading: false,
      contentItems: items,
      onAddBtnClick: me._addWorkday
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

module.exports = WorkDay;
