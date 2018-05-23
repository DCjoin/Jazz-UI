import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import {Status} from '../../constants/actionType/Measures.jsx';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import {MeasuresItem} from './MeasuresItem.jsx';
import {Snackbar, CircularProgress} from 'material-ui';
import {DIALOG_TYPE} from '../../constants/actionType/Measures.jsx';
import Problem from './MeasurePart/Problem.jsx';
import {Solution,SolutionLabel} from './MeasurePart/Solution.jsx';
import SolutionGallery from './MeasurePart/SolutionGallery.jsx';
import DisappareItem from './MeasurePart/DisappareItem.jsx';
import {EnergySys} from './MeasurePart/MeasureTitle.jsx';
import Immutable from 'immutable';

import PushConfirmDialog from'./push_confirm_dialog.jsx';

export default class NotPushPanel extends Component {
  constructor(props) {
    super(props);
    this._onChanged=this._onChanged.bind(this);
    this._onPush=this._onPush.bind(this);
    this._onDelete=this._onDelete.bind(this);
    this.merge=this.merge.bind(this);
    this._onMeasureItemClick=this._onMeasureItemClick.bind(this);


  }

  state={
    solutionList:null,
    checkList:null,
    dialogType:null,
    handleIndex:null,
    snackbarText:null,
    measureIndex:null,
    measureShow:false
    }

  _onChanged(){
    this.setState({
      solutionList:MeasuresStore.getSolutionList(),
      checkList:MeasuresStore.getCheckList(),
      snackbarText:MeasuresStore.getText()
    })
  }

  _onAllCheck(event,isChecked){
    MeasuresAction.checkSolution('all',isChecked);
  }

  _onPush(){
    var ids=MeasuresStore.getIds(this.state.handleIndex);
    if(this.state.handleIndex!=='Batch'){
      MeasuresAction.updateSolution(this.state.solutionList.getIn([this.state.handleIndex]).toJS(),()=>{
        MeasuresAction.pushProblem(ids);
      })
    }
    else {
      MeasuresAction.pushProblem(ids);
    }
    this.setState({
      handleIndex:null,
      solutionList:null,
    })
  }


  _onDelete(){
    var ids=MeasuresStore.getIds(this.state.handleIndex);
    MeasuresAction.deleteProblem(ids);
    this.setState({
      dialogType:null,
      handleIndex:null,
      measureShow:false,
      measureIndex:null,
    })
  }

  _onMeasureItemClick(index){
    this.setState({
      measureShow:true,
      measureIndex:index
    })
  }


  _renderAction(){
    if(this.state.solutionList===null || this.state.solutionList.size===0){
      return null
    }else {
      var styles={
        icon:{
          width: '18px',
          height: '18px',
          color:'#9fa0a4',
          marginRight:'10px',
          marginTop:'1px'
        },
        label:{
          fontSize: '14px',
          lineHeight: '1.5',
          textAlign: 'left',
          color: '#0f0f0f',
          // width:'28px'
        },
        box:{
          marginRight:'15px',
          // width:'54px'
        },
        btn:{
          width: '130px',
          height: '25px',
          borderRadius: '2px',
          border: 'solid 1px #dfdfdf',
          lineHeight:'15px'
        },
        btnIcon:{
          fontSize:'11px'
        },
        btnlabel:{
          fontSize: '12px',
          color: '#0f0f0f'
        }

      }
      return(
        <div className="action">
          <Checkbox disabled={MeasuresStore.IsAllCheckDisabled()} iconStyle={styles.icon} labelStyle={styles.label} checked={MeasuresStore.getAllSelectedStatus()} onCheck={this._onAllCheck} label={I18N.Tag.SelectAll} style={styles.box}/>
          <FlatButton label={I18N.Setting.ECM.PushAll} icon={<FontIcon className="icon-volume-push" color="#0f0f0f"style={styles.btnIcon}/>}
                style={styles.btn} labelStyle={styles.btnlabel}
                disabled={MeasuresStore.IsPushAllDisabled()} onClick={()=>{
              this.setState({
                dialogType:DIALOG_TYPE.BATCH_PUSH,
                handleIndex:'Batch'
              })
            }} />
        </div>
      )
    }

  }

