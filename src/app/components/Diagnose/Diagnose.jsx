import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames";
import {CircularProgress, Snackbar} from 'material-ui';
import find from 'lodash-es/find';
import LabelList from './LabelList.jsx';
import InputDataStore from 'stores/DataAnalysis/InputDataStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import Immutable from 'immutable';
import LabelDetail from './LabelDetail.jsx';
import CreateDiagnose from './CreateDiagnose.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import {formStatus} from 'constants/FormStatus.jsx';
import EditDiagnose from './EditDiagnose.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';

import SimilarProblem from './similar_problem.jsx';
import SolutionSuggest from './solution_suggest.jsx';
import GenerateSolution from './generate_solution.jsx';

function SolutionFull() {
  return PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

const SOLUTION_NAMES=[I18N.Setting.ECM.SolutionName.First,I18N.Setting.ECM.SolutionName.Second,I18N.Setting.ECM.SolutionName.Third,
                      I18N.Setting.ECM.SolutionName.Fourth,I18N.Setting.ECM.SolutionName.Fifth,I18N.Setting.ECM.SolutionName.Sixth,
                      I18N.Setting.ECM.SolutionName.Seventh,I18N.Setting.ECM.SolutionName.Eighth,I18N.Setting.ECM.SolutionName.Ninth,
                      I18N.Setting.ECM.SolutionName.Tenth]
let INIT_SOLUTION = Immutable.fromJS({
  "Problem": {
    "HierarchyId": 0,
    "Name": "",
    "EnergySys": 0,
    "IsFocus": true,
    "Description": "",
    "Status": 1,
    "IsConsultant": true,
    "EnergyProblemImages": [],
    "ProblemTypeId": 0,
    "SolutionTitle": "",
    "DataLabelId": 0,
    "DataLabelName": "",
    "DiagnoseIds": [],
  },
  "Solutions": [
    {
      "Name": "",
      "EnergySavingUnit": "",
      "ROI": 0,
      "SolutionDescription": "",
      "SolutionImages": []
    }
  ],
  "Remarks": [],
  "EnergyEffectStatus": true
});

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
}

function privilegeWithSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return (privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege())
  || privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege()));
}

function isListFull() {
	return privilegeWithSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function isBasicView() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isView.bind(privilegeUtil));
}

function isBasicNoPrivilege() {
	return !(isBasicView() || isBasicFull())
}

