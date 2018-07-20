import React, { Component , PureComponent} from 'react';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import Tree from 'controls/tree/Tree.jsx';
import classnames from 'classnames';
import { nodeType } from 'constants/TreeConstants.jsx';
import Spin from '@emop-ui/piano/spin';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import { Checkbox} from 'material-ui';
import _ from 'lodash-es';
import PropTypes from 'prop-types';

import Immutable from 'immutable';

const TAG=Immutable.fromJS([{
  Id:1,
  Code:'123123',
  Name:'13213'
},{
  Id:2,
  Code:'123123',
  Name:'13213'
},{
  Id:3,
  Code:'123123',
  Name:'13213'
},{
  Id:4,
  Code:'123123',
  Name:'13213'
},{
  Id:5,
  Code:'123123',
  Name:'13213'
}])

var findBuildId=(node,trees)=>{
  var building=null;
  var f=(el)=>{
    if(el.get("Id")===node.get("Id") && el.get("NodeType")===node.get("NodeType")){
      return true
    }else{
      if(el.get("Children") && el.get("Children").size!==0){
        var flag=false;
        console.log(el.get("Name"))
        el.get("Children").forEach(child=>{
          if(f(child)){
            if(el.get("NodeType")===nodeType.Building){
              building=el
            }
            flag=true
          }
        })
        console.log(el.get("Name"),flag)
        return flag
      }else{
        console.log(el.get("Name"))
        return false
      }
      console.log(el.get("Name"))
      return false
    }
  }
  trees.forEach(tree=>{f(tree)});
  console.log(building.get("Id"),building.get("Name"))
  return building.get("Id")
}
class PureTree extends PureComponent {
  render() {
    let { hierarchy, selectedNode, onSelectNode, generateNodeConent } = this.props;
    let treePorps = {
      allNode: hierarchy,
      collapsedLevel: 0,
      nodeOriginPaddingLeft: 0,
      onSelectNode: onSelectNode,
      arrowIconExpandClass: 'icon-arrow-unfold',
      arrowIconCollapsedClass: 'icon-arrow-fold',
      generateNodeConent: generateNodeConent,
      selectedNode: selectedNode,
      treeNodeClass: 'data-quality-maintenance-tree-node',
    };
    return (<Tree {...treePorps}></Tree>);
  }
}

class PureItem extends PureComponent {
  render() {
    let { tag, isChecked,onCheck } = this.props;
    return (<div className="item" onClick={onCheck}>
      <Checkbox style={{width:'30px'}} checked={isChecked}/>
      <div className="name">{tag.get("Name")}</div>
      <div className="code">{tag.get("Code")}</div>
    </div>);
  }
}

