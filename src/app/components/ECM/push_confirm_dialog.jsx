import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'controls/FlatButton.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import Snackbar from 'material-ui/Snackbar';
import Immutable from 'immutable';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import ImagGroupPanel from 'controls/ImagGroupPanel.jsx';
import {PlanTitle,ProblemDetail,PlanDetail} from '../Diagnose/generate_solution.jsx';

const NUMBER_REG = /^[1-9]\d*(\.\d+)?$/;

export default class PushConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this._onClose=this._onClose.bind(this);
    this._onChange=this._onChange.bind(this);
    this._onPush=this._onPush.bind(this);
    this._onBlur=this._onBlur.bind(this);
    
    
  }

    state={
      solution:this.props.solution,
      snackBarOpen:false,
      saveTipShow:false,
      errorData:Immutable.fromJS({})
    }

    _hasError(){
       var errorData=this._validateAll();
       return errorData.get("Problem").find(item=>item!=='')!==undefined || errorData.get("Solutions").map(solution=>solution.find(item=>item!=='')!==undefined)
                                                                                    .includes(true) 
    }

    _validate(paths,value,errorData){
       var pathName=paths.slice(0);
        var error='';
        if(paths[0]==='Solutions'){
          pathName=pathName.pop();
        }else{pathName=pathName.join('')}

       

        if( ~paths.indexOf('ExpectedAnnualEnergySaving') ) {
            if( value && !NUMBER_REG.test(value) ) {
                error = I18N.Setting.ECM.NumberrTip;
              }
            }
    
        if( ~paths.indexOf('ExpectedAnnualCostSaving') ) {
      
              if( value && !NUMBER_REG.test(value) ) {
                 error = I18N.Setting.ECM.NumberrTip;
                }
            }
        if( ~paths.indexOf('InvestmentAmount') ) {
      
            if( value && !NUMBER_REG.test(value) ) {
                error = I18N.Setting.ECM.NumberrTip;
              }
     
            }    

        if( paths.join('') === 'ProblemSolutionTitle' ) {
          if( !value ) {
            error = I18N.Setting.Diagnose.PleaseInput+I18N.Setting.Diagnose.SolutionTitle;
          }
        }else if( paths.join('') === 'ProblemEnergySys' ) {
          if( !value && !this.state.solution.getIn(paths)) {
            error = I18N.Setting.Diagnose.PleaseSelect+I18N.Setting.Diagnose.EnergySys;
          }
        }else if(value!==0 && !value && pathName!=='InvestmentAmount'){
            if(pathName==='Name'){pathName='SolutionName'}
            if(pathName==='EnergySavingUnit'){pathName="ExpectedAnnualEnergySaving"}
           error=I18N.Setting.Diagnose.PleaseInput+I18N.Setting.Diagnose[pathName];   
            if(pathName==='EnergySavingUnit'){ paths=paths.slice(0,2)
                                           paths.push('ExpectedAnnualEnergySaving')}    
        }

        errorData=errorData.setIn(paths,error);
        return errorData
    }

    _validateAll(){
      var validatePath={
        Problem:['SolutionTitle','Name','EnergySys','Description'],
        Solution:['ExpectedAnnualEnergySaving','EnergySavingUnit','ExpectedAnnualCostSaving','Name','SolutionDescription']
      };
      var errorData=this.state.errorData;
      validatePath.Problem.forEach(key=>{
        errorData=this._validate(['Problem',key],this.state.solution.getIn(['Problem',key]),errorData)
      })
      validatePath.Solution.forEach(key=>{
        this.state.solution.get("Solutions").forEach((solution,idx)=>{
          errorData=this._validate(['Solutions',idx,key],solution.get(key),errorData)
        })

      })

      return errorData
    }

    _onClose(){
      if(MeasuresStore.IsSolutionDisable(this.state.solution.toJS()) || this._hasError()){
        this.setState({
          snackBarOpen:true,
          errorData:this._validateAll()
        })
      }else{
        if(Immutable.is(this.state.solution,this.props.solution)){
          this.props.onClose()
        }else{
          this.setState({
            saveTipShow:true
          })
        }
      }
    }

     _onChange( paths, value ) {
        this.setState({
          solution: this.state.solution.setIn(paths, value)
        });
      }

      _getSaveSolution(){
        return this.state.solution.set(
                  'Solutions',
                  this.state.solution
                    .get('Solutions')
                    .map( solution =>
                      solution.set(
                        'ROI',
                        MeasuresStore.getInvestmentReturnCycle(
                          solution.get('InvestmentAmount'),
                          solution.get('ExpectedAnnualCostSaving')
                        )
                      )
                    )
                )
      }

    _onPush(e){
       if(MeasuresStore.IsSolutionDisable(this.state.solution.toJS()) || this._hasError()){
        this.setState({
          snackBarOpen:true,
          errorData:this._validateAll()
        })
      }else{
        this.props.onPush(e,this._getSaveSolution().setIn(["Problem","Status"],2))
      }     
    }

      _onBlur( paths, value ) {
        let errorData = this.state.errorData;

        errorData=this._validate(paths, value,errorData);

        this.setState({
          errorData
        });
  }

    _renderFooter(){
                return(
                        <div className="solution-footer">
                                <div className="action">
                                     <FlatButton flat primary label={I18N.Setting.ECM.PushBtn}
                                             onClick={this._onPush}/>
                                     <FlatButton outline secondary label={I18N.Common.Button.Delete} onClick={this.props.onDelete}/>
                                </div>
                        </div>
                )
        }

    _renderSaveTip(){
          var styles={
      content:{
        padding:'30px',
        display:'flex',
        justifyContent:'center'
      },
      action:{
        padding:'0 30px'
      }
    };
    var content=I18N.format(I18N.Setting.ECM.SaveTip);
    return(
      <NewDialog
        open={true}
        actionsContainerStyle={styles.action}
        overlayStyle={{zIndex:'1000'}}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Common.Button.Save}
              onClick={()=>{this.props.onSave(this._getSaveSolution())}} />,
            <FlatButton
              label={I18N.Common.Button.NotSave}
              onClick={() => {this.setState({
                              saveTipShow:false
                              },()=>{
                                this.props.onClose()
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
    }

    render(){
      var {errorData}=this.state;
      return(
        <div className="solution-edit">
          <div className="content-field">
            <div className="solution-head">{I18N.Setting.ECM.Solution}</div>
            <IconButton iconClassName="icon-close" style={{padding:0,width:'24px',height:'26px'}} iconStyle={{fontSize:'24px',color:"#9fa0a4"}}
             onClick={this._onClose}/>
             <div className="solution-content">
                <session className='session-container'>
                  <PlanTitle errorData={errorData} isRequired={true} energySolution={this.state.solution} onChange={this._onChange} hasSubTitle={false} onBlur={this._onBlur}/>
                </session>
                <session className='session-container'>
                  <ProblemDetail errorData={errorData} isRequired={true} energySolution={this.state.solution} onChange={this._onChange} hasEnergySys={true} onBlur={this._onBlur}/>
                </session>
                <session className='session-container'>
                  <PlanDetail errorData={errorData} hasPicTitle={false} isRequired={true} Solutions={this.state.solution.get('Solutions')} onChange={this._onChange} onBlur={this._onBlur}/>
                </session>
             </div> 

          </div>
         
          {this._renderFooter()}
         <Snackbar ref='snackbar' autoHideDuration={1500} open={!!this.state.snackBarOpen} onRequestClose={()=>{this.setState({snackBarOpen:false})}} message={I18N.Setting.ECM.RequiredTip}/>
         {this.state.saveTipShow && this._renderSaveTip()}
        </div>
      )
    }

}
