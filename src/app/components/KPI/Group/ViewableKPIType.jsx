import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import TitleComponent from 'controls/TitleComponent.jsx';
import {Type,SettingStatus} from 'constants/actionType/KPI.jsx';
import assign from 'object-assign';

export default class ViewableKPIType extends Component {
	render() {
    var {status,type,onTypeChange,onClassChange,indicatorClass}=this.props;
    var typeProps={
      title:I18N.Setting.CustomizedLabeling.KPIType,
			style:{
				marginTop:'20px'
			},
      contentStyle:{
        marginTop:'6px',
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
					alignItems:'center',
					height:'30px'
				},
				label:{
					fontSize: '14px',
					color:'#0f0f0f',
					width:'70px'
				},
				icon:{
					width:'16px',
					height:'16px',
					marginRight:'10px',
					marginTop:'2px'
				},
				selectedBtn:{
					borderRadius:'2px',zIndex:'2',border:'1px solid #32ad3c',backgroundColor:"#32ad3c",color:"#ffffff",width:'100px',height:'30px',lineHeight:'28px'
				},
				btn:{
					width:'100px',height:'30px',lineHeight:'28px',borderRadius: '2px',border: 'solid 1px #9fa0a4',color:'#0f0f0f'
				}
			},
			prop={
				quota:{
					label:I18N.Setting.KPI.YearAndType.Quota,
					onTouchTap:()=>{onTypeChange(Type.Quota)},
					// secondary:type===Type.Quota?true:false,
					labelStyle:{padding:0},
					style:type===Type.Quota?assign({},styles.selectedBtn,{marginLeft:'-2px'}):assign({},styles.btn,{marginLeft:'-2px'})
				},
				savingRate:{
					label:I18N.Setting.KPI.YearAndType.SavingRate,
					onTouchTap:()=>{onTypeChange(Type.SavingRate)},
					// secondary:type===Type.SavingRate?true:false,
					labelStyle:{padding:0},
					style:type===Type.SavingRate?styles.selectedBtn:styles.btn
				},
			};
			content= (<div>
				<div style={styles.group}>
					<RadioButton
						checked={indicatorClass===Type.Dosage}
						value={Type.Dosage}
						label={I18N.Setting.KPI.YearAndType.Dosage}
						style={{width:'120px'}}
						labelStyle={styles.label}
						iconStyle={styles.icon}
						onCheck={onClassChange.bind(Type.Dosage)}
						disabled={status===SettingStatus.Prolong && indicatorClass!==Type.Dosage}
						/>
						{indicatorClass===Type.Dosage && <div style={styles.group}>
							<FlatButton {...prop.savingRate}/>
							<FlatButton {...prop.quota}/>
						
						</div>}

				</div>
				<div style={styles.group}>
					<RadioButton
						checked={indicatorClass===Type.Ratio}
						value={Type.Ratio}
						label={I18N.Setting.KPI.YearAndType.Ratio}
						style={{width:'120px'}}
						labelStyle={styles.label}
						iconStyle={styles.icon}
						onCheck={onClassChange.bind(Type.Ratio)}
						disabled={status===SettingStatus.Prolong && indicatorClass!==Type.Ratio}
						/>
						{indicatorClass===Type.Ratio && <div style={styles.group}>
							<FlatButton {...prop.savingRate}/>
						<FlatButton {...prop.quota}/>
						
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
