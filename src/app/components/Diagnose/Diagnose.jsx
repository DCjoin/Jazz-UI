import React, { Component } from 'react';
import classnames from "classnames";
import LabelList from './LabelList.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import Immutable from 'immutable';
import LabelDetail from './LabelDetail.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
}

function privilegeWithSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege());
}

function isListFull() {
	return privilegeWithSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function isBasicView() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isView.bind(privilegeUtil));
}

function isBasicNoPrivilege() {
	return !(isBasicView() || isBasicFull())
}




export default class Diagnose extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props);
        this._onHasProblem = this._onHasProblem.bind(this);
        this._onItemTouchTap = this._onItemTouchTap.bind(this);
        this._onBasicTabSwitch = this._onBasicTabSwitch.bind(this);
        this._onChanged = this._onChanged.bind(this);

    }

  state={
        infoTabNo:isBasicNoPrivilege()?2:1,
        hasProblem:false,
        selectedNode:Immutable.fromJS({}),
        nodeDetail:null,
        isBasic:true
    }

  _onChanged(){
    this.setState({
      nodeDetail:DiagnoseStore.getDiagnose()
    })
  }

  _onHasProblem(){
    this.setState({
      hasProblem:CurrentUserStore.getDiagnoseBubble()
    })
  }

  _switchTab(no){
    this.setState({
      infoTabNo:no,
      nodeDetail:null
    })
  }

  _onItemTouchTap(data){
    this.setState({
      selectedNode:data
    },()=>{
      DiagnoseAction.getDiagnose(data.get("Id"));
    })
  }

  _onBasicTabSwitch(no){
      this.setState({
        isBasic:no===1
      })
    }

  _renderTab(){
    if(isListFull() && !isBasicNoPrivilege()){
      return(
        <div className="titleTabs">
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===1})} onClick={this._switchTab.bind(this,1)} style={{display:'flex'}}>
            {I18N.Setting.Diagnose.DiagnoseProblem}
            {this.state.hasProblem?<BubbleIcon style={{width:'5px',height:'5px'}}/>:null}
          </div>
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===2})} onClick={this._switchTab.bind(this,2)} style={{marginLeft:'72px'}}>
            {I18N.Setting.Diagnose.DiagnoseList}
          </div>
        </div>
      )
    }
    else {
      return<div style={{marginTop:'30px'}}/>
    }

  }


  getProblem(){
    this.setState({
      nodeDetail:null
    },()=>{
      DiagnoseAction.getDiagnoseStatic(this.context.hierarchyId)
    })
  }

  componentDidMount(){
    CurrentUserStore.addCurrentUserListener(this._onHasProblem);
    DiagnoseStore.addChangeListener(this._onChanged);
    this.getProblem();
  }

  componentWillReceiveProps(nextProps, nextCtx) {
    if( this.context.hierarchyId && nextCtx.hierarchyId === nextProps.params.customerId * 1 ) {
      this.getProblem();
      nextProps.router.push(
        getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(nextProps.params)
      )
    }
  }

  componentWillUnmount(){
    CurrentUserStore.removeCurrentUserListener(this._onHasProblem);
    DiagnoseStore.removeChangeListener(this._onChanged);
  }

render(){

  return(
    <div className="diagnose-panel">
      {this._renderTab()}
      <div className="content">
        <LabelList ref='list' isFromProbem={this.state.infoTabNo===1} selectedNode={this.state.selectedNode} onItemTouchTap={this._onItemTouchTap} onTabSwitch={this._onBasicTabSwitch}/>
        <LabelDetail isFromProbem={this.state.infoTabNo===1} selectedNode={this.state.nodeDetail} isBasic={this.state.isBasic}/>
    </div>
    </div>
  )
}
}
