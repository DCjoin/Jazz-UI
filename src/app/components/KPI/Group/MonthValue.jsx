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
  }

  state={
    hasHistory:false,
    calcSum:'-'
  };

  _onChange(){
    this.setState({
      hasHistory:MonthKPIStore.getHasHistory(),
      calcSum:MonthKPIStore.getCalcSumValue()
    })
  }

  _init(){
    var {ActualTagId,AnnualSavingRate}=this.props.buildingInfo.toJS(),
        {Year,IndicatorType}=this.props.kpiInfo.toJS();
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
    let {Year,IndicatorType,value,tag}=this.props;
    SingleKPIAction.getCalcValue();
  }

  _onTargetValueChange(index,value){
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
      IndicatorType:Type.MonthValue
    };

    return(
          <TitleComponent {...monthProps}>
            <FlatButton
              label={this.state.hasHistory?I18N.Setting.KPI.Parameter.CalcViaHistory:I18N.Setting.KPI.Parameter.NoCalcViaHistory}
              onTouchTap={this._onCalcValue}
              disabled={value==='' || !value || !this.state.hasHistory}
              style={{border:'1px solid #e4e7e9'}}
            />
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
            {this.props.buildingInfo.get('AnnualQuota')}
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
              {this.props.buildingInfo.get('AnnualSavingRate')}
            </TitleComponent>
            <TitleComponent {...annualProps}>
              {this.state.calcSum}
            </TitleComponent>
          </div>
        )
      }
  }

  componentDidMount(){
    customerId=parseInt(this.context.router.params.customerId);
    MonthKPIStore.addChangeListener(this._onChange);
    this._init()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.buildingInfo.get('ActualTagId')!==this.props.buildingInfo.get('ActualTagId')){
      this._init()
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
