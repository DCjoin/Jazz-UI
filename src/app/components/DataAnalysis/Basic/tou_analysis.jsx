'use strict';
import React, { Component }  from "react";
import NewDialog from 'controls/NewDialog.jsx';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import IconButton from 'material-ui/IconButton';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Immutable from 'immutable';
import TagAction from 'actions/TagAction.jsx';

const ASC_STEP = [
	TimeGranularity.None,
	TimeGranularity.Minite,
	TimeGranularity.Hourly,
	TimeGranularity.Daily,
	TimeGranularity.Weekly,
	TimeGranularity.Monthly,
	TimeGranularity.Yearly,
];

const SUPPORT_CHART_TYPE=['column','stack','pie'];

var checkSupportChartType=(chartType)=>SUPPORT_CHART_TYPE.indexOf(chartType)>-1;

var checkSupportStep=(chartType,step)=>(
    (chartType==='column' && ASC_STEP.indexOf(step)<=ASC_STEP.indexOf(TimeGranularity.Hourly)) 
  || (chartType==='stack' && ASC_STEP.indexOf(step)>ASC_STEP.indexOf(TimeGranularity.Hourly))
  || chartType==='pie'
)

var checkSupportTag=()=>AlarmTagStore.getSearchTagList() && AlarmTagStore.getSearchTagList().length<=1



export default class TouAnalysis extends Component {

  state={
    tags:Immutable.fromJS(AlarmTagStore.getSearchTagList())
  }

  _renderStepErrorDialog(){
    var {onChangeChartType}=this.props;
    var validChart=this.props.chartType==='column'?<div style={{display:'flex'}}>
      <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'stack')}}>{I18N.EM.CharType.Stack}</div>
      、
      <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'pie')}}>{I18N.EM.CharType.Pie}</div>
    </div>
    :<div style={{display:'flex'}}>
      <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'column')}}>{I18N.EM.CharType.Bar}</div>
      、
      <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'pie')}}>{I18N.EM.CharType.Pie}</div>
    </div>
    return(
        <NewDialog
          open={true}
          modal={false}
          isOutsideClose={false}
          onRequestClose={this.props.onClose}
          contentStyle={{marginBottom:'40px'}}
          >
          <div className="tou-dialog-error">
            {I18N.format(I18N.Setting.DataAnalysis.Tou.NotSupport,I18N.EM.Report.Step)}
            ,
            {I18N.Setting.DataAnalysis.Tou.ChangeStep}
            {validChart}
            {I18N.Setting.DataAnalysis.Tou.Try}
          </div>
        </NewDialog>
    )
  }

  _renderChartTypeErrorDialog(){
    var {onChangeChartType}=this.props;
    return(
        <NewDialog
          open={true}
          modal={false}
          isOutsideClose={false}
          onRequestClose={this.props.onClose}
          contentStyle={{marginBottom:'40px'}}
          >
          <div className="tou-dialog-error">
            {I18N.format(I18N.Setting.DataAnalysis.Tou.NotSupport,I18N.Folder.WidgetName)}
            ,
            {I18N.Setting.DataAnalysis.Tou.ChangeStep}
            <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'column')}}>{I18N.EM.CharType.Bar}</div>
             、
            <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'stack')}}>{I18N.EM.CharType.Stack}</div>
             、
             <div className="tou-dialog-error-chart" onClick={()=>{onChangeChartType(null,null,'pie')}}>{I18N.EM.CharType.Pie}</div>
            {I18N.Setting.DataAnalysis.Tou.Try}
          </div>
        </NewDialog>)
  }

  _onConfirm(){
    var allTags=Immutable.fromJS(AlarmTagStore.getSearchTagList());
    allTags=allTags.delete(allTags.findIndex(tag=>tag.get('tagId')===this.state.tags.getIn([0,'tagId'])));
    TagAction.removeTagStatusByTou(allTags.toJS());
    this.props.onClose();
  }

  _renderTagErrorDialog(){
    let actions = [
			<NewFlatButton style={{marginLeft: 24,float:'right'}} label={I18N.Common.Button.Cancel2} onClick={this.props.onClose}/>,
			<NewFlatButton primary label={I18N.Common.Button.Confirm} disabled={this.state.tags.size!==1} onClick={this._onConfirm.bind(this)} style={{float:'right'}}/>	
		];
    return(
      <NewDialog
          open={true}
          modal={true}
          actions={actions}
          contentStyle={{marginBottom:'40px'}}
          >
          <div className="tou-dialog-error" style={{flexDirection:'column'}}>
            {I18N.Setting.DataAnalysis.Tou.NotSupportMulti}
            {this.state.tags.map((tag,index)=><div className="tou-dialog-error" style={{marginTop:'20px',alignItems:'center'}}>
              <div className="tou-dialog-error-tagname" title={tag.get('tagName')}>{tag.get('tagName')}</div>
              {this.state.tags.size!==1 && <IconButton iconClassName="icon-close" iconStyle={{fontSize:'14px',color:'#626469',marginLeft:'16px'}}
                                                         style={{width:'14px',height:'24px',padding:'0'}}
                                                         onClick={()=>{
                                                          this.setState({
                                                            tags:this.state.tags.delete(index)
                                                          })
                                                         }} />}
              </div>)}
          </div>
        </NewDialog>
    )
  }

  _renderMultiTimeDialog(){
    return(
        <NewDialog
          open={true}
          modal={false}
          isOutsideClose={false}
          onRequestClose={this.props.onClose}
          contentStyle={{marginBottom:'40px'}}
          >
          <div className="tou-dialog-error">
            {I18N.Setting.DataAnalysis.Tou.NotSupportHistory}
          </div>
        </NewDialog>)
  }

  render(){
    var {chartType,step,isMultiTime,onSuccess}=this.props;
    var content;
    if(!checkSupportTag()){
      content=this._renderTagErrorDialog()
    }else if(!checkSupportChartType(chartType)){
      content=this._renderChartTypeErrorDialog()
    }else if(!checkSupportStep(chartType,step)){
      content=this._renderStepErrorDialog()
    }else  if(isMultiTime){
      content=this._renderMultiTimeDialog()
    }else{
      content=null;
      onSuccess();
    }

    return(
      <div>
        {content}
      </div>
    )
  }
}