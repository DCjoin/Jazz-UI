'use strict';

import React from "react";
import mui from 'material-ui';
import {dateFormat} from '../../util/Util.jsx';
import HierarchyButton from '../HierarchyButton.jsx';

let { Dialog, DropDownMenu, FlatButton, TextField, RadioButton, RadioButtonGroup } = mui;

var WidgetSaveWindow = React.createClass({
  getInitialState() {
    return {dashboardState:'existDashboard'};
  },
  show(){
    this.refs.dialogWindow.show();
  },
  onTreeItemClick(){

  },
  _onExistRadioChanged(){
    this.setState({dashboardState:'existDashboard'});
    console.log('_onExistRadioChanged');
  },
  _onNewRadioChanged(){
    this.setState({dashboardState:'newDashboard'});
    console.log('_onNewRadioChanged');
  },
  render(){
    let existDashBoardRadioContent;
    let newDashboardRadioContent;
    if(this.state.dashboardState ==='existDashboard'){
      existDashBoardRadioContent = <div><DropDownMenu menuItems={[{text:'dashboard1'}]}></DropDownMenu></div>;
    }else{
      newDashboardRadioContent = <div><TextField ref={'dashboardname'} hintText={'新建仪表盘'}/></div>;
    }
    var form =<div>
      <div>
        <span className='jazz-form-field-title'>图标名称：</span> <TextField ref={'widgetname'} />
      </div>
      <div>
        <span className='jazz-form-field-title'>层级节点：</span> <HierarchyButton onTreeClick={this.onTreeItemClick} ></HierarchyButton>
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

    var dialog = <Dialog  title="保存图标至仪表盘"  actions={_buttonActions} modal={false} ref="dialogWindow">
                  {form}
                 </Dialog>;

    return dialog;
  },
  componentDidMount: function() {
    //this.refs.existDashboardRadio.setSelectedValue('existDashboard');
  },

});

module.exports = WidgetSaveWindow;
