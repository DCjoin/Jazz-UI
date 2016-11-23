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
                  onChange:this.props.onChange,
                  date:CommonFuns.formatDateByPeriod(el)
                };
            if(el.isBefore(moment(new Date()).format('YYYY-MM-01')) && this.props.IndicatorType===Type.SavingRate){
              props.disabled=true;
              props.underlineShow=false;
              props.value='-'
            }
            else if(this.props.values && this.props.values.getIn[index]){
                  props.value=this.props.values.getIn[index,'Value'];
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
