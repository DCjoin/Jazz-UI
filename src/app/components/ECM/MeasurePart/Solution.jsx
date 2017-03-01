import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'controls/CustomTextField.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import IconLabelField from 'controls/IconLabelField.jsx';

export default class Solution extends Component {

    constructor(props) {
      super(props);
    }

    render(){
      var {canEdit,measure}=this.props;
      var {EnergySolution}=measure.toJS();
      var {ExpectedAnnualEnergySaving,EnergySavingUnit,ExpectedAnnualCostSaving,InvestmentAmount,Description}=EnergySolution;
      let iconStyle = {
          fontSize: '20px'
        },
        style = {
          padding: '0px',
          height: '18px',
          width: '18px',
          fontSize: '20px',
          marginTop:'-5px'
        };

      var props={
        savingIcon:{
          key:'EnergySolution'+EnergySolution.Id+'_SavingIcon',
          icon:<FontIcon className="icon-energy_saving" iconStyle ={iconStyle} style = {style} />,
          label:I18N.Setting.ECM.ExpectedAnnualEnergySaving,
        },
        costIcon:{
          key:'EnergySolution'+EnergySolution.Id+'_CostIcon',
          icon:<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} style = {style} />,
          label:I18N.Setting.ECM.ExpectedAnnualCostSaving,
        },
        amountIcon:{
          key:'EnergySolution'+EnergySolution.Id+'_AmountIcon',
          icon:<FontIcon className="icon-investment" iconStyle ={iconStyle} style = {style} />,
          label:I18N.Setting.ECM.InvestmentAmount,
        },
        cycleIcon:{
          key:'EnergySolution'+EnergySolution.Id+'_CycleIcon',
          icon:<FontIcon className="icon-roi" iconStyle ={iconStyle} style = {style} />,
          label:I18N.Setting.ECM.InvestmentReturn,
        },
        saving:{
          key:'EnergySolution'+EnergySolution.Id+'_Saving'+new Date(),
          isNumber:true,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                if(!MeasuresStore.validateNumber(value)){value=ExpectedAnnualEnergySaving}
                                this.props.merge(['EnergySolution','ExpectedAnnualEnergySaving'],value)
                              },
          value:ExpectedAnnualEnergySaving,
          style:{marginTop:'-5px'},
          width:'50px',
          regexFn:(value)=>{
            if(value===''){value=null}
            if(!MeasuresStore.validateNumber(value)){
              return I18N.Setting.ECM.NumberErrorText
            }
            else {
              return null
            }
          },
        displayFn:(value)=>{
            if(value===''){value=null}
             return MeasuresStore.getDisplayText(value)
          }
        },
        savingUnit:{
          key:'EnergySolution'+EnergySolution.Id+'_SavingUnit',
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergySolution','EnergySavingUnit'],value)
                              },
          value:EnergySavingUnit,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true,
          displayFn:(value)=>{
            if(value===''){value=null}
             return MeasuresStore.getDisplayText(value)
          }
        },
        cost:{
          key:'EnergySolution'+EnergySolution.Id+'_Cost'+new Date(),
          isNumber:true,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                if(!MeasuresStore.validateNumber(value)){value=ExpectedAnnualCostSaving}
                                this.props.merge(['EnergySolution','ExpectedAnnualCostSaving'],value)
                              },
          value:ExpectedAnnualCostSaving,
          style:{marginTop:'-5px'},
          width:'50px',
          regexFn:(value)=>{
            if(value===''){value=null}
            if(!MeasuresStore.validateNumber(value)){
              return I18N.Setting.ECM.NumberErrorText
            }
            else {
              return null
            }
          },
          displayFn:(value)=>{
            if(value===''){value=null}
             return MeasuresStore.getDisplayText(value)
          }
        },
        amount:{
          key:'EnergySolution'+EnergySolution.Id+'_Amount'+new Date(),
          isNumber:true,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                if(!MeasuresStore.validateNumber(value)){value=InvestmentAmount}
                                this.props.merge(['EnergySolution','InvestmentAmount'],value)
                              },
          value:InvestmentAmount,
          style:{marginTop:'-5px'},
          width:'50px',
          regexFn:(value)=>{
            if(value===''){value=null}
            if(!MeasuresStore.validateNumber(value)){
              return I18N.Setting.ECM.NumberErrorText
            }
            else {
              return null
            }
          },
          displayFn:(value)=>{
            if(value===''){value=null}
             return MeasuresStore.getDisplayText(value)
          }
        },
        description:{
          key:'EnergySolution'+EnergySolution.Id+'_Description',
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergySolution','Description'],value);
                              },
          value:Description,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true,
          displayFn:(value)=>{
                      if(value===''){value=null}
                       return MeasuresStore.getDisplayText(value)
                    }
        },
      };
      var InvestmentReturnCycle=MeasuresStore.getInvestmentReturnCycle(InvestmentAmount,ExpectedAnnualCostSaving);
      return(
        <div className="jazz-ecm-measure-problem">
          <div className="name">
            {I18N.Setting.ECM.SolutionDetail}
          </div>
          <div className="row">
            <div className="jazz-ecm-measure-solution-iconrow" style={{justifyContent: 'space-between'}}>
              <IconLabelField {...props.savingIcon}>
                <div className="jazz-ecm-measure-solution-iconrow">
                  {canEdit?<TextField {...props.saving}/>:MeasuresStore.getDisplayText(ExpectedAnnualEnergySaving)}
                  {canEdit?<TextField {...props.savingUnit}/>:MeasuresStore.getDisplayText(EnergySavingUnit)}
                </div>
              </IconLabelField>
              <IconLabelField {...props.costIcon}>
                <div className="jazz-ecm-measure-solution-iconrow">
                  {canEdit?<TextField {...props.cost}/>:MeasuresStore.getDisplayText(ExpectedAnnualCostSaving)}
                  {"RMB"}
                </div>
              </IconLabelField>
              <IconLabelField {...props.amountIcon}>
                <div className="jazz-ecm-measure-solution-iconrow">
                  {canEdit?<TextField {...props.amount}/>:MeasuresStore.getDisplayText(InvestmentAmount)}
                  {"RMB"}
                </div>
              </IconLabelField>
              <IconLabelField {...props.cycleIcon}>
                {InvestmentReturnCycle || '-'}
              </IconLabelField>
            </div>
          </div>
          <div className="row">
            <div className="label">
              {I18N.Setting.UserManagement.Comment}
            </div>
            {canEdit?<TextField {...props.description}/>:<div className="jazz-ecm-measure-viewabletext">{MeasuresStore.getDisplayText(Description)}</div>}
          </div>
        </div>
      )
    }

}

Solution.propTypes = {
  measure:React.PropTypes.object,
  canEdit:React.PropTypes.bool,
  merge:React.PropTypes.func
};
