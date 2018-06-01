import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import Immutable from 'immutable';
import BuildingConfig from './building_config.jsx';
import GroupConfig from './GroupConfig.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';

import CircularProgress from 'material-ui/CircularProgress';

import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import BasicConfig from './BasicConfig.jsx';

import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import Dialog from 'controls/NewDialog.jsx';
import DosageMonthConfig from './DosageMonthConfig.jsx';
import RatioMonthConfig from './RatioMonthConfig.jsx';



var customerId=null;


function formatValue(value){
  if(value===null) return null;
  return value*1
}

function Header({name, indicatorClass, indicatorType,onClose}) {
	return (
		<header style={{marginLeft: 20,marginTop: 20, marginBottom: 10}}>
			<div style={{display:'flex',flexDirection:'row'}}>
				<div className='hiddenEllipsis' style={{fontWeight:'600',fontSize:'16px',color:'#0f0f0f'}}>{name}</div>
        <div style={{borderRadius: '1px',border: 'solid 1px #32ad3c',color:'#32ad3c',padding:'4px 8px',fontSize:'10px',marginLeft:'20px'}}>
          {`${indicatorClass===Type.Dosage?I18N.Setting.KPI.YearAndType.DosageAbbr:I18N.Setting.KPI.YearAndType.RatioAbbr} · ${indicatorType===Type.Quota?I18N.Setting.KPI.YearAndType.Quota:I18N.Setting.KPI.YearAndType.SavingRate}`}
        </div>
			</div>
			<IconButton style={{position: 'absolute', right: 14, top: 0}} iconClassName='icon-close' onClick={onClose}/>
		</header>
	);
}
import PropTypes from 'prop-types';
export default class EditConfig extends Component {

	static contextTypes = {
		router: PropTypes.object,
	};

	constructor(props) {
		super(props);
		// this._onChange = this._onChange.bind(this);
		// this._onSuccess = this._onSuccess.bind(this);
		// this._onError = this._onError.bind(this);
		this._onSave = this._onSave.bind(this);
		// this._onMonthConfig = this._onMonthConfig.bind(this);
	}

	state={
		// kpiInfo:this.props.kpiInfo,
		configStep:null,
		isNew:!this.props.kpiInfo.get("AnnualQuota") && !this.props.kpiInfo.get("AnnualSavingRate"),
		configBuildingIndex:null
	};

	_onSave(){		
				GroupKPIAction.update();
				this.props.onSave();
	}


	_renderGroupConfig(){
		let props={
			ref:'group',
			isNew:this.state.isNew,
			configStep:this.state.configStep,
			kpiInfo:this.props.kpiInfo,
			onEdit:()=>{this.setState({configStep:1})},
			onCancel:()=>{this.setState({configStep:null})},
			onSave:()=>{this.setState({configStep:this.state.isNew?2:null})}
		};
		return(
			<GroupConfig {...props}/>
		)
	}

	_renderBuildingConfig(){
		let props={
			configStep:this.state.configStep,
			isNew:this.state.isNew,
			kpiInfo:this.props.kpiInfo,
			onEdit:(index)=>{this.setState({configStep:2,configBuildingIndex:index})},
			onCancel:()=>{this.setState({configStep:null,configBuildingIndex:null})},
			onSave:()=>{this.setState({configStep:null,configBuildingIndex:null})},
			year:this.props.year,
			isGroupChanged:()=>{
				return this.refs.group && (formatValue(GroupKPIStore.getRawData().getIn(["GroupKpiSetting","AdvanceSettings","AnnualQuota"]))!==formatValue(this.refs.group.state.kpiInfo.get("AnnualQuota"))
													 || formatValue(GroupKPIStore.getRawData().getIn(["GroupKpiSetting","AdvanceSettings","AnnualSavingRate"]))!==formatValue(this.refs.group.state.kpiInfo.get("AnnualSavingRate")))
			}
			
		};
		return(
			<BuildingConfig {...props}/>
		)
	}

