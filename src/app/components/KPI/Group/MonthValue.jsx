'use strict';
import React, {Component,PropTypes} from 'react';
import classnames from 'classnames';
import TitleComponent from 'controls/TitleComponent.jsx';
// import ViewableTextField from 'controls/ViewableTextField.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import CommonFuns from 'util/Util.jsx';
import MonthValueGroup from '../Single/MonthValueGroup.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';

var customerId=null;

function getDisplayData(value){
  return value===null?'－':CommonFuns.getLabelData(parseFloat(value))
}

export default class MonthValue extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onTargetValueChange = this._onTargetValueChange.bind(this);
    this._onClickAway = this._onClickAway.bind(this);
    this._onCalcValue = this._onCalcValue.bind(this);

  }

  state={
    hasHistory:false,
    calcSum:null,
    isCalc:this.props.buildingInfo.get('ActualTagId')?true:false
  };

  _onChange(){
    this.setState({
      hasHistory:MonthKPIStore.getHasHistory(),
      calcSum:MonthKPIStore.getCalcSumValue()
    })
  }

  _onClickAway(){
    this.setState({
      isCalc:true
    })
  }

  _init(props){
    var {ActualTagId,AnnualSavingRate,ActualRatioTagId,HierarchyId}=props.buildingInfo.toJS(),
        {Year,IndicatorType,IndicatorClass}=props.kpiInfo.toJS();
        if(IndicatorClass===Type.Dosage){
          if(ActualTagId){
            SingleKPIAction.IsAutoCalculable(customerId,ActualTagId,Year);
            if(IndicatorType===Type.SavingRate){
              var params={
                TagId:ActualTagId,
                CustomerId:customerId,
                IndicatorClass,
                Year,
                QuotaType:IndicatorType,
                RatioValue:AnnualSavingRate
              };
              MonthKPIAction.getCalcSumValue(params,HierarchyId);
            }
          }
        }else {
          if(ActualTagId && ActualRatioTagId){
            if(IndicatorType===Type.SavingRate){
              var params={
                TagId:ActualTagId,
                DenominatorTagId:ActualRatioTagId,
                CustomerId:customerId,
                IndicatorClass,
                Year,
                QuotaType:IndicatorType,
                RatioValue:AnnualSavingRate
              };
              MonthKPIAction.getCalcSumValue(params,HierarchyId);
            }
          }
        }

  }

  getUom(){
    let {IndicatorClass,UomId}=this.props.kpiInfo.toJS();
    let {RatioUomId}=this.props.buildingInfo.toJS();
    if(!UomId){UomId=this.props.buildingInfo.get("UomId")};
    if(IndicatorClass===Type.Dosage){
      if(UomId) {
        let uom=CommonFuns.getUomById(UomId).Code;
        return uom===''?'':`(${uom})`
      }
      else return ''
    }
    else if(UomId && RatioUomId){
      let uom=CommonFuns.getUomById(UomId).Code;
      let ratioUom=CommonFuns.getUomById(RatioUomId).Code;
      if(UomId===RatioUomId) return ''
      return `(${uom}/${ratioUom})`
    }
    else return ''
  }

  _onCalcValue(){
    var {ActualTagId,AnnualSavingRate,AnnualQuota}=this.props.buildingInfo.toJS(),
        {Year,IndicatorType}=this.props.kpiInfo.toJS();
        this.setState({
          isCalc:true
        },()=>{
          SingleKPIAction.getCalcValue({
            TagId:ActualTagId,
            CustomerId:customerId,
            Year,
            QuotaType:IndicatorType,
            IndexValue:AnnualQuota,
            RatioValue:AnnualSavingRate
          });
        })
  }

  _onFillValue(value){
    SingleKPIAction.fillMonthValue(value)
  }

  _onTargetValueChange(index,value){
    this.setState({
      isCalc:false
    },()=>{
      MonthKPIAction.merge([{
        path:`TargetMonthValues.${index}.Value`,
        value
      }])
    })

  }

  /*_renderMonth(uom){
    let {IndicatorClass}=this.props.kpiInfo.toJS();
    let {TargetMonthValues}=this.props.buildingInfo.toJS();
    let monthProps={
      title:`${I18N.Kpi.TargetValues}${uom}`,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthGroupProps={
      values:TargetMonthValues,
      onChange:this._onTargetValueChange,
      IndicatorType:Type.MonthValue,
      onClickAway:this._onClickAway
    },
    sumProps={
            title:I18N.format(I18N.Setting.KPI.Group.MonthConfig.MonthValueSum,uom),
            contentStyle:{
              margin:'15px 0 30px 0'
            }
          };

    return(
          <TitleComponent {...monthProps}>
            {IndicatorClass===Type.Dosage && <FlatButton
              label={this.state.hasHistory?I18N.Setting.KPI.Parameter.CalcViaHistory:I18N.Setting.KPI.Parameter.NoCalcViaHistory}
              onTouchTap={this._onCalcValue}
              disabled={!this.state.hasHistory}
              style={{border:'1px solid #e4e7e9'}}
            />}
          {IndicatorClass===Type.Dosage && <TitleComponent {...sumProps}>
              {CommonFuns.toThousands(MonthKPIStore.getValueSum(this.state.isCalc,this.props.buildingInfo.get('TargetMonthValues').toJS())) || '-'}
            </TitleComponent>}
            <MonthValueGroup {...monthGroupProps}/>
          </TitleComponent>
    )
  }

  _renderIndicator(uom){
      let {IndicatorType}=this.props.kpiInfo.toJS();
      if(IndicatorType===Type.Quota){
        let props={
          title:`${I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,I18N.Setting.KPI.Quota,uom)}`,
          contentStyle:{
            marginLeft:'0'
          }
        };
        return(
          <TitleComponent {...props}>
            {CommonFuns.toThousands(this.props.buildingInfo.get('AnnualQuota'))}
          </TitleComponent>
        )
      }
      else {
        let valueProps={
          title:`${I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,I18N.Setting.KPI.SavingRate,' (%)')}`,
          contentStyle:{
            marginLeft:'0'
          }
        },
        annualProps={
          title:`${I18N.format(I18N.Setting.KPI.Group.MonthConfig.AnnualTotal,uom)}`,
          contentStyle:{
            marginLeft:'0'
          },
          style:{
            marginLeft:'30px'
          }
        };
        return(
          <div style={{display:'flex'}}>
            <TitleComponent {...valueProps}>
              {CommonFuns.toThousands(this.props.buildingInfo.get('AnnualSavingRate'))}
            </TitleComponent>
            <TitleComponent {...annualProps}>
              {CommonFuns.toThousands(this.state.calcSum) || '-'}
            </TitleComponent>
          </div>
        )
      }
  }*/


  _validateSavingRate(value){
    value=CommonFuns.thousandsToNormal(value);
    return SingleKPIStore.validateSavingRate(value)
  }

  componentDidMount(){
    customerId=parseInt(this.context.router.params.customerId);
    MonthKPIStore.addChangeListener(this._onChange);
    this._init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let {IndicatorClass}=nextProps.kpiInfo.toJS();
    if(IndicatorClass===Type.Dosage){
      if(nextProps.buildingInfo.get('ActualTagId')!==this.props.buildingInfo.get('ActualTagId') || 
         (this._validateSavingRate(nextProps.buildingInfo.get('AnnualSavingRate')) && nextProps.buildingInfo.get('AnnualSavingRate')!==this.props.buildingInfo.get('AnnualSavingRate'))){
        this._init(nextProps)
      }
    }else {
      if((nextProps.buildingInfo.get('ActualTagId') && nextProps.buildingInfo.get('ActualRatioTagId') &&
        (nextProps.buildingInfo.get('ActualTagId')!==this.props.buildingInfo.get('ActualTagId') ||
        nextProps.buildingInfo.get('ActualRatioTagId')!==this.props.buildingInfo.get('ActualRatioTagId')))
        || (nextProps.buildingInfo.get('AnnualSavingRate') && this._validateSavingRate(nextProps.buildingInfo.get('AnnualSavingRate')) &&
        nextProps.buildingInfo.get('AnnualSavingRate')!==this.props.buildingInfo.get('AnnualSavingRate'))){
        this._init(nextProps)
      }
    }
  }

  componentWillUnmount(){
    MonthKPIStore.removeChangeListener(this._onChange);
  }

  render(){
     var {IndicatorClass,IndicatorType}=this.props.kpiInfo.toJS();
     var {TargetMonthValues,AnnualSavingRate,AnnualQuota}=this.props.buildingInfo.toJS();
     var uom=this.getUom();
     var monthGroupProps={
      values:TargetMonthValues,
      onChange:this._onTargetValueChange,
      IndicatorType:Type.MonthValue,
      onClickAway:this._onClickAway,
      isViewStatus:this.props.isViewStatus
    };

      return(
      <div>
        {IndicatorType===Type.SavingRate && <div style={{fontSize:'14px',color:'#626469',marginTop:'25px'}}>
          {IndicatorClass===Type.Dosage?I18N.Setting.KPI.Group.MonthConfig.AnnualTotal+(uom):I18N.Setting.KPI.Group.MonthConfig.AnnualTotalForRatio+(uom)}</div>}
        {IndicatorType===Type.SavingRate && <div style={{fontSize:'16px',color:'#626469',marginTop:'5px'}}>{CommonFuns.toThousands(this.state.calcSum) || '－'}</div>}
        <div className="jazz-kpi-month-config">
          <div className="jazz-kpi-month-config-month">
            <div className="jazz-kpi-month-config-month-head">
              <div className="jazz-kpi-month-config-month-head-title">{I18N.Setting.KPI.Parameter.MonthValue+uom}</div>

              {!this.props.isViewStatus && IndicatorClass===Type.Dosage && <div className={classnames('jazz-kpi-month-config-month-head-history-btn', {['disabled']:(!AnnualSavingRate && !AnnualQuota)  || !this.state.hasHistory})}
                   onClick={(AnnualSavingRate || AnnualQuota) && this.state.hasHistory?this._onCalcValue:()=>{}}>{I18N.Setting.KPI.Parameter.CalcViaHistory}</div>}
              
              {!this.props.isViewStatus && IndicatorClass===Type.Ratio && IndicatorType===Type.Quota && 
              <div className={classnames('jazz-kpi-month-config-month-head-history-btn', {['disabled']:(!AnnualSavingRate && !AnnualQuota)})}
                   onClick={(AnnualSavingRate || AnnualQuota)?()=>{this._onFillValue(AnnualQuota)}:()=>{}}>{I18N.Setting.KPI.Config.FillBuilding}</div>}
             
             {!this.props.isViewStatus && IndicatorClass===Type.Ratio && IndicatorType===Type.SavingRate && 
              <div className={classnames('jazz-kpi-month-config-month-head-history-btn', {['disabled']:this.state.calcSum===null})}
                   onClick={this.state.calcSum!==null?()=>{this._onFillValue(this.state.calcSum)}:()=>{}}>{I18N.Setting.KPI.Config.FillAnnual}</div>}          
            </div>      
            <MonthValueGroup {...monthGroupProps}/>
          </div>
          {IndicatorClass===Type.Dosage && <div className="sum">
            {I18N.SumWindow.Sum + "：" 
            + (getDisplayData(MonthKPIStore.getValueSum(this.state.isCalc,this.props.buildingInfo.get('TargetMonthValues').toJS())))}
          </div>}
        </div>
       </div>

      )
  }
}

MonthValue.propTypes={
  kpiInfo:React.PropTypes.object,
  buildingInfo:React.PropTypes.object,
  isViewStatus:React.PropTypes.bool,
};
