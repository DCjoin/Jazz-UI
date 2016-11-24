'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'Immutable';
import TitleComponent from '../../controls/TtileComponent.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import MonthValueGroup from './MonthValueGroup.jsx';

export default class Prediction extends Component {

  constructor(props) {
    super(props);
    this._onCalcValue = this._onCalcValue.bind(this);
  }
  _onCalcValue(){
    // let {Year,IndicatorType,value}=this.props;
    // KPIAction.getCalcValue(Year,IndicatorType,value);
  }

  render(){
    let {PredictionSetting,onPredictioChange}=this.props;
    PredictionSetting=PredictionSetting || Immutable.fromJS({});
    let {MonthPredictionValues,TagSavingRates}=PredictionSetting.toJS();
    let savingRateProps={
      title:I18N.Setting.KPI.Parameter.TagSavingRates,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthProps={
      title:I18N.Setting.KPI.Parameter.MonthPrediction,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthGroupProps={
      values:MonthPredictionValues,
      onChange:onPredictioChange,
      IndicatorType:Type.MonthPrediction
    };

    return(
      <div>
        <TitleComponent {...savingRateProps}>
        </TitleComponent>
          <TitleComponent {...monthProps}>
            <FlatButton
            label={I18N.Setting.KPI.Parameter.CalcViaSavingRates}
            onTouchTap={this._onCalcValue}
            disabled={!TagSavingRates || TagSavingRates.size===0}
            style={{border:'1px solid #e4e7e9'}}
            />
          <MonthValueGroup {...monthGroupProps}/>
          </TitleComponent>
      </div>


    )
  }

}

Prediction.propTypes={
    PredictionSetting:PropTypes.object,
    onPredictioChange:PropTypes.func,
    Year:PropTypes.number,
};
Prediction.defaultProps = {
};
