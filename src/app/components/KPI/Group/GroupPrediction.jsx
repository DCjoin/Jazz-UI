'use strict';
import React, {Component} from 'react';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import Immutable from 'immutable';
import Prediction from '../Single/Prediction.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import PropTypes from 'prop-types';
export default class GroupPrediction extends Component {

  _onRatesSave(tag){
      MonthKPIAction.merge([{
        path:'TagSavingRates',
        value:Immutable.fromJS({
          TagId:tag.get('Id'),
          TagName:tag.get('Name'),
          SavingRate:0
        }),
        status:DataStatus.ADD
      }])
  }

  _onPredictioChange(index,value){
    MonthKPIAction.merge([{
      path:`MonthPredictionValues.${index}.Value`,
      value
    }])
  }

  _deleteRate(index){
    MonthKPIAction.merge([{
      path:`TagSavingRates.${index}`,
      status:DataStatus.DELETE
    }])
  }

  _onTagRateChange(index,value){
    MonthKPIAction.merge([{
      path:`TagSavingRates.${index}.SavingRate`,
      value,
    }])
  }

  render(){
    var props={
      onRatesSave:this._onRatesSave,
      onPredictioChange:this._onPredictioChange,
      deleteRate:this._deleteRate,
      onTagRateChange:this._onTagRateChange,
      ...this.props
    };
    return(
      <div className="jazz-kpi-prediction-config">
        <div className="jazz-kpi-prediction-config-head">
          <em/>
          <div className="jazz-kpi-prediction-config-head-title">{I18N.Setting.KPI.Parameter.MonthPrediction}</div>
        </div>
        
        <Prediction {...props}/>
      </div>

  )
  }
}
GroupPrediction.propTypes={
    PredictionSetting:PropTypes.object,
    Year:PropTypes.number,
    uom:PropTypes.string,
    tag:PropTypes.object,
    hierarchyId:PropTypes.number,
    hierarchyName:PropTypes.string,
    isViewStatus:PropTypes.bool,
};
