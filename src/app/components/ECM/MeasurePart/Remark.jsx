import React, { Component } from 'react';
import ReactDom from 'react-dom';
import FontIcon from 'material-ui/FontIcon';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import {DataConverter} from 'util/Util.jsx';
import moment from 'moment';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
// import ViewableTextField from 'controls/ViewableTextField.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TextField from 'material-ui/TextField';

function canDelete(canEdit,userId){
  return canEdit && userId===CurrentUserStore.getCurrentUser().Id
}

function getNewRemarkHeight(el){
  return Array.prototype.slice.call(el.querySelectorAll('.remarkItem'))[0].clientHeight
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
      onChange: (e,value)=>{this.setState({value})},
      value: this.state.value,
      hintText:I18N.Setting.ECM.AddRemark,
      hintStyle:{fontSize:"12px"},
      multiLine:true,
      style:{width:'100%'}
    };
    return(
      <div className="add_remark_item">
        <TextField {...prop}/>
        <div>
          <FlatButton
            style={{width: '67px',height: '24px',borderRadius: '2px',border: 'solid 1px #3dcd58',lineHeight:'20px',minWidth:"67px"}}
            labelStyle={{color:'#3dcd58',fontSize:'14px'}}
            label={I18N.Common.Button.Save}
            disabled={this.state.value===''}
            onClick={()=>{
                          this.props.onSave(this.state.value);
                          this.setState({
                            value:""
                          })
                        }} />
          <FlatButton
            style={{width: '67px',height: '24px',borderRadius: '2px',lineHeight:'20px',minWidth:"67px",marginLeft:'15px'}}
            labelStyle={{color:'#626469',fontSize:'14px'}}
            label={I18N.Common.Button.Cancel2}
            onClick={()=>{
              this.props.onCancel();
              this.setState({
                value:""
              })
            }} />
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
    var info=`${moment(j2d(CreateTime)).format('YYYY-MM-DD HH:mm')} ${CreateUserName}`;
    return(
      <div className="remarkItem">
        <div className="text">{this.displayText(Remark)}</div>
        <div className="info">
          <div className="time_name">{info}</div>
          {canDelete(this.props.canEdit,CreateUserId) && <FontIcon className="icon-delete" style={{marginLeft:'5px',fontSize:'14px'}} onClick={this.props.onDelete}/>}
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

    componentDidUpdate(prevProps,prevState){
      if(prevState.remarkList!==null && prevState.remarkList.size<this.state.remarkList.size){
        this.props.onScroll(getNewRemarkHeight(ReactDom.findDOMNode(this)))
      }
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
            </div>
            {this.props.canEdit && <AddRemark onSave={this._onSave.bind(this)} onCancel={this._onCancel.bind(this)}/>}
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
    onScroll:React.PropTypes.func,
  };
