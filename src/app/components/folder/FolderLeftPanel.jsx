'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
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

import HierarchyStore from '../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../actions/HierarchyAction.jsx';


import Immutable from 'immutable';

//for test
var testnode={
  Id : 1,
  CustomerId : 100001,
  UserId : 1,
  Name:"child1",
  Path:"仪表盘/child1",
  ChildWidgetCount:5,
  ChildFolderCount:1,
  ParentId:-1,
  Order:1,
  Type:6,
  IsSenderCopy:false,
  HasChildren : true,
  IsRead:true,
  Children:[
  {
    Id : 2,
CustomerId: 100001,
UserId: 1,
Name : "child1_1",
Path : "仪表盘/child1/child1_1",
ChildWidgetCount : 0,
ChildFolderCount :0,
ParentId : 1,
Order :1,
Type :6,
IsSenderCopy : false,
IsRead:false,
  },{
    Id : 3,
      CustomerId : 100001,
      UserId : 1,
      Name : "child1_2",
      Path : "仪表盘/child1/child1_2",
      ChildWidgetCount : 0,
      ChildFolderCount : 0,
      ParentId : 1,
      Order : 2,
      Type : 7,
      WidgetType:1,
      IsSenderCopy : true,
      SourceUserName:"User2",
      IsRead : false,

  },{
    Id : 4,
CustomerId : 100001,
UserId : 1,
Name : "child1_3",
Path : "仪表盘/child1/child1_3",
ChildWidgetCount : 0,
ChildFolderCount : 0,
ParentId : 1,
Order : 3,
Type :7,
WidgetType : 4,
IsSenderCopy : true,
SourceUserName : "User2",
IsRead : false,
  },{
    Id : 5,
    CustomerId : 100001,
    UserId : 1,
    Name : "child1_4",
    Path : "仪表盘/child1/child1_4",
    ChildWidgetCount : 0,
    ChildFolderCount : 0,
    ParentId : 1,
    Order : 4,
    Type : 7,
    WidgetType : 3,
    IsRead : false,
  },{
    Id : 6,
CustomerId : 100001,
UserId : 1,
Name : "child1_5",
Path : "仪表盘/child1/child1_5",
ChildWidgetCount : 0,
ChildFolderCount : 0,
ParentId : 1,
Order : 5,
Type : 7,
WidgetType : 5,
IsRead : false,
  },{
    Id : 7,
  CustomerId : 100001,
  UserId : 1,
  Name : "child1_6",
  Path : "仪表盘/child1/child1_6",
  ChildWidgetCount : 0,
  ChildFolderCount : 0,
  ParentId : 1,
  Order : 6,
  Type :7,
  WidgetType : 2,
  IsRead : false,
  }
  ]
  }
