'use strict';

import React from "react";
import mui from 'material-ui';
import {dateFormat} from '../../util/Util.jsx';
import HierarchyButton from '../HierarchyButton.jsx';
import MutableDropMenu from '../../controls/MutableDropMenu.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DashboardStore from '../../stores/DashboardStore.jsx';
import CommonFuns from '../../util/Util.jsx';

let { Dialog, DropDownMenu, FlatButton, TextField, RadioButton, RadioButtonGroup } = mui;
let isShowed = false;

var WidgetSaveWindow = React.createClass({
  propTypes:{
    onWidgetSaveWindowDismiss: React.PropTypes.func
  },
  getInitialState() {
    return {dashboardState:'existDashboard',
            dashboardMenuItems:[{text:''}]
           };
  },
  show(){
    this.refs.dialogWindow.show();
    isShowed = true;
  },
  hide(){
    this.refs.dialogWindow.dismiss();
  },
  _onDismiss(){
    if(this.props.onWidgetSaveWindowDismiss){
      this.props.onWidgetSaveWindowDismiss();
    }
    isShowed = false;
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
    this.setState({dashboardState:'existDashboard'});
  },
  _onNewRadioChanged(){
    this.setState({dashboardState:'newDashboard'});
  },
  _onExistDashboardChanged(e, selectedIndex, menuItem){
    console.log(selectedIndex, menuItem);
    this.setState({selectedExistingDashboard:menuItem});
  },
  render(){
    let me = this;
    let existDashBoardRadioContent;
    let newDashboardRadioContent;
    if(this.state.dashboardState ==='existDashboard'){
      existDashBoardRadioContent = <div><MutableDropMenu ref={'dashboardListDropDownMenu'} menuItems={this.state.dashboardMenuItems}
                                                      onChange={this._onExistDashboardChanged}></MutableDropMenu></div>;
    }else{
      newDashboardRadioContent = <div><TextField ref={'newDashboardName'} hintText={'新建仪表盘'}/></div>;
    }
    var form =<div style={{marginLeft:'17px'}}>
      <div style={{paddingBottom:'10px'}}>
        <span className='jazz-form-text-field-title'>*图标名称：</span> <TextField ref={'widgetname'} />
      </div>
      <div style={{marginBottom:'10px'}} className={'jazz-normal-hierarchybutton-container'}>
        <span className='jazz-form-field-title' style={{marginTop:'12px'}}>*层级节点：</span>
          <HierarchyButton ref={'hierTreeButton'} show={true}
              onButtonClick={this.onHierButtonClick} onTreeClick={this.onTreeItemClick} ></HierarchyButton>
      </div>
      <div style={{ marginBottom:'10px'}}>
        <span className='jazz-form-field-title' style={{marginTop:'2px'}}>*选择仪表盘：</span>
        <div style={{width: '200px', display:'inline-block'}}>
          <RadioButtonGroup ref={'existDashboardRadio'} onChange={this._onExistRadioChanged} valueSelected={this.state.dashboardState}>
            {[<RadioButton label="已存在仪表盘" value="existDashboard" ></RadioButton>]}
          </RadioButtonGroup>
          {existDashBoardRadioContent}
          <RadioButtonGroup ref={'newDashboardRadio'} onChange={this._onNewRadioChanged} valueSelected={this.state.dashboardState}>
            {[<RadioButton label="新建仪表盘" name="newDashboard" value="newDashboard"></RadioButton>]}
          </RadioButtonGroup>
          {newDashboardRadioContent}
        </div>
      </div>
      <div>
        <span className='jazz-form-text-field-title'>备注：</span><TextField ref={'dashboardComment'} multiLine='true'/>
      </div>
    </div>;

    var _buttonActions = [
            <FlatButton label="保存" onClick={this._onDialogSubmit} />,
            <FlatButton label="放弃" onClick={this._onDialogCancel} style={{marginRight:'364px'}}/>
        ];
    let _titleElement = <h3 style={{fontSize:'20px', fontWeight:'bold', padding:'24px 0 0 50px'}}>{'保存图标至仪表盘'}</h3>;
    var dialog = <Dialog  title={_titleElement} contentStyle={{height:'460px', width:'600px', color:'#464949'}}
                          actions={_buttonActions} modal={false} ref="dialogWindow" onDismiss={this._onDismiss}>
                  {form}
                 </Dialog>;

    return dialog;
  },
  componentDidMount: function() {
    DashboardStore.addDashboardListLoadedListener(this._onDashboardListLoaded);
  },
  componentWillUnmount: function() {
    DashboardStore.removeDashboardListLoadedListener(this._onDashboardListLoaded);
  },
  componentDidUpdate(){
    if(this.props.openImmediately && !isShowed){
      var tagOption = this.props.tagOption;
      this.refs.hierTreeButton.selectHierItem(tagOption.hierId, true);
      this.show();
    }

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
      let existDashboardItem = CommonFuns.getSelecetedItemFromDropdownMenu(this.refs.dashboardListDropDownMenu);
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
      if(!createNewDashboard){
        let existDashboardItem = CommonFuns.getSelecetedItemFromDropdownMenu(this.refs.dashboardListDropDownMenu),
            dashboardId = existDashboardItem.id,
            title = this.refs.widgetname.getValue();

        widgetDto = {widgetDto: {
                                  ContentSyntax:this.props.contentSyntax,
                                  DashboardId:dashboardId,
                                  Name: title
                                }
                    };
      }else{
        widgetDto ={ dashboard: { HierarchyId: this.state.selectedNode.Id,
                                  Name:this.refs.newDashboardName.getValue(),
                                  IsFavorite: false,
                                  IsRead: false
                                },
                     widget: { ContentSyntax:this.props.contentSyntax,
                               Name:this.refs.widgetname.getValue()
                             }
                   };
      }

      AlarmAction.save2Dashboard(widgetDto, createNewDashboard);
      this.hide();
    }

  }
});

module.exports = WidgetSaveWindow;
