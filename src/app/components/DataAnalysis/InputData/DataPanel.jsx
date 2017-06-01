import React, { Component, PropTypes } from 'react';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import InputDataAction from 'actions/DataAnalysis/InputDataAction.jsx';
import InputDataStore from 'stores/DataAnalysis/InputDataStore.jsx';
import {CircularProgress} from 'material-ui';
import DropDownMenu from 'material-ui/DropDownMenu';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import CommonFuns from 'util/Util.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';
import UOMStore from '../../../stores/UOMStore.jsx';
import _ from 'lodash';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import Regex from '../../../constants/Regex.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import Immutable from 'immutable';
import ReactDom from 'react-dom';
import Config from 'config';
import NewDialog from 'controls/NewDialog.jsx';
import RefreshIndicator from 'material-ui/RefreshIndicator';

function getRelativeDateByStep(step){
		switch (step) {
			case TimeGranularity.Min15:
			case TimeGranularity.Min30:
			case TimeGranularity.Hourly:
					 return 'Last7Day';
					 break;
			case TimeGranularity.Daily:
					 return 'Last30Day';
					 break;
			case TimeGranularity.Monthly:
					 return 'Last12Month';
					 break;
				case TimeGranularity.Yearly:
							return 'Last5Year'
					break;
			default:

		}
}

function getUom(uomId){
	var uom=_.find(UOMStore.getUoms(),item=>item.Id===uomId);
	return `${uom.Comment}/${uom.Code}`
}

function getInitEndDate(data,step){
	let date = new Date();
	date.setHours(0, 0, 0);
	let endDate = CommonFuns.dateAdd(date, 1, 'days');

	if(step===TimeGranularity.Min15 || step===TimeGranularity.Min30 || step===TimeGranularity.Hourly){
		let date= CommonFuns.dateAdd(CommonFuns.DataConverter.JsonToDateTime(data), 30 , 'days');
		if(date.getTime()<endDate.getTime()) return date
	}

		return endDate

}

