import React, { Component } from 'react';
import ReactDom from 'react-dom';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
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
    value:'',
    errorshow:false
  }
  render(){
    var MULTISTYLE={
        width: '770px',
        fontSize:'14px',
        padding:'0 10px',
        boxSizing:' border-box'     
};
    // var prop = {
    //   onChange: (e,value)=>{this.setState({value})},
    //   value: this.state.value,
    //   hintText:I18N.Setting.ECM.AddRemark,
    //   hintStyle:{fontSize:"12px",paddingLeft:"8px"},
    //   multiLine:true,
    //   style:{width:'100%'}
    // };
    return(
      <div className="add_remark_item">
        <div className="text-field">
              <div className="text">
                  <TextField hintText={I18N.Setting.ECM.AddRemark}
                             hintStyle={{bottom:'15px'}}
                             multiLine={true}
                             rowsMax={10000}
                             value={this.state.value}
                            style={MULTISTYLE}
                            underlineShow={false}
                            onChange={(e,value)=>{this.setState({value,errorshow:false})}}
                            textareaStyle={{overflowY:'hidden'}}/>                                                               
              </div>
              {this.state.errorshow && <div style={{color:'#dc0a0a',fontSize:'12px',marginTop:'8px'}}>{I18N.Setting.ECM.AddRemarkTip}</div>}
          </div>
        <div style={{marginTop:'24px',display:'flex',alignItems: "baseline"}}>
          <FlatButton
            style={{width: '86px',height: '28px',borderRadius: '2px',border: 'solid 1px #3dcd58',lineHeight:'28px',minWidth:"86px"}}
            labelStyle={{color:'#3dcd58',fontSize:'14px',padding:'0px',verticalAlign:'baseline'}}
            label={I18N.Setting.ECM.AddRemark}
            onClick={()=>{
                          if(this.state.value===''){
                            this.setState({errorshow:true})
                          }else{
                            this.props.onSave(this.state.value);
                          this.setState({
                            errorshow:false,
                            value:"",
                          })
                          }
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
    var date=moment(j2d(CreateTime)).format('YYYY-MM-DD'),
        time=moment(j2d(CreateTime)).format('HH:mm')
    var info=`${moment(j2d(CreateTime)).format('YYYY-MM-DD HH:mm')} ${CreateUserName}`;
    return(
      <div className="remarkItem">
        <div className="text">{this.displayText(Remark)}</div>
        <div className="info">
          <div className="time_name">
          {date}
          <span style={{marginLeft:'10px',marginRight:'10px'}}>{time}</span>
          {CreateUserName}
        </div>
          {canDelete(this.props.canEdit,CreateUserId) && <IconButton iconClassName="icon-delete" iconStyle={{marginLeft:'10px',fontSize:'14px',color:"#505559"}} style={{padding:'0',width:'14px',height:'14px'}} onClick={this.props.onDelete}/>}
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

 const ICONSTYLE = {
        fontSize: '20px'
      },
      STYLE = {
        padding: '0px',
        fontSize: '20px',
        lineHeight:"20px",
        marginRight:'12px'
      };

export default class Remark extends Component {

    constructor(props) {
      super(props);
      this._onChanged = this._onChanged.bind(this);
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
      this.setState({
        remarkList:null
      },()=>{
         MeasuresAction.deleteRemark(this.props.problemId,remarkId)
      })
       
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
      MeasuresStore.addChangeListener(this._onChanged);
      !this.props.remarkList && MeasuresAction.getRemarkList(this.props.problemId);
    }

    componentDidUpdate(prevProps,prevState){
      if( (!prevProps.remarkList || prevState.remarkList===null) && prevState.remarkList && prevState.remarkList.size<this.state.remarkList.size){
        this.props.onScroll(getNewRemarkHeight(ReactDom.findDOMNode(this)))
      }
    }

    componentWillUnmount(){
      MeasuresStore.removeChangeListener(this._onChanged);
    }

    render(){
      if(this.props.remarkList == null && this.state.remarkList===null){
        return(
          <div className="flex-center">
           <CircularProgress  mode="indeterminate" size={80} />
         </div>
        )
      }else {
        /*return(
          <div className="measure-remark">
            <div className="title">
              <div className="name">{I18N.Remark.Label}</div>
            </div>
            {this.props.canEdit && <AddRemark onSave={this._onSave.bind(this)} onCancel={this._onCancel.bind(this)}/>}
            {(this.props.remarkList || this.state.remarkList).map(remark=>(
              remark && <RemarkItem remark={remark} canEdit={this.props.canEdit} onDelete={this._onDelete.bind(this,remark.get('Id'))}/>
            ))}
          </div>
        )*/
        return(
          <div className="measure-remark">
                      <div className="push-panel-solution-header">
                        <div className="push-panel-solution-header-title">
                              <FontIcon className="icon-note" color="#32ad3c" iconStyle ={ICONSTYLE} style = {STYLE} />
                              <div className="font" style={{marginLeft:'0'}}>{I18N.Remark.Label}</div>
                        </div>
                    </div>
                    {this.props.canEdit && <AddRemark onSave={this._onSave.bind(this)} onCancel={this._onCancel.bind(this)}/>}
            {(this.props.remarkList || this.state.remarkList).map(remark=>(
              remark && <RemarkItem remark={remark} canEdit={this.props.canEdit} onDelete={this._onDelete.bind(this,remark.get('Id'))}/>
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
