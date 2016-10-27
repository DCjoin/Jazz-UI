'use strict';
import React from "react";
import classNames from 'classnames';
import { Paper, Menu, Mixins } from 'material-ui';
import { nodeType } from '../../constants/TreeConstants.jsx';

let treeMap = new Array();

let SearchItem = React.createClass({
  propTypes: {
    nodeData: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
  },
  _onClick: function() {
    this.props.onClick(this.props.nodeData);
  },
  render: function() {
    var name = this.props.nodeData.Name;
    var icon = (
    <div className={classNames({
      //add for file operation
      "icon-folder": this.props.nodeData.Type == nodeType.Folder,
      "icon-chart": this.props.nodeData.Type == nodeType.Widget
    })}/>
    );

    return (
      <div className="jazz-searchmenuitem" onClick={this._onClick} title={this.props.nodeData.Path}>
        <div style={{
        fontSize: '16px'
      }}>
          {icon}
        </div>
        <div className='jazz-dimsearch-nodename'>
          {this.props.nodeData.Name}</div>
      </div>
      )
  }
});
let FolderSearch = React.createClass({
  //mixins: [Mixins.ClickAwayable],
  propTypes: {
    allNode: React.PropTypes.object.isRequired,
    onSearchNodeClick: React.PropTypes.func.isRequired,
    searchValue: React.PropTypes.string,
    handleClickAway: React.PropTypes.func
  },
  drawNodeType: function() {
    let that = this;
    let folderMenuItems = [];
    let widgetMenuItems = [];
    var searchvalue = this.props.searchValue;
    folderMenuItems.length = 0;
    widgetMenuItems.length = 0;
    treeMap.forEach(function(nodeData, i) {

      var name = (nodeData.Name).toLocaleUpperCase();
      if (name.indexOf(searchvalue.toLocaleUpperCase()) >= 0) {

        if (nodeData.Type == 6) {
          folderMenuItems.push(<SearchItem nodeData={nodeData} onClick={that.props.onSearchNodeClick}/>)
        } else {
          widgetMenuItems.push(
            <SearchItem nodeData={nodeData} onClick={that.props.onSearchNodeClick}/>
          );
        }
      }
    });
    return (
      <div className="jazz-folder-leftpanel-searchpaper">
          {folderMenuItems}
          {widgetMenuItems}
          </div>
      );
  },
  componentClickAway: function() {
    this.props.handleClickAway();
  },
  render: function() {
    var dataSource = this.props.allNode;
    treeMap.length = 0;
    var traverse = function(data) {
      if (Array.isArray(data)) {
        data.forEach(function(node) {
          treeMap.push(node);
          if (Array.isArray(node.Children)) {
            traverse(node.Children);
          }
        });
      } else if (data) {
        treeMap.push(data);
        if (Array.isArray(data.Children)) {
          traverse(data.Children);
        }
      }
    }
    traverse(dataSource);
    var paperStyle = {
      backgroundColor: '#ffffff',
      zIndex: '100',
      width: '300px',
      height: '390px',
      position: 'fixed',
      top: '125px',
      left: '10px',
      border: '1px solid #c9c8c8',
      marginTop: '25px'
    };
    return (
      <Paper style={paperStyle}>
            {this.drawNodeType()}
          </Paper>
      )
  }
});

module.exports = FolderSearch;