var PanelContainer = React.createClass({

  _onFolderTreeChange:function(){
    this.setState({
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getFolderTree(),
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
    FolderAction.createWidgetOrFolder(this.state.selectedNode,I18N.Folder.NewFolder,6,window.currentCustomerId);
  },
  _onCreateFolderOrWidgetChange:function(){
    this.setState({
      isLoading:false,
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getNewNode()
    });

  },
  _onNewWidget:function(e, item){
    let widgetType=parseInt(item.key);
    let _newWidget=[];

    _newWidget[1]=I18N.Folder.NewWidget.Menu1;
    _newWidget[2]=I18N.Folder.NewWidget.Menu2;
    _newWidget[3]=I18N.Folder.NewWidget.Menu3;
    _newWidget[4]=I18N.Folder.NewWidget.Menu4;
    _newWidget[5]=I18N.Folder.NewWidget.Menu5;

    let name=I18N.format(I18N.Folder.NewWidget.DefaultName, _newWidget[widgetType]);
    this.setState({
      isLoading:true
    });
    FolderAction.createWidgetOrFolder(this.state.selectedNode,name,7,window.currentCustomerId,widgetType);
  },
  _onTemplateTest:function(){
    this.setState({
      templateShow:true
    })
  },
  _onTemplateDismiss:function(){
    this.setState({
      templateShow:false
    })
  },
  _onSearchClick:function(node){
    this.setState({
      selectedNode:node
    })
  },
  getInitialState:function(){
    return{
      allNode:null,
      isLoading:true,
      selectedNode:null,
      templateShow:false,
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
  componentDidMount: function() {

    FolderStore.addFolderTreeListener(this._onFolderTreeChange);
    FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);
    FolderAction.getFolderTreeByCustomerId(window.currentCustomerId);

    FolderStore.addDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.addCopyItemSuccessListener(this._onCopyItem);
    /*
    HierarchyStore.addHierarchyNodeListener(this._onChange);
    HierarchyAction.loadall(window.currentCustomerId);
    */
  },
  componentWillUnmount:function(){

    FolderStore.removeFolderTreeListener(this._onFolderTreeChange);
    FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);

    FolderStore.removeDeleteItemSuccessListener(this._onDeleteItem);
    FolderStore.removeCopyItemSuccessListener(this._onCopyItem);

  //  HierarchyStore.removeHierarchyNodeListener(this._onChange);
  },
  render:function(){
    //style
    var menuStyle={
          marginTop:"35px",
        },
        iconStyle={
          paddingTop:'0px'
        };
    //icon
    var IconButtonElement=<IconButton iconClassName="icon-log" disabled={this.state.buttonDisabled}/>,
        menuIcon=<FontIcon className="icon-language" style={iconStyle}/>;
    //props
    var iconMenuProps={
        iconButtonElement:IconButtonElement,
        openDirection:"bottom-right",
        menuStyle:menuStyle
      },
      treeProps={
        collapsedLevel:0,
        allNode:this.state.allNode,
        allHasCheckBox:false,
        allDisabled:false,
        generateNodeConent:this.generateNodeConent,
        onSelectNode:this._onSelectNode,
        selectedNode:this.state.selectedNode
      };


      var treeContent=(this.state.isLoading?<CircularProgress  mode="indeterminate" size={1} />:<Tree {...treeProps}/>);
    //  var template=(this.state.templateShow?<CopyView onDismiss={this._onTemplateDismiss} copyNode={this.state.selectedNode}/>:null);
    //  var template=(this.state.templateShow?<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.selectedNode}/>:null);
    var template=(this.state.templateShow?<ShareView onDismiss={this._onTemplateDismiss} shareNode={this.state.selectedNode}/>:null);

    return(
      <div className="jazz-folder-leftpanel-container">

        <div className="jazz-folder-leftpanel-header">
          <div className="newfolder">
            <IconButton iconClassName="icon-column-fold" onClick={this._onNewFolder} disabled={this.state.buttonDisabled}/>
          </div>
          <div className="newwidget">
            <IconMenu {...iconMenuProps} onItemTouchTap={this._onNewWidget}>
               <MenuItem ref="Menu1" key={1} primaryText={I18N.Folder.NewWidget.Menu1} leftIcon={menuIcon}/>
               <MenuItem ref="Menu2" key={2} primaryText={I18N.Folder.NewWidget.Menu2} leftIcon={menuIcon}/>
               <MenuItem ref="Menu3" key={3} primaryText={I18N.Folder.NewWidget.Menu3} leftIcon={menuIcon}/>
               <MenuItem ref="Menu4" key={4} primaryText={I18N.Folder.NewWidget.Menu4} leftIcon={menuIcon}/>
               <MenuItem ref="Menu5" key={5} primaryText={I18N.Folder.NewWidget.Menu5} leftIcon={menuIcon}/>
            </IconMenu>
          </div>
          <IconButton iconClassName="icon-alarm" onClick={this._onTemplateTest}/>
          <div>

          </div>
        </div>

        <div className="jazz-folder-leftpanel-search">
          <SearchBox onSearchClick={this._onSearchClick}></SearchBox>
        </div>

        <div className="jazz-folder-leftpanel-foldertree">
          {treeContent}
        </div>
        {template}
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
        <FlatButton   style={buttonStyle} onClick={this._onToggle}>
          <FontIcon className="icon-taglist-fold" style={iconStyle}/>
        </FlatButton>
      </div>
    )
  }
});

module.exports = FolderLeftPanel;
