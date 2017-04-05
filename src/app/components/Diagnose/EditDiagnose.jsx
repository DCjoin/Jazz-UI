import React, { Component } from 'react';
import moment from 'moment';
import {CircularProgress,TextField,IconButton,FlatButton} from 'material-ui';
import { curry } from 'lodash/function';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import {DiagnoseRange,CreateStep2} from './CreateDiagnose.jsx';
import Immutable from 'immutable';
import NewDialog from 'controls/NewDialog.jsx';

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
          this._onChanged = this._onChanged.bind(this);
      }

  state={
          diagnoseData:null,
					errorShow:false
      }

  _onChanged(){
    this.setState({
      diagnoseData:DiagnoseStore.getDiagnose(),
      chartData:DiagnoseStore.getPreviewChartData()
    })
  }


	_onUpdate(isSuccess){
		if(isSuccess){
			this.props.onClose()
		}
		else {
			this.setState({
				errorShow:true
			})
		}
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

	_renderErrorDialog() {
		var that = this;
		var onClose = function() {
			that.setState({
				errorShow: false,
			});
		};

			return (
				 <NewDialog
			        open={this.state.errorShow}
			        modal={false}
			        isOutsideClose={false}
			        onRequestClose={onClose}
			        titleStyle={{margin:'0 24px'}}
			        contentStyle={{overflowY: 'auto',paddingRight:'5px',display:'block'}}>
							{I18N.Setting.Diagnose.SaveErrorMsg}
						</NewDialog>)

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
          me.getPreviewchart(this.state.diagnoseData.toJS())
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
    DiagnoseAction.previewchart(dto)
  }

  componentDidMount(){
    DiagnoseStore.addChangeListener(this._onChanged);
		DiagnoseStore.addUpdateDiagnoseListener(this._onUpdate);
    DiagnoseAction.getDiagnose(this.props.selectedNode.get('Id'),(dto)=>{
      this.getPreviewchart(dto)
    });
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
		DiagnoseStore.removeUpdateDiagnoseListener(this._onUpdate);
  }

  render(){
	  if(this.state.diagnoseData===null){
			return(
				<div className='diagnose-overlay'>
					<header className='diagnose-overlay-header'>
						<div/>
						<IconButton iconClassName='icon-close' onTouchTap={this.props.onClose}/>
					</header>
					<div className="flex-center">
			                                                  <CircularProgress  mode="indeterminate" size={80} />
			                                                 </div>
				</div>
			)
		}else {
			return(
				<div className='diagnose-overlay'>
					<header className='diagnose-overlay-header'>
						<div>
							<span>{I18N.Setting.Diagnose.EditDiagnose}</span>
							<span><TextField value={this.state.diagnoseData.get('Name')} onChange={(event)=>{this._merge('Name',event.target.value)}}/></span>
						</div>
						<IconButton iconClassName='icon-close' onTouchTap={this.props.onClose}/>
					</header>
					{this._renderContent()}
					<FlatButton label={I18N.Setting.Diagnose.SaveAndExit} style={{float:'right'}} disabled={this._validate()} onTouchTap={()=>{
							DiagnoseAction.updateDiagnose(this.state.diagnoseData.toJS())
						}}/>
					{this.state.errorShow && this._renderErrorDialog()}
				</div>
			)
		}

  }


}

EditDiagnose.propTypes={
  selectedNode:React.PropTypes.object,
  onClose:React.PropTypes.func,
}
