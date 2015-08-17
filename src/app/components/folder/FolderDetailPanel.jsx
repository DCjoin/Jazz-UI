'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import classNames from 'classnames';
import {CircularProgress,FlatButton,FontIcon,IconButton,IconMenu,Dialog} from 'material-ui';

var FolderDetailPanel = React.createClass({

  propTypes:{
    onToggle: React.PropTypes.func,
    nodeData: React.PropTypes.object,
  },
  render:function(){
  var collapseButton = (
                      <div className="fold-tree-btn pop-framework-right-actionbar-top-fold-btn" style={{"color":"#939796"}}>
                        <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} onClick={this.props.onToggle}/>
                      </div>
                      );
  return(
    <div className='jazz-folder-detail'>
      {collapseButton}
    </div>
  )
  }
});

module.exports = FolderDetailPanel;
