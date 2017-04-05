import React, { Component } from 'react';
import classnames from "classnames";
import {Type,DiagnoseStatus,ItemType} from '../../constants/actionType/Diagnose.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import BubbleIcon from '../BubbleIcon.jsx';

class Group extends Component{
  constructor(props, ctx) {
    super(props);
  }

  state={
    collapsed:true
  }

  _renderTitle(){
    var {Name,ChildrenCount}=this.props.nodeData.toJS();
    var styles={
      label:{
        fontSize:'14px'
      },
      icon:{
        fontSize:'14px',
        color:'#ffffff',
        marginLeft:'15px'
      },
      bubble:{
        borderRadius:'5px',
        backgroundColor:'#191919',
        border:'1px solid red',
        width:'16px',
        height:'16px',
        marginLeft:'15px'
      },
      number:{
        color:'red',
        lineHeight:'16px'
      }
    };

    var count=ChildrenCount>0?<BubbleIcon number={ChildrenCount} style={styles.bubble} numberStyle={styles.number}/>:null;
    var addBtn=<div className="addBtn">
                  <FlatButton label={I18N.Setting.Diagnose.Diagnose} labelStyle={styles.label}
                    icon={<FontIcon className="icon-more" style={styles.label}/>}
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
        </div>
        <div className="side">
          {!this.props.isFromProbem && addBtn}
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
        {data.get('Status')===DiagnoseStatus.Suspend && <FontIcon className="icon-more" style={{fontSize:'14px',marginLeft:'15px'}}/>}
      </div>
    ))
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
      "icon-chart": Id === ItemType.Basic.NonRunTime || Id === ItemType.Senior.NonRunTime,
      "icon-chart": Id === ItemType.Basic.DeviceEfficiency || Id === ItemType.Senior.DeviceEfficiency,
      "icon-chart": Id === ItemType.Basic.NonEssentialOperation || Id === ItemType.Senior.NonEssentialOperation,
      "icon-chart": Id === ItemType.Basic.IndoorEnvironmental || Id === ItemType.Senior.IndoorEnvironmental,
      "icon-chart": Id === ItemType.Senior.RunTime,
      "icon-chart": Id === ItemType.Basic.DemandOptimization,
      "icon-chart": Id === ItemType.Senior.OperationOptimization,
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
