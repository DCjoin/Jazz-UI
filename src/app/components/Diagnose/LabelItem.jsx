import React, { Component } from 'react';
import classnames from "classnames";
import {Type,DiagnoseStatus,ItemType} from '../../constants/actionType/Diagnose.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import BubbleIcon from '../BubbleIcon.jsx';
import Immutable from 'immutable';
import NewFlatButton from 'controls/NewFlatButton.jsx';

function isChild(parent,item){
  return parent.get('Children').findIndex(el=>el.get('Id')===item.get('Id'))>-1
}

function hasChild(parent){
  return parent.get('Children')?true:false
}

function isCollapsed(parent,item){
  return hasChild(parent)?!isChild(parent,item):true
}
class Group extends Component{
  constructor(props, ctx) {
    super(props);
  }


  state={
    collapsed:this.props.selectedNode?isCollapsed(this.props.nodeData,this.props.selectedNode):true
  }

  _renderTitle(){
    var {Name,ChildrenCount}=this.props.nodeData.toJS();
    var styles={
      btn:{
        borderRadius: '2px',
        padding:'3px 5px',
        minWidth:'0',
        height:'auto',
        lineHeight:'auto',
        marginLeft:'6px',
      },
      label:{
        fontSize:'9px',
        padding:'0px',
        color:"#ffffff"
      },
      btnIcon:{
        fontSize:'7px',
        color:"#ffffff",
        marginLeft:'0',
        marginRight:'4px'
      },
      icon:{
        fontSize:'14px',
        color:'#626469',
      },
      bubble:{
        borderRadius:'100px',
        // backgroundColor:'#191919',
        // border:'1px solid red',
        width:'12px',
        height:'12px',
        marginLeft:'5px'
      },
      number:{
        color:'#ffffff',
        lineHeight:'12px'
      }
    };

    var count=ChildrenCount>0?<BubbleIcon number={ChildrenCount} style={styles.bubble} numberStyle={styles.number}/>:null;
    var addBtn=<div className="addBtn">
                  <NewFlatButton label={I18N.Setting.Diagnose.Diagnose} labelStyle={styles.label} style={styles.btn} primary={true}
                    icon={<FontIcon className="icon-add" style={styles.btnIcon}/>}
                    onClick={(e)=>{
                                    e.stopPropagation();
                                    this.props.onAdd(this.props.nodeData)}}/>
                </div>
    var collapsedIcon=ChildrenCount>0?<FontIcon className={classnames({
                                                                "icon-arrow-fold":this.state.collapsed,
                                                                "icon-arrow-unfold":!this.state.collapsed
                                                              })} style={styles.icon}/>:<div style={{width:'15px'}}/>;
    return(
      <div className={classnames({"item":true,"canSelect":ChildrenCount>0})} style={{justifyContent:'space-between'}} onClick={()=>{this.setState({collapsed:!this.state.collapsed})}}>
        <div className="side">
          {collapsedIcon}
          <FontIcon className="icon-add" style={{fontSize:'14px',color:'#626469',marginRight:'5px'}}/>
          <div className="text">{Name}</div>
          {this.props.isFromProbem && count}
        </div>
        <div className="side">
          {!this.props.isFromProbem && addBtn}
        </div>
      </div>
    )
  }

  _renderContent(){
    var styles={
      icon:{
        fontSize:'14px',
        color:'#626469',
        marginRight:'5px'
      },
    }
    return this.props.nodeData.get('Children').map(data=>(
      <div title={data.get('Name')} className={classnames({
                                  "item":true,
                                  "selected":this.props.selectedNode?data.get('Id')===this.props.selectedNode.get('Id'):false,
                                  'canSelect':true
                                })}
           style={{paddingLeft:'50px'}} onClick={()=>{this.props.onItemTouchTap(data)}}>
           <FontIcon className="icon-add" style={styles.icon}/>
        <div className="text">{data.get('Name')}</div>
        {!this.props.isFromProbem && data.get('Status')===DiagnoseStatus.Suspend && <div className="suspend-font" style={{marginLeft:'5px'}}>{I18N.Setting.Diagnose.Suspend}</div>}
      </div>
    ))
  }

  componentWillReceiveProps(nextProps){
    if(!Immutable.is(nextProps.selectedNode,this.props.selectedNode)){
      this.setState({
        collapsed:nextProps.selectedNode?isCollapsed(nextProps.nodeData,nextProps.selectedNode):true
      })
    }
  }

  render(){
    return(
      <div>
        {this._renderTitle()}
        {!this.state.collapsed && this.props.nodeData.get('Children') && this._renderContent()}
      </div>
    )
  }
}

Group.propTypes = {
  nodeData: React.PropTypes.object,
  selectedNode: React.PropTypes.object,
  isFromProbem:React.PropTypes.bool,
  onAdd:React.PropTypes.func,
  onItemTouchTap:React.PropTypes.func,
};

export default class LabelItem extends Component {

  constructor(props, ctx) {
    super(props);
  }

  _renderGroupTitle(){
    var {Name}=this.props.nodeData.toJS();
    return (
      <div className="item" style={{borderBottom:'1px solid #e6e6e6'}}>
        <div className="text" style={{fontWeight:'bold'}}>{Name}</div>
      </div>
    )
  }

  _renderContent(){
    return this.props.nodeData.get('Children').map(child=>(
              <Group   nodeData={child}
                selectedNode={this.props.selectedNode}
                isFromProbem={this.props.isFromProbem}
                onAdd={this.props.onAdd}
                onItemTouchTap={this.props.onItemTouchTap}
                onFormStatusChanged={this.props.onFormStatusChanged}/>
            ))
  }

  render(){
    return (
      <div className="label-group">
        {this._renderGroupTitle()}
        {this.props.nodeData.get('Children') && this._renderContent()}
      </div>
      )
  }
}

LabelItem.propTypes = {
  nodeData: React.PropTypes.object,
  selectedNode: React.PropTypes.object,
  isFromProbem:React.PropTypes.bool,
  onAdd:React.PropTypes.func,
  onItemTouchTap:React.PropTypes.func,
};
