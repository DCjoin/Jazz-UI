'use strict';
import React, {Component,PropTypes} from 'react';
import moment from 'moment';
import DateTextField from 'controls/DateTextField.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import CommonFuns from 'util/Util.jsx';
import {Type} from 'constants/actionType/KPI.jsx';

export default class MonthValueGroup extends Component {

  render(){
    return(
      <div className="jazz-kpi-calc-month">
        {
          SingleKPIStore.getYearQuotaperiod().map((el,index)=>{
            var props={
                  onBlur:this.props.onClickAway,
                  onChange:(value)=>{
                    value=CommonFuns.thousandsToNormal(value);
                    this.props.onChange(index,value)
                  },
                  date:CommonFuns.formatDateByPeriod(el),
                  regexFn:(value)=>{
                    value=CommonFuns.thousandsToNormal(value);
                    return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText}
                };
            if(el.isBefore(moment(new Date()).format('YYYY-MM-01')) && this.props.IndicatorType===Type.MonthPrediction){
              props.disabled=true;
              props.underlineShow=false;
              props.value='-';
              if(this.props.values && this.props.values[index]){
                    props.value=this.props.values[index].Value===null?'-':CommonFuns.toThousands(this.props.values[index].Value);
                }
            }
            else if(this.props.values && this.props.values[index]){
                  props.value=CommonFuns.toThousands(this.props.values[index].Value);
              }

            return <DateTextField {...props}/>
          })
        }
      </div>
    )

  }
}
MonthValueGroup.propTypes={
  values:PropTypes.array,
  onChange:PropTypes.func,
  IndicatorType:PropTypes.number,
  onClickAway:PropTypes.func
}
MonthValueGroup.defaultProps = {
  value:[]
};
