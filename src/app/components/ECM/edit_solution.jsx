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

 const ICONSTYLE = {
        fontSize: '20px'
      },
      STYLE = {
        padding: '0px',
        fontSize: '20px',
        lineHeight:"20px",
        marginRight:'12px'
      };
export default class EditSolution extends Component {
  constructor(props) {
    super(props);
    this._onClose=this._onClose.bind(this);
  }

    state={
      solution:this.props.solution,
      energySys:this.props.solution.getIn(["Problem",'EnergySys']),
      snackBarOpen:false,
      saveTipShow:false,
      solutionUnfold:true
    }

    _onSave(){
      
    }

    _onClose(){
      var currentSolution=this.state.solution.setIn(["Problem",'EnergySys'],this.state.energySys);
      if(MeasuresStore.IsSolutionDisable(currentSolution.toJS())){
        this.setState({
          snackBarOpen:true
        })
      }else{
        if(Immutable.is(currentSolution,this.props.solution)){
          this.props.onClose()
        }else{
          this.setState({
            saveTipShow:true
          })
        }
      }
    }

    _renderSolution(){
      var user=this.state.solution.getIn(['Problem','CreateUserName']);
      var iconstyle={fontSize:'16px'},style={padding:'0',fontSize:'16px',height:'16px',linHeght:'16px',marginRight:'8px',marginLeft:'8px'};
      return(
        <div className="push-panel-solution-header">
          <div className="push-panel-solution-header-title">
            <FontIcon className="icon-pay-back-period" color="#32ad3c" iconStyle ={ICONSTYLE} style = {STYLE} />
            <div className="font">{I18N.Setting.ECM.Solution}</div>
            <div className="create-user">{I18N.Setting.ECM.PushPanel.CreateUser+'：'+user}</div>

          </div>
          <div className="push-panel-solution-header-operation">
            <div onClick={this._onSave} style={{marginRight:'50px'}}> <FontIcon className="icon-save" color="#626469" iconStyle ={iconstyle} style = {style} />
            {I18N.Common.Button.Save}</div>
            {this.state.solutionUnfold && <div onClick={()=>{this.setState({solutionUnfold:!this.state.solutionUnfold})}}> {I18N.Setting.ECM.UnFold} <FontIcon className="icon-arrow-up" color="#626469" iconStyle ={iconstyle} style = {style} />
              </div>}
              {!this.state.solutionUnfold && <div onClick={()=>{this.setState({solutionUnfold:!this.state.solutionUnfold})}}> {I18N.Setting.ECM.Fold} <FontIcon className="icon-arrow-down" color="#626469" iconStyle ={iconstyle} style = {style} />
              </div>}
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
              onClick={()=>{this.props.onSave(this.state.solution.setIn(["Problem",'EnergySys'],this.state.energySys))}} />,
            <FlatButton
              label={I18N.Common.Button.NotSave}
              onClick={() => {this.setState({
                              saveTipShow:false
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
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
        <div className="solution-edit">
          <div className="content-field">
            <div className="solution-head" style={{display:'flex',alignItems: 'center'}}>
              <FontIcon className="icon-pay-back-period" color="#32ad3c" iconStyle ={ICONSTYLE} style = {STYLE} />
              {I18N.Setting.ECM.Solution}</div>

            <IconButton iconClassName="icon-close" style={{padding:0,width:'24px',height:'26px'}} iconStyle={{fontSize:'24px',color:"#9fa0a4"}}
             onClick={this._onClose}/>

             {this.props.operation}
             {this._renderSolution()}
             {this._renderRemark()}

          </div>
         <Snackbar ref='snackbar' autoHideDuration={1500} open={!!this.state.snackBarOpen} onRequestClose={()=>{this.setState({snackBarOpen:false})}} message={I18N.Setting.ECM.RequiredTip}/>
         {this.state.saveTipShow && this._renderSaveTip()}
        </div>
      )
    }
}