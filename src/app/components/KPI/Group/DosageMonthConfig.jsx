'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import CommonFuns from 'util/Util.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './ActualTag.jsx';
import MonthValue from './MonthValue.jsx';
import Prediction from './GroupPrediction.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import PropTypes from 'prop-types';
export default class DosageMonthConfig extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
		this._onSave = this._onSave.bind(this);
	  }

  state = {
    buildingInfo:null
  };

	_onChange(){
    this.setState({
      buildingInfo:MonthKPIStore.getMonthKpi()
    })
	}

	_onSave(){
    let {UomId}=this.props.kpiInfo.toJS();
    if(UomId){
      GroupKPIAction.merge([{
        path:`Buildings.${this.props.index}`,
        value:this.state.buildingInfo
      }]);
    }else {
      GroupKPIAction.merge([{
        path:`Buildings.${this.props.index}`,
        value:this.state.buildingInfo
      },{
        path:`UomId`,
        value:this.state.buildingInfo.get('UomId')
      },{
				path:`NumeratorCommodityId`,
        value:this.state.buildingInfo.get('NumeratorCommodityId')
			}]);
    }

		this.props.onSave();
	}

	  getUom(){
    let {UomId}=this.props.kpiInfo.toJS();
		if(!UomId){UomId=this.state.buildingInfo.get("UomId")}

      if(UomId) {
        let uom=CommonFuns.getUomById(UomId).Code;
        return uom===''?'':`(${uom})`
      }
      else return ''

  }

  _validateQuota(value){
    value=CommonFuns.thousandsToNormal(value);
    return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
  }

  _validateSavingRate(value){
    value=CommonFuns.thousandsToNormal(value);
    return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
  }

	_renderIndicator(){
    let {IndicatorType}=this.props.kpiInfo.toJS();
    let {AnnualQuota,AnnualSavingRate}=this.state.buildingInfo.toJS();
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        annualTitle=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Indicator,type),
        annualHint=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.IndicatorHint,type),
        title,
        // title=IndicatorType===Type.Quota?`${annualTitle} (${uom})`:`${annualTitle} (%)`,
        value=IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate;

        if(IndicatorType===Type.Quota){
          title=`${annualTitle}${this.getUom()}`
        }else {
          title=`${annualTitle} (%)`
        }
    let  annualProps={
          ref: 'annual',
          isViewStatus: this.props.isViewStatus,
          didChanged:value=>{
                      value=CommonFuns.thousandsToNormal(value);
                      let path=IndicatorType===Type.Quota?'AnnualQuota':'AnnualSavingRate';

											      MonthKPIAction.merge([{
        											path,
        											value
     													 }])
                              },
          defaultValue: CommonFuns.toThousands(value) || '',
          title: title,
          hintText:annualHint,
          autoFocus:true,
          regexFn:IndicatorType===Type.Quota?this._validateQuota:this._validateSavingRate,
          style:{width:'150px'},
          floatingLabelStyle: {
            width: '200%',
            color: '#9fa0a4',
            fontSize: '14px',
          },
          hintStyle: {
            width: '200%',
            fontSize: '14px',
          }
        };
    return(
      <ViewableTextField {...annualProps}/>
    )
  }

  _renderMonthValue(){
		var props={
			kpiInfo:this.props.kpiInfo,
			buildingInfo:this.state.buildingInfo,
			isViewStatus:this.props.isViewStatus
		};
		return(
			<MonthValue {...props}/>
		)
  }

	_renderPrediction(){
		var {HierarchyId,HierarchyName,MonthPredictionValues,TagSavingRates,ActualTagId,ActualTagName}=this.state.buildingInfo.toJS();
		var {Year,NumeratorCommodityId,UomId}=this.props.kpiInfo.toJS();
		if(!UomId){UomId=this.state.buildingInfo.get("UomId")};
		if(!NumeratorCommodityId){NumeratorCommodityId=this.state.buildingInfo.get("NumeratorCommodityId")};
		// var uom=CommonFuns.getUomById(this.props.kpiInfo.get('UomId')).Code;
		var props={
			PredictionSetting:{
				TagSavingRates,MonthPredictionValues
			},
	    Year:Year,
	    uomId:UomId,
			tag:Immutable.fromJS({
				// Id:ActualTagId,
				Name:ActualTagName,
				UomId,
				CommodityId:NumeratorCommodityId
			}),
	    hierarchyId:HierarchyId,
	    hierarchyName:HierarchyName,
			isViewStatus:this.props.isViewStatus,
      buildingInfo:this.state.buildingInfo
		};
		return(
			<Prediction {...props}/>
		)
	}

	  _renderFooter(){
    return(
      <div className="jazz-kpi-config-edit-step-action">
                             {!this.props.isCreate && <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={this.props.onCancel}/>}
                             <FlatButton label={I18N.Common.Button.Save} disabled={!MonthKPIStore.validateMonthInfo(this.state.buildingInfo)} primary={true} style={this.props.isCreate?{float:'right',minWidth:'68px'}:{float:'right',minWidth:'68px',marginRight:'20px'}}
                                onTouchTap={this._onSave}/>
                      </div>
    )
  }

	componentDidMount(){
		MonthKPIStore.addChangeListener(this._onChange);
    let paths=['Buildings',this.props.index];
    MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if( this.props.index!==nextProps.index) {
			this.setState({
				buildingInfo:null
			},()=>{
			let paths=['Buildings',nextProps.index];
    	MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
			})

		}
	}

	componentWillUnmount(){
		MonthKPIStore.removeChangeListener(this._onChange);
	}

  render(){
    if(this.state.buildingInfo===null){
      return <div/>
    }
    let {isCreate,isViewStatus}=this.props;
	  let {HierarchyName}=this.state.buildingInfo.toJS();
    let tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
			isViewStatus
    };

    return(
      <div>
				{this._renderIndicator()}
        <ActualTag {...tagProps}/>
        {this._renderMonthValue()}
				{this._renderPrediction()}
				{!this.props.isViewStatus && this._renderFooter()}
      </div>
    )
  }
}

				  /*<FormBottomBar isShow={true} saveBtnProps={{label:I18N.Platform.Password.Confirm}} allowDelete={false} allowEdit={false} enableSave={MonthKPIStore.validateMonthInfo(this.state.buildingInfo)}
				ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
				cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>*/

DosageMonthConfig.propTypes= {
	kpiInfo:PropTypes.object,
  index:PropTypes.number,
	isCreate:PropTypes.bool,
	onSave:PropTypes.func,
	onCancel:PropTypes.func,
	isViewStatus:PropTypes.bool,
};
