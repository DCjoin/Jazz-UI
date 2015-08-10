'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress,FlatButton,FontIcon,IconButton,IconMenu,} from 'material-ui';
import SearchBox from './FolderSearchBox.jsx';
import Tree from '../../controls/tree/Tree.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
import NodeContent from './TreeNodeContent.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');

import HierarchyStore from '../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../actions/HierarchyAction.jsx';

import Immutable from 'immutable';

let _newWidget=[];
/*
 _newWidget[2]=I18N.Folder.NewWidget.Menu2;
_newWidget[3]=I18N.Folder.NewWidget.Menu3;
_newWidget[4]=I18N.Folder.NewWidget.Menu4;
_newWidget[5]=I18N.Folder.NewWidget.Menu5;
_newWidget[7]=I18N.Folder.NewWidget.Menu1;
*/
_newWidget[2]='Menu2';
_newWidget[3]='Menu3';
_newWidget[4]='Menu4';
_newWidget[5]='Menu5';
_newWidget[7]='Menu1';

var PanelContainer = React.createClass({

  _onFolderTreeChange:function(){
    this.setState({
      allNode:FolderStore.getFolderTree(),
      selectedNode:FolderStore.getFolderTree(),
      isLoading:false
    });
  },

  generateNodeConent:function(nodeData){
    return(<NodeContent nodeData={nodeData}
                        selectedNode={this.state.selectedNode}/>);
  },
  _onChange:function(){
    this.setState({
    //  allNode:FolderStore.getFolderTree(),
      allNode:HierarchyStore.getData(),
      isLoading:false
    });
  },
  _onSelectNode:function(nodeData){
    this.setState({
      selectedNode:nodeData
    })
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
    let name=I18N.format(I18N.Folder.NewWidget.DefaultName, _newWidget[widgetType]);
    this.setState({
      isLoading:true
    });
    FolderAction.createWidgetOrFolder(this.state.selectedNode,name,7,window.currentCustomerId,widgetType);
  },
  _onTemplateTest:function(){
    this.setState({
      templateShow:!this.state.templateShow
    })
  },
  getInitialState:function(){
    return{
      allNode:null,
      isLoading:true,
      selectedNode:null,
      templateShow:false
    };
  },

  componentDidMount: function() {

    FolderStore.addFolderTreeListener(this._onFolderTreeChange);
    FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);
    FolderAction.getFolderTreeByCustomerId(100012);
    /*
    HierarchyStore.addHierarchyNodeListener(this._onChange);
    HierarchyAction.loadall(window.currentCustomerId);
    */
  },
  componentWillUnmount:function(){

    FolderStore.removeFolderTreeListener(this._onFolderTreeChange);
    FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidgetChange);

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
    var IconButtonElement=<IconButton iconClassName="icon-log"/>,
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
      var template=(this.state.templateShow?<Copy />:null);


    return(
      <div className="jazz-folder-leftpanel-container">

        <div className="jazz-folder-leftpanel-header">
          <div className="newfolder">
            <IconButton iconClassName="icon-column-fold" onClick={this._onNewFolder}/>
          </div>
          <div className="newwidget">
            <IconMenu {...iconMenuProps} onItemTouchTap={this._onNewWidget}>
               <MenuItem ref="Menu1" key={7} primaryText={I18N.Folder.NewWidget.Menu1} leftIcon={menuIcon}/>
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
          <SearchBox></SearchBox>
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
    var panel=(this.state.isShow?(<div style={{display:'flex'}}><PanelContainer></PanelContainer> </div>)
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