function SolutionFull() {
	return privilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

export default class Diagnose extends Component {

  static contextTypes = {
        hierarchyId: PropTypes.string
      };

  constructor(props, ctx) {
        super(props);
        this._onHasProblem = this._onHasProblem.bind(this);
        this._onItemTouchTap = this._onItemTouchTap.bind(this);
        this._onBasicTabSwitch = this._onBasicTabSwitch.bind(this);
        this._onCreated = this._onCreated.bind(this);
        this._onRemove=this._onRemove.bind(this);
        this._onShowSolutionSnakBar = this._onShowSolutionSnakBar.bind(this);
        this._onChanged = this._onChanged.bind(this);
    }

  state={
    infoTabNo:isBasicNoPrivilege()?2:1,
    hasProblem:false,
    selectedId:null,
    isBasic:true,
    formStatus:formStatus.VIEW,
    addLabel:null,
    createSuccessMeg: false,
    showSolutionTip:false,
    createStep: 0,
    createRefProblems: [],
    createRefPlans: [],
  }

  _onChanged(){
    this.forceUpdate()
  }

  _onHasProblem(){
    this.setState({
      hasProblem:CurrentUserStore.getDiagnoseBubble()
    })
  }

  _onCreated(isClose, lastCreateId) {
    this.setState({
      createSuccessMeg: isClose
    });
    //alert('hehehe:' + lastCreateId);
    // DiagnoseAction.getDiagnoseStatic(this.context.hierarchyId);
  }

  _switchTab(no){
    this.setState({
      infoTabNo:no,
      selectedId:null,
      isBasic: true,
    })
  }

  _onItemTouchTap(data){
    this.setState({
      selectedId:data.get('Id')
    })
  }

  _onBasicTabSwitch(no){
      this.setState({
        isBasic:no===1
      })
    }

  _onRemove(id){
    this.setState({
      selectedId:id
    })
  }

  _onShowSolutionSnakBar() {
    this.setState({
      showSolutionTip: true
    });
  }

  _renderTab(){
    if(isListFull() && !isBasicNoPrivilege()){
      return(
        <div className="titleTabs">
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===1})} onClick={this._switchTab.bind(this,1)} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            {I18N.Setting.Diagnose.DiagnoseProblem}
            {this.state.hasProblem?<BubbleIcon style={{width:'5px',height:'5px',marginTop:'-12px'}}/>:null}
          </div>
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===2})} onClick={this._switchTab.bind(this,2)} style={{marginLeft:'15px'}}>
            {I18N.Setting.Diagnose.DiagnoseList}
          </div>
        </div>
      )
    }
    else {
      return <div style={{marginTop:'30px'}}/>
    }

  }

  _getCombineSolution() {
    let initSolution = this._getCustomSolution();
    let problemId = this.state.selectedId;
    let currentProblem = DiagnoseStore.findDiagnoseById( problemId );

    if( this.state.createRefPlans && this.state.createRefPlans.length > 0 ) {
      if( this.state.createRefPlans.length === 1 ) {
        initSolution = initSolution.setIn(['Problem', 'Description'], this.state.createRefPlans[0].ProblemDescription);
      } else {
        let descArr = [];
        this.state.createRefPlans.map( (plan, idx) => {
          descArr.push(SOLUTION_NAMES[idx]);
          descArr.push('\r\n');
          descArr.push(plan.ProblemDescription);
          descArr.push('\r\n');
          descArr.push('\r\n');
        } );
        initSolution = initSolution.setIn(['Problem', 'Description'], descArr.join(''));
      }

      initSolution = initSolution.set('Solutions', Immutable.fromJS(this.state.createRefPlans.map(
        ({SolutionName, Id, ROI, SolutionDescription, ProblemLabels, CreatorUserName, CreatorUserId, Images}) => ({
          Id,
          Name: SolutionName,
          ExpectedAnnualEnergySaving: '',
          EnergySavingUnit: '',
          ExpectedAnnualCostSaving: '',
          InvestmentAmount: '',
          ROI,
          SolutionDescription: SolutionDescription,
          ProblemTypeName: ProblemLabels[0].ProblemTypeName,
          EnergeyLabel: ProblemLabels[0].DataLabelsName[0].Name,
          CreatorUserId,
          CreatorUserName,
          SolutionImages: Images.map( ({OssKey, Url, Name}) => ({ImageUrl: Url, OssKey, Name}) )
        }) )));
    }
    return initSolution;
                        // .setIn(['Problem', 'EnergySys '], problems.find( problem => problem.get('Id') === currentProblemId ).get('EnergySys '))
                        // .setIn(['Problem', 'HierarchyId'], this.context.hierarchyId);
  }
  _getCustomSolution() {
    let problemId = this.state.selectedId;
    let currentProblem = DiagnoseStore.findDiagnoseById( problemId );
    let initSolution = INIT_SOLUTION
            .setIn(['Problem', 'IsConsultant'], SolutionFull())
            .setIn(['Problem', 'HierarchyId'], this.context.hierarchyId)
            .setIn(['Problem', 'EnergyProblemImages'], Immutable.fromJS([currentProblem.toJS()].concat(this.state.createRefProblems).map( problem => Immutable.fromJS({
              Id: problem.Id,
              Name: problem.Name,
            }) ) ))
            .setIn(['Problem', 'ProblemTypeId'], DiagnoseStore.findLabelById(problemId).get('ProblemTypeId'))
            .setIn(['Problem', 'DataLabelId'], DiagnoseStore.findLabelById(problemId).get('Id'))
            .setIn(['Problem', 'DiagnoseIds'], [problemId])
            .setIn(['Problem', 'TagIds'], [currentProblem.get('TagId')].concat( this.state.createRefProblems.map( problem => problem.TagId ) ) );

    if( this.state.createRefProblems ) {
      if( this.state.createRefProblems.length === 0 ) {
        initSolution = initSolution.setIn(['Problem', 'Name'], currentProblem.get('TagName') + '-' + DiagnoseStore.findProblemById(problemId).get('Name'));
      } else {
        initSolution = initSolution.setIn(['Problem', 'Name'], DiagnoseStore.findLabelById(problemId).get('Name') + '-' +  DiagnoseStore.findProblemById(problemId).get('Name'));
        let DiagnoseIds = initSolution.getIn(['Problem', 'DiagnoseIds']);
        this.state.createRefProblems.map( problem => {
          DiagnoseIds.push( problem.Id );
        } );
        initSolution = initSolution.setIn(['Problem', 'DiagnoseIds'], DiagnoseIds);
      }
    }
    return initSolution;
  }

  _goStep0() {
    this.setState({createStep: 0, createRefProblems: [], createRefPlans: []});
  }

  getProblem(hierarchyId){
    this.setState({
      nodeDetail:null
    },()=>{
      DiagnoseAction.getDiagnoseStatic(hierarchyId)
    })
  }

  _goStep1() {
    if( (this.state.selectedId && DiagnoseStore.findLabelById( this.state.selectedId ) && DiagnoseStore.findLabelById( this.state.selectedId ).get('Children').size > 1) ) {
      this.setState({createStep: 1, createRefPlans: []});
    } else {
      if( this.state.createStep > 1 ) {
        this._goStep0();
      } else {
        this._goStep2();
      }
    }
  }
  _goStep2() {
    if( (DiagnoseStore.getSuggestSolutions() && DiagnoseStore.getSuggestSolutions().size > 0) ) {
      this.setState({createStep: 2});
    } else {
      if( this.state.createStep > 2 ) {
        this._goStep1();
      } else {
        this._goCustom();
      }
    }
  }

  _goStep3() {
    this.setState({createStep: 3, energySolution: this._getCombineSolution()});
  }

  _goCustom() {
    this.setState({createStep: 3, energySolution: this._getCustomSolution(), createRefPlans: []});
  }

  componentDidMount(){
    CurrentUserStore.addCurrentUserListener(this._onHasProblem);
    DiagnoseStore.addCreatedDiagnoseListener(this._onCreated);
    DiagnoseStore.addRemoveDiagnoseListener(this._onRemove);
    FolderStore.addSolutionCreatedListener(this._onShowSolutionSnakBar);
    DiagnoseStore.addChangeListener(this._onChanged);
    this.getProblem(this.context.hierarchyId);
  }

  componentWillReceiveProps(nextProps, nextCtx) {
    if( this.context.hierarchyId && nextCtx.hierarchyId === nextProps.params.customerId * 1 ) {
      nextProps.router.push(
        getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(nextProps.params)
      )
    }
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
    CurrentUserStore.removeCurrentUserListener(this._onHasProblem);
    DiagnoseStore.removeCreatedDiagnoseListener(this._onCreated);
    DiagnoseStore.removeRemoveDiagnoseListener(this._onRemove);
    FolderStore.removeSolutionCreatedListener(this._onShowSolutionSnakBar);
  }

