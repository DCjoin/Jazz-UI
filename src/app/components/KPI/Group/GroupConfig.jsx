import React, { Component } from 'react';
import TitleComponent from 'controls/TitleComponent.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import CommonFuns from 'util/Util.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx'

export default class GroupConfig extends Component {

  _validateQuota(value){
    return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
  }

  _validateSavingRate(value){
    return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
  }

  _renderConfig(){
    let {UomId,IndicatorType,AnnualQuota,AnnualSavingRate}=this.props.kpiInfo.toJS();
    let uom=CommonFuns.getUomById(UomId).Code;
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        annualTitle=I18N.format(I18N.Setting.KPI.Group.GroupConfig.Annual,type),
        annualHint=I18N.format(I18N.Setting.KPI.Group.GroupConfig.InputAnnual,type),
        title=IndicatorType===Type.Quota?`${annualTitle} (${uom})`:`${annualTitle} (%)`,
        value=IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate;
    let  annualProps={
          ref: 'annual',
          isViewStatus: false,
          didChanged:value=>{
                      let path=IndicatorType===Type.Quota?'AnnualQuota':'AnnualSavingRate';
                      GroupKPIAction.merge([{
                        path,
                        value
                      }]);
                              },
          defaultValue: !isNaN(value) && value!==null?value:value || '',
          title: title,
          hintText:annualHint,
          regexFn:IndicatorType===Type.Quota?this._validateQuota:this._validateSavingRate,
        };
    return(
      <ViewableTextField {...annualProps}/>
    )
  }

	render() {
    var isActive=GroupKPIStore.IsActive(this.props.status,this.props.kpiInfo);
    var props={
      title:I18N.Setting.KPI.Group.GroupConfig.Title
    };
    if(isActive){
      return(
        <TitleComponent {...props}>
          {this._renderConfig()}
        </TitleComponent>
      )
    }
    else {
      return(
        <TitleComponent {...props} titleStyle={{color:'#e4e7e9'}}/>
      )
    }

  }
}
GroupConfig.propTypes = {
	status:React.PropTypes.string,
	kpiInfo:React.PropTypes.object,
};
