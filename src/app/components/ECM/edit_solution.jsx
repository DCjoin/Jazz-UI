import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import Snackbar from 'material-ui/Snackbar';
import Immutable from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import Remark from './MeasurePart/Remark.jsx';
import ReactDom from 'react-dom';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'controls/FlatButton.jsx';
import {PlanTitle,ProblemDetail,PlanDetail} from '../Diagnose/generate_solution.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import StatusCmp from './MeasurePart/Status.jsx';
import {EnergySys} from './MeasurePart/MeasureTitle.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import ReactDOM from 'react-dom';

const NUMBER_REG = /^[1-9]\d*(\.\d+)?$/;

 const ICONSTYLE = {
        fontSize: '20px'
      },
      STYLE = {
        padding: '0px',
        fontSize: '20px',
        lineHeight:"20px",
        marginRight:'12px'
      };

  const SCROLL_OFFSET=184;
function privilegeWithPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege());
}
//能源经理
function PushIsFull() {
	return privilegeWithPush(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithPushAndNotPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

function pushAndNotPushIsFull() {
	return privilegeWithPushAndNotPush(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class EditSolution extends Component {
  constructor(props) {
    super(props);
    this._onClose=this._onClose.bind(this);
    this._onChange=this._onChange.bind(this);
    this._onSave=this._onSave.bind(this);
    this._onScroll=this._onScroll.bind(this);
    this._onBlur=this._onBlur.bind(this);
  }

    state={
      preSolution:this.props.solution,
      solution:this.props.solution,
      energySys:this.props.solution.getIn(["Problem",'EnergySys']),
      snackBarText:null,
      saveTipShow:false,
      solutionUnfold:true,
      errorData:Immutable.fromJS({})
    }

      _onScroll(e){
                var scrollTop=ReactDOM.findDOMNode(this).scrollTop;
                var width=ReactDOM.findDOMNode(this.refs.save_column).clientWidth;
                if(scrollTop>SCROLL_OFFSET){
                        ReactDOM.findDOMNode(this.refs.save_column).style.position='fixed';
                        ReactDOM.findDOMNode(this.refs.save_column).style.top=0;
                        ReactDOM.findDOMNode(this.refs.save_column).style.width=width+'px';
                        ReactDOM.findDOMNode(this.refs.save_column).style.backgroundColor='#ffffff';
                        ReactDOM.findDOMNode(this.refs.save_column).style.zIndex=2

                }else{
                       ReactDOM.findDOMNode(this.refs.save_column).style.position='relative';
                }
        }

    _hasError(){
       var errorData=this._validateAll();
       return errorData.get("Problem").find(item=>item!=='')!==undefined || errorData.get("Solutions").map(solution=>solution.find(item=>item!=='')!==undefined)
                                                                                    .includes(true) 
    }
    _onSave(){
      var errorData=this._validateAll();
      if(MeasuresStore.IsSolutionDisable(this.state.solution.toJS()) || this._hasError()){
        this.setState({
          snackBarText:I18N.Setting.ECM.RequiredTip,
          errorData:this._validateAll()
        })
      }else{
        MeasuresAction.updateSolution(this.state.solution.toJS(),()=>{
          this.setState({
            snackBarText:I18N.Setting.ECM.SaveSuccess,
            preSolution:this.state.solution
          })
      });
      }

    }

    _onClose(){
      var currentSolution=this.state.solution.setIn(["Problem",'EnergySys'],this.state.energySys);

      if(!this.props.hasPriviledge){
        this.props.onClose()
      }
      if(MeasuresStore.IsSolutionDisable(currentSolution.toJS()) || this._hasError()){
        this.setState({
          snackBarText:I18N.Setting.ECM.RequiredTip,
          errorData:this._validateAll()
        })
      }else{
        if(Immutable.is(currentSolution,this.state.preSolution)){
            this.props.onClose(!Immutable.is(this.state.preSolution,this.props.solution))
          
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

      _onBlur( paths, value ) {
        let errorData = this.state.errorData;

        errorData=this._validate(paths, value,errorData);

        this.setState({
          errorData
        });
  }

    _renderSolution(){
      var user=this.state.solution.getIn(['Problem','CreateUserName']);
      var iconstyle={fontSize:'16px'},style={padding:'0',fontSize:'16px',height:'16px',linHeght:'16px',marginRight:'8px',marginLeft:'8px'};
      var {errorData}=this.state;
      return(
        <div>
                <div ref="save_column" className="push-panel-solution-header">
                    <div className="push-panel-solution-header-title">
                      <FontIcon className="icon-pay-back-period" color="#32ad3c" iconStyle ={ICONSTYLE} style = {STYLE} />
                      <div className="font">{I18N.Setting.ECM.Solution}</div>
                      <div className="create-user">{I18N.Setting.ECM.PushPanel.CreateUser+'：'+user}</div>

                    </div>
                    <div className="push-panel-solution-header-operation">
                      {this.props.hasPriviledge && this.state.solutionUnfold && <div onClick={this._onSave} style={{marginRight:'50px'}}> <FontIcon className="icon-save" color="#626469" iconStyle ={iconstyle} style = {style} />
                      {I18N.Common.Button.Save}</div>}
                      {this.state.solutionUnfold && <div onClick={()=>{this.setState({solutionUnfold:!this.state.solutionUnfold})}}> {I18N.Setting.ECM.UnFold} <FontIcon className="icon-arrow-up" color="#626469" iconStyle ={iconstyle} style = {style} />
                        </div>}
                        {!this.state.solutionUnfold && <div onClick={()=>{this.setState({solutionUnfold:!this.state.solutionUnfold})}}> {I18N.Setting.ECM.Fold} <FontIcon className="icon-arrow-down" color="#626469" iconStyle ={iconstyle} style = {style} />
                        </div>}
                    </div>
              
                  </div>
                {this.state.solutionUnfold && <div className="solution-content">
                {this.props.hasPriviledge && <session className='session-container'>
                  <PlanTitle errorData={errorData} isRequired={true} energySolution={this.state.solution} onChange={this._onChange} onBlur={this._onBlur}/>
                </session>}
                <session className='session-container'>
                  <PlanDetail errorData={errorData} hasPicTitle={false} isView={!this.props.hasPriviledge} solutionTitle={PushIsFull()?null:this.state.solution.getIn(['Problem','SolutionTitle'])} isRequired={true} Solutions={this.state.solution.get('Solutions')} onChange={this._onChange} onBlur={this._onBlur}/>
                </session>
                <session className='session-container'>
                  <ProblemDetail errorData={errorData} isView={!this.props.hasPriviledge} isRequired={true} energySolution={this.state.solution} onChange={this._onChange} hasEnergySys={false} onBlur={this._onBlur}/>
                </session>
             </div>}
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
              onClick={()=>{this.props.onSave(this.state.solution.setIn(["Problem",'EnergySys'],this.state.energySys))}} />,
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

      _renderOperation(){
          var problem=this.state.solution.get('Problem'),
              status=problem.get('Status'),
              currentSolution=this.state.solution.setIn(["Problem",'EnergySys'],this.state.energySys);
          var prop={
            energySys:{
              measure:currentSolution,
              canNameEdit:this.props.hasPriviledge,
              canEnergySysEdit:this.props.hasPriviledge,
              merge:(paths,value)=>{this.setState({energySys:value})},
            }
          }
          return(
            <div className="jazz-ecm-push-operation">
              <StatusCmp status={status} canEdit={this.props.hasStatusPriviledge} onChange={(value)=>{this.props.onStatusChange(value,this.state.solution)}}/>
              <EnergySys {...prop.energySys}/>
              {this.props.person(problem,true,0,false,this.state.solution)}        
            </div>
          )
  }

    _renderRemark(){
      var prop={
       problemId:this.state.solution.getIn(['Problem','Id']),
       canEdit:this.props.hasRemarkPriviledge,
       onScroll:(height)=>{ReactDom.findDOMNode(this).scrollTop+=height+15}
     }
     return<Remark {...prop}/>
    }

    render(){
      return(
        <div className="solution-edit" onScroll={this._onScroll}>
          <div className="content-field">
            <div className="solution-head" style={{display:'flex',alignItems: 'center'}}>
              <FontIcon className="icon-pay-back-period" color="#32ad3c" iconStyle ={ICONSTYLE} style = {STYLE} />
              {I18N.Setting.ECM.SolutionAssign}</div>

            <IconButton iconClassName="icon-close" style={{padding:0,width:'24px',height:'26px'}} iconStyle={{fontSize:'24px',color:"#9fa0a4"}}
             onClick={this._onClose}/> 

             {this._renderOperation()}
             {this._renderSolution()}
             {this._renderRemark()}

          </div>
         <Snackbar ref='snackbar' autoHideDuration={1500} open={this.state.snackBarText!==null} onRequestClose={()=>{this.setState({snackBarText:null})}} message={this.state.snackBarText}/>
         {this.state.saveTipShow && this._renderSaveTip()}
        </div>
      )
    }
}