render(){
  return(
    <div className="diagnose-panel">
      {this.state.createStep === 1 && <SimilarProblem
        onChange={ refProblems => {
          this.setState({
            createRefProblems: refProblems
          })
        }}
        onBack={() => this._goStep0()}
        onNext={() => this._goStep2()}
        onCancel={() => this._goStep0()}
        chartDatas={DiagnoseStore.getSimilarProblemChart()}
        currentProblemId={this.state.selectedId}
        checkedProblems={this.state.createRefProblems}
        problems={DiagnoseStore.findLabelById( this.state.selectedId ).get('Children')}
      />}
      {this.state.createStep === 2 && <SolutionSuggest
        onChange={ refPlans => {
          this.setState({
            createRefPlans: refPlans
          })
        }}
        onBack={() => this._goStep1()}
        onNext={() => this._goStep3()}
        onCustom={() => this._goCustom()}
        onCancel={() => this._goStep0()}
        checkedPlan={this.state.createRefPlans}
        plans={DiagnoseStore.getSuggestSolutions()}/>}
      {this.state.createStep === 3 && <GenerateSolution
        onBack={() => this._goStep2()}
        onNext={() => this._goStep0()}
        onCancel={() => this._goStep0()}
        energySolution={ this.state.energySolution }
        currentProblemId={this.state.selectedId}
        checkedProblems={this.state.createRefProblems}
        chartDatas={DiagnoseStore.getSimilarProblemChart()}
        onCreate={(data) => {
          DiagnoseAction.createSolution(data, () => {
            this.props.router.replace(RoutePath.ecm(this.props.params)+'?init_hierarchy_id='+this.context.hierarchyId);
          });
        }}
        />}
      {this._renderTab()}
      <div className="content">
        <LabelList ref='list' isFromProbem={this.state.infoTabNo===1} selectedNode={DiagnoseStore.findDiagnoseById(this.state.selectedId)}
          onItemTouchTap={this._onItemTouchTap} onTabSwitch={this._onBasicTabSwitch}
          onAdd={(label)=>{this.setState({
            formStatus:formStatus.ADD,
            addLabel:label
          })}}/>
          <LabelDetail isFromProbem={this.state.infoTabNo===1} selectedNode={DiagnoseStore.findDiagnoseById(this.state.selectedId)}
                       isBasic={this.state.isBasic} formStatus={this.state.formStatus} addLabel={this.state.addLabel}
                       onEdit={(label)=>{this.setState({
                         formStatus:formStatus.EDIT,
                         addLabel:label
                       })}}
                       willCreate={() => {this._goStep1()}}
                       />
      </div>
      {this.state.formStatus === formStatus.ADD &&
      <CreateDiagnose
        isBasic={this.state.isBasic}
        EnergyLabel={this.state.addLabel}
        DiagnoseItem={DiagnoseStore.findItemById(this.state.addLabel.get('ItemId'))}
        onClose={(id) => {
        this.setState({
          formStatus:formStatus.VIEW,
          addLabel: null,
          selectedId:id?id:this.state.selectedId
        });
      }}/>}
      {this.state.formStatus === formStatus.EDIT &&
      <EditDiagnose selectedNode={this.state.addLabel} onClose={() => {
        this.setState({
          formStatus:formStatus.VIEW,
          addLabel: null,
        });
      }}/>}
      <Snackbar message={I18N.Setting.Diagnose.Created}
          open={this.state.createSuccessMeg}
          onRequestClose={() => {this.setState({createSuccessMeg: false})}}/>

      <Snackbar ref='snackbar'
            open={this.state.showSolutionTip}
            onRequestClose={() => {
              this.setState({showSolutionTip: false})
            }}
            message={SolutionFull() ? I18N.Setting.DataAnalysis.SaveScheme.FullTip : I18N.Setting.DataAnalysis.SaveScheme.PushTip}
            action={I18N.Setting.DataAnalysis.SaveScheme.TipAction}
            onActionTouchTap={() => {
              util.openTab(RoutePath.ecm(this.props.params)+'?init_hierarchy_id='+this.context.hierarchyId);
            }}
          />
    </div>
  )
}
}