	componentWillMount(){
		customerId=parseInt(this.context.router.params.customerId);
	}

	componentDidMount(){
		// GroupKPIStore.addChangeListener(this._onChange);
		// GroupKPIStore.addSuccessListener(this._onSuccess);
		// GroupKPIStore.addErrorListener(this._onError);
		if(!this.state.isNew){
			var {AnnualQuota,AnnualSavingRate}=this.props.kpiInfo.getIn(["Buildings",0]).toJS();
			if(!AnnualQuota && !AnnualSavingRate){
				this.setState({
					configStep:2
				})
			}
		}else{
			this.setState({
				configStep:1
			})
		}
	}

	// componentWillReceiveProps(nextProps, nextContext) {
	// 	if(!Immutable.is(nextProps.kpiInfo,this.props.kpiInfo)){
  //     this.setState({
  //       kpiInfo:nextProps.kpiInfo,
	// 			isNew:!nextProps.kpiInfo.get("AnnualQuota") && !nextProps.kpiInfo.get("AnnualSavingRate"),
	// 			configStep:(!nextProps.kpiInfo.get("AnnualQuota") && !nextProps.kpiInfo.get("AnnualSavingRate"))?1:2
  //     })
  //   }
	// }

	componentWillUnmount(){
		// GroupKPIStore.removeChangeListener(this._onChange);
		// GroupKPIStore.removeSuccessListener(this._onSuccess);
		// GroupKPIStore.removeErrorListener(this._onError);
	}

	render() {
    var {IndicatorName,IndicatorClass, IndicatorType}=this.props.kpiInfo.toJS();
    return(
      <div className="jazz-kpi-config-edit">
        <div className="jazz-main-content">
         	<Header name={I18N.format(I18N.Setting.KPI.Config.Header,IndicatorName,this.props.year)}  
                  indicatorClass={IndicatorClass} indicatorType={IndicatorType}
                  onClose={()=>{
												var close=true;
												if(this.state.configStep===1 && 
													 (formatValue(GroupKPIStore.getRawData().getIn(["GroupKpiSetting","AdvanceSettings","AnnualQuota"]))!==formatValue(this.refs.group.state.kpiInfo.get("AnnualQuota"))
													 || formatValue(GroupKPIStore.getRawData().getIn(["GroupKpiSetting","AdvanceSettings","AnnualSavingRate"]))!==formatValue(this.refs.group.state.kpiInfo.get("AnnualSavingRate")))) {
														close=false;
														this.setState({
															closeDlgShow: true
														});
													} 
													if(this.state.configStep===2 && !Immutable.is(this.props.kpiInfo.getIn(["Buildings",this.state.configBuildingIndex]),MonthKPIStore.getMonthKpi())){
														close=false;
														this.setState({
															closeDlgShow: true
														});
													}
													if(close){this._onSave();}
									
					}}/>
          {this._renderGroupConfig()}
					{this._renderBuildingConfig()}
					<NewDialog open={this.state.closeDlgShow} actionsContainerStyle={{textAlign: 'right',marginRight:'20px',marginBottom:'20px'}} actions={[
					<NewFlatButton primary label={I18N.Common.Button.Confirm} onClick={this._onSave}/>,
					<NewFlatButton style={{marginLeft: 20}} secondary label={I18N.Common.Button.Cancel2} onClick={() =>{
						this.setState({closeDlgShow:false})
					}}/>
				]}>{I18N.Setting.KPI.Config.LeaveTip}</NewDialog>
        </div>
      </div>
    )
	}
}
EditConfig.propTypes= {
	kpiInfo:PropTypes.object,
	year:PropTypes.number,
	//编辑时，需要name
	name:PropTypes.string,
	onSave:PropTypes.func,
	onCancel:PropTypes.func,
	// onPending:PropTypes.func,
};
