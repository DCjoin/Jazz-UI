'use strict';
import React, {Component,PropTypes} from 'react';
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
    calcSum:'-',
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
    var {ActualTagId,AnnualSavingRate}=props.buildingInfo.toJS(),
        {Year,IndicatorType}=props.kpiInfo.toJS();
    if(ActualTagId){
      SingleKPIAction.IsAutoCalculable(customerId,ActualTagId,Year);
      if(IndicatorType===Type.SavingRate){
        var params={
          TagId:ActualTagId,
          CustomerId:customerId,
          Year,
          QuotaType:IndicatorType,
          RatioValue:AnnualSavingRate
        };
        MonthKPIAction.getCalcSumValue(params);
      }
    }
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

  _renderMonth(uom){
    let {TargetMonthValues}=this.props.buildingInfo.toJS();
    let monthProps={
      title:`${I18N.Setting.KPI.Parameter.MonthValue} (${uom})`,
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
            <FlatButton
              label={this.state.hasHistory?I18N.Setting.KPI.Parameter.CalcViaHistory:I18N.Setting.KPI.Parameter.NoCalcViaHistory}
              onTouchTap={this._onCalcValue}
              disabled={!this.state.hasHistory}
              style={{border:'1px solid #e4e7e9'}}
            />
            <TitleComponent {...sumProps}>
              {CommonFuns.toThousands(MonthKPIStore.getValueSum(this.state.isCalc,this.props.buildingInfo.get('TargetMonthValues').toJS())) || '-'}
            </TitleComponent>
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
          title:`${I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,I18N.Setting.KPI.SavingRate,'%')}`,
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
              {CommonFuns.toThousands(this.state.calcSum)}
            </TitleComponent>
          </div>
        )
      }
  }

  componentDidMount(){
    customerId=parseInt(this.context.router.params.customerId);
    MonthKPIStore.addChangeListener(this._onChange);
    this._init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.buildingInfo.get('ActualTagId')!==this.props.buildingInfo.get('ActualTagId')){
      this._init(nextProps)
    }
  }

  componentWillUnmount(){
    MonthKPIStore.removeChangeListener(this._onChange);
  }

  render(){
      let props={
        title:I18N.Setting.KPI.Parameter.MonthValue,
        contentStyle:{
          marginLeft:'0',
          marginTop:'15px'
          },
        };
      let uom=CommonFuns.getUomById(this.props.kpiInfo.get('UomId')).Code;
      return(
        <TitleComponent {...props}>
          {this._renderIndicator(uom)}
          {this._renderMonth(uom)}
        </TitleComponent>
      )
  }
}

MonthValue.propTypes={
  kpiInfo:React.PropTypes.object,
  buildingInfo:React.PropTypes.object,
};
