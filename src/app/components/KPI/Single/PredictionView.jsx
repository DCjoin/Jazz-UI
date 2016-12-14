'use strict';
import React, {Component,PropTypes} from 'react';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import Immutable from 'Immutable';
import Prediction from './Prediction.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';

export default class PredictionView extends Component {

  _onRatesSave(tag){
      SingleKPIAction.merge([{
        path:'AdvanceSettings.PredictionSetting.TagSavingRates',
        value:Immutable.fromJS({
          TagId:tag.get('Id'),
          TagName:tag.get('Name'),
          SavingRate:0
        }),
        status:DataStatus.ADD
      }])
  }

  _onPredictioChange(index,value){
    let MonthPredictionValues=SingleKPIStore.getKpiInfo().getIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues']),
        period=SingleKPIStore.getYearQuotaperiod();
        if(MonthPredictionValues){
          SingleKPIAction.merge([{
            path:`AdvanceSettings.PredictionSetting.MonthPredictionValues.${index}`,
            value:Immutable.fromJS({
              Month:SingleKPIStore.DatetimeToJson(period[index]._d),
              Value:value
            })
          }
        ])
        }
        else {
              SingleKPIAction.merge([{
                path:'AdvanceSettings.PredictionSetting.MonthPredictionValues',
                index:index,
                length:12,
                value:Immutable.fromJS({
                  Month:SingleKPIStore.DatetimeToJson(period[index]._d),
                  Value:value,
                }),
                status:DataStatus.ADD
              }])
        }
  }

  _deleteRate(index){
    SingleKPIAction.merge([{
      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index}`,
      status:DataStatus.DELETE
    }])
  }

  _onTagRateChange(index,value){
    SingleKPIAction.merge([{
      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index-1}.SavingRate`,
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
      <Prediction {...props}/>
  )
  }
}
PredictionView.propTypes={
    PredictionSetting:PropTypes.object,
    Year:PropTypes.number,
    uom:PropTypes.string,
    tag:PropTypes.object,
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
};
