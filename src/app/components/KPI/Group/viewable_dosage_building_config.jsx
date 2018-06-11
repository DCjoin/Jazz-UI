import React, { Component } from 'react';
import Immutable from 'immutable'; 
import DosageMonthConfig from './DosageMonthConfig.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import CommonFuns from 'util/Util.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import classNames from 'classnames';
import FontIcon from 'material-ui/FontIcon';
import PropTypes from 'prop-types';
export default class ViewableDosageBuildingConfig extends Component {
    constructor(props) {
      super(props);

    }

  _renderContent(){
    let isCeate=this.props.kpiInfo.getIn(["Buildings",this.props.index,'ActualTagName'])?false:true;
		let props={
			kpiInfo:this.props.kpiInfo,
			index:this.props.index,
			isCreate:isCeate,
      isViewStatus:this.props.isViewStatus,
			onSave:()=>{
				this.props.onSave();
			},
			onCancel:()=>{
				this.props.onCancel();
			},
		}
    return(
      <DosageMonthConfig {...props}/>
    )
  }

  // getUom(){
  //   let {UomId}=this.props.kpiInfo.toJS();

  //     if(UomId) {
  //       let uom=CommonFuns.getUomById(UomId).Code;
  //       return uom===''?'':`(${uom})`
  //     }
  //     else return ''
   
  // }

  // _validateQuota(value){
  //   value=CommonFuns.thousandsToNormal(value);
  //   return !SingleKPIStore.validateQuota(value) && I18N.Setting.KPI.Parameter.QuotaErrorText
  // }

  // _validateSavingRate(value){
  //   value=CommonFuns.thousandsToNormal(value);
  //   return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
  // }

	// _renderIndicator(){
  //   let {IndicatorType}=this.props.kpiInfo.toJS();
  //   let {AnnualQuota,AnnualSavingRate}=this.props.kpiInfo.getIn(['Buildings',this.props.index]).toJS();
  //   let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
  //       annualTitle=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Indicator,type),
  //       annualHint=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.IndicatorHint,type),
  //       title,
  //       // title=IndicatorType===Type.Quota?`${annualTitle} (${uom})`:`${annualTitle} (%)`,
  //       value=IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate;

  //       if(IndicatorType===Type.Quota){
  //         title=`${annualTitle}${this.getUom()}`
  //       }else {
  //         title=`${annualTitle} (%)`
  //       }
  //   let  annualProps={
  //         ref: 'annual',
  //         isViewStatus: this.props.isViewStatus,
  //         didChanged:value=>{
  //                     value=CommonFuns.thousandsToNormal(value);
  //                     let path=IndicatorType===Type.Quota?'AnnualQuota':'AnnualSavingRate';

	// 										      MonthKPIAction.merge([{
  //       											path,
  //       											value
  //    													 }])
  //                             },
  //         defaultValue: CommonFuns.toThousands(value) || '',
  //         title: title,
  //         hintText:annualHint, 
  //         autoFocus:true,
  //         regexFn:IndicatorType===Type.Quota?this._validateQuota:this._validateSavingRate,
  //         style:{width:'150px'}
  //       };
  //   return(
  //     <ViewableTextField {...annualProps}/>
  //   )
  // }

  render(){
  var building=this.props.kpiInfo.getIn(["Buildings",this.props.index]);
   var styles={
        icon:{
          fontSize:'15px',
          lineHeight:'15px',
          marginRight:'5px'
        }

    }
    return(
      <div className="jazz-viewable-building-config">
        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',borderBottom:'1px solid #e6e6e6',paddingRight:'15px',alignItems:'center'}}>
            <div className="jazz-viewable-building-config-head">{building.get("HierarchyName")}</div>
            {this.props.isViewStatus && <div className={classNames({
				                                        "operation":true,
				                                        'disabled':this.props.disableEdit
			                                          })} onClick={!this.props.disableEdit && this.props.onEdit}>
            <FontIcon className="icon-edit" color={this.props.disableEdit?"#cbcbcb":"#32ad3c"} style={styles.icon}/>
            {I18N.Baseline.Button.Edit}
          </div>}
        </div>
       
        <div className="jazz-viewable-building-config-content">
          {this._renderContent()}</div>
      </div>
    )
  }

}

ViewableDosageBuildingConfig.propTypes= {
	isViewStatus:PropTypes.bool,
  disableEdit:PropTypes.bool,
	index:PropTypes.number,
  kpiInfo:PropTypes.object,
  indicatorType:PropTypes.number,
  onEdit:PropTypes.func,
  onCancel:PropTypes.func,
  onSave:PropTypes.func,
};