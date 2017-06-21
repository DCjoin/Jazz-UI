import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
// import TextField from 'controls/CustomTextField.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import IconLabelField from 'controls/IconLabelField.jsx';
import CommonFuns from 'util/Util.jsx';
import TextField from 'material-ui/TextField';

class NativeTextField extends Component{

  constructor(props) {
        super(props);
      }

  state={
    value:this.props.value
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      value:nextProps.value
    })
  }

  shouldComponentUpdate(nextProps,nextState){
    if(nextProps.value===this.props.value && nextState.value===this.state.value) return false
    return true
  }

  render(){
    var prop={
      id:this.props.id,
      value:this.state.value,
      underlineShow:false,
      inputStyle:{width:"45px",height:"28px"},
      style:{width:"45px",height:"28px",border:"1px solid #e6e6e6",borderRadius:4,marginRight:'5px'},
      errorText:this.props.getErrorText?this.props.getErrorText(this.state.value):null,
      onChange:(e,value)=>{this.setState({value})},
      onBlur:()=>{this.props.onBlur(this.state.value)},
    }
    return(
      <TextField {...prop}/>
    )
  }
}

export class SolutionLabel extends Component {
  render(){
    var {canEdit,measure}=this.props;
    var {EnergySolution}=measure.toJS();
    var {ExpectedAnnualEnergySaving,EnergySavingUnit,ExpectedAnnualCostSaving,InvestmentAmount,Description}=EnergySolution;
    let iconStyle = {
        fontSize: '24px'
      },
      style = {
        padding: '0px',
        height: '24px',
        width: '24px',
        fontSize: '24px',
        marginTop:'-5px'
      };

    var props={
      savingIcon:{
        key:'EnergySolution'+EnergySolution.Id+'_SavingIcon',
        icon:<FontIcon className="icon-energy_saving" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.ExpectedAnnualEnergySaving,
      },
      costIcon:{
        key:'EnergySolution'+EnergySolution.Id+'_CostIcon',
        icon:<FontIcon className="icon-cost_saving" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.ExpectedAnnualCostSaving,
      },
      amountIcon:{
        key:'EnergySolution'+EnergySolution.Id+'_AmountIcon',
        icon:<FontIcon className="icon-investment" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.InvestmentAmount,
      },
      cycleIcon:{
        key:'EnergySolution'+EnergySolution.Id+'_CycleIcon',
        icon:<FontIcon className="icon-roi" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.InvestmentReturn,
      },
      saving:{
        key:'EnergySolution'+EnergySolution.Id+'_Saving'+new Date(),
        id:'EnergySolution'+EnergySolution.Id+'_Saving'+new Date(),
        value:ExpectedAnnualEnergySaving,
        onBlur:(value)=>{
                              if(value===''){value=null}
                              if(!MeasuresStore.validateNumber(value)){value=ExpectedAnnualEnergySaving}
                              this.props.merge(['EnergySolution','ExpectedAnnualEnergySaving'],value)
                            },
        getErrorText:(value)=>{return (!MeasuresStore.validateNumber(value))?I18N.Setting.ECM.NumberErrorText:null}
      },
      savingUnit:{
        key:'EnergySolution'+EnergySolution.Id+'_SavingUnit',
        id:'EnergySolution'+EnergySolution.Id+'_SavingUnit',
        onBlur:(value)=>{
                              if(value===''){value=null}
                              this.props.merge(['EnergySolution','EnergySavingUnit'],value)
                            },
        value:EnergySavingUnit,
      },
      cost:{
        key:'EnergySolution'+EnergySolution.Id+'_Cost'+new Date(),
        id:'EnergySolution'+EnergySolution.Id+'_Cost'+new Date(),
        value:ExpectedAnnualCostSaving,
        onBlur:(value)=>{
                              if(value===''){value=null}
                              if(!MeasuresStore.validateNumber(value)){value=ExpectedAnnualCostSaving}
                              this.props.merge(['EnergySolution','ExpectedAnnualCostSaving'],value)
                            },
        getErrorText:(value)=>{return (!MeasuresStore.validateNumber(value))?I18N.Setting.ECM.NumberErrorText:null}
      },
      amount:{
        key:'EnergySolution'+EnergySolution.Id+'_Amount'+new Date(),
        id:'EnergySolution'+EnergySolution.Id+'_Amount'+new Date(),
        value:InvestmentAmount,
        onBlur:(value)=>{
                              if(value===''){value=null}
                              if(!MeasuresStore.validateNumber(value)){value=InvestmentAmount}
                              this.props.merge(['EnergySolution','InvestmentAmount'],value)
                            },
        getErrorText:(value)=>{return (!MeasuresStore.validateNumber(value))?I18N.Setting.ECM.NumberErrorText:null}
      }
    };
    var InvestmentReturnCycle=MeasuresStore.getInvestmentReturnCycle(InvestmentAmount,ExpectedAnnualCostSaving),
    uom=CommonFuns.isNumber(InvestmentReturnCycle)?I18N.EM.Year:'';

    return(
      <div className="jazz-ecm-measure-problem">
        <div className="row">
          <div className="jazz-ecm-measure-solution-iconrow" style={{justifyContent: 'space-between'}}>
            <IconLabelField {...props.savingIcon}>
              <div className="jazz-ecm-measure-solution-iconrow">
                {canEdit?<NativeTextField {...props.saving}/>:MeasuresStore.getDisplayText(ExpectedAnnualEnergySaving)}
                {canEdit?<NativeTextField {...props.savingUnit}/>:MeasuresStore.getDisplayText(EnergySavingUnit)}
              </div>
            </IconLabelField>
            <IconLabelField {...props.costIcon}>
              <div className="jazz-ecm-measure-solution-iconrow">
                {canEdit?<NativeTextField {...props.cost}/>:MeasuresStore.getDisplayText(ExpectedAnnualCostSaving)}
                {"RMB"}
              </div>
            </IconLabelField>
            <IconLabelField {...props.amountIcon}>
              <div className="jazz-ecm-measure-solution-iconrow">
                {canEdit?<NativeTextField {...props.amount}/>:MeasuresStore.getDisplayText(InvestmentAmount)}
                {"RMB"}
              </div>
            </IconLabelField>
            <IconLabelField {...props.cycleIcon}>
              {`${InvestmentReturnCycle || ' — '} ${uom}`}
            </IconLabelField>
          </div>
        </div>
      </div>
    )
  }
}


