'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import classNames from 'classnames';
import {CircularProgress,FontIcon} from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let Menu = require('material-ui/lib/menus/menu');

var FolderItem= React.createClass({
  propTypes:{
    nodeData: React.PropTypes.object,
  },
  _onMenuSelect:function(e,item){

  },
  _onTitleMenuClick:function(){
    this.setState({
      isTitleMenuShow:!this.state.isTitleMenuShow
    });
  },
  getInitialState:function(){
    return{
      isTitleMenuShow:false
    }
  },
  render:function(){
    var menu,subtitle;
    if(this.props.nodeData.get('Type')==6){
      menu=<Menu onItemTouchTap={this._onMenuSelect}>
            <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} />
            <MenuItem key={2} primaryText={I18N.Folder.Detail.Title.Menu2} />
            <MenuItem key={3} primaryText={I18N.Folder.Detail.Title.Menu3} />
          </Menu>;
      subtitle=<div style={{display:'flex','flex-direction':'row'}}>
                <div>{I18N.Folder.FolderName+this.props.nodeData.get('ChildFolderCount')}</div>
                <div style={{'margin-left':'5px'}}>{I18N.Folder.WidgetName+this.props.nodeData.get('ChildWidgetCount')}</div>
              </div>
    }
    else {
      menu=<Menu onItemTouchTap={this._onMenuSelect}>
            <MenuItem key={1} primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} />
            <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} />
            <MenuItem key={3} primaryText={I18N.Folder.Detail.WidgetMenu.Menu3} />
            <MenuItem key={4} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} />
            <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} />
          </Menu>
    };
    var titleMenu=(this.state.isTitleMenuShow?{menu}:null);
    return(
      <div className='jazz-folder-detail-item'>
        <div className='icon'>
         <img src={require('../../less/images/chart.png')}/>
        </div>
        <div className='title' title={this.props.nodeData.get('Name')} onClick={this._onTitleMenuClick}>
          <div className='name'>
            {this.props.nodeData.get('Name')}
          </div>
          <div className='select'>
              <div className="icon-arrow-down"/>
          </div>

        </div>
        {titleMenu}
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
  },
  _onTitleMenuClick:function(){
    this.setState({
      isTitleMenuShow:!this.state.isTitleMenuShow
    })
  },
  _onTitleMenuSelect:function(e,item){
    console.log(item);
  },
  getInitialState:function(){
    return{
      isTitleMenuShow:false
    }
  },
  render:function(){
  var collapseButton = (
                      <div className="fold-tree-btn pop-framework-right-actionbar-top-fold-btn" style={{"color":"#939796"}}>
                        <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} onClick={this.props.onToggle}/>
                      </div>
                  );

  var titleMenu=(this.state.isTitleMenuShow?<Menu onItemTouchTap={this._onTitleMenuSelect}>
                                              <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} />
                                              <MenuItem key={2} primaryText={I18N.Folder.Detail.Title.Menu2} />
                                              <MenuItem key={3} primaryText={I18N.Folder.Detail.Title.Menu3} />
                                            </Menu>:null);
  var subtitle=(this.props.nodeData.get('SourceUserName')?I18N.format(I18N.Folder.Detail.SubTitile,this.props.nodeData.get('SourceUserName')):null)
  var content=[];
    this.props.nodeData.get('Children').forEach(function(child){
      content.push(<FolderItem nodeData={child}/>)
    })
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
              <FontIcon className="icon-arrow-down"/>
          </div>
          {titleMenu}
        </div>
        <div className='content'>
          {content}
        </div>

      </div>
    )



  }
});

module.exports = FolderDetailPanel;
