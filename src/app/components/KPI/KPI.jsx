'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import CircularProgress from 'material-ui/CircularProgress';
import TagSelect from './TagSelect.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx'
import BasicConfig from './BasicConfig.jsx';
import TitleComponent from '../../controls/TitleComponent.jsx';
import YearAndTypeConfig from './YearAndTypeConfig.jsx';
import ParameterConfig from './ParameterConfig.jsx';
import {Type,Status} from '../../constants/actionType/KPI.jsx';
import FormBottomBar from '../../controls/FormBottomBar.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Dialog from '../../controls/NewDialog.jsx';
import {DataConverter} from '../../util/Util.jsx';

var customerId=null;

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
		this._onSave = this._onSave.bind(this);
		this._onError = this._onError.bind(this);
		this._onSuccess = this._onSuccess.bind(this);
		this._onYearChange = this._onYearChange.bind(this);


  }

  state = {
    tageSelectShow:false,
		tag:null,
		kpiInfo:Immutable.fromJS({}),
		hasHistory:false,
		errorTitle: null,
		errorContent: null,
  };

	_onChange(){
		if(this.state.kpiInfo.size===0 && KPIStore.getKpiInfo().size!==0 && !this.props.isCreate){
			let {ActualTagId,ActualTagName,UomId,CommodityId}=KPIStore.getKpiInfo().toJS();
			this.setState({
				tag:Immutable.fromJS({
					Id:ActualTagId,
					Name:ActualTagName,
					UomId,CommodityId
				})
			},()=>{
				KPIAction.IsAutoCalculable(this.context.router.params.customerId,ActualTagId,this.props.year)
			})
		}
		this.setState({
			kpiInfo:KPIStore.getKpiInfo(),
			hasHistory:KPIStore.getHasHistory(),
		})
	}

	_onNameChange(value){
		KPIAction.merge([{
			path:'IndicatorName',
			value
		}])
	}

	_onYearChange(value){
		if(!this.props.isCreate){
			KPIAction.getKPI(this.props.kpiId,value);
		}
		KPIAction.IsAutoCalculable(customerId,this.state.tag.get('Id'),value);
		KPIAction.getKPIPeriodByYear(customerId,value);

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
		let TargetMonthValues=this.state.kpiInfo.getIn(['AdvanceSettings','TargetMonthValues']),
				period=KPIStore.getYearQuotaperiod();
		if(TargetMonthValues){
			KPIAction.merge([{
				path:`AdvanceSettings.TargetMonthValues.${index}`,
				value:Immutable.fromJS({
					Month:KPIStore.DatetimeToJson(period[index]._d),
					Value:value
				})
			}])
		}
		else {
					KPIAction.merge([{
						path:'AdvanceSettings.TargetMonthValues',
						index:index,
						length:12,
						value:Immutable.fromJS({
							Month:KPIStore.DatetimeToJson(period[index]._d),
							Value:value,
						}),
						status:Status.ADD
					}])
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
			KPIAction.IsAutoCalculable(customerId,tag.get('Id'),year);
		})
  }

  _onDialogDismiss(){
    this.setState({
      tageSelectShow:false,
			// ratesTageSelectShow:false
    })
  }

	_onSelectTagShow(){
		this.setState({
			tageSelectShow:true
		})
	}

	// _onRatesSelectTagShow(){
	// 	this.setState({
	// 		ratesTageSelectShow:true
	// 	})
	// }

	// _onRatesSave(tag){
	// 	this.setState({
	// 		ratesTageSelectShow:false
	// 	},()=>{
	// 		KPIAction.merge([{
	// 			path:'AdvanceSettings.PredictionSetting.TagSavingRates',
	// 			value:Immutable.fromJS({
	// 				TagId:tag.get('Id'),
	// 				TagName:tag.get('Name'),
	// 				SavingRate:0
	// 			}),
	// 			status:Status.ADD
	// 		}])
	// 	})
	// }

	_onSuccess(year){
		this.props.onSave(year)
	}

	_onSave(){
		let kpi=KPIStore.transit(this.state.kpiInfo);
		if(this.props.isCreate){
			KPIAction.createKpi(customerId,this.props.hierarchyId,this.props.hierarchyName,kpi);
		}
		else {
			KPIAction.updateKpi(kpi)
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
		customerId=this.context.router.params.customerId;
		let {isCreate,kpiId,year}=this.props;
		KPIAction.getKPIPeriodByYear(customerId,year);
		if(!isCreate){
			KPIAction.getKPI(kpiId,year);
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

		if(this.state.kpiInfo.size===0 && !isCreate){
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
		};

		let {IndicatorName,ActualTagName,ActualTagId,UomId,CommodityId}=this.state.kpiInfo.toJS();
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
					TargetMonthValues:TargetMonthValues,
					Year:Year || this.props.year,
					PredictionSetting:PredictionSetting,
					hasHistory:this.state.hasHistory,
					hierarchyId,
					hierarchyName,
				};
				if(this.state.kpiInfo && this.state.kpiInfo.size>0 && !this.props.isCreate){
					parameterProps.tag=Immutable.fromJS({
						Id:ActualTagId,
						Name:ActualTagName,
						UomId,CommodityId
					})
				}

    return(
      <TitleComponent {...titleProps}>
				<BasicConfig {...basicProps}/>
				<YearAndTypeConfig {...yearAndTypeProps}/>
				<ParameterConfig {...parameterProps}/>
        {this.state.tageSelectShow && <TagSelect {...tagProps}/>}
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