  _renderOperation(index){
    var disabled=MeasuresStore.IsSolutionDisable(this.state.solutionList.getIn([index]).toJS());
    var styles={
      pushlabel:{
        fontSize:'14px',
        color:disabled?'#9fa0a4':'#32ad3d',
        paddingLeft:"5px",
        paddingRight:"0",
        marginLeft:"0"
      },
      deletelabel:{
        fontSize:'14px',
        color:'#0f0f0f',
        paddingLeft:"5px",
        paddingRight:"0",
        marginLeft:"0"
      },
      pushBtn:{
        minWidth:"59px",
        height:'21px',
        lineHeight:'21px',
        marginRight:'15px'
      },
      deleteButton:{
        minWidth:"59px",
        height:'21px',
        lineHeight:'21px'
      }
    };
    return(
      <div style={{display:'inline-block'}} onClick={(e)=>{e.stopPropagation()}}>
        <FlatButton disabled={disabled} label={I18N.Setting.ECM.PushBtn} style={styles.pushBtn}
                    onClick={(e)=>{
                      e.stopPropagation();
                        this.setState({
                          dialogType:DIALOG_TYPE.PUSH,
                          handleIndex:index
                        })
                    }} labelStyle={styles.pushlabel} icon={<FontIcon className="icon-to-ecm" color="#32ad3c" style={styles.pushlabel}/>}/>
                  <FlatButton label={I18N.Common.Button.Delete} style={styles.deleteButton}
                    onClick={(e)=>{
                      e.stopPropagation();
                      this.setState({
                        dialogType:DIALOG_TYPE.DELETE,
                        handleIndex:index
                      })
                    }} labelStyle={styles.deletelabel} icon={<FontIcon className="icon-delete" color="#0f0f0f" style={styles.deletelabel}/>}/>
      </div>
    )
  }

  _renderList(){
    if(this.state.solutionList===null){
      return (
        <div className="flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else if(this.state.solutionList.size===0){
      return null
    }
    else {
      return(
        <div ref="content" className="content">
          {this.state.solutionList.map((solution,index)=>{
            // measure:solution
            var prop={
              measure:solution,
              hasCheckBox:true,
              isChecked:this.state.checkList.getIn([index,'checked']),
              onChecked:(e,isChecked)=>{
                          MeasuresAction.checkSolution(index,isChecked);
                        },
              disabled:MeasuresStore.IsSolutionDisable(solution.toJS()),
              personInCharge:null,
              action:this._renderOperation(index),
              onClick:()=>{this._onMeasureItemClick(index)}
            };
            if(this.state.dialogType===null && this.state.handleIndex!==null && index===this.state.handleIndex){
              return <DisappareItem {...this.getProps()} onEnd={this._onPush}><MeasuresItem {...prop}/></DisappareItem>
            }
            else {
              return <MeasuresItem {...prop}/>
            }
          }
                  )}
        </div>

      )
    }
  }

  _renderPushDialog(){
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
    var content=this.state.dialogType===DIALOG_TYPE.BATCH_PUSH
                ?I18N.format(I18N.Setting.ECM.BatchPushContent,MeasuresStore.getNamesById('Batch'))
                :I18N.format(I18N.Setting.ECM.PushContent);
return(
     <NewDialog
        open={true}
        overlayStyle={{zIndex:'1000'}}
        actionsContainerStyle={styles.action}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Setting.ECM.Push}
              onClick={()=>{
                this.setState({
                  dialogType:null,
                  measureShow:false,
                  measureIndex:null,
                },()=>{
                  if(this.state.handleIndex==='Batch'){
                    this._onPush()
                  }
                })
              }} />,
            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              dialogType: null,
                              handleIndex:null
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>

   

    )
  }

  _renderDeleteDialog(){
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
    var content=I18N.format(I18N.Setting.ECM.DeleteContent);
    return(
      <NewDialog
        open={true}
        actionsContainerStyle={styles.action}
        overlayStyle={{zIndex:'1000'}}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Common.Button.Delete}
              onClick={this._onDelete} />,
            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              dialogType: null,
                              handleIndex:null
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
  }

