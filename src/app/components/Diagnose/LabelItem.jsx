import React, { Component } from 'react';
import classnames from "classnames";
import {Type,DiagnoseStatus,ItemType} from '../../constants/actionType/Diagnose.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import BubbleIcon from '../BubbleIcon.jsx';
import Immutable from 'immutable';

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
        marginLeft:'6px'
      },
      label:{
        fontSize:'9px',
        padding:'0px',
        color:"#ffffff"
      },
      btnIcon:{
        fontSize:'9px',
        color:"#ffffff",
        marginLeft:'0',
        marginRight:'4px'
      },
      icon:{
        fontSize:'14px',
        color:'#ffffff',
        marginLeft:'15px'
      },
      bubble:{
        borderRadius:'2px',
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
                  <FlatButton label={I18N.Setting.Diagnose.Diagnose} labelStyle={styles.label} style={styles.btn} backgroundColor="#0cad04"
                    icon={<FontIcon className="icon-add" style={styles.btnIcon}/>}
                    onClick={(e)=>{
                                    e.stopPropagation();
                                    this.props.onAdd(this.props.nodeData)}}/>
                </div>
    var collapsedIcon=ChildrenCount>0?<FontIcon className={classnames({
                                                                "icon-arrow-down":this.state.collapsed,
                                                                "icon-arrow-up":!this.state.collapsed
                                                              })} style={styles.icon}/>:null;
    return(
      <div className={classnames({"item":true,"canSelect":ChildrenCount>0})} style={{justifyContent:'space-between'}} onClick={()=>{this.setState({collapsed:!this.state.collapsed})}}>
        <div className="side">
          <div className="text">{Name}</div>
          {this.props.isFromProbem && count}
          {!this.props.isFromProbem && addBtn}
        </div>
        <div className="side">
          {collapsedIcon}
        </div>
      </div>
    )
  }

  _renderContent(){
    return this.props.nodeData.get('Children').map(data=>(
      <div className={classnames({
                                  "item":true,
                                  "selected":this.props.selectedNode?data.get('Id')===this.props.selectedNode.get('Id'):false,
                                  'canSelect':true
                                })}
           style={{paddingLeft:'30px'}} onClick={()=>{this.props.onItemTouchTap(data)}}>
        <div className="text">{data.get('Name')}</div>
        {!this.props.isFromProbem && data.get('Status')===DiagnoseStatus.Suspend && <FontIcon className="icon-more" style={{fontSize:'14px',marginLeft:'15px'}}/>}
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
    var {Id,Name}=this.props.nodeData.toJS();
    var icon = (
    <div className="node-content-icon" style={{
      color: '#ffffff'
    }}>
        <div className={classnames({
      //"icon-folder": Id === ItemType.Basic.NonRunTime || Id === ItemType.Senior.NonRunTime,
      "icon-chart": [ItemType.Basic.NonRunTime,ItemType.Senior.NonRunTime,ItemType.Basic.DeviceEfficiency, ItemType.Senior.DeviceEfficiency,
                    ItemType.Basic.NonEssentialOperation, ItemType.Senior.NonEssentialOperation,
                    ItemType.Basic.IndoorEnvironmental, ItemType.Senior.IndoorEnvironmental,
                    ItemType.Senior.RunTime,
                    ItemType.Basic.DemandOptimization,
                    ItemType.Senior.OperationOptimization].reduce((result, type) => result || Id === type, false)
      // "icon-chart": Id === ItemType.Basic.DeviceEfficiency || Id === ItemType.Senior.DeviceEfficiency,
      // "icon-chart": Id === ItemType.Basic.NonEssentialOperation || Id === ItemType.Senior.NonEssentialOperation,
      // "icon-chart": Id === ItemType.Basic.IndoorEnvironmental || Id === ItemType.Senior.IndoorEnvironmental,
      // "icon-chart": Id === ItemType.Senior.RunTime,
      // "icon-chart": Id === ItemType.Basic.DemandOptimization,
      // "icon-chart": Id === ItemType.Senior.OperationOptimization,
    })}/>
      </div>
    );
    return (
      <div className="item">
        {icon}
        <div className="text" style={{marginLeft:'10px'}}>{Name}</div>
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
