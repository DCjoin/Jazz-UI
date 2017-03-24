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

function isFull() {
	return privilegeWithSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}

export default class Diagnose extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props);
        this._onHasProblem = this._onHasProblem.bind(this);
        this._onItemTouchTap = this._onItemTouchTap.bind(this);
        this.getBasicOrSenior = this.getBasicOrSenior.bind(this);

    }

  state={
        infoTabNo:1,
        hasProblem:true,
        selectedNode:Immutable.fromJS({}),
    }

  _onHasProblem(){
    this.setState({
      hasProblem:CurrentUserStore.getDiagnoseBubble()
    })
  }

  _switchTab(no){
    this.setState({
      infoTabNo:no
    })
  }

  _onItemTouchTap(data){
    this.setState({
      selectedNode:data
    })
  }

  _renderTab(){
    if(isFull()){
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
    DiagnoseAction.getDiagnoseStatic(this.context.hierarchyId)
  }

  getBasicOrSenior(){
      if(this.refs.list){
        return this.refs.list.IsBasic()
      }
      return true
  }

  componentDidMount(){
    CurrentUserStore.addCurrentUserListener(this._onHasProblem);
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
  }

render(){

  return(
    <div className="diagnose-panel">
      {this._renderTab()}
      <div className="content">
        <LabelList ref='list' isFromProbem={this.state.infoTabNo===1} selectedNode={this.state.selectedNode} onItemTouchTap={this._onItemTouchTap}/>
        <LabelDetail isFromProbem={this.state.infoTabNo===1} selectedNode={this.state.selectedNode} isBasic={this.getBasicOrSenior()}/>
    </div>
    </div>
  )
}
}
