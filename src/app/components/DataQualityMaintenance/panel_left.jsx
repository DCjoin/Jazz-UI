import React, { Component, PureComponent } from 'react';

import classnames from 'classnames';

import { CircularProgress } from 'material-ui';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';

import { nodeType } from 'constants/TreeConstants.jsx';

import {dateAdd} from 'util/Util.jsx';

import Tree from 'controls/tree/Tree.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';


class PureTree extends PureComponent {
  render() {
    let { hierarchy, selectedNode, onSelectNode, generateNodeConent, checkCollapseStatus } = this.props;
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
      checkCollapseStatus: checkCollapseStatus,
    };
    return (<Tree {...treePorps}></Tree>);
  }
}

export default class Left extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openPopover: false,
      popoverAnchorEl: null,
    };

    this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
  }
  _handleRequestClose() {
    this.setState(() => ({
      openPopover: false,
      // popoverAnchorEl: null,
    }));
  }
  _checkCollapseStatus(node) {
    // console.log(node.toJS());
    return node && node.get('Children') && node.get('Children').size > 0 && node.get('Children').some(child => child.get('NodeType') === 999)
  }
  _onDateSelectorChanged(startDate, endDate, startTime, endTime) {
     let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime();
    if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
      let isStart = dateSelector.getTimeType();
      if (isStart) {
        endDate = dateAdd(startDate, 30, 'days');
        endTime = startTime;
        timeRange.end = new Date(endDate.setHours(endTime, 0, 0, 0));
      } else {
        //jacob 2016-04-05: 开始时间不能出现24点
        startDate = dateAdd(endDate, -30, 'days');
        startTime = endTime;
        if(endTime==24)
        {
          startTime = 0;
          startDate = dateAdd(startDate, 1, 'days');
        }
        timeRange.start = new Date(startDate.setHours(startTime, 0, 0, 0));
      }
    }

    this.props.onDateSelectorChanged(timeRange.start,timeRange.end)

  }
  _generateNodeConent(nodeData) {
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
          'icon-column-fold': type == nodeType.Folder,
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
  render() {
    let { hierarchy, isBuilding, selectedNode, onSelectNode, onOpenHierarchy , startDate, endDate, switchMonitorTime, scanSwitch} = this.props;
    return (
      <div className='data-quality-maintenance-left'>
        <div className='data-quality-maintenance-filter-time'>
          <div className="text">{I18N.VEE.MonitorTime+"："}</div>
          <DateTimeSelector ref='dateTimeSelector' showTime={false} endLeft='-100px' startDate={startDate} endDate={endDate}  _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <div className='data-quality-maintenance-filter-node'></div>
        <div className='data-quality-maintenance-hierarchy'>
          <PureTree hierarchy={hierarchy} selectedNode={selectedNode} onSelectNode={onSelectNode} generateNodeConent={this._generateNodeConent} checkCollapseStatus={this._checkCollapseStatus}/>
        </div>
        <div className='data-quality-maintenance-actions-bar'>
          <div>{'配置规则'}</div>
          <div onClick={(e) => {
            if( isBuilding ) {
              this.setState({
                openPopover: true,
                popoverAnchorEl: e.target,
              });
            } else {
              onOpenHierarchy();
            }
          }}>{isBuilding ? <div className='icon-drop-down'>{'更多'}</div> : '管理数据流'}</div>
        </div>
        {this.state.openPopover && <Popover
          style={{
            padding:'6px 0'
          }}
          open={this.state.openPopover}
          anchorEl={this.state.popoverAnchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
          onRequestClose={this._handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <div
            className='data-quality-maintenance-actions-popover-item'
            onClick={() => {
              onOpenHierarchy();
              this._handleRequestClose();
            }}
          >
            {'管理数据流'}
          </div>
          <div className='data-quality-maintenance-actions-popover-item' onClick={() => {
            if( !scanSwitch.get('_loading') ) {
              this.setState({
                openPopover: false,
              });
              switchMonitorTime();
            }
          }}>{scanSwitch.get('_loading') ?
            <div className='flex-center'><CircularProgress size={20}/></div> :
            (scanSwitch.get('IsOpen') ? '关闭数据流' : '开始数据流监测')}
          </div>
        </Popover>}
      </div>
    );
  }
}
