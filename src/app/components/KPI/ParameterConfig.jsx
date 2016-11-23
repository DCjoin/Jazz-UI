'use strict';
import React, {Component,PropTypes} from 'react';
import TitleComponent from '../../controls/TtileComponent.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';

export default class ParameterConfig extends Component {

  _renderIndicatorConfig(){
    let {IndicatorType,value}=this.props;
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate,
        annualTitle=I18N.format(I18N.Setting.KPI.Parameter.Annual,type),
        annualHint=I18N.format(I18N.Setting.KPI.Parameter.InputAnnual,type);
    let props={
      title:I18N.Setting.KPI.Parameter.Indicator,
      contentStyle:{
        marginLeft:'0'
      }
    },
    annualProps={
      ref: 'annual',
      isViewStatus: false,
      didChanged: value=>{
                  let path=IndicatorType===Type.Quota?'AdvanceSettings.AnnualQuota':'AdvanceSettings.AnnualSavingRate';
                  this.props.onAnnualChange(path,value);
                          },
      defaultValue: value,
      title: annualTitle,
      hintText:annualHint,
      // regexFn:
      }

    return(
      <TitleComponent {...props}>
        <ViewableTextField/>
      </TitleComponent>
    )
  }

  render(){
    let tagId=this.props.tag.get('Id');

    if(tagId){
      let props={
        title:I18N.Setting.KPI.Parameter.Title
      };
      return(
        <TitleComponent {...props}>
          {this._renderIndicatorConfig()}
        </TitleComponent>
      )
    }
    else {
      return(
        <TitleComponent title={I18N.Setting.KPI.YearAndType.Title} titleStyle={{color:'#e4e7e9'}}/>
      )
    }

  }
}

ParameterConfig.propTypes={
  	tag: PropTypes.object,
    value:PropTypes.string,
    IndicatorType:PropTypes.string,
    onAnnualChange:PropTypes.func,
    onIndicatorTypeChange:PropTypes.func,
};
ParameterConfig.defaultProps = {
  value:''
};