export default class DataPanel extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onRelativeDateChange = this._onRelativeDateChange.bind(this);
		this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
		this._onValueChange = this._onValueChange.bind(this);
		this._handleExport = this._handleExport.bind(this);
		this._onLeave = this._onLeave.bind(this);
		this._handleSave = this._handleSave.bind(this);
	}

	state={
		dataList:null,
		startDate:null,
		endDate:null,
		relativeDate:null,
		modifyData:Immutable.fromJS([]),
		leaveDialogShow:false,
		isSaving:false
	}

	_initDataTime(step,data){
		if(data!==null){
				return {
					relativeDate:'Customerize',
					startDate:CommonFuns.DataConverter.JsonToDateTime(data,false),
					endDate:getInitEndDate(data,step)
				}
		}else {
			var relativeDate=getRelativeDateByStep(step);
			var timeregion = CommonFuns.GetDateRegion(relativeDate.toLowerCase());
			return{
				relativeDate,
				startDate:timeregion.start,
				endDate:timeregion.end
			}
		}
	}

	_onLeave(){
		this.setState({
			leaveDialogShow:true
		})
	}

	_onRelativeDateChange(e, selectedIndex, value) {
    if (value && value !== 'Customerize') {
			var {CalculationStep,Id}=this.props.selectedTag.toJS();
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
			this.setState({
				relativeDate:value,
				startDate:timeregion.start,
				endDate:timeregion.end,
				dataList:null
			},()=>{
				TagAction.getTagsData(Id, CalculationStep, timeregion.start, timeregion.end)
			})
    }
  }

	_onDateSelectorChanged(startDate, endDate, startTime, endTime){
		var {CalculationStep,Id}=this.props.selectedTag.toJS();
		let dateSelector = this.refs.dateTimeSelector;
		let timeRange = dateSelector.getDateTime();


				if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
		      let isStart = dateSelector.getTimeType();
		      if (isStart) {
		        endDate = CommonFuns.dateAdd(startDate, 30, 'days');
		        endTime = startTime;
		        timeRange.end = new Date(endDate.setHours(endTime, 0, 0, 0));
		      } else {
		        //jacob 2016-04-05: 开始时间不能出现24点
		        startDate = CommonFuns.dateAdd(endDate, -30, 'days');
		        startTime = endTime;
		        if(endTime==24)
		        {
		          startTime = 0;
		          startDate = CommonFuns.dateAdd(startDate, 1, 'days');
		        }
		        timeRange.start = new Date(startDate.setHours(startTime, 0, 0, 0));
		      }
		    }


		this.setState({
					relativeDate:'Customerize',
					startDate:timeRange.start,
					endDate:timeRange.end,
					dataList:null
				},()=>{
					TagAction.getTagsData(Id, CalculationStep, startDate, endDate)
				})
	}

	_onChange(saveSuccessed=false){
		if(this.state.startDate===null){
			var {CalculationStep}=this.props.selectedTag.toJS(),timeRange=null;

				if(InputDataStore.getLatestRawData()===null){
					timeRange=this._initDataTime(CalculationStep,null)
				}else {
					timeRange=this._initDataTime(CalculationStep,InputDataStore.getLatestRawData().UtcTime)
				}

			this.setState({
				...timeRange,
				dataList:InputDataStore.getRawDataList(timeRange.startDate,timeRange.endDate,CalculationStep)
			})
		}
		else {
			this.setState({
				...timeRange,
				dataList:InputDataStore.getDataList(),
				modifyData:saveSuccessed?Immutable.fromJS([]):this.state.modifyData,
				isSaving:false
			})
		}

	}

	_onValueChange(value,index){
		var modifyData=this.state.modifyData,
				utcTime=this.state.dataList.getIn([index,'UtcTime']),
				mIndex=modifyData.find(data=>data.get('UtcTime')===utcTime);
				if(value===''){
					modifyData=mIndex>-1?this.state.modifyData.delete(mIndex):modifyData
				}
				else {
					modifyData=mIndex>-1?this.state.modifyData.setIn([mIndex,"DataValue"],value):this.state.modifyData.push(this.state.dataList.getIn([index]).set('DataValue',value))
				}
		this.setState({
			dataList:this.state.dataList.setIn([index,'DataValue'],value),
			modifyData:modifyData
		})
	}

	_handleSave(){
		if(this.state.modifyData.size!==0){
			this.setState({
				isSaving:true
			},()=>{
				InputDataAction.saveRawData(this.state.dataList,this.state.modifyData.toJS(),this.props.selectedTag.get('Id'))
			})

		}
	}

	_handleExport(){
		InputDataAction.saveRawData(this.state.dataList,this.state.modifyData.toJS(),this.props.selectedTag.get('Id'),()=>{
			this._exportData()
		})
		// this._exportData()
	}

	_exportData(){
			var createElement = window.Highcharts.createElement,
	      discardElement = window.Highcharts.discardElement,
					frame = ReactDom.findDOMNode(this.refs.exportIframe),
					doc = frame.contentDocument;

			let url = Config.ServeAddress + Config.APIBasePath + `/widget/exportrawdata/${this.props.selectedTag.get('Id')}`;
			let form = createElement('form', {
								 method: 'get',
								 action: url,
								 target:'_self'
						 }, {
								 display: 'none'
						 }, doc.body);

						 createElement('input', {
								 type: 'hidden',
								 name: 'startTime',
								 value: CommonFuns.DataConverter.DatetimeToJson(this.state.startDate)
						 }, null, form);

						 createElement('input', {
								 type: 'hidden',
								 name: 'endTime',
								 value: CommonFuns.DataConverter.DatetimeToJson(this.state.endDate)
						 }, null, form);
			 // submit
			 form.submit();

			 // clean up
			 discardElement(form);

	}

	_renderHeader(){
		var styles={
			button:{
				marginRight:'12px',
				height:'30px',
				lineHeight:'30px'
			},
			label:{
				fontSize:'14px'
			},
			refresh: {
    		display: 'inline-block',
    	position: 'relative',
  		},
		};
		var saveIcon=this.state.isSaving?<RefreshIndicator size={20} top={0} status="loading" style={styles.refresh}/>
																:<FontIcon className="icon-save" style={{fontSize:'14px',marginRight:12}}/>;
			return(
				<div className="jazz-input-data-content-panel-header">
					<span>{this.props.selectedTag.get('Name')}</span>
					<span>
						<NewFlatButton label={I18N.Common.Button.Save} labelstyle={styles.label} secondary={true}
							icon={saveIcon} style={styles.button}
							onClick={()=>{this._handleSave()}}
							disabled={this.state.isSaving}/>
						<NewFlatButton label={I18N.Common.Button.Export} labelstyle={styles.label} secondary={true}
								icon={<FontIcon className="icon-export" style={styles.label}/>} style={styles.button}
								onClick={()=>{this._handleExport()}}/>
					</span>
				</div>
			)
	}

	_renderToolBar(){
		var {CalculationStep}=this.props.selectedTag.toJS();
		return(
			<div style={{
					display: 'flex',
					minHeight: '70px',
					height: '70px',
					alignItems:'center',
				}}>
				<div style={{display:'flex'}}>
					<DropDownMenu ref="relativeDate" style={{
					 width: '100px',
					 height:'30px',
					 lineHeight:'30px',
					 backgroundColor:'#ffffff',
					 border:'1px solid #e6e6e6'
				 }}
				 labelStyle={{fontSize:'14px',lineHeight:'30px',paddingRight:'0',color:'#626469',height:'30px',paddingLeft:'0',textAlign:'center'}} iconStyle={{display:'none'}} underlineStyle={{display:'none'}} value={this.state.relativeDate} onChange={this._onRelativeDateChange}>{InputDataStore.getSearchDateByStep(CalculationStep)}</DropDownMenu>

			 <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' startDate={this.state.startDate}  endDate={this.state.endDate} _onDateSelectorChanged={this._onDateSelectorChanged} showTime={true}/>

				</div>
			</div>
		)
	}

	_renderDataTable(){
		var {CalculationStep}=this.props.selectedTag.toJS();
		return(
			<div className="jazz-input-data-content-panel-data-table">
				<div className="jazz-input-data-content-panel-data-table-item">
					<span>{I18N.Setting.Calendar.Time}</span>
					<span style={{borderLeft:'solid 1px #e6e6e6'}}>{getUom(this.props.selectedTag.get('UomId'))}</span>
				</div>
				{this.state.dataList.map((data,index)=>(
					<div className="jazz-input-data-content-panel-data-table-item">
						<span>{CommonFuns.formatDateValueForRawData(CommonFuns.DataConverter.JsonToDateTime(data.get("UtcTime")), CalculationStep)}</span>
						<span><ViewableTextField
													id={data.get("UtcTime")}
						              isViewStatus={false}
						              style={{width: 'auto'}}
						              defaultValue={data.get("DataValue")}
													regex={Regex.TagRule}
													errorMessage={I18N.Setting.DataAnalysis.InputDataErrorTip}
													hintText={I18N.Setting.DataAnalysis.InputDataHintText}
						              didBlur={(val) => {this._onValueChange(val,index)}}
						            /></span>
					</div>
				))}
			</div>
		)
	}

	_renderLeaveDialog(){
		if(this.state.modifyData.size===0){
			InputDataAction.changeSelectedTag();
			return null
		}else {
			var dialogActions = [
				<NewFlatButton
				label={I18N.Common.Button.Save}
				primary={true}
				onClick={()=>{
					this.setState({
						leaveDialogShow:false
					})
					InputDataAction.saveRawData(this.state.dataList,this.state.modifyData.toJS(),this.props.selectedTag.get('Id'),()=>{
						InputDataAction.changeSelectedTag()
					})
					}}
				/>,
				<NewFlatButton
				label={I18N.Common.Button.NotSave}
				secondary={true}
				onClick={()=>{
					this.setState({
						leaveDialogShow:false
					})
					InputDataAction.changeSelectedTag()
				}} style={{
					marginLeft: '20px'
				}}/>
			];
			return(
				<NewDialog actions={dialogActions} modal={true} open={true}>
					{I18N.Setting.DataAnalysis.InputDataLeaveTip}
				</NewDialog>
			)
		}

	}

	componentDidMount(){
		InputDataStore.addChangeListener(this._onChange);
		InputDataStore.addLeaveChangeListener(this._onLeave);
		InputDataAction.getLatestRawData(this.props.selectedTag.get('Id'));
	}

	componentWillReceiveProps(nextProps){
		if(!Immutable.is(nextProps.selectedTag,this.props.selectedTag)){
			this.setState({
				dataList:null,
				startDate:null,
				endDate:null,
				relativeDate:null,
				modifyData:Immutable.fromJS([]),
				leaveDialogShow:false,
				isSaving:false
			},()=>{
				InputDataAction.getLatestRawData(nextProps.selectedTag.get('Id'));
			})
		}
	}

	componentWillUnmount(){
		InputDataStore.removeChangeListener(this._onChange);
		InputDataStore.removeLeaveChangeListener(this._onLeave);
	}

  render(){
		if(this.state.dataList===null){
			return(
				<div className="jazz-input-data--content-panel flex-center">
					<CircularProgress  mode="indeterminate" size={80} />
				</div>
			)
		}
		else {
			return(
				<div className="jazz-input-data-content-panel">
					{this._renderHeader()}
					{this._renderToolBar()}
					{this._renderDataTable()}
					{this.state.leaveDialogShow && this._renderLeaveDialog()}
					<iframe style={{display: 'none'}} ref='exportIframe'></iframe>
				</div>
			)
		}

  }
}


DataPanel.propTypes = {
  selectedTag:React.PropTypes.object,
};
