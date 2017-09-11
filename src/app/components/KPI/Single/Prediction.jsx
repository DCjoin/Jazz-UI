'use strict';
import React, {Component,PropTypes} from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TitleComponent from 'controls/TitleComponent.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import MonthValueGroup from './MonthValueGroup.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import TagSelect from './TagSelect.jsx';
import {DataConverter} from 'util/Util.jsx';
import CommonFuns from 'util/Util.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';

function getUom(uomId){
  if(uomId){
    let uom=CommonFuns.getUomById(uomId).Code;
    if(uom==='') return ''
    else return `(${uom})`
  }
  return ''
}

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
    this._onPredictioChange = this._onPredictioChange.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  state={
    ratesTageSelectShow:false,
    hasHistory:MonthKPIStore.getHasHistory(),
  }

 _onChange(){
    this.setState({
      hasHistory:MonthKPIStore.getHasHistory(),
    })
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
      this.props.onRatesSave(tag);
      // SingleKPIAction.merge([{
      //   path:'AdvanceSettings.PredictionSetting.TagSavingRates',
      //   value:Immutable.fromJS({
      //     TagId:tag.get('Id'),
      //     TagName:tag.get('Name'),
      //     SavingRate:0
      //   }),
      //   status:DataStatus.ADD
      // }])
    })
  }

  	_onPredictioChange(index,value){
      this.props.onPredictioChange(index,value);
  		// let MonthPredictionValues=SingleKPIStore.getKpiInfo().getIn(['AdvanceSettings','PredictionSetting','MonthPredictionValues']),
  		// 		period=SingleKPIStore.getYearQuotaperiod();
      //     if(MonthPredictionValues){
      //       SingleKPIAction.merge([{
      //         path:`AdvanceSettings.PredictionSetting.MonthPredictionValues.${index}`,
      //         value:Immutable.fromJS({
      //           Month:SingleKPIStore.DatetimeToJson(period[index]._d),
      //           Value:value
      //         })
      //       }
      //     ])
      //     }
      //     else {
      //           SingleKPIAction.merge([{
      //             path:'AdvanceSettings.PredictionSetting.MonthPredictionValues',
      //             index:index,
      //             length:12,
      //             value:Immutable.fromJS({
      //               Month:SingleKPIStore.DatetimeToJson(period[index]._d),
      //               Value:value,
      //             }),
      //             status:DataStatus.ADD
      //           }])
      //     }
  	}

  _onCalcValue(TagSavingRates){
    SingleKPIAction.getCalcPredicate(this.context.router.params.customerId,this.props.Year,TagSavingRates)
  }

  _deleteRate(index){
    this.props.deleteRate(index)
    // SingleKPIAction.merge([{
    //   path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index}`,
    //   status:DataStatus.DELETE
    // }])
  }

