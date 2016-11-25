'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'Immutable';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TitleComponent from '../../controls/TtileComponent.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import {Type,Status} from '../../constants/actionType/KPI.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx';
import MonthValueGroup from './MonthValueGroup.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';

export default class Prediction extends Component {

  static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onCalcValue = this._onCalcValue.bind(this);
  }

  _onCalcValue(TagSavingRates){
    // let {Year,IndicatorType,value}=this.props;
    // KPIAction.getCalcValue(Year,IndicatorType,value);
    //
    KPIAction.getCalcPredicate(this.context.router.params.customerId,this.props.Year,TagSavingRates)
  }

  _deleteRate(index){
    KPIAction.merge([{
      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index}`,
      status:Status.DELETE
    }])
  }

  _renderTagSavingRates(predictionSetting){
    let {TagSavingRates}=predictionSetting;
    let tags=KPIStore.getTagTable(TagSavingRates),
        rates=KPIStore.getRatesTable(TagSavingRates);

        return(
          <table className='jazz-kpi-save-rates'>
            <tbody>
              <tr>
                {tags.map((tag,index)=>{
                  return <td>
                  <span className='tagName'>{tag}</span>
                          {index>0 && <IconButton iconStyle={{fontSize:'14PX'}} style={{width:'14px',height:'14px'}} onClick={this._deleteRate.bind(this,index-1)}>
                                         <FontIcon className="icon-delete"/>
                                       </IconButton>
                          }
                         </td>
                })}
                <td><FlatButton
                            label={I18N.EM.Report.SelectTag}
                            onTouchTap={(e)=>{
                              this.props.onSelectTagShow();
                              e.stopPropagation();
                            }}
                            style={{border:'1px solid #e4e7e9'}}
                            /></td>
              </tr>
              <tr>
                {rates.map((rate,index)=>{
                  let content=rate;
                  if(index>0){
                    let rateProps={
                      ref: 'rate',
                      isViewStatus: false,
                      style:{width:'120px'},
                      didChanged: value=>{
                                    //if(value==='') value=0;
                                    KPIAction.merge([{
                                      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index-1}.SavingRate`,
                                      value,
                                    }])
                                          },
                      defaultValue: rate,
                      regexFn:KPIStore.validateSavingRate
                    };
                    content=<div style={{display:'flex','alignItems':'center'}}>
                      <span><ViewableTextField {...rateProps}/></span>
                      <span>%</span>
                    </div>;
                  }

                  return <td>
                          {content}
                         </td>
                })}
                <td/>
              </tr>
            </tbody>
          </table>
        )
  }

  render(){
    let {PredictionSetting,onPredictioChange}=this.props;
    PredictionSetting=PredictionSetting || {};
    let {MonthPredictionValues,TagSavingRates}=PredictionSetting;
    let savingRateProps={
      title:I18N.Setting.KPI.Parameter.TagSavingRates,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthProps={
      title:`${I18N.Setting.KPI.Parameter.MonthPrediction} (${this.props.uom})`,
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
          {this._renderTagSavingRates(PredictionSetting)}
        </TitleComponent>
          <TitleComponent {...monthProps}>
            <FlatButton
            label={I18N.Setting.KPI.Parameter.CalcViaSavingRates}
            onTouchTap={this._onCalcValue.bind(this,TagSavingRates)}
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
    onSelectTagShow:PropTypes.func,
    uom:PropTypes.string
};
Prediction.defaultProps = {
};
