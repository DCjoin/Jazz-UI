import React, { Component } from 'react';
import moment from 'moment';
import {CircularProgress,TextField,IconButton,FlatButton} from 'material-ui';
import { curry } from 'lodash/function';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import {DiagnoseRange,CreateStep2} from './CreateDiagnose.jsx';
import Immutable from 'immutable';
import NewDialog from 'controls/NewDialog.jsx';
import {DataConverter, isEmptyStr} from 'util/Util.jsx';
import {DIAGNOSE_MODEL} from 'constants/actionType/Diagnose.jsx';

function getFirstDateByThisYear(formatStr) {
	return new Date(moment().startOf('year').format(formatStr))
}

function getEndDateByThisYear(formatStr) {
	return new Date(moment().endOf('year').format(formatStr))
}

const DATA_FORMAT = 'YYYY-MM-DD';
const SEPARTOR = '-';
const TRIGGER_TYPE = {
	FixedValue: 1,
	HistoryValue: 2,
}

export default class EditDiagnose extends Component {

  constructor(props, ctx) {
          super(props);
          this._onChanged = this._onChanged.bind(this);
					this._onUpdate = this._onUpdate.bind(this);
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

  _merge(paths,value, callback){
		if(paths==='StartTime' || paths==='EndTime' || paths==='HistoryStartTime' || paths==='HistoryEndTime'){
			let j2d=DataConverter.J2DNoTimezone,
					d2j=DataConverter.DatetimeToJson;
			value=d2j(j2d(value))
		}
    DiagnoseAction.mergeDiagnose(paths,value)
    callback && callback();
  }

  _validate(){
    var {Name,WorkTimes}=this.state.diagnoseData.toJS();
    if(Name==='' || Name===null || WorkTimes.length===0) return true
    return false
  }

	_formatTime(time){
		var j2d=DataConverter.JsonToDateTime;
		return(moment(j2d(time)).format('YYYY-MM-DDTHH:mm:ss'))
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
							val = new Date().getFullYear() + SEPARTOR + val.join(SEPARTOR);
							let setVal = () => {
								this._merge(['Timeranges', idx, type], val);
							}
							if( type === 'StartTime' && moment(val) > moment(Timeranges[idx].EndTime) ) {
								this._merge(['Timeranges', idx, 'EndTime'], val);
							} else if( type === 'EndTime' && moment(val) < moment(Timeranges[idx].StartTime) ) {
								this._merge(['Timeranges', idx, 'StartTime'], val);
							}
							setVal();
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

	_editNeedRequire() {
		let {diagnoseData} = this.state,
		DiagnoseModel = this.props.EnergyLabel.get('DiagnoseModel');
		if( DiagnoseModel === DIAGNOSE_MODEL.A ) {
			return isEmptyStr( diagnoseData.get('TriggerValue') );
		} else if(DiagnoseModel === DIAGNOSE_MODEL.B) {
			if( diagnoseData.get('TriggerType') === TRIGGER_TYPE.FixedValue ) {
				return isEmptyStr( diagnoseData.get('TriggerValue') )
			}
			if( diagnoseData.get('TriggerType') === TRIGGER_TYPE.HistoryValue ) {
				return false;
			}
		} else if(DiagnoseModel === DIAGNOSE_MODEL.C) {
			return true;
		}
	}
  _renderChart(){
    var me=this;
    var {DiagnoseModel,WorkTimes,TriggerValue,ConditionType,TriggerType,ToleranceRatio,HistoryStartTime,HistoryEndTime,
          StartTime,EndTime}=this.state.diagnoseData.toJS();
    var props={
      DiagnoseModel,WorkTimes,TriggerValue,ConditionType,TriggerType,ToleranceRatio,
			HistoryStartTime:this._formatTime(HistoryStartTime),
			HistoryEndTime:this._formatTime(HistoryEndTime),
      StartTime:this._formatTime(StartTime),
			EndTime:this._formatTime(EndTime),
      chartData:this.state.chartData,
      chartDataLoading:this.state.chartData===null,
      getChartData:()=>{
        this.setState({
          chartData:null
        },()=>{
          me.getPreviewchart(this.state.diagnoseData.toJS())
        })
      },
      onUpdateFilterObj:path => (val, callback) => this._merge(path, val, callback),
    }
    return <CreateStep2 {...props}/>
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
			var styles={
				label:{
					fontSize: '14px',
  				fontWeight: '500',
  				lineHeight: '1.14',
  				color: '#ffffff'
				},
				btn:{
					minWidth:'0',
					borderRadius: '2px',
					width:'120px',
					marginTop:'20px'
				}
			};
			return(
				<div className='diagnose-overlay'>
					<header className='diagnose-overlay-header'>
						<div>
							<span>{I18N.Setting.Diagnose.EditDiagnose}</span>
							<span style={{marginLeft:'10px'}}><TextField value={this.state.diagnoseData.get('Name')} onChange={(event)=>{this._merge('Name',event.target.value)}}/></span>
						</div>
						<IconButton iconClassName='icon-close' onTouchTap={this.props.onClose}/>
					</header>
					{this._renderContent()}
					<footer>
						<div style={{float:"right", marginBottom: 40}}>
								<FlatButton label={I18N.Setting.Diagnose.SaveAndExit} labelStyle={styles.label} style={styles.btn} backgroundColor="#0cad04"
									disabled={this._validate()} onTouchTap={()=>{
										DiagnoseAction.updateDiagnose(
											{...this.state.diagnoseData.toJS(),
											...{
												HistoryEndTime: moment(this.state.diagnoseData.get('HistoryEndTime')).format('YYYY-MM-DDTHH:mm:ss')
											}}
										)
									}}/>
								</div>
					</footer>


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
