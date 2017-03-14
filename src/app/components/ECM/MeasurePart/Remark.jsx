import React, { Component } from 'react';
import classNames from 'classnames';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import {DataConverter} from 'util/Util.jsx';
import moment from 'moment';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'controls/FlatButton.jsx';

function canDelete(canEdit,userId){
  return canEdit && userId===CurrentUserStore.getCurrentUser().Id
}

class AddRemark extends Component{

  constructor(props) {
        super(props);
      }

  state={
    value:''
  }
  render(){
    var prop = {
      isViewStatus: false,
      didChanged: (value)=>{this.setState({value})},
      defaultValue: this.state.value,
      title: I18N.Remark.Label,
      multiLine:true,
      style:{width:'100%'}
    };
    return(
      <div className="add_remark_item">
        <ViewableTextField {...prop}/>
        <div>
          <RaisedButton
            style={{border:'1px solid #ececec'}}
            label={I18N.Common.Button.Save}
            onClick={()=>{this.props.onSave(this.state.value)}} />
          <FlatButton
            label={I18N.Common.Button.Cancel2}
            onClick={this.props.onCancel} />
          </div>
      </div>
    )
  }
}

AddRemark.propTypes = {
  onCancel:React.PropTypes.func,
  onSave:React.PropTypes.func,
};

class RemarkItem extends Component{

  displayText(text){
      if(text.indexOf('\n')>-1){
        var v=text;
        var arr = v.split('\n');
        if (arr.length > 1) {
          v = arr.map(item => {
            return <div>{item}</div>;
            });
          }
          return v
        }
      else {
        return text
      }
  }

  render(){
    var j2d=DataConverter.JsonToDateTime;
    let {Remark,CreateUserName,CreateUserId,CreateTime}=this.props.remark.toJS();
    var info=`${moment(j2d(CreateTime)).format('YYYY-MM-DD hh:mm')} ${CreateUserName}`;
    return(
      <div className="remarkItem">
        <div className="text">{this.displayText(Remark)}</div>
        <div className="info">
          <div className="time_name">{info}</div>
          {canDelete(this.props.canEdit,CreateUserId) && <div className="delete" onClick={this.props.onDelete}>{I18N.Common.Button.Delete}</div>}
        </div>
      </div>
    )
  }
}

RemarkItem.propTypes = {
  remark:React.PropTypes.object,
  canEdit:React.PropTypes.bool,
  onDelete:React.PropTypes.func,
};
export default class Remark extends Component {

    constructor(props) {
      super(props);
    }

    state={
      remarkList:null,
      addRemark:false
    }

    _onChanged(){
      this.setState({
        remarkList:MeasuresStore.getRemarkList()
      })
    }

    _onAdd(e){
        this.setState({
          addRemark:true
        });
        e.stopPropagation();
    }

    _onDelete(remarkId){
        MeasuresAction.deleteRemark(this.props.problemId,remarkId)
    }

    _onSave(remark){
      MeasuresAction.addRemark(this.props.problemId,{EnergyProblemId:this.props.problemId,Remark,remark});
      this._onCancel();
    }

    _onCancel(){
      this.setState({
        addRemark:false
      })
    }

    componentDidMount(){
      MeasuresStore.addChangeListener(this._onChanged.bind(this));
      MeasuresAction.getRemarkList(this.props.problemId);
    }

    componentWillUnmount(){
      MeasuresStore.removeChangeListener(this._onChanged.bind(this));
    }

    render(){
      if(this.state.remarkList===null){
        return(
          <div className="flex-center">
           <CircularProgress  mode="indeterminate" size={80} />
         </div>
        )
      }else {
        return(
          <div className="measure-remark">
            <div className="title">
              <div className="name">{I18N.Remark.Label}</div>
              {this.props.canEdit && <div className={classNames({'addBtn': true,'active':!this.state.addRemark})} onClick={this._onAdd.bind(this)}>{I18N.Common.Button.Add}</div>}
            </div>
            {this.state.addRemark && <AddRemark onSave={this._onSave.bind(this)} onCancel={this._onCancel.bind(this)}/>}
            {this.state.remarkList.map(remark=>(
              <RemarkItem remark={remark} canEdit={this.props.canEdit} onDelete={this._onDelete.bind(this,remark.get('Id'))}/>
            ))}
          </div>
        )
      }
    }
  }

  Remark.propTypes = {
    problemId:React.PropTypes.number,
    canEdit:React.PropTypes.bool,
  };
