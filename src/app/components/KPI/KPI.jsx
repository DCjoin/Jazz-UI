'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import TagSelect from './TagSelect.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx'
import BasicConfig from './BasicConfig.jsx';
import TitleComponent from '../../controls/TtileComponent.jsx';
import YearAndTypeConfig from './YearAndTypeConfig.jsx';
import ParameterConfig from './ParameterConfig.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';

export default class KPI extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
		this._onDialogDismiss = this._onDialogDismiss.bind(this);
		this._onTagSave = this._onTagSave.bind(this);
		this._onSelectTagShow = this._onSelectTagShow.bind(this);
		this._onTargetValueChange = this._onTargetValueChange.bind(this);
  }

  state = {
    tageSelectShow:false,
		tag:null,
		kpiInfo:Immutable.fromJS({}),
  };

	_onChange(){
		this.setState({
			kpiInfo:KPIStore.getKpiInfo()
		})
	}

	_onNameChange(value){
		KPIAction.merge([{
			path:'IndicatorName',
			value
		}])
	}

	_onYearChange(value){
		if(this.props.isCreate){
			KPIAction.merge([{
				path:'AdvanceSettings.Year',
				value
			}])
		}
		else {
			KPIAction.getKPI(this.props.kpiId,value)
		}
	}

	_onIndicatorTypeChange(ev,value){
		KPIAction.merge([{
			path:'AdvanceSettings.IndicatorType',
			value
		}])
	}

	_onAnnualChange(path,value){
		KPIAction.merge([{
			path,
			value
		}])
	}

	_onTargetValueChange(index,value){
		let target=this.state.kpiInfo.getIn(['AdvanceSettings','TargetMonthValues',index]),
				period=KPIStore.getYearQuotaperiod();
		if(target){
			KPIAction.merge([{
				path:`AdvanceSettings.TargetMonthValues.${index}.Value`,
				value
			}])
		}
		else {
			KPIAction.merge([{
				path:`AdvanceSettings.TargetMonthValues.${index}.Value`,
				value
			},
			{
				path:`AdvanceSettings.TargetMonthValues.${index}.Month`,
				value:period[index]
			}
		])
		}

	}

	_onPredictioChange(index,value){
		let target=this.state.kpiInfo.getIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues',index]),
				period=KPIStore.getYearQuotaperiod();
		if(target){
			KPIAction.merge([{
				path:`AdvanceSettings.PredictionSetting.MonthPredictionValues.${index}.Value`,
				value
			}])
		}
		else {
			KPIAction.merge([{
				path:`AdvanceSettings.PredictionSetting.MonthPredictionValues.${index}.Value`,
				value
			},
			{
				path:`AdvanceSettings.PredictionSetting.MonthPredictionValues.${index}.Month`,
				value:period[index]
			}
		])
		}
	}

  _onTagSave(tag){
		this.setState({
			tageSelectShow:false,
			tag:tag
		},()=>{
			KPIAction.merge([{
				path:'ActualTagId',
				value:tag.get('Id')
			},{
				path:'ActualTagName',
				value:tag.get('Name')
			}])
		})
  }

  _onDialogDismiss(){
    this.setState({
      tageSelectShow:false
    })
  }

	_onSelectTagShow(){
		this.setState({
			tageSelectShow:true
		})
	}

	componentWillMount(){
		let {isCreate,kpiId,year}=this.props;
		KPIAction.getQuotaperiodByYear(this.context.router.params.customerId,year);
		if(!isCreate){
			KPIAction.getKPI(kpiId,year)
		}
		// KPIAction.merge([{
		// 	path:'CustomerId',
		// 	value:customerId
		// },{
		// 	path:'HierarchyId',
		// 	value:hierarchyId
		// },{
		// 	path:'HierarchyName',
		// 	value:hierarchyName
		// }
	// ])
	}

	componentDidMount(){
		KPIStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		KPIStore.removeChangeListener(this._onChange);
	}

  render(){
    let {hierarchyId,hierarchyName,isCreate}=this.props;
		let {IndicatorName,ActualTagName,ActualTagId}=this.state.kpiInfo.toJS();
		let AdvanceSettings=this.state.kpiInfo.get('AdvanceSettings') || Immutable.fromJS({});
		let {IndicatorType,AnnualQuota,AnnualSavingRate,TargetMonthValues,Year,PredictionSetting}=AdvanceSettings.toJS();

    let titleProps={
			title:`${hierarchyName}-${isCreate?I18N.Setting.KPI.create:I18N.Setting.KPI.edit}`,
			contentStyle:{
				marginLeft:'0'
			},
			titleStyle:{
				fontSize:'16px'
			},
			className:'jazz-kpi-config-wrap'
		},
				tagProps={
      		hierarchyId,
      		hierarchyName,
      		onSave:this._onTagSave,
      		onCancel:this._onDialogDismiss
    			},
				basicProps={
					onNameChange: this._onNameChange,
					isCreate:this.props.isCreate,
					name:IndicatorName,
					onSelectTagShow:this._onSelectTagShow,
					tagName:ActualTagName,
				},
				yearAndTypeProps={
					tagId:ActualTagId,
					onYearChange:this._onYearChange,
					onIndicatorTypeChange:this._onIndicatorTypeChange,
					IndicatorType:IndicatorType,
					Year:Year || this.props.year,
				},
				parameterProps={
					tag:this.state.tag,
					IndicatorType:IndicatorType,
					onAnnualChange:this._onAnnualChange,
					value:IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate,
					onTargetValueChange:this._onTargetValueChange,
					onPredictioChange:this._onPredictioChange,
					TargetMonthValues:TargetMonthValues,
					Year:Year || this.props.year,
					PredictionSetting:PredictionSetting,
				};
    return(
      <TitleComponent {...titleProps}>
				<BasicConfig {...basicProps}/>
				<YearAndTypeConfig {...yearAndTypeProps}/>
				<ParameterConfig {...parameterProps}/>
        {this.state.tageSelectShow && <TagSelect {...tagProps}/>}
      </TitleComponent>
    )
  }
}
KPI.propTypes = {
	hierarchyId:React.PropTypes.number,
	hierarchyName:React.PropTypes.string,
	kpiId:React.PropTypes.number,
	isCreate:React.PropTypes.bool,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
	year:React.PropTypes.number,
};
KPI.defaultProps = {
	hierarchyId: 100016,
	hierarchyName:'楼宇BADGOOD',
	year:2016,
	isCreate:true
};
