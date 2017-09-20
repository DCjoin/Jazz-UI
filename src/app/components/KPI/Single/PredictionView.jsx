'use strict';
import React, {Component,PropTypes} from 'react';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import Immutable from 'immutable';
import Prediction from './Prediction.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';

export default class PredictionView extends Component {

  static contextTypes = {
		router: React.PropTypes.object,
	};

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

  _onPredictionChange(index,value){
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
      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index}.SavingRate`,
      value,
    }])
  }

  componentDidMount(){
		SingleKPIAction.IsAutoCalculable(parseInt(this.context.router.params.customerId),this.props.tag.get("Id"),this.props.Year);
	}

  render(){
    var props={
      ...this.props,
      onRatesSave:this._onRatesSave,
      onPredictioChange:this._onPredictionChange,
      deleteRate:this._deleteRate,
      onTagRateChange:this._onTagRateChange,
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