SolutionLabel.propTypes = {
  measure:React.PropTypes.object,
  canEdit:React.PropTypes.bool,
  merge:React.PropTypes.func
};

export class Solution extends Component {

    constructor(props) {
      super(props);
    }

    render(){
      var {canEdit,measure}=this.props;
      var {EnergySolution}=measure.toJS();
      var {Description,Name}=EnergySolution;

      var props={
        name:{
          key:'EnergyProblem'+EnergySolution.Id+'_Name',
          id:'EnergyProblem'+EnergySolution.Id+'_Name',
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergySolution','Name'],value)
                              },
          value:Name,
          hintText:I18N.Setting.ECM.AddSolutionName,
          hintStyle:{fontSize:"12px"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
        description:{
          key:'EnergySolution'+EnergySolution.Id+'_Description',
          key:'EnergySolution'+EnergySolution.Id+'_Description',
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergySolution','Description'],value);
                              },
          value:Description,
          hintText:I18N.Setting.ECM.AddSolutionDescription,
          hintStyle:{fontSize:"12px"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
      };
      return(
        <div className="jazz-ecm-measure-problem">
          <div className="name">
            {I18N.Setting.ECM.SolutionDetail}
          </div>
          <div className="row">
            <div className="label">
              {I18N.EM.Report.Name}
            </div>
            {canEdit?<TextField {...props.name}/>:<div className="jazz-ecm-measure-viewabletext">{MeasuresStore.getDisplayText(Name)}</div>}
          </div>
          <div className="row" style={{marginTop:"8px"}}>
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
