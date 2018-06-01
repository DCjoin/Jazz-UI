import React, { Component } from 'react';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseList from './DiagnoseList.jsx';
import DiagnoseProblem from './DiagnoseProblem.jsx';
import Immutable from 'immutable';

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithSeniorSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege());
}

function isListFull() {
	return privilegeWithSeniorSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}

function isView() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isView.bind(privilegeUtil));
}

function noPrivilege(){
  return !isFull() && !isView()
}

function noListPrivilege(){
  return !isListFull()
}


export default class LabelDetail extends Component {

  constructor(props, ctx) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    selectedNode:this.props.selectedNode
  }

  _onChanged(){
    if(this.props.selectedNode){
      this.setState({
        selectedNode:DiagnoseStore.findDiagnoseById(this.props.selectedNode.get('Id'))
      })
    }else{
      this.forceUpdate()
    }
  }


  _renderContent(){
		return this.props.isFromProbem?<DiagnoseProblem willCreate={this.props.willCreate} selectedNode={this.state.selectedNode} isBasic={this.props.isBasic} onEdit={this.props.onEdit}/>
                                  :<DiagnoseList selectedNode={this.state.selectedNode} onEdit={this.props.onEdit}/>;
  }

  componentDidMount(){
    DiagnoseStore.addChangeListener(this._onChanged);
  }

  componentWillReceiveProps(nextProps){
    if(!Immutable.is(nextProps.selectedNode,this.props.selectedNode)){
      this.setState({
        selectedNode:nextProps.selectedNode===null?null:DiagnoseStore.findDiagnoseById(nextProps.selectedNode.get('Id'))
      })
    }
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
  }

  render(){
    var text=DiagnoseStore.getContentText(this.props.isFromProbem,this.state.selectedNode);
    var content;

		if(this.props.isFromProbem && !this.props.isBasic && noPrivilege()){
      text=I18N.Setting.Diagnose.NoPrivilege
    }
    if(!this.props.isFromProbem && !this.props.isBasic && noListPrivilege()){
      text=I18N.Setting.Diagnose.NoListPrivilege
    }
		if(text!==''){
      content=<div className="flex-center">
               {text}
             </div>
    }else{
			content=this._renderContent()
		}

    return(
      <div className="detail-content">
        {content}
      </div>
    )
  }
}
import PropTypes from 'prop-types';
LabelDetail.propTypes={
  isFromProbem:PropTypes.bool,
  selectedNode:PropTypes.object,
	isBasic:PropTypes.bool,
	addLabel:PropTypes.object,
	formStatus:PropTypes.any,
  onEdit:PropTypes.func
}
