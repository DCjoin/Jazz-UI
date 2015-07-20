'use strict';

import React from "react";
import mui from 'material-ui';
import classNames from 'classnames';
import {dateFormat,Regex} from '../../util/Util.jsx';
import HierarchyButton from '../HierarchyButton.jsx';
import MutableDropMenu from '../../controls/MutableDropMenu.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DashboardStore from '../../stores/DashboardStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import CommonFuns from '../../util/Util.jsx';

let { Dialog, DropDownMenu, FlatButton, TextField, RadioButton, RadioButtonGroup } = mui;

var WidgetSaveWindow = React.createClass({
  propTypes:{
    onWidgetSaveWindowDismiss: React.PropTypes.func
  },
  getInitialState() {
    return {dashboardState:'existDashboard',
            dashboardMenuItems:[],
            tagOption:{},
            selectedExistingDashboardIndex: 0,
            error:{},
            newDashboardNameError:null,
            chartTitleError:null,
            chartTitleValue:null,
            newDashboardNameValue:null
           };
  },
  getDefaultProps: function() {
    return {
      chartTitle:''
    };
  },
  show(){
    this.refs.dialogWindow.show();
  },
  hide(){
    this.refs.dialogWindow.dismiss();
  },
  _onDismiss(){
    if(this.props.onWidgetSaveWindowDismiss){
      this.props.onWidgetSaveWindowDismiss();
    }
  },
  onTreeItemClick(hierItem){
    //console.log(item);
    this.setState({selectedNode: hierItem});
    AlarmAction.getDashboardByHierachy(hierItem.Id);
  },
  onHierButtonClick(){
    this.setState({
      HierarchyShow:true
    });
  },
  _onDashboardListLoaded(){
    var menuItems = DashboardStore.getDashboardMenuItems();
    this.setState({dashboardMenuItems:menuItems});
  },
  _onExistRadioChanged(){
    this.setState({
      dashboardState:'existDashboard',
      error:{}
    });
  },
  _onNewRadioChanged(){
    this.setState({dashboardState:'newDashboard',
      error:{}
    });
  },
  _onExistDashboardChanged(e, selectedIndex, menuItem){
    this.setState({selectedExistingDashboard:menuItem,
                   selectedExistingDashboardIndex: selectedIndex});
  },
  _onNameFieldChange(e){
    if(Regex.NameRule.test(e.target.value)){
      this.setState({
        chartTitleError:null
      });
    }
    else {
      this.setState({
        chartTitleError:'非法输入'
      });
    }

  if(e.target.value.length<=100){
    this.setState({
      chartTitleValue:e.target.value
    });
  //  this.refs.widgetname.setValue(e.target.value.slice(0,99))
  }
  },
  _onNewDSNameFieldChange(e){
    if(Regex.NameRule.test(e.target.value)){
      this.setState({
        newDashboardNameError:null
      });
    }
    else {
      this.setState({
        newDashboardNameError:'非法输入'
      });
    }
    if(e.target.value.length<=100){
      this.setState({
        newDashboardNameValue:e.target.value
      });
    }
  //  this.refs.newDashboardName.setErrorText();
  },
  _onDashboardErrorLoaded(){
    this.setState({
      error:DashboardStore.GetDashboardError()
    });
  },
  _onSaveDashboardSuccessLoaded(){
    this.setState({
      error:{}
    });
  this.hide();
  },
  render(){
    let me = this;
    let existDashBoardRadioContent;
    let newDashboardRadioContent;
    let dashboardListMenuItemStyle={
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    if(this.state.dashboardState ==='existDashboard'){
      if(this.state.dashboardMenuItems.length === 0){
          existDashBoardRadioContent = <div></div>;
      }else{
        existDashBoardRadioContent = <div className={classNames({'jazz-widget-save-dialog-existing-dashboard':true})} >
            <DropDownMenu ref={'dashboardListDropDownMenu'} menuItems={this.state.dashboardMenuItems} menuItemStyle={dashboardListMenuItemStyle} style={{width:'392px'}}
              selectedIndex={this.state.selectedExistingDashboardIndex} onChange={this._onExistDashboardChanged}></DropDownMenu></div>;
      }
    }else{
      newDashboardRadioContent = <div><TextField ref={'newDashboardName'} value={this.state.newDashboardNameValue} hintText={'新建仪表盘'}
        className={'jazz-widget-save-dialog-textfiled'} onChange={this._onNewDSNameFieldChange}
        errorText={this.state.newDashboardNameError}/></div>;
    }

    var _buttonActions = [
            <FlatButton label="保存" onClick={this._onDialogSubmit} />,
            <FlatButton label="放弃" onClick={this._onDialogCancel} style={{marginRight:'364px'}}/>
        ];
    let _titleElement = <h3 style={{fontSize:'20px', fontWeight:'bold', padding:'24px 0 0 50px'}}>{'保存图表至仪表盘'}</h3>;
    let chartTitleError,oldDashboardError,newDashboardError;
    if(this.state.error){
      if(this.state.error.chartTitle){
         chartTitleError=<div style={{color:'#f46a58','font-size':'12px','margin-left':'120px'}}>{this.state.error.chartTitle}</div>;
      }
      if(this.state.error.oldDashboard){
        oldDashboardError=<div style={{color:'#f46a58','font-size':'12px','margin-left':'20px'}}>{this.state.error.oldDashboard}</div>;
      }
      if(this.state.error.newDashboard){
        newDashboardError=<div style={{color:'#f46a58','font-size':'12px','margin-left':'120px'}}>{this.state.error.newDashboard}</div>;
      }
    }
    let form = <div style={{marginLeft:'27px'}} className='jazz-widget-save-dialog-content-container'>
        <div style={{paddingBottom:'10px'}}>
          <span className='jazz-form-text-field-label'>*图表名称：</span>
          <TextField ref={'widgetname'} className={'jazz-widget-save-dialog-textfiled'} value={this.state.chartTitleValue}
                    onChange={this._onNameFieldChange} defaultValue={this.props.chartTitle} errorText={this.state.chartTitleError}/>
                  {chartTitleError}
        </div>
        <div style={{marginBottom:'20px'}} className={'jazz-normal-hierarchybutton-container'}>
          <span className='jazz-form-field-title'>*层级节点：</span>
            <HierarchyButton ref={'hierTreeButton'} show={true} hierIdAndClick={this.props.tagOption.hierId}
                onButtonClick={this.onHierButtonClick} onTreeClick={this.onTreeItemClick} ></HierarchyButton>
        </div>
        <div style={{ marginBottom:'10px'}}>
          <span className='jazz-form-field-title' style={{marginTop:'2px'}}>*选择仪表盘：</span>
          <div style={{width: '200px', display:'inline-block'}}>
            <RadioButtonGroup ref={'existDashboardRadio'} onChange={this._onExistRadioChanged} valueSelected={this.state.dashboardState}>
              {[<RadioButton label="已存在仪表盘" value="existDashboard" className={'jazz-widget-save-dialog-radiobutton'} ></RadioButton>]}
            </RadioButtonGroup>
            {existDashBoardRadioContent}
            {oldDashboardError}
            <RadioButtonGroup ref='newDashboardRadio' onChange={this._onNewRadioChanged} valueSelected={this.state.dashboardState}>
              {[<RadioButton label="新建仪表盘" name="newDashboard" value="newDashboard"></RadioButton>]}
            </RadioButtonGroup>
            {newDashboardRadioContent}
            {newDashboardError}
          </div>
        </div>
        <div>
          <span className='jazz-form-text-field-label'>备注：</span>
          <TextField ref='dashboardComment' multiLine='true' className={'jazz-widget-save-dialog-textfiled'} hintText='写下您的建议或看法。' />
        </div>
      </div>;
    var dialog = <div className={'jazz-dialog-body-visible'}><Dialog  title={_titleElement} contentStyle={{height:'460px', width:'600px', color:'#464949'}}
      autoScrollBodyContent={true} openImmediately={true} contentInnerStyle={{'max-height':'340px'}}
                          actions={_buttonActions} modal={false} ref="dialogWindow" onDismiss={this._onDismiss}>
                          {form}
                 </Dialog></div>;

    return dialog;
  },
  componentDidMount: function() {
    DashboardStore.addDashboardListLoadedListener(this._onDashboardListLoaded);
    DashboardStore.addDashboardErrorListener(this._onDashboardErrorLoaded);
    DashboardStore.addSaveDashboardSuccessListener(this._onSaveDashboardSuccessLoaded);

  },
  componentWillUnmount: function() {
    DashboardStore.removeDashboardListLoadedListener(this._onDashboardListLoaded);
    DashboardStore.removeDashboardErrorListener(this._onDashboardErrorLoaded);
    DashboardStore.removeSaveDashboardSuccessListener(this._onSaveDashboardSuccessLoaded);
  },

  _onDialogCancel(){
    this.hide();
  },
  validate(){
    let title = this.refs.widgetname.getValue();
    let flag = true;
    if(title.trim() === '' ){
      this.refs.widgetname.setErrorText('必填项。');
      flag = false;
    }

    if(!this.state.selectedNode){
      this.refs.hierTreeButton.setErrorText('必填项。');
      flag = false;
    }
    if(this.state.dashboardState === 'existDashboard'){
      if(!this.state.dashboardMenuItems || this.state.dashboardMenuItems.length===0){
        flag = false;
        return flag;
      }
      let existDashboardItem = this.state.dashboardMenuItems[this.state.selectedExistingDashboardIndex];
      if(!existDashboardItem || !existDashboardItem.id) {
        flag = false;
      }
    }else{
      let newDashboardName = this.refs.newDashboardName.getValue();
      if(newDashboardName.trim() === ''){
        this.refs.newDashboardName.setErrorText('必填项。');
        flag = false;
      }
    }

    return flag;
  },
  _onDialogSubmit(){
    if(this.validate()){
      let widgetDto;
      let createNewDashboard = (this.state.dashboardState === 'newDashboard');
      let comment = this.refs.dashboardComment.getValue();
      if(comment === null || comment.trim() ===''){
        comment='';
      }
      if(!createNewDashboard){
        let existDashboardItem = this.state.dashboardMenuItems[this.state.selectedExistingDashboardIndex],
            dashboardId = existDashboardItem.id,
            title = this.refs.widgetname.getValue();

        widgetDto = {widgetDto: {
                                  ContentSyntax:this.props.contentSyntax,
                                  DashboardId:dashboardId,
                                  Name: title,
                                  Annotation: comment
                                }
                    };
      }else{
        widgetDto ={ dashboard: { HierarchyId: this.state.selectedNode.Id,
                                  Name:this.refs.newDashboardName.getValue(),
                                  IsFavorite: false,
                                  IsRead: false
                                },
                     widget: { ContentSyntax:this.props.contentSyntax,
                               Name:this.refs.widgetname.getValue(),
                               Annotation: comment
                             }
                   };
      }

      AlarmAction.save2Dashboard(widgetDto, createNewDashboard);

    }

  }
});

module.exports = WidgetSaveWindow;
