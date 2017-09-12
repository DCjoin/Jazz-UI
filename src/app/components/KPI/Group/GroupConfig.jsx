import React, { Component } from 'react';
import Immutable from 'immutable'; 
import {find} from 'lodash-es';
import {Type} from 'constants/actionType/KPI.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import CommonFuns from 'util/Util.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';

function getCustomerById(customerId) {
  return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}

export default class GroupConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};
  
  state={
    kpiInfo:this.props.kpiInfo
  }

  _validateQuota(value){
    value=CommonFuns.thousandsToNormal(value);
    return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
  }

  _validateSavingRate(value){
    value=CommonFuns.thousandsToNormal(value);
    return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
  }

  getUom(){
    let {IndicatorClass,UomId,RatioUomId}=this.state.kpiInfo.toJS();
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

  _renderConfig(){
    let {IndicatorType,AnnualQuota,AnnualSavingRate}=this.state.kpiInfo.toJS();
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        annualTitle=I18N.format(I18N.Setting.KPI.Group.GroupConfig.Annual,getCustomerById(parseInt(this.context.router.params.customerId)).Name,type),
        annualHint=I18N.format(I18N.Setting.KPI.Group.GroupConfig.InputAnnual,getCustomerById(parseInt(this.context.router.params.customerId)).Name,type),
        title,
        // title=IndicatorType===Type.Quota?`${annualTitle} (${uom})`:`${annualTitle} (%)`,
        value=IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate;

        if(IndicatorType===Type.Quota){
          title=`${annualTitle}${this.getUom()}`
        }else {
          title=`${annualTitle} (%)`
        }
    let  annualProps={
          ref: 'annual',
          isViewStatus: this.props.configStep!==1,
          didChanged:value=>{
                      value=CommonFuns.thousandsToNormal(value);
                      let path=IndicatorType===Type.Quota?'AnnualQuota':'AnnualSavingRate';

                      this.setState({
                        kpiInfo:this.state.kpiInfo.set(path,value)
                      })
                              },
          defaultValue: this.props.configStep!==1?CommonFuns.getLabelData(parseFloat(value)) || '':CommonFuns.toThousands(value) || '',
          title: title,
          hintText:annualHint, 
          autoFocus:true,
          regexFn:IndicatorType===Type.Quota?this._validateQuota:this._validateSavingRate,
          style:{width:'150px'}
        };
    return(
      <ViewableTextField {...annualProps}/>
    )
  }

	componentWillReceiveProps(nextProps, nextContext) {
		if(!Immutable.is(nextProps.kpiInfo,this.props.kpiInfo)){
      this.setState({
        kpiInfo:nextProps.kpiInfo
      })
    }
	}

	render() {
    let {AnnualQuota,AnnualSavingRate}=this.state.kpiInfo.toJS();
    return(
      <StepComponent step={1} isfolded={false} title={I18N.Setting.KPI.Config.Group} 
                    isView={this.props.configStep!==1} editDisabled={this.props.configStep!==null} onEdit={this.props.onEdit}>
                    <div style={{display:'flex',flexDirection:'column',paddingRight:'15px'}}>
                      {this._renderConfig()}
                      {this.props.configStep===1 && 
                          <div className="jazz-kpi-config-edit-step-action">
                             {!this.props.isNew && <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={this.props.onCancel}/>}
                             <FlatButton label={I18N.Common.Button.Save} disabled={!AnnualQuota && !AnnualSavingRate} primary={true} style={{float:'right',minWidth:'68px',marginRight:'20px'}} 
                                onTouchTap={()=>{
                                   GroupKPIAction.updateKpiInfo(this.state.kpiInfo);
                                    this.props.onSave();
                              }}/>    
                      </div>}
                    </div>

      </StepComponent>
    )

  }
}

GroupConfig.propTypes = {
	configStep:React.PropTypes.number || null,
	kpiInfo:React.PropTypes.object,
  onEdit:React.PropTypes.func,
  onCancel:React.PropTypes.func,
  onSave:React.PropTypes.func,
  isNew:React.PropTypes.bool,
};
