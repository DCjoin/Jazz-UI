import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'controls/NewFlatButton.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import {Type,SettingStatus} from 'constants/actionType/KPI.jsx';

export default class ViewableKPIType extends Component {
	render() {
    var {status,type,onTypeChange,onClassChange,indicatorClass}=this.props;
    var typeProps={
      title:I18N.Setting.CustomizedLabeling.KPIType,
      contentStyle:{
        marginTop:'10px',
        marginLeft:'0'
      }
    };
    var content;
    if(status===SettingStatus.Edit){
			var typeTitle=type===Type.Quota?I18N.Setting.KPI.YearAndType.Quota:I18N.Setting.KPI.YearAndType.SavingRate,
					classTitle=indicatorClass===Type.Dosage?I18N.Setting.KPI.YearAndType.Dosage:I18N.Setting.KPI.YearAndType.Ratio;
      content=`${classTitle} — ${typeTitle}`
    }
    else {
      // content= <RadioButtonGroup name="type" valueSelected={type}
      //                           onChange={onTypeChange}>
      //           <RadioButton
      //             value={Type.Quota}
      //             label={I18N.Setting.KPI.YearAndType.Quota}
      //             style={{width:'200px'}}
      //             />
      //           <RadioButton
      //             value={Type.SavingRate}
      //             label={I18N.Setting.KPI.YearAndType.SavingRate}
      //             style={{width:'200px',marginLeft:'50px'}}
      //             />
      //         </RadioButtonGroup>
      var styles={
				group:{
					display:'flex',
					flexDirection:'row',
					alignItems:'center'
				}
			},
			prop={
				quota:{
					label:I18N.Setting.KPI.YearAndType.Quota,
					onTouchTap:()=>{onTypeChange(Type.Quota)},
					secondary:type===Type.Quota?true:false,
					style:type===Type.Quota?{}:{border:'1px solid #e6e6e6'}
				},
				savingRate:{
					label:I18N.Setting.KPI.YearAndType.SavingRate,
					onTouchTap:()=>{onTypeChange(Type.SavingRate)},
					secondary:type===Type.SavingRate?true:false,
					style:type===Type.SavingRate?{}:{border:'1px solid #e6e6e6'}
				},
			};
			content= (<div>
				<div style={styles.group}>
					<RadioButton
						checked={indicatorClass===Type.Dosage}
						value={Type.Dosage}
						label={I18N.Setting.KPI.YearAndType.Dosage}
						style={{width:'200px'}}
						onCheck={onClassChange.bind(Type.Dosage)}
						disabled={status===SettingStatus.Prolong && indicatorClass!==Type.Dosage}
						/>
						{indicatorClass===Type.Dosage && <div style={styles.group}>
						<FlatButton {...prop.quota}/>
						<FlatButton {...prop.savingRate}/>
						</div>}

				</div>
				<div style={styles.group}>
					<RadioButton
						checked={indicatorClass===Type.Ratio}
						value={Type.Ratio}
						label={I18N.Setting.KPI.YearAndType.Ratio}
						style={{width:'200px'}}
						onCheck={onClassChange.bind(Type.Ratio)}
						disabled={status===SettingStatus.Prolong && indicatorClass!==Type.Ratio}
						/>
						{indicatorClass===Type.Ratio && <div style={styles.group}>
						<FlatButton {...prop.quota}/>
						<FlatButton {...prop.savingRate}/>
						</div>}

				</div>
							</div>)


    }
		return (
      <TitleComponent {...typeProps}>
        {content}
      </TitleComponent>
		);
	}
}
ViewableKPIType.propTypes = {
	status:React.PropTypes.string,
	type:React.PropTypes.number,
	indicatorClass:React.PropTypes.number,
	onTypeChange:React.PropTypes.func,
	onClassChange:React.PropTypes.func,
};
