'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import { CircularProgress, FontIcon, IconMenu, IconButton } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import FolderAction from '../../actions/FolderAction.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import OrigamiPanel from '../../controls/OrigamiPanel.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';
import { getCookie } from '../../util/Util.jsx';
import PermissionCode from '../../constants/PermissionCode.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
function currentUser() {
  return CurrentUserStore.getCurrentUser();
}

var FolderItem = createReactClass({
  propTypes: {
    nodeData: PropTypes.object,
    onOperationSelect: PropTypes.func,
  },
  _onMenuSelect: function(e, item) {
    let menuIndex = parseInt(item.key);
    this.props.onOperationSelect(this.props.nodeData, menuIndex);
  },
  _onTitleMenuClick: function() {
    this.setState({
      isTitleMenuShow: !this.state.isTitleMenuShow
    });
  },
  _onItemClick: function() {
    FolderAction.setSelectedNode(this.props.nodeData);
    if (this.props.nodeData.get('IsSenderCopy') && !this.props.nodeData.get('IsRead')) {
      FolderAction.modifyFolderReadStatus(this.props.nodeData);
    }

  },
  getImage: function() {
    var image;
    if (this.props.nodeData.get('Type') == 6) {
      image = <img src={require('../../less/images/folder.png')}/>
    } else {
      switch (this.props.nodeData.get('ChartType')) {
        case 1:
          image = <img src={require('../../less/images/line.png')}/>;
          break;
        case 2:
        case 3:
          image = <img src={require('../../less/images/column.png')}/>;
          break;
        case 4:
          image = <img src={require('../../less/images/pie.png')}/>;
          break;
        case 5:
          image = <img src={require('../../less/images/raw-data.png')}/>;
          break;
        case 'Column':
          image = <img src={require('../../less/images/labeling.png')}/>;
          break;
      }
    }
    return image
  },
  getInitialState: function() {
    return {
      isTitleMenuShow: false
    }
  },
  render: function() {
    var menu,
      subtitle;
    var iconStyle = {
        fontSize: '12px',
        color: '#464949'
      },
      menuStyle = {
        fontSize: '14px',
        lineHeight: '32px'
      };
    var IconButtonElement = <IconButton iconStyle={iconStyle} iconClassName="icon-arrow-down"/>;
    //props
    var iconMenuProps = {
      iconButtonElement: IconButtonElement,
      anchorOrigin:{horizontal: 'left', vertical: 'top'},
     targetOrigin:{horizontal: 'left', vertical: 'top'}
    };
    //add for PM2.5
    var user=window.currentUser || currentUser();
    if(user.Name==='se'){
      menu=null;
    }
    else if (this.props.nodeData.get('Type') == 6) {
      menu = <IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
            <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
            <MenuItem key={2} primaryText={I18N.Folder.Detail.Title.Menu2} style={menuStyle}/>
            <MenuItem key={3} primaryText={I18N.Folder.Detail.Title.Menu3} style={menuStyle}/>
            </IconMenu>;
      subtitle = <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
                <div>{I18N.Folder.FolderName + this.props.nodeData.get('ChildFolderCount')}</div>
                <div style={{
        marginLeft: '5px'
      }}>{I18N.Folder.WidgetName + this.props.nodeData.get('ChildWidgetCount')}</div>
              </div>
    } else {
      if (this.props.nodeData.get('WidgetType') == 4 || this.props.nodeData.get('WidgetType') == 5) {
        menu = <IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
              <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
              <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} style={menuStyle}/>
              <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} style={menuStyle}/>
              </IconMenu>
      } else {
        // CurrentUserStore.getCurrentPrivilege().indexOf('1205') > -1
        if (CurrentUserStore.permit(PermissionCode.ENERGY_EXPORT.FULL)) {
          menu = <IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
                <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
                <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} style={menuStyle}/>
                <MenuItem key={4} primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} style={menuStyle}/>
                <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} style={menuStyle}/>
                </IconMenu>
        } else {
          menu = <IconMenu {...iconMenuProps} onItemTouchTap={this._onMenuSelect}>
                <MenuItem key={1} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
                <MenuItem key={2} primaryText={I18N.Folder.Detail.WidgetMenu.Menu2} style={menuStyle}/>
                <MenuItem key={5} primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} style={menuStyle}/>
                </IconMenu>
        }

      }
    }

    var image = this.getImage();
    return (
      <div className='jazz-folder-detail-item'>
        <div className='icon' onClick={this._onItemClick}>
        {image}
        </div>
        <div className='title' title={this.props.nodeData.get('Name')} onClick={this._onTitleMenuClick}>
          <div className='name'>
            {this.props.nodeData.get('Name')}
          </div>
          <div className='select'>
              {menu}
          </div>

        </div>
        <div className='subtitle'>
        {subtitle}
        </div>

      </div>
    )
  }
});
var FolderDetailPanel = createReactClass({

  propTypes: {
    onToggle: PropTypes.func,
    nodeData: PropTypes.object,
    onOperationSelect: PropTypes.func,
  },
  _onTitleMenuClick: function() {
    this.setState({
      isTitleMenuShow: !this.state.isTitleMenuShow
    })
  },
  _onTitleMenuSelect: function(e, item) {
    let menuIndex = parseInt(item.key);
    this.props.onOperationSelect(this.props.nodeData, menuIndex, true);
  },
  _onItemMenuSelect: function(node, index) {
    this.props.onOperationSelect(node, index);
  },
  _onBackBtnClick: function() {
    var parentNode = FolderStore.getNodeById(this.props.nodeData.get('ParentId'));
    FolderAction.setSelectedNode(parentNode);
  },
  getInitialState: function() {
    return {
      isTitleMenuShow: false
    }
  },
  render: function() {
    var that = this;
    var user=window.currentUser || currentUser();
    var collapseButton = (
    <div className="fold-tree-btn pop-framework-right-actionbar-top-fold-btn" style={{
      "color": "#939796"
    }}>
                        <FontIcon hoverColor="#6b6b6b" color="#939796" className={classNames("icon", "icon-column-fold")} onClick={this.props.onToggle}/>
                      </div>
    );
    var iconStyle = {
        fontSize: '16px',
      },
      menuStyle = {
        fontSize: '14px',
        lineHeight: '32px'
      };
    var IconButtonElement = <IconButton iconStyle={iconStyle} iconClassName="icon-arrow-down"/>;
    //props
    var iconMenuProps = {
      iconButtonElement: IconButtonElement,
      anchorOrigin:{horizontal: 'left', vertical: 'top'},
      targetOrigin:{horizontal: 'left', vertical: 'top'}
    };
    var subtitle = (this.props.nodeData.get('SourceUserName') ? I18N.format(I18N.Folder.Detail.SubTitile, this.props.nodeData.get('SourceUserName')) : null)
    var content = [];
    if (this.props.nodeData.get('Children')) {
      this.props.nodeData.get('Children').forEach(function(child) {
        content.push(<FolderItem key={child.get('Id')} nodeData={child} onOperationSelect={that._onItemMenuSelect}/>)
      })
    }

    var icon = (this.props.nodeData.get('Id') != -1 && user.Name!=='se') ? <IconMenu {...iconMenuProps} onItemTouchTap={this._onTitleMenuSelect}>
                                                  <MenuItem ref="Menu1" key={1} primaryText={I18N.Folder.Detail.Title.Menu1} style={menuStyle}/>
                                                  <MenuItem ref="Menu2" key={2} primaryText={I18N.Folder.Detail.Title.Menu2} style={menuStyle}/>
                                                  <MenuItem ref="Menu3" key={3} primaryText={I18N.Folder.Detail.Title.Menu3} style={menuStyle}/>
                                                </IconMenu>
      : null;
    var BackBtn = (this.props.nodeData.get('Id') != -1) ?

      <div style={{
        height: '30px',
        width: '30px',
        border: '1px solid #ececec',
        marginRight: '10px',
        marginTop: '-3px'
      }}>
      <FontIcon style={{
        fontSize: '16px',
        margin: '5px 0 0 6px',
      }} className={classNames("icon", "icon-return")} onClick={this._onBackBtnClick}/>
    </div>

      : null;

    return (
      <div className='jazz-folder-detail'>

        <div className='header'>
          <OrigamiPanel />
          {collapseButton}
          <div className='subtitle'>
            {subtitle}
          </div>

          <div className='title' title={this.props.nodeData.get('Name')} onClick={this._onTitleMenuClick}>
{BackBtn}
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
