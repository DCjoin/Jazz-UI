import React, { Component } from 'react';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseList from './DiagnoseList.jsx';
import DiagnoseProblem from './DiagnoseProblem.jsx';

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

export default class LabelDetail extends Component {

  _renderContent(){
		return this.props.isFromProbem?<DiagnoseProblem selectedNode={this.props.selectedNode} isBasic={this.props.isBasic}/>
																	:<DiagnoseList selectedNode={this.props.selectedNode}/>;
  }

  render(){
    var text=DiagnoseStore.getContentText(this.props.isFromProbem,this.props.selectedNode);
    var content;

		if(!isFull()){
      text=I18N.Setting.Diagnose.NoPrivilege
    }
		if(text){
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
}
