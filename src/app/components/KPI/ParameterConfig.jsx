'use strict';
import React, {Component,PropTypes} from 'react';
import TitleComponent from '../../controls/TtileComponent.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import MonthValueGroup from './MonthValueGroup.jsx';
import Prediction from './Prediction.jsx';

export default class ParameterConfig extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onCalcValue = this._onCalcValue.bind(this);
  }

  _onCalcValue(){
    let {Year,IndicatorType,value,tag}=this.props;
    KPIAction.getCalcValue(KPIStore.getCalcPredicateParam(this.context.router.params.customerId,tag.get('Id'),Year,IndicatorType,value));
  }

  _validateQuota(value){
    return !KPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
  }

  _validateSavingRate(value){
    return !KPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
  }

  _renderIndicatorConfig(uom){
    let {IndicatorType,value,tag,TargetMonthValues,onTargetValueChange}=this.props;
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        annualTitle=I18N.format(I18N.Setting.KPI.Parameter.Annual,type),
        annualHint=I18N.format(I18N.Setting.KPI.Parameter.InputAnnual,type);
    let indicatorProps={
      title:I18N.Setting.KPI.Parameter.Indicator,
      contentStyle:{
        marginLeft:'0'
      }
    },
    annualProps={
      ref: 'annual',
      isViewStatus: false,
      didChanged: value=>{
                  let path=IndicatorType===Type.Quota?'AdvanceSettings.AnnualQuota':'AdvanceSettings.AnnualSavingRate';
                  this.props.onAnnualChange(path,value);
                          },
      defaultValue: value,
      title: `${annualTitle} (${uom})`,
      hintText:annualHint,
      regexFn:IndicatorType===Type.Quota?this._validateQuota:this._validateSavingRate,
    },
    monthProps={
      title:`${I18N.Setting.KPI.Parameter.MonthValue} (${uom})`,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthGroupProps={
      values:TargetMonthValues,
      onChange:onTargetValueChange,
      IndicatorType:Type.MonthValue
    };

    return(
      <TitleComponent {...indicatorProps}>
        <ViewableTextField {...annualProps}/>
          <TitleComponent {...monthProps}>
            <FlatButton
            label={I18N.Setting.KPI.Parameter.CalcViaHistory}
            onTouchTap={this._onCalcValue}
            disabled={value==='' || !this.props.hasHistory}
            style={{border:'1px solid #e4e7e9'}}
            />
          <MonthValueGroup {...monthGroupProps}/>
          </TitleComponent>
      </TitleComponent>
    )
  }

  _renderPredictionConfig(uom){
    let {tag,hierarchyId,hierarchyName}=this.props,
      predictionProps={
      title:I18N.Setting.KPI.Parameter.Prediction,
      contentStyle:{
        marginLeft:'0'
      }
    },
    props={
      PredictionSetting:this.props.PredictionSetting,
      Year:this.props.Year,
      uom:uom,
      tag,hierarchyId,hierarchyName
    };

    return(
      <TitleComponent {...predictionProps}>
        <Prediction {...props}/>
      </TitleComponent>
    )
  }

  render(){
    if(this.props.tag){
      let props={
        title:I18N.Setting.KPI.Parameter.Title
      };
      let uom=CommonFuns.getUomById(this.props.tag.get('UomId')).Code;
      return(
        <TitleComponent {...props}>
          {this._renderIndicatorConfig(uom)}
          {this._renderPredictionConfig(uom)}
        </TitleComponent>
      )
    }
    else {
      return(
        <TitleComponent title={I18N.Setting.KPI.YearAndType.Title} titleStyle={{color:'#e4e7e9'}}/>
      )
    }

  }
}

ParameterConfig.propTypes={
  	tag: PropTypes.object,
    value:PropTypes.string,
    IndicatorType:PropTypes.string,
    onAnnualChange:PropTypes.func,
    onTargetValueChange:PropTypes.func,
    TargetMonthValues:PropTypes.array,
    PredictionSetting:PropTypes.object,
    Year:PropTypes.number,
    hasHistory:PropTypes.bool,
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
};
ParameterConfig.defaultProps = {
  value:''
};
