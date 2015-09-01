'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import classSet from 'classnames';
import {CircularProgress,FlatButton,FontIcon,IconButton,IconMenu,Dialog} from 'material-ui';
import SearchBox from './FolderSearchBox.jsx';
import Tree from '../../controls/tree/Tree.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
import NodeContent from './TreeNodeContent.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');
import CopyView from './operationView/CopyView.jsx';
import DeleteView from './operationView/DeleteView.jsx';
import ShareView from './operationView/ShareView.jsx';
import SendView from './operationView/SendView.jsx';
import DropdownButton from '../../controls/DropdownButton.jsx';

import HierarchyStore from '../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../actions/HierarchyAction.jsx';



import Immutable from 'immutable';

var PanelContainer = React.createClass({

  _onFolderTreeChange:function(){
    this.setState({
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getSelectedNode(),
      isLoading:false
    });
  },

  generateNodeConent:function(nodeData,IsSendCopyReaded){
    return(<NodeContent nodeData={nodeData}
                        selectedNode={this.state.selectedNode}
                        readStatus={IsSendCopyReaded}/>);
  },
  _onChange:function(){
    this.setState({
    //  allNode:FolderStore.getFolderTree(),
      allNode:HierarchyStore.getData(),
      isLoading:false
    });
  },
  _onSelectNode:function(nodeData){
    FolderAction.setSelectedNode(nodeData);
    if(nodeData.get('Type')==7){
      this.setState({
        selectedNode:nodeData,
        buttonDisabled:true,
      })
    }
    else {
      this.setState({
        selectedNode:nodeData,
        buttonDisabled:false,
      })
    }
  },
  _onNewFolder:function(){
    this.setState({
      isLoading:true
    });
    var name=FolderStore.getDefaultName(I18N.Folder.NewFolder,this.state.selectedNode,6);
    FolderAction.createWidgetOrFolder(this.state.selectedNode,name,6,window.currentCustomerId);
  },
  _onCreateFolderOrWidgetChange:function(){
    this.setState({
      isLoading:false,
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getSelectedNode()
    });

  },
  _onNewWidget:function(e,item){
    let widgetType=parseInt(item.key);
    let _newWidget=[];

    _newWidget[1]=I18N.Folder.NewWidget.Menu1;
    _newWidget[2]=I18N.Folder.NewWidget.Menu2;
    _newWidget[3]=I18N.Folder.NewWidget.Menu3;
    _newWidget[4]=I18N.Folder.NewWidget.Menu4;
    _newWidget[5]=I18N.Folder.NewWidget.Menu5;

    let name=I18N.format(I18N.Folder.NewWidget.DefaultName, _newWidget[widgetType]);
    name=FolderStore.getDefaultName(name,this.state.selectedNode,7);
    this.setState({
      isLoading:true
    });
    FolderAction.createWidgetOrFolder(this.state.selectedNode,name,7,window.currentCustomerId,widgetType);
    this.setState({
      buttonDisabled:true
    })
  },
  _onSearchClick:function(node){
    FolderAction.setSelectedNode(node);
    this.setState({
      selectedNode:node
    })
  },
  _onModifyName:function(){
    let me = this;
    this.setState({isLoading:true}, ()=>{
        me.setState({isLoading:false, allNode:FolderStore.getFolderTree()});
    });
  },
  getInitialState:function(){
    return{
      allNode:null,
      isLoading:true,
      selectedNode:null,
      buttonDisabled:false
    };
  },
  _onDeleteItem:function(){
    this.setState({
      allNode:FolderStore.getFolderTree()
    })
  },
  _onCopyItem:function(){
    this.setState({
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getSelectedNode()
    })
  },
  _onSelectedNodeChange:function(){
    this.setState({
      selectedNode:FolderStore.getSelectedNode()
    })
  },
  _onGragulaNode:function(targetId,sourceId,pass){
    var targetNode=FolderStore.getNodeById(parseInt(targetId)),
        sourceNode=FolderStore.getNodeById(parseInt(sourceId)),
        parentNode=FolderStore.getParent(targetNode);
    if(!pass){
      FolderAction.moveItem(sourceNode.toJSON(),targetNode.toJSON(),null)
    }
    else {
      FolderAction.moveItem(sourceNode.toJSON(),parentNode.toJSON(),targetNode.toJSON())
    }
    this.setState({
        isLoading:true,
    })
  },
  _onMoveItemChange:function(){
    this.setState({
      isLoading:false,
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getSelectedNode()
    });
  },
  componentDidMount: function() {

    FolderStore.addFolderTreeListener(this._onFolderTreeChange);
    FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);
    FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);

    FolderStore.addDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.addCopyItemSuccessListener(this._onCopyItem);
    FolderStore.addModifyNameSuccessListener(this._onModifyName);
    FolderStore.addModifyNameErrorListener(this._onModifyName);
    FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.addMoveItemSuccessListener(this._onMoveItemChange);

  },
  componentWillUnmount:function(){

    FolderStore.removeFolderTreeListener(this._onFolderTreeChange);
    FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);

    FolderStore.removeDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItem);
    FolderStore.removeModifyNameSuccessListener(this._onModifyName);
    FolderStore.removeModifyNameErrorListener(this._onModifyName);
    FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.removeMoveItemSuccessListener(this._onMoveItemChange);

  },
  render:function(){
    //style
    var iconStyle={
          paddingTop:'0px'
        },
        itemStyle={
          fontSize:'14px',
          color:'#767a7a',
          paddingLeft:'44px'
        },
        buttonStyle = {
          backgroundColor: 'transparent',
          height: '32px'
        };
        var newFolderClasses = {
          'se-dropdownbutton': true,
          'btn-container': true,
          'btn-container-active': !this.state.buttonDisabled
        };

    //icon
    var energyAnalysisIcon=<FontIcon className="icon-energy-analysis" style={iconStyle}/>,
        unitIndexIcon=<FontIcon className="icon-unit-index" style={iconStyle}/>,
        timeRationIcon=<FontIcon className="icon-dust-concentration" style={iconStyle}/>,
        labelingIcon=<FontIcon className="icon-labeling" style={iconStyle}/>,
        rankingIcon=<FontIcon className="icon-ranking" style={iconStyle}/>;

    var filterOptions=[
      <MenuItem key={1} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu1} leftIcon={energyAnalysisIcon}/>,
      <MenuItem key={2} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu2} leftIcon={unitIndexIcon}/>,
      <MenuItem key={3} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu3} leftIcon={timeRationIcon}/>,
      <MenuItem key={4} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu4} leftIcon={labelingIcon}/>,
      <MenuItem key={5} innerDivStyle={itemStyle} primaryText={I18N.Folder.NewWidget.Menu5} leftIcon={rankingIcon}/>
    ];

    //props
    var treeProps={
        collapsedLevel:0,
        allNode:this.state.allNode,
        allHasCheckBox:false,
        allDisabled:false,
        generateNodeConent:this.generateNodeConent,
        onSelectNode:this._onSelectNode,
        selectedNode:this.state.selectedNode,
        onGragulaNode:this._onGragulaNode,
        arrowClass:'jazz-foldertree-arrow',
        treeNodeClass:'jazz-foldertree-node'
      },
      newWidgetProps = {
                type: "Add",
                text:I18N.Folder.WidgetName,
                menuItems: filterOptions,
                onItemClick: this._onNewWidget,
                disabled: this.state.buttonDisabled
              };


      var treeContent=(this.state.isLoading?<CircularProgress  mode="indeterminate" size={1} />:<Tree {...treeProps}/>);

    return(
      <div className="jazz-folder-leftpanel-container">

        <div className="jazz-folder-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{margin:'0 30px'}}>
            <FlatButton disabled={this.state.buttonDisabled} onClick={this._onNewFolder} style={buttonStyle}>
              <FontIcon className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Folder.FolderName}</span>
            </FlatButton>
          </div>
          <DropdownButton {...newWidgetProps}/>
          <div>

          </div>
        </div>

        <div className="jazz-folder-leftpanel-search">
          <SearchBox onSearchClick={this._onSearchClick}></SearchBox>
        </div>

        <div className="jazz-folder-leftpanel-foldertree">
          {treeContent}
        </div>
      </div>
    )
  }
});
var FolderLeftPanel = React.createClass({
  propTypes: {
    isShow:React.PropTypes.bool,
    onToggle:React.PropTypes.func,
},
  _onToggle:function(){
    this.props.onToggle();
    this.setState({
        isShow:!this.state.isShow
    })
  },
  getInitialState: function() {
      return {
        isShow: this.props.isShow
      };
    },
  componentWillReceiveProps:function(nextProps){
      this.setState({
        isShow: nextProps.isShow
      })
    },
  render:function(){
    var buttonStyle = {
      minWidth:'36px',
      width:'36px',
      height:'36px',
      margin:'300px -36px 0 0 ',
    },
    iconStyle={
      fontSize:'36px'
    };
    var panel=(this.state.isShow?(<div style={{display:'flex',flex:1}}><PanelContainer></PanelContainer> </div>)
                    :(<div style={{display:'none'}}><PanelContainer></PanelContainer></div>)
              );
    return(
      <div style={{display:'flex'}}>
        {panel}

      </div>
    )
  }
});

module.exports = FolderLeftPanel;
