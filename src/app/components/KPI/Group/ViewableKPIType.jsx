import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TitleComponent from 'controls/TitleComponent.jsx';
import {Type,SettingStatus} from 'constants/actionType/KPI.jsx';

export default class ViewableKPIType extends Component {
	render() {
    var {status,type,onTypeChange}=this.props;
    var typeProps={
      title:I18N.Setting.CustomizedLabeling.KPIType,
      contentStyle:{
        marginTop:'10px',
        marginLeft:'0'
      }
    };
    var content;
    if(status===SettingStatus.Edit){
      content=type===Type.Quota?I18N.Setting.KPI.YearAndType.Quota:I18N.Setting.KPI.YearAndType.SavingRate
    }
    else {
      content= <RadioButtonGroup name="type" valueSelected={type}
                                onChange={onTypeChange} style={{display:'flex'}}>
                <RadioButton
                  value={Type.Quota}
                  label={I18N.Setting.KPI.YearAndType.Quota}
                  style={{width:'200px'}}
                  />
                <RadioButton
                  value={Type.SavingRate}
                  label={I18N.Setting.KPI.YearAndType.SavingRate}
                  style={{width:'200px',marginLeft:'50px'}}
                  />
              </RadioButtonGroup>
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
	onTypeChange:React.PropTypes.func,
};
