'use strict';
import React, {Component} from 'react';
import {IconButton} from 'material-ui';
import Immutable from 'immutable';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './RatioActualTag.jsx';
import MonthValue from './MonthValue.jsx';
import Prediction from './GroupPrediction.jsx';
import CommonFuns from 'util/Util.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import ViewableTextField from 'controls/ViewableTextField.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import {Type} from 'constants/actionType/KPI.jsx';

export default class RatioMonthConfig extends Component {

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
        path:`RatioUomId`,
        value:this.state.buildingInfo.get('RatioUomId')
      },{
        path:`RatioCommodityId`,
        value:this.state.buildingInfo.get('RatioCommodityId')
      },{
        path:`NumeratorCommodityId`,
        value:this.state.buildingInfo.get('NumeratorCommodityId')
      }]);
    }

		this.props.onSave();
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

  _renderFooter(){
    return(
      <div className="jazz-kpi-config-edit-step-action">
                             {!this.props.isCreate && <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={this.props.onCancel}/>}
                             <FlatButton label={I18N.Common.Button.Save} disabled={!MonthKPIStore.validateRatioMonthInfo(this.state.buildingInfo)} primary={true} style={this.props.isCreate?{float:'right',minWidth:'68px'}:{float:'right',minWidth:'68px',marginRight:'20px'}}
                                onTouchTap={this._onSave}/>
                      </div>
    )
  }

    getUom(){
    let {UomId,RatioUomId}=this.props.kpiInfo.toJS();
    if(!UomId){UomId=this.state.buildingInfo.get("UomId")}
    if(!RatioUomId){RatioUomId=this.state.buildingInfo.get("RatioUomId")}

      if(UomId && RatioUomId){
      let uom=CommonFuns.getUomById(UomId).Code;
      let ratioUom=CommonFuns.getUomById(RatioUomId).Code;
      if(UomId===RatioUomId) return ''
      return `(${uom}/${ratioUom})`
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
            width: '200%'
          },
          hintStyle: {
            width: '200%'
          }
        };
    return(
      <ViewableTextField {...annualProps}/>
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
    let {isCreate}=this.props;
	  let {HierarchyName}=this.state.buildingInfo.toJS();
    let tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
      isViewStatus:this.props.isViewStatus
    };

    return(
      <div>
          {this._renderIndicator()}
          <ActualTag {...tagProps}/>
          {this._renderMonthValue()}
          {!this.props.isViewStatus && this._renderFooter()}
    </div>
    )
  }
}
import PropTypes from 'prop-types';
RatioMonthConfig.propTypes= {
  kpiInfo:PropTypes.object,
  index:PropTypes.number,
	isCreate:PropTypes.bool,
	onSave:PropTypes.func,
	onCancel:PropTypes.func,
	isViewStatus:PropTypes.bool,
};