/*
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
        )*/
  _renderTagSavingRates(predictionSetting){
    var {isViewStatus}=this.props;
    let {TagSavingRates}=predictionSetting;
    let tags=SingleKPIStore.getTagTable(TagSavingRates),
        rates=SingleKPIStore.getRatesTable(TagSavingRates);

    var styles={
      button:{
        marginRight:'15px',
        height:'30px',
        lineHeight:'30px',
        marginTop:'5px'
      },
      label:{
        fontSize:'14px',
        lineHeight:'14px',
        verticalAlign:'baseline'
      }
    };


      return(
        <div style={{marginTop:'15px'}}>
          {tags.length>0 && <div className="jazz-kpi-prediction-config-tags-row" style={{marginBottom:'11px'}}>
            <div className="jazz-kpi-prediction-config-tags-row-column1">
              <div className="title">{I18N.Setting.KPI.Config.Tag}</div>
            </div>
            <div className="jazz-kpi-prediction-config-tags-row-column2">
              <div className="title">{I18N.Setting.KPI.Parameter.SavingRates+'(%)'}</div>
            </div>
          </div>}
          {tags.map((tag,index)=>{
            let rateProps={
                      ref: 'rate',
                      isViewStatus: this.props.isViewStatus,
                      style:{width:'80px'},
                      didChanged: value=>{
                                    this.props.onTagRateChange(index,value);
                                    //if(value==='') value=0;
                                    // SingleKPIAction.merge([{
                                    //   path:`AdvanceSettings.PredictionSetting.TagSavingRates.${index-1}.SavingRate`,
                                    //   value,
                                    // }])
                                          },
                      defaultValue: rates[index],
                      regexFn:(value)=>{
                        return !SingleKPIStore.validateSavingRate(value) && I18N.Setting.KPI.Parameter.SavingRateErrorText
                      }
                    };
                  return(
                    <div className="jazz-kpi-prediction-config-tags-row" style={{marginBottom:'16px'}}>
                      <div className="jazz-kpi-prediction-config-tags-row-column1">
                        <div className="name" title={tag}>{tag}</div>
                      </div>
                      <div className="jazz-kpi-prediction-config-tags-row-column2">
                        <ViewableTextField {...rateProps}/>
                      </div>
                      {!isViewStatus && <IconButton iconStyle={{fontSize:'14PX'}} style={{width:'14px',height:'14px',marginLeft:'58px',padding:'0'}} onClick={this._deleteRate.bind(this,index)}>
                                         <FontIcon className="icon-delete" color="#32ad3c"/>
                                       </IconButton>}
                    </div>
                  )
                  
                })}

                {!isViewStatus && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={this._onRatesSelectTagShow}/>}
        </div>
      )
  }

  componentDidMount(){
    MonthKPIStore.addChangeListener(this._onChange);
  }

  componentWillUnmount(){
    MonthKPIStore.removeChangeListener(this._onChange);
  }

  render(){
    let {PredictionSetting,hierarchyId,hierarchyName,tag,uomId,isViewStatus}=this.props;
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
      title:`${I18N.Setting.KPI.Parameter.MonthPrediction} ${getUom(uomId)}`,
      contentStyle:{
        marginLeft:'0'
      }
    },
    monthGroupProps={
      values:MonthPredictionValues,
      onChange:this._onPredictioChange,
      IndicatorType:Type.MonthPrediction,
      isViewStatus
    },
    ratesTagProps={
        key:'ratestagselect',
          title:I18N.Setting.KPI.Group.GroupConfig.SelectTagForPrediction,
          hierarchyId,
          hierarchyName,
          tag:tag,
          onSave:this._onRatesSave,
          onCancel:this._onDialogDismiss
          };

    return(
      <div>
        <div className="jazz-kpi-prediction-config-tags">
          <div className="jazz-kpi-prediction-config-tags-title">{I18N.Setting.KPI.Parameter.TagSavingRates}</div>
          {this._renderTagSavingRates(PredictionSetting)}
        </div>
        <div className="jazz-kpi-prediction-config-month">
          <div className="jazz-kpi-prediction-config-month-head">
            <div className="jazz-kpi-prediction-config-month-head-title">{`${I18N.Setting.KPI.Parameter.MonthPrediction} ${getUom(uomId)}`}</div>
            {!isViewStatus && <div className={classnames('jazz-kpi-prediction-config-month-head-calc-btn', {['disabled']:!tag.get("Id") || !this.state.hasHistory})}
                   onClick={(!tag.get("Id") || !this.state.hasHistory)?this._onCalcValue.bind(this,TagSavingRates):()=>{}}>{I18N.Setting.KPI.Parameter.CalcViaSavingRates}</div>}
          </div>
          <MonthValueGroup {...monthGroupProps}/>
        </div>
          
          {this.state.ratesTageSelectShow && <TagSelect {...ratesTagProps}/>}
      </div>


    )
  }

}

Prediction.propTypes={
    PredictionSetting:PropTypes.object,
    Year:PropTypes.number,
    uomId:PropTypes.number || any,
    tag:PropTypes.object,
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
    isViewStatus:React.PropTypes.bool,
};