export default class TagSelect extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

    constructor(props) {
      super(props);
      this._onChanged = this._onChanged.bind(this);
      this._onCheck=this._onCheck.bind(this);
    }
  
    state={
      selectHierarchyNode:null,
      hierarchys:null,
      tags:null,
    }
    
    _currentBuildingId=null;

    _onChanged(){
      this.setState({
        hierarchys:DataQualityMaintenanceStore.getHierarchys().getIn(['Tree', 0, 'Children']),
        tags:DataQualityMaintenanceStore.getTags()
      })
    }

    _generateNodeConent(nodeData){
      var type = nodeData.get('NodeType');
      var icon = (
        <div className='node-content-icon'>
          <div className={classnames({
            'icon-customer': type == nodeType.Customer,
            'icon-orgnization': type == nodeType.Organization,
            'icon-site': type == nodeType.Site,
            'icon-building': type == nodeType.Building,
            'icon-room': type == nodeType.Room,
            'icon-panel': type == nodeType.Panel,
            'icon-panel-box': type == nodeType.Panel,
            'icon-device': type == nodeType.Device,
            'icon-device-box': type == nodeType.Device,
            'icon-Gateway': type == nodeType.GateWay,
            'icon-image': type == nodeType.Widget,
            'icon-dimension-node': type == nodeType.Area,
          })}/>
        </div>
      );
  
      return (
        <div className='tree-node-content'>
          {icon}
          <div className='node-content-text' title={nodeData.get('Name')}>{nodeData.get('Name')}</div>
        </div>
      );
    }

    _renderHierarchyField(){
      return(<div className="rules-configuration-content-tag-select-hierarchy-field">
        {this.state.hierarchys===null?<div className="flex-center"><Spin/></div>
        :<PureTree hierarchy={this.state.hierarchys} 
                  selectedNode={this.state.selectHierarchyNode}
                  onSelectNode={(node)=>{
                                if(node.get("NodeType")>nodeType.Building){
                                  this._currentBuildingId=findBuildId(node,this.state.hierarchys);
                                  this.setState({
                                    selectHierarchyNode:node,
                                    tags:null
                                  },()=>{
                                    DataQualityMaintenanceAction.getTags({
                                      CustomerId: this.context.router.params.customerId,
                                      UserId: CurrentUserStore.getCurrentUser().Id,
                                      Id:node.get("Id"),
                                      NodeType: node.get("NodeType"),
                                      SubType:node.get("SubType")})                                      
                                  })
                                }
                                
                              }}
                  generateNodeConent={this._generateNodeConent}/>}
      </div>)
    }

    checkAll(){
      if(this.props.selectTags.length===0) return false;
      var buildId=this._currentBuildingId;
      var index=_.findIndex(this.props.selectTags, function(o) { return o.buildingId===buildId; })
      if(index>-1){
        var tagIds=this.props.selectTags[index].tagIds;
        return  _.takeWhile(this.state.tags.toJS(),tag=>tagIds.indexOf(tag.Id)>-1).length===this.state.tags.size && this.state.tags.size!==0
      }
      return false
    }

    _onCheckAll(status){
      var selectTags=this.props.selectTags;
      var buildId=this._currentBuildingId;
      var index= _.findIndex(selectTags,tagArr=>tagArr.buildingId===buildId);
      if(index===-1){
        selectTags.push({
          buildingId:buildId,
          tagIds:this.state.tags.map(tag=>tag.get("Id")).toJS()
        })
      }else{
        if(status){
          this.state.tags.forEach(tag=>{
            if(selectTags[index].tagIds.indexOf(tag.get("Id"))==-1){
              selectTags[index].tagIds.push(tag.get("Id"))
            }
          })
        }else{
          this.state.tags.forEach(tag=>{
            _.remove(selectTags[index].tagIds,id=>id===tag.get("Id"))
          })
        }
      }
      this.props.onSelect(selectTags)
    }

    _onCheck(tagId,checked){
      var selectTags=this.props.selectTags;
      var buildId=this._currentBuildingId;
      var index= _.findIndex(selectTags,tagArr=>tagArr.buildingId===buildId);
      if(index===-1){
        selectTags.push({
          buildingId:buildId,
          tagIds:[tagId]
        })
      }else{
        if(checked){
          selectTags[index].tagIds.push(tagId)
        }else{
          _.remove(selectTags[index].tagIds,id=>id===tagId)
        }
      }

      this.props.onSelect(selectTags)
    }

    _renderTags(){
      var content;
      if(this.state.selectHierarchyNode===null){
        content= <div className="flex-center">{I18N.VEE.Rule.SelectTagTip}</div>
      }else if(this.state.tags===null){
        content=<div className="flex-center"><Spin/></div>
    }else{
        var chechAll=this.checkAll();
        content=[
          <div className="rules-configuration-content-tag-select-tags-field-header">
              <Checkbox style={{width:'30px'}} checked={chechAll} onCheck={()=>{this._onCheckAll(!chechAll)}}/>
              <div className="name">{I18N.Setting.Tag.TagName}</div>
              <div className="code">{I18N.Setting.Tag.Code}</div>
          </div>,
          <div className="rules-configuration-content-tag-select-tags-field-content">
            {this.state.tags.map(tag=>{
              var isChecked=this.props.selectTags.length===0?false:_.findIndex(this.props.selectTags,tagArr=>tagArr.tagIds.indexOf(tag.get("Id"))>-1)>-1;
              return <PureItem tag={tag} isChecked={isChecked} onCheck={()=>{this._onCheck(tag.get("Id"),!isChecked)}}/>})}
          
      </div>
        ]
      }
      return(
        <div className="rules-configuration-content-tag-select-tags-field">
          {content}
        </div>
      )
    }

    componentDidMount(){
      DataQualityMaintenanceStore.addChangeListener(this._onChanged);
      DataQualityMaintenanceAction.getHierarchys({
        CustomerId: this.context.router.params.customerId,
        UserId: CurrentUserStore.getCurrentUser().Id,
      });
    }
    componentWillUnmount(){
      DataQualityMaintenanceStore.removeChangeListener(this._onChanged);
    }
    render(){
      return(
        <div className="rules-configuration-content-tag-select">
          {this._renderHierarchyField()}
          {this._renderTags()}
        </div>
      )
    }
}