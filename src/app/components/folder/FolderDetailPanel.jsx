'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import classNames from 'classnames';
import {CircularProgress,FontIcon,IconMenu,IconButton} from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let Menu = require('material-ui/lib/menus/menu');
import FolderAction from '../../actions/FolderAction.jsx';

var FolderItem= React.createClass({
  propTypes:{
    nodeData: React.PropTypes.object,
    onOperationSelect:React.PropTypes.func,
  },
  _onMenuSelect:function(e,item){
    let menuIndex=parseInt(item.key);
    this.props.onOperationSelect(this.props.nodeData,menuIndex);
  },
  _onTitleMenuClick:function(){
    this.setState({
      isTitleMenuShow:!this.state.isTitleMenuShow
    });
  },
  _onItemClick:function(){
    FolderAction.setSelectedNode(this.props.nodeData);
  },
  getInitialState:function(){
    return{
      isTitleMenuShow:false
    }
  },
  render:function(){
    var menu,subtitle;
    var IconButtonElement=<IconButton iconClassName="icon-arrow-down"/>;
                    //props
    var iconMenuProps={
                        iconButtonElement:IconButtonElement,
                        openDirection:"bottom-left",
                      };
    if(this.props.nodeData.get('Type')==6){
      menu=  <IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
            <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} />
            <MenuItem key={2} primaryText={I18N.Folder.Detail.Title.Menu2} />
            <MenuItem key={3} primaryText={I18N.Folder.Detail.Title.Menu3} />
            </IconMenu>;
      subtitle=<div style={{display:'flex','flex-direction':'row'}}>
                <div>{I18N.Folder.FolderName+this.props.nodeData.get('ChildFolderCount')}</div>
                <div style={{'margin-left':'5px'}}>{I18N.Folder.WidgetName+this.props.nodeData.get('ChildWidgetCount')}</div>
              </div>
    }
    else {
      menu=<IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
            <MenuItem key={1} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} />
            <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} />
            <MenuItem key={3} primaryText={I18N.Folder.Detail.WidgetMenu.Menu3} />
            <MenuItem key={4} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} />
            <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} />
            </IconMenu>
    };
    return(
      <div className='jazz-folder-detail-item'>
        <div className='icon' onClick={this._onItemClick}>
         <img src={require('../../less/images/chart.png')}/>
        </div>
        <div className='title' title={this.props.nodeData.get('Name')} onClick={this._onTitleMenuClick}>
          <div className='name'>
            {this.props.nodeData.get('Name')}
          </div>
          {menu}

        </div>
        <div className='subtitle'>
        {subtitle}
        </div>

      </div>
    )
  }
});
var FolderDetailPanel = React.createClass({

  propTypes:{
    onToggle: React.PropTypes.func,
    nodeData: React.PropTypes.object,
    onOperationSelect:React.PropTypes.func,
  },
  _onTitleMenuClick:function(){
    this.setState({
      isTitleMenuShow:!this.state.isTitleMenuShow
    })
  },
  _onTitleMenuSelect:function(e,item){
    let menuIndex=parseInt(item.key);
    this.props.onOperationSelect(this.props.nodeData,menuIndex);
  },
  _onItemMenuSelect:function(node,index){
    this.props.onOperationSelect(node,index);
  },
  getInitialState:function(){
    return{
      isTitleMenuShow:false
    }
  },
  render:function(){
    var that=this;
  var collapseButton = (
                      <div className="fold-tree-btn pop-framework-right-actionbar-top-fold-btn" style={{"color":"#939796"}}>
                        <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} onClick={this.props.onToggle}/>
                      </div>
                  );
  var iconStyle={
        fontSize:'20px',
      },
      menuStyle={
        fontSize:'14px'
      };
  var IconButtonElement=<IconButton iconStyle={iconStyle} iconClassName="icon-arrow-down"/>;
                  //props
  var iconMenuProps={
                      iconButtonElement:IconButtonElement,
                      openDirection:"bottom-right",
                      menuStyle:menuStyle
                    };
  var subtitle=(this.props.nodeData.get('SourceUserName')?I18N.format(I18N.Folder.Detail.SubTitile,this.props.nodeData.get('SourceUserName')):null)
  var content=[];
  if(this.props.nodeData.get('Children')){
    this.props.nodeData.get('Children').forEach(function(child){
      content.push(<FolderItem nodeData={child} onOperationSelect={that._onItemMenuSelect}/>)
    })
  };
  var icon=(this.props.nodeData.get('Id')!=-1)?<IconMenu {...iconMenuProps} onItemTouchTap={this._onTitleMenuSelect}>
                                                  <MenuItem ref="Menu1" key={1} primaryText={I18N.Folder.Detail.Title.Menu1} />
                                                  <MenuItem ref="Menu2" key={2} primaryText={I18N.Folder.Detail.Title.Menu2} />
                                                  <MenuItem ref="Menu3" key={3} primaryText={I18N.Folder.Detail.Title.Menu3} />
                                                </IconMenu>
                                                :null;

    return(
      <div className='jazz-folder-detail'>
        <div className='header'>
          {collapseButton}
          <div className='subtitle'>
            {subtitle}
          </div>
          <div className='title' title={this.props.nodeData.get('Name')} onClick={this._onTitleMenuClick}>
            <div className='name'>
              {this.props.nodeData.get('Name')}
            </div>
            <div className='icon'>
              {icon}
            </div>
          </div>
        </div>
        <div className='content'>
          {content}
        </div>

      </div>
    )



  }
});

module.exports = FolderDetailPanel;
