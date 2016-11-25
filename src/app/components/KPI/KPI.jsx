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
import {Type,Status} from '../../constants/actionType/KPI.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Dialog from '../../controls/NewDialog.jsx';

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
		this._onRatesSelectTagShow = this._onRatesSelectTagShow.bind(this);
		this._onRatesSave = this._onRatesSave.bind(this);
		this._onPredictioChange = this._onPredictioChange.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onError = this._onError.bind(this);
  }

  state = {
    tageSelectShow:false,
		ratesTageSelectShow:false,
		tag:null,
		kpiInfo:Immutable.fromJS({}),
		hasHistory:false,
		errorTitle: null,
		errorContent: null,
  };

	_onChange(){
		this.setState({
			kpiInfo:KPIStore.getKpiInfo(),
			hasHistory:KPIStore.getHasHistory()
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
			KPIAction.IsAutoCalculable(this.state.tag.get('Id'),value)
		}
		else {
			KPIAction.getKPI(this.props.kpiId,value),
			KPIAction.IsAutoCalculable(this.state.tag.get('Id'),value)
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
		let preTag=this.state.tag,
				year=this.state.kpiInfo.getIn(['AdvanceSettings','Year']) || (new Date()).getFullYear();
		this.setState({
			tageSelectShow:false,
			tag:tag
		},()=>{
			let params=[{
				path:'ActualTagId',
				value:tag.get('Id')
			},{
				path:'ActualTagName',
				value:tag.get('Name')
			},{
				path:'UomId',
				value:tag.get('UomId')
			},{
				path:'CommodityId',
				value:tag.get('CommodityId')
			}];
			if(preTag===null){
				params.push({
					path:'AdvanceSettings.Year',
					value:(new Date()).getFullYear()
				});
				params.push({
					path:'AdvanceSettings.IndicatorType',
					value:Type.Quota
				});
			}
			KPIAction.merge(params);
			KPIAction.IsAutoCalculable(tag.get('Id'),year);
		})
  }

  _onDialogDismiss(){
    this.setState({
      tageSelectShow:false,
			ratesTageSelectShow:false
    })
  }

	_onSelectTagShow(){
		this.setState({
			tageSelectShow:true
		})
	}

	_onRatesSelectTagShow(){
		this.setState({
			ratesTageSelectShow:true
		})
	}

	_onRatesSave(tag){
		this.setState({
			ratesTageSelectShow:false
		},()=>{
			KPIAction.merge([{
				path:'AdvanceSettings.PredictionSetting.TagSavingRates',
				value:Immutable.fromJS({
					TagId:tag.get('Id'),
					TagName:tag.get('Name'),
					SavingRate:0
				}),
				status:Status.ADD
			}])
		})
	}

	_onSuccess(){
		this.props.onSave()
	}

	_onSave(){
		let kpi=KPIStore.transit(this.state.kpiInfo);
		if(this.props.isCreate){
			KPIAction.createKpi(this.context.router.params.customerId,this.props.hierarchyId,this.props.hierarchyName,kpi);
		}
		else {
			KPIAction.updateKpi(this.context.router.params.customerId,this.props.hierarchyId,this.props.hierarchyName,kpi)
		}
	}

	_onError(error) {
		this.setState({
			errorTitle: error.title,
			errorContent: error.content,
		});
	}

	_renderErrorDialog() {
    var that = this;
    var onClose = function() {
      that.setState({
        errorTitle: null,
        errorContent: null,
      });
    };
    if (!!this.state.errorTitle) {
      return (<Dialog
        ref = "_dialog"
        title={this.state.errorTitle}
        modal={false}
        open={!!this.state.errorTitle}
        onRequestClose={onClose}
        >
        {this.state.errorContent}
      </Dialog>);
    } else {
      return null;
    }
  }

	componentWillMount(){
		let {isCreate,kpiId,year}=this.props;
		KPIAction.getKPIPeriodByYear(this.context.router.params.customerId,year);
		if(!isCreate){
			KPIAction.getKPI(kpiId,year)
		}
	}

	componentDidMount(){
		KPIStore.addChangeListener(this._onChange);
		KPIStore.addSuccessListener(this._onSuccess);
		KPIStore.addErrorListener(this._onError);
	}

	componentWillUnmount(){
		KPIStore.removeChangeListener(this._onChange);
		KPIStore.removeSuccessListener(this._onSuccess);
		KPIStore.removeErrorListener(this._onError);

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
					key:'tagselect',
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
					hasHistory:this.state.hasHistory,
					onSelectTagShow:this._onRatesSelectTagShow,
				},
				ratesTagProps={
						key:'ratestagselect',
		      		hierarchyId,
		      		hierarchyName,
							tag:this.state.tag,
		      		onSave:this._onRatesSave,
		      		onCancel:this._onDialogDismiss
		    			};
    return(
      <TitleComponent {...titleProps}>
				<BasicConfig {...basicProps}/>
				<YearAndTypeConfig {...yearAndTypeProps}/>
				<ParameterConfig {...parameterProps}/>
        {this.state.tageSelectShow && <TagSelect {...tagProps}/>}
				{this.state.ratesTageSelectShow && <TagSelect {...ratesTagProps}/>}
				  <FormBottomBar isShow={true} allowDelete={false} allowEdit={false} enableSave={KPIStore.validateKpiInfo(this.state.kpiInfo)}
				ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
				cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
			{this._renderErrorDialog()}
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
