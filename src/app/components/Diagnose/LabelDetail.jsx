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
		return this.props.isFromProbem?<DiagnoseProblem selectedNode={this.state.selectedNode} isBasic={this.props.isBasic} onEdit={this.props.onEdit}/>
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

		if(this.props.isFromProbem && !this.props.isBasic && !isFull()){
      text=I18N.Setting.Diagnose.NoPrivilege
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

LabelDetail.propTypes={
  isFromProbem:React.PropTypes.bool,
  selectedNode:React.PropTypes.object,
	isBasic:React.PropTypes.bool,
	addLabel:React.PropTypes.object,
	formStatus:React.PropTypes.any,
  onEdit:React.PropTypes.func
}
