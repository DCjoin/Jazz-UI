'use strict';
import React, {Component} from 'react';
import moment from 'moment';
import DateTextField from 'controls/DateTextField.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import CommonFuns from 'util/Util.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import PropTypes from 'prop-types';
function getDisplayData(value){
  // console.log(value);
  return value===null?'－':CommonFuns.getLabelData(parseFloat(value))
}

export default class MonthValueGroup extends Component {

  render(){
    return(
      <div className="jazz-kpi-calc-month">
        {SingleKPIStore.getYearQuotaperiod()?
          SingleKPIStore.getYearQuotaperiod().map((el,index)=>{
            var props={
                  isViewStatus:this.props.isViewStatus,
                  onBlur:this.props.onClickAway,
                  onChange:(value)=>{
                    value=CommonFuns.thousandsToNormal(value);
                    this.props.onChange(index,value)
                  },
                  date:SingleKPIStore.formatDateByPeriod(el),
                  regexFn:(value)=>{
                    if(value==='－') return ''
                    value=CommonFuns.thousandsToNormal(value);
                    return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText}
                };
            if(el.isBefore(moment(new Date()).format('YYYY-MM-01')) && this.props.IndicatorType===Type.MonthPrediction){
              props.disabled=true;
              props.underlineShow=false;
              props.value='－';
              if(this.props.values && this.props.values[index]){
                    props.value=this.props.values[index].Value===null?'－':CommonFuns.toThousands(this.props.values[index].Value);
                }
            }
            else if(this.props.values && this.props.values[index]){
                  props.value=this.props.isViewStatus?getDisplayData(this.props.values[index].Value):CommonFuns.toThousands(this.props.values[index].Value);
              }

            return <DateTextField {...props}/>
          })
          :<div/>
        }
      </div>
    )

  }
}
MonthValueGroup.propTypes={
  values:PropTypes.array,
  onChange:PropTypes.func,
  IndicatorType:PropTypes.number,
  onClickAway:PropTypes.func,
  isViewStatus:PropTypes.bool,
}
MonthValueGroup.defaultProps = {
  value:[]
};
