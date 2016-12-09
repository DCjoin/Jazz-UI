'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'Immutable';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TitleComponent from 'controls/TitleComponent.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import MonthValueGroup from './MonthValueGroup.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import TagSelect from './TagSelect.jsx';
import {DataConverter} from 'util/Util.jsx';

export default class Prediction extends Component {

  static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onCalcValue = this._onCalcValue.bind(this);
    this._onDialogDismiss = this._onDialogDismiss.bind(this);
    this._onRatesSelectTagShow = this._onRatesSelectTagShow.bind(this);
    this._onRatesSave = this._onRatesSave.bind(this);
  }

  state={
    ratesTageSelectShow:false,
  }

  _onDialogDismiss(){
    this.setState({
      ratesTageSelectShow:false
    })
  }

  _onRatesSelectTagShow(){
    this.setState({
      ratesTageSelectShow:true
    })
  }

  _onRatesSave(tag){
    this.setState({
      ratesTageSelectShow:false
    },()=>{
      SingleKPIAction.merge([{
        path:'AdvanceSettings.PredictionSetting.TagSavingRates',
        value:Immutable.fromJS({
          TagId:tag.get('Id'),
          TagName:tag.get('Name'),
          SavingRate:0
        }),
        status:DataStatus.ADD
      }])
    })
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

  _onCalcValue(TagSavingRates){
    SingleKPIAction.getCalcPredicate(this.context.router.params.customerId,this.props.Year,TagSavingRates)
  }

  _deleteRate(index){
    SingleKPIAction.merge([{
      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index}`,
      status:DataStatus.DELETE
    }])
  }

  _renderTagSavingRates(predictionSetting){
    let {TagSavingRates}=predictionSetting;
    let tags=SingleKPIStore.getTagTable(TagSavingRates),
        rates=SingleKPIStore.getRatesTable(TagSavingRates);

        return(
          <table className='jazz-kpi-save-rates'>
            <tbody>
              <tr>
                {tags.map((tag,index)=>{
                  return <td title={tag}>
                  <span className='tagName'>{tag}</span>
                          {index>0 && <IconButton iconStyle={{fontSize:'14PX'}} style={{width:'14px',height:'14px'}} onClick={this._deleteRate.bind(this,index-1)}>
                                         <FontIcon className="icon-delete"/>
                                       </IconButton>
                          }
                         </td>
                })}
                <td><FlatButton
                            label={I18N.EM.Report.SelectTag}
                            onTouchTap={this._onRatesSelectTagShow}
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
                                    SingleKPIAction.merge([{
                                      path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index-1}.SavingRate`,
                                      value,
                                    }])
                                          },
                      defaultValue: rate,
                      regexFn:(value)=>{
                        return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
                      }
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
    let {PredictionSetting,hierarchyId,hierarchyName,tag}=this.props;
    PredictionSetting=PredictionSetting || {};
    let {MonthPredictionValues,TagSavingRates}=PredictionSetting;
    let savingRateProps={
      title:I18N.Setting.KPI.Parameter.TagSavingRates,
      contentStyle:{
        marginLeft:'0',
        overflowX:'auto',
        paddingBottom:'10px'
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
      onChange:this._onPredictioChange,
      IndicatorType:Type.MonthPrediction
    },
    ratesTagProps={
        key:'ratestagselect',
          hierarchyId,
          hierarchyName,
          tag:tag,
          onSave:this._onRatesSave,
          onCancel:this._onDialogDismiss
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
          {this.state.ratesTageSelectShow && <TagSelect {...ratesTagProps}/>}
      </div>


    )
  }

}

Prediction.propTypes={
    PredictionSetting:PropTypes.object,
    Year:PropTypes.number,
    uom:PropTypes.string,
    tag:PropTypes.object,
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
};
Prediction.defaultProps = {
};
