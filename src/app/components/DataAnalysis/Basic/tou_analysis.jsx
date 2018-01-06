'use strict';
import React, { Component }  from "react";
import NewDialog from 'controls/NewDialog.jsx';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import IconButton from 'material-ui/IconButton';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Immutable from 'immutable';
import TagAction from 'actions/TagAction.jsx';
import TouTariffStore from 'stores/DataAnalysis/touTariff_store.jsx';
import TouTariffAction from 'actions/DataAnalysis/touTariff_action.jsx';
import { CircularProgress} from 'material-ui';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import {find} from 'lodash-es';
import { Snackbar} from 'material-ui';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

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

var findBuilding=(buildingId)=>find(HierarchyStore.getBuildingList(), building =>building.Id === buildingId * 1);

var checkBuildingHasTouProperty=(buildingId)=>findBuilding(buildingId) && findBuilding(buildingId).HasTouTariff

var checkSupportChartType=(chartType)=>SUPPORT_CHART_TYPE.indexOf(chartType)>-1;

var checkSupportStep=(chartType,step)=>(
    (chartType==='column' && ASC_STEP.indexOf(step)<=ASC_STEP.indexOf(TimeGranularity.Hourly))
  || (chartType==='stack' && ASC_STEP.indexOf(step)>ASC_STEP.indexOf(TimeGranularity.Hourly))
  || chartType==='pie'
)

var checkSupportTag=()=>AlarmTagStore.getSearchTagList() && AlarmTagStore.getSearchTagList().length<=1

var checkTagProperty=(tag)=>(checkBuildingHasTouProperty(tag.get('HierarchyId'))
                                                    && tag.get('CommodityId')===1
                                                    && tag.get('UomId')===1
																										&& tag.get('CalculationStep')===1
                                                    && tag.get("CalculationType")===1)

var checkTagsProperty=(tagInfos)=>tagInfos.map(tag=>checkTagProperty(tag))
                                         .includes(true)

var getIds=()=>AlarmTagStore.getSearchTagList().map(tag=>tag.tagId)


export default class TouAnalysis extends Component {

  constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    selectedTagId:null,
    tags:Immutable.fromJS(AlarmTagStore.getSearchTagList()),
    tagInfos:null
  }

  _onChanged(){
    this.setState({
      tagInfos:TouTariffStore.getTagsInfo()
    })
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
          titleStyle={{marginBottom:'0',height:'16px',lineHeight:'16px'}}
          actionsContainerStyle={{display:'none'}}
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
          titleStyle={{marginBottom:'0',height:'16px',lineHeight:'16px'}}
          actionsContainerStyle={{display:'none'}}
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
    allTags=allTags.delete(allTags.findIndex(tag=>tag.get('tagId')===this.state.selectedTagId));
    this.props.onTagConfirm(allTags.toJS());
  }

  _renderTagErrorDialog(){
    let actions = [
			<NewFlatButton style={{marginLeft: 16,float:'right',border:'1px solid #9fa0a4',width:'80px',minWidth:'80px',lineHeight:'34px'}} label={I18N.Common.Button.Cancel2} onClick={this.props.onClose}/>,
			<NewFlatButton primary label={I18N.Common.Button.Confirm} disabled={this.state.selectedTagId===null} onClick={this._onConfirm.bind(this)} style={{float:'right',width:'80px',minWidth:'80px',lineHeight:'34px'}}/>
		];
    return(
      <NewDialog
          open={true}
          modal={true}
          actions={actions}
          titleStyle={{marginBottom:'0',height:'16px',lineHeight:'16px'}}
          contentStyle={{overflowY:'auto'}}
          actionsContainerStyle={{margin:'16px 24px 16px 0'}}
          >
          <div className="tou-dialog-error" style={{flexDirection:'column'}}>
            {I18N.Setting.DataAnalysis.Tou.NotSupportMulti}
            <RadioButtonGroup name="tagSelect" valueSelected={this.state.selectedTagId} onChange={(e,value)=>{
                                                                                                  this.setState({
                                                                                                    selectedTagId:value
                                                                                                  })}}
                                                                                        style={{marginTop:'18px'}}>
              {this.state.tagInfos.map(tag=>{
                                                        var disabled=!checkTagProperty(tag)
                                                        return(<RadioButton
                                                          value={tag.get('Id')}
                                                          label={tag.get('Name')+(disabled?`  (${I18N.Setting.DataAnalysis.Tou.TagNotSupport})`:'')}
                                                          disabled={disabled}
                                                          labelStyle={{fontSize:'16px',wordBreak: 'break-all'}}
                                                          style={{marginBottom:'18px'}}
                                                        />)})}
            </RadioButtonGroup>
          </div>
        </NewDialog>
    )
  }

  _renderMultiTimeDialog(){

    let actions = [
			<NewFlatButton style={{marginLeft: 16,float:'right',border:'1px solid #9fa0a4',width:'80px',minWidth:'80px',lineHeight:'34px'}} label={I18N.Setting.DataAnalysis.Tou.NotCancelMulti} onClick={this.props.onClose}/>,
			<NewFlatButton primary label={I18N.Setting.DataAnalysis.Tou.CancelMulti} onClick={()=>{this.props.cancelMulti();
                                                                                              this.props.onSuccess();
                                                                                             }}
                             style={{float:'right',width:'80px',minWidth:'80px',lineHeight:'34px'}}/>
		];
    return(
        <NewDialog
          open={true}
          modal={true}
          actions={actions}
          titleStyle={{marginBottom:'0',height:'16px',lineHeight:'16px'}}
          actionsContainerStyle={{margin:'16px 24px 16px 0'}}
          contentStyle={{marginBottom:'40px'}}
          >
          <div className="tou-dialog-error">
            {I18N.Setting.DataAnalysis.Tou.NotSupportHistory}
          </div>
        </NewDialog>)
  }

  _renderTagNotSupportSnackBar(){
    return <Snackbar style={{
        maxWidth: 'none'
      }} message={I18N.Message.M02028} autoHideDuration={4000} open={true} onRequestClose={this.props.onClose} ref='errorMessageDialog' />;
  }

  componentDidMount(){
    TouTariffStore.addChangeListener(this._onChanged);
    TouTariffAction.getTagsInfo(getIds());
  }

  componentWillUnmount(){
    TouTariffStore.removeChangeListener(this._onChanged);
  }

  render(){
    var {chartType,step,isMultiTime,onSuccess}=this.props;
    var content;
    if(this.state.tagInfos===null){
      content=null
    }else if(!checkTagsProperty(this.state.tagInfos)){
      content=this._renderTagNotSupportSnackBar()
    }else if(!checkSupportTag()){
      content=this._renderTagErrorDialog()
    }else if(isMultiTime){
      content=this._renderMultiTimeDialog()
    }else if(!checkSupportChartType(chartType)){
      content=this._renderChartTypeErrorDialog()
    }else  {
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
