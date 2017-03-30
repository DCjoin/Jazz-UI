import React, { Component } from 'react';
import moment from 'moment';
import {CircularProgress,TextField,IconButton,FlatButton} from 'material-ui';
import { curry } from 'lodash/function';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import {DiagnoseRange,CreateStep2} from './CreateDiagnose.jsx';
import Immutable from 'immutable';

function getFirstDateByThisYear(formatStr) {
	return new Date(moment().startOf('year').format(formatStr))
}

function getEndDateByThisYear(formatStr) {
	return new Date(moment().endOf('year').format(formatStr))
}

const DATA_FORMAT = 'YYYY-MM-DD';
const SEPARTOR = '-';

export default class EditDiagnose extends Component {

  constructor(props, ctx) {
          super(props);
          this._onTitleMenuSelect = this._onTitleMenuSelect.bind(this);
          this._onChanged = this._onChanged.bind(this);
      }

  state={
          diagnoseData:null
      }

  _onChanged(){
    this.setState({
      diagnoseData:DiagnoseStore.getDiagnose(),
      chartData:DiagnoseStore.getPreviewChartData()
    })
  }

  _onClose(){

  }

  _merge(paths,value){
    let diagnoseData = this.state.diagnoseData,
		immuVal = Immutable.fromJS(value);
		if(paths instanceof Array) {
			diagnoseData = diagnoseData.setIn(paths, immuVal);
		} else {
			diagnoseData = diagnoseData.set(paths, immuVal);
		}
    this.setState({diagnoseData})
  }

  _validate(){
    var {Name,WorkTimes}=this.state.diagnoseData.toJS();
    if(Name==='' || Name===null || WorkTimes.length===0) return true
    return false
  }

  _renderRange(){
    var {Step,Timeranges}=this.state.diagnoseData.toJS()
    var props={
      Step,
      onUpdateStep:(val)=>{this._merge('Step',val)},
      Timeranges,
      onUpdateDateRange:(idx, type, startOrEnd, val) => {
							this._merge(['Timeranges', idx, type],
								new Date().getFullYear() + SEPARTOR + val.join(SEPARTOR)
							);
						},
      onAddDateRange:() => {
							Timeranges.push({
								StartTime: getFirstDateByThisYear(DATA_FORMAT),
								EndTime: getEndDateByThisYear(DATA_FORMAT)});
							this._merge('Timeranges', Timeranges);
						},
      onDeleteDateRange:(idx) => {
      							Timeranges.splice(idx, 1);
      							this._merge('Timeranges', Timeranges);
      						},
    }
    return <DiagnoseRange {...props}/>
  }

  _renderChart(){
    var me=this;
    var {DiagnoseModel,WorkTimes,TriggerValue,ConditionType,TriggerType,ToleranceRatio,HistoryStartTime,HistoryEndTime,
          StartTime,EndTime}=this.state.diagnoseData.toJS();
    var props={
      DiagnoseModel,WorkTimes,TriggerValue,ConditionType,TriggerType,ToleranceRatio,HistoryStartTime,HistoryEndTime,
      StartTime,EndTime,
      chartData:this.state.chartData,
      chartDataLoading:this.state.chartData===null,
      getChartData:()=>{
        this.setState({
          chartData:null
        },()=>{
          me.getPreviewchart(this.state.diagnoseData)
        })
      },
      onUpdateFilterObj:curry(this._merge)
    }
    return <CreateStep2{...props} />
  }

  _renderContent(){
    return(
      <div>
        {this._renderRange()}
        {this._renderChart()}
      </div>
    )
  }
  getPreviewchart(dto){
    DiagnoseAction.previewchart(dto.toJS())
  }

  componentDidMount(){
    DiagnoseStore.addChangeListener(this._onChanged);
    DiagnoseAction.getDiagnose(this.props.selectedNode.get('Id'),()=>{
      this.getPreviewchart(DiagnoseStore.getDiagnose())
    });
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
  }

  render(){
    var content=this.state.diagnoseData===null?<div className="flex-center" style={{flex:'none'}}>
                                                  <CircularProgress  mode="indeterminate" size={80} />
                                                 </div>:this._renderContent()
    return(
      <div className='diagnose-overlay'>
        <header className='diagnose-overlay-header'>
          <div>
            <span>{I18N.Setting.Diagnose.EditDiagnose}</span>
            <span><TextField value={this.state.diagnoseData.get('Name')} onChange={(event)=>{this._merge('Name',event.target.value)}}/></span>
          </div>
          <IconButton iconClassName='icon-close' onTouchTap={this._onClose}/>
        </header>
        {content}
        <FlatButton label={I18N.Setting.Diagnose.SaveAndExit} style={{float:'right'}} disabled={this._validate()} onTouchTap={}/>
      </div>
    )
  }


}

EditDiagnose.propTypes={
  selectedNode:React.PropTypes.object,
  onClose:React.PropTypes.func,
}
