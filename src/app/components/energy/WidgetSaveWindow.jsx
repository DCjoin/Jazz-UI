'use strict';

import React from "react";
import mui from 'material-ui';
import {dateFormat} from '../../util/Util.jsx';
import HierarchyButton from '../HierarchyButton.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import DashboardStore from '../../stores/DashboardStore.jsx';

let { Dialog, DropDownMenu, FlatButton, TextField, RadioButton, RadioButtonGroup } = mui;
let isShowed = false;

var WidgetSaveWindow = React.createClass({
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
    isShowed = false;
  },
  onTreeItemClick(hierItem){
    //console.log(item);
    AlarmAction.getDashboardByHierachy(hierItem.Id);
  },
  onHierButtonClick(){

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
  render(){
    let me = this;
    let existDashBoardRadioContent;
    let newDashboardRadioContent;
    if(this.state.dashboardState ==='existDashboard'){
      existDashBoardRadioContent = <div><DropDownMenu ref={'dashboardListDropDownMenu'} menuItems={this.state.dashboardMenuItems}></DropDownMenu></div>;
    }else{
      newDashboardRadioContent = <div><TextField ref={'dashboardname'} hintText={'新建仪表盘'}/></div>;
    }
    var form =<div>
      <div>
        <span className='jazz-form-field-title'>图标名称：</span> <TextField ref={'widgetname'} />
      </div>
      <div>
        <span className='jazz-form-field-title'>层级节点：</span> <HierarchyButton ref={'hierTreeButton'} onButtonClick={this.onHierButtonClick} onTreeClick={this.onTreeItemClick} ></HierarchyButton>
      </div>
      <div>
        <span className='jazz-form-field-title'>选择仪表盘：</span>
        <div style={{marginLeft: '140px'}}>
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
        <span className='jazz-form-field-title'>备注：</span><TextField ref={'dashboardname'} multiLine='true'/>
      </div>
    </div>;

    var _buttonActions = [
            <FlatButton
              label="保存"
              secondary={true}
              onClick={this._onDialogSubmit} />,
            <FlatButton
              label="放弃"
              primary={true}
              onClick={this._onDialogCancel} style={{marginRight:'560px'}}/>
        ];

    var dialog = <Dialog  title="保存图标至仪表盘"  actions={_buttonActions} modal={false} ref="dialogWindow" onDismiss={this._onDismiss}>
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
  _onDialogSubmit(){
    console.log('_onDialogSubmit');
    this.hide();
  },
  _onDialogCancel(){
    console.log('_onDialogCancel');
    this.hide();
  },
  validate(){
    let title = this.refs.widgetname.getValue();
    let flag = true;
    if(title.trim() === '' ){
      this.refs.widgetname.setErrorText('必填项。');
      flag = false;
    }
  }
});

module.exports = WidgetSaveWindow;
