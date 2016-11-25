'use strict';
import React, {Component,PropTypes} from 'react';
import moment from 'moment';
import DateTextField from '../../controls/DateTextField.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';

export default class MonthValueGroup extends Component {

  render(){
    return(
      <div className="jazz-kpi-calc-month">
        {
          KPIStore.getYearQuotaperiod().map((el,index)=>{
            var props={
                  onChange:(value)=>{this.props.onChange(index,value)},
                  date:CommonFuns.formatDateByPeriod(el),
                  regexFn:KPIStore.validateQuota
                };
            if(el.isBefore(moment(new Date()).format('YYYY-MM-01')) && this.props.IndicatorType===Type.MonthPrediction){
              props.disabled=true;
              props.underlineShow=false;
              props.value='-';
              if(this.props.values && this.props.values[index]){
                    props.value=this.props.values[index].Value===null?'-':this.props.values[index].Value;
                }
            }
            else if(this.props.values && this.props.values[index]){
                  props.value=this.props.values[index].Value;
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
}
MonthValueGroup.defaultProps = {
  value:[]
};
