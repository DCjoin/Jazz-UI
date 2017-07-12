import React, { Component } from 'react';
import classNames from 'classnames';
import {Type} from 'constants/actionType/KPI.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import {TextField} from 'material-ui';
import CommonFuns from 'util/Util.jsx';

export default class BuildingItem extends Component {

    constructor(props) {
      super(props);
      this._onValueChange = this._onValueChange.bind(this);
    }

    _validateQuota(value){
      value=CommonFuns.thousandsToNormal(value);
      return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
    }

    _validateSavingRate(value){
      value=CommonFuns.thousandsToNormal(value);
      return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
    }

  _onValueChange(event){
    var value=CommonFuns.thousandsToNormal(event.target.value),
        path=this.props.IndicatorType===Type.Quota?'AnnualQuota':'AnnualSavingRate';
    GroupKPIAction.merge([{
      path:`Buildings.${this.props.index}.${path}`,
      value
    }]);
    // this.props.onCalcSum(false)
  }

  getError(value){
      if(this.props.IndicatorType===Type.Quota){
          return this._validateQuota(value)
        }
        else {
          return this._validateSavingRate(value)
        }
      }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.buildingInfo.AnnualQuota===nextProps.buildingInfo.AnnualQuota
      && this.props.buildingInfo.AnnualSavingRate===nextProps.buildingInfo.AnnualSavingRate) return false;
      return true;
  }

	render() {
    let {buildingInfo,onMonthConfigShow,IndicatorType}=this.props;
    let {AnnualQuota,AnnualSavingRate}=buildingInfo;
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        hint=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Input,type),
        value=IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate;
    let valueIsActive=!isNaN(value) && value!==null && value!=='';
    let props={
          value:CommonFuns.toThousands(value) || '',
          //value:'12345',
          hintText:hint,
          errorText:this.getError(value),
          style:{width:'150px',minWidth:'150px'},
          onChange:this._onValueChange,
          // onBlur:onCalcSum.bind(this,true)
                };
    return(
      <tr>
        <td className="column1" title={buildingInfo.HierarchyName}>{buildingInfo.HierarchyName}</td>
        <td className="column2"><TextField {...props}/></td>
        <td className="column3" title={buildingInfo.ActualTagName}>{buildingInfo.ActualTagName}</td>
        <td className="column4" onClick={valueIsActive?onMonthConfigShow.bind(this,true):()=>{}}>
          <div className={classNames({'active':valueIsActive})}>{I18N.Setting.KPI.Group.BuildingConfig.MonthConfig}</div>
          </td>
      </tr>
    )

  }
}
BuildingItem.propTypes = {
  index:React.PropTypes.number,
	buildingInfo:React.PropTypes.object,
  onMonthConfigShow:React.PropTypes.func,
  IndicatorType:React.PropTypes.number,
  // onCalcSum:React.PropTypes.func,
};