  _renderMeasureDialog(){
    var currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);
    var onSave=(solution)=>{
      this.setState({
        measureShow:false,
        measureIndex:null
    },()=>{
      // currentSolution=MeasuresStore.getValidParams(currentSolution);
      MeasuresAction.updateSolution(solution.toJS(),()=>{
        MeasuresAction.getGroupSettingsList(this.props.hierarchyId,Status.NotPush)
      });
    })
    };
   var props={
     title:{
       measure:currentSolution,
       canNameEdit:true,
       canEnergySysEdit:true,
       merge:this.merge,
     },
     problem:{
       measure:currentSolution,
       canEdit:true,
       merge:this.merge,
     },
     solution:{
       measure:currentSolution,
       canEdit:true,
       merge:this.merge,
     },
     gallery: {
      measure:currentSolution,
      onDelete: (idx) => {
        let imagesPath = ['Problem','EnergyProblemImages'];
        this.merge(imagesPath, currentSolution.getIn(imagesPath).delete(idx));
      }
     }
   }
    /*return(
      <NewDialog
        open={this.state.measureShow}
        hasClose
        isOutsideClose={false}
        onRequestClose={onClose}
        titleStyle={{margin:'0 7px',paddingTop:"7px"}}
        contentStyle={{overflowY:"auto",display:'block',padding:"6px 28px 14px 32px",margin:0}}
        >
        <div className="jazz-ecm-push-operation" style={{paddingRight:'19px',borderBottom:"1px solid #e6e6e6"}}>
          {this._renderOperation(this.state.measureIndex)}
          <EnergySys {...props.title}/>
        </div>

        <SolutionLabel {...props.solution}/>
        <Solution {...props.solution}/>
        <Problem {...props.problem}/>
        <div style={{margin:"46px 20px 0 16px"}}><SolutionGallery {...props.gallery}/></div>

      </NewDialog>
    )*/

    return <PushConfirmDialog solution={currentSolution}
                               onPush={(e,solution)=>{
                                 e.stopPropagation();
                                this.setState({
                                  dialogType:DIALOG_TYPE.PUSH,
                                  handleIndex:this.state.measureIndex
                                },()=>{
                                  this.merge([],solution)
                                })
                               }}
                               onDelete={(e)=>{
                                 e.stopPropagation();
                                this.setState({
                                  dialogType:DIALOG_TYPE.DELETE,
                                  handleIndex:this.state.measureIndex
                                })
                               }}
                               onClose={()=>{
                                 this.setState({
                                   measureShow:false
                                 })
                               }}
                               onSave={onSave}/>
  }

  getProps(){
  var {destX,destY}=this.props.generatePositon,
      width=ReactDom.findDOMNode(this.refs.content).clientWidth-10-10-5-15;
  return{
    destX,destY,width
  }
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }

  // componentWillMount(){
  //   MeasuresStore.setSolutionList(solutionList,1);//for test
  //   this.setState({
  //     solutionList:Immutable.fromJS(solutionList),//for test
  //     checkList:MeasuresStore.getCheckList()
  //   })
  // }

  componentDidMount(){
    MeasuresStore.addChangeListener(this._onChanged);
    MeasuresAction.getGroupSettingsList(this.props.hierarchyId,Status.NotPush);
    // MeasuresAction.getGroupSettingsList(100001,Status.NotPush);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.hierarchyId !== this.props.hierarchyId) {
      MeasuresAction.getGroupSettingsList(nextProps.hierarchyId,Status.NotPush);
    }
  }

  componentWillUnmount(){
    MeasuresStore.removeChangeListener(this._onChanged);
  }

  render(){
    var dialog=null;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.PUSH:
      case DIALOG_TYPE.BATCH_PUSH:
            dialog=this._renderPushDialog();
            break;
      case DIALOG_TYPE.DELETE:
            dialog=this._renderDeleteDialog();
            break;
      default:

    }
    return(
      <div className="jazz-ecm-notPush">
        {this._renderAction()}
        {this._renderList()}
        {dialog}
        {this.state.solutionList!==null && this.state.solutionList.size!==0 && this.state.measureShow && this._renderMeasureDialog()}
        <Snackbar ref='snackbar' open={!!this.state.snackbarText} onRequestClose={()=>{
            MeasuresAction.resetErrorText()
          }} message={this.state.snackbarText}/>
      </div>
    )

  }
}

  NotPushPanel.propTypes = {
    hierarchyId:React.PropTypes.number,
    generatePositon:React.PropTypes.Object,
  };
