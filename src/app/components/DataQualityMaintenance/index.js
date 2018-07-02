import React, { Component, PureComponent } from 'react';

import moment from 'moment';
import classnames from 'classnames';

import { CircularProgress } from 'material-ui';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import {dateAdd} from 'util/Util.jsx';
import Button from '@emop-ui/piano/button';
import Dialog from '@emop-ui/piano/dialog';

import Tree from 'controls/tree/Tree.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import { nodeType } from '../../constants/TreeConstants.jsx';
import DataQuality from 'constants/actionType/data_quality.jsx';
import DataQualityMaintenanceAction from '../../actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from '../../stores/data_quality_maintenance.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';

import TagContentField from './tag_content_field.jsx';
import Panel from 'controls/toggle_icon_panel.jsx';

function formatMomentToDateStr(date) {
  return date.toJSON();
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

class Left extends Component {
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
    let { hierarchy, selectedNode, onSelectNode, onOpenHierarchy , startDate , endDate} = this.props;
    let selectedIsBuilding = selectedNode && selectedNode.get('NodeType') === nodeType.Building;
    return (
      <div className='data-quality-maintenance-left'>
        <div className='data-quality-maintenance-filter-time'>
          <div className="text">{I18N.VEE.MonitorTime+"："}</div>
          <DateTimeSelector ref='dateTimeSelector' showTime={false} endLeft='-100px'     startDate= {startDate}
      endDate={endDate}  _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <div className='data-quality-maintenance-filter-node'></div>
        <div className='data-quality-maintenance-hierarchy'>
          <PureTree hierarchy={hierarchy} selectedNode={selectedNode} onSelectNode={onSelectNode} generateNodeConent={this._generateNodeConent}/>
        </div>
        <div className='data-quality-maintenance-actions-bar'>
          <div>{'配置规则'}</div>
          <div>{'导出报告'}</div>
          <div onClick={(e) => {
            if( selectedIsBuilding ) {
              this.setState({
                openPopover: true,
                popoverAnchorEl: e.target,
              });
            } else {
              onOpenHierarchy();
            }
          }}>{selectedIsBuilding ? <div className='icon-drop-down'>{'更多'}</div> : '管理数据流'}</div>
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
          <div className='data-quality-maintenance-actions-popover-item'>{'开始数据流监测'}</div>
        </Popover>}
      </div>
    );
  }
}
class Right extends Component {
  render() {
    let { selectedNode ,showLeft, onToggle} = this.props;

    if( selectedNode ){
      return(selectedNode.get("NodeType")===DataQuality.nodeType.Tag?<TagContentField nodeData={selectedNode} showLeft={showLeft} onToggle={onToggle}/>
                                                                          :null)
    }else{
      return(<Panel onToggle={onToggle} isFolded={showLeft}>
            <div className='flex-center' style={{fontSize: '16px', color: '#626469',}}>{'请在左边选择要查看的节点'}</div>
          </Panel>) 
    }
  }
}


export default class DataQualityMaintenance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      needRefresh: false,
      startTime: moment().subtract(1, 'months').startOf('day'),
      endTime: moment().startOf('day'),
      showLeft:true
    };
    this._openSSOHierarchyUrl = this._openSSOHierarchyUrl.bind(this);
    this._onChange = this._onChange.bind(this);

    DataQualityMaintenanceStore.addChangeListener(this._onChange);

    this._getVEEDataStructure();
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      VEEDataStructure: DataQualityMaintenanceStore.getVEEDataStructure()
    });
  }

  _getVEEDataStructure(state = this.state) {
    DataQualityMaintenanceAction.getVEEDataStructure({
      ExceptionType: 0,
      StartTime: this.state.startTime.toJSON(),
      EndTime: this.state.endTime.toJSON(),
      CustomerId: this.props.router.params.customerId,
      UserId: CurrentUserStore.getCurrentUser().Id,
      // 'StartTime': '2018-06-28T02:44:35.581Z',
      // 'EndTime': '2018-06-28T02:44:35.581Z',
      // 'CustomerId':100626,
      // 'UserId':312081
    });

  }

  _openSSOHierarchyUrl() {
    let { customerId, lang } = this.props.router.params;
    window.open(`/${lang}/sso-redirect-hierarchy/${customerId}?callbackURL=${location.href}`);
    this.setState(() => ({needRefresh: true}));
  }

  _renderNeedRefresh() {
    return (
      <Dialog
        open={this.state.needRefresh}
        actions={[
          <div>
            <Button flat secondary
              label={'刷新页面'}
              labelStyle={{
                color: '#32ad3c',
              }}
              style={{
                float: 'right',
              }}
              onClick={() => {
                this.setState(() => ({needRefresh: false}));
                this._getVEEDataStructure();
              }}
            />
          </div>
        ]}
        contentStyle={{
          padding: '24px 0 18px'
        }}
      >{'刷新页面获取新数据流架构'}</Dialog>);
  }
  _renderNon() {
    return (<div className='flex-center'><Button onClick={this._openSSOHierarchyUrl} label={'+ ' + '新建数据流架构'} outline secondary /></div>)
  }
  render() {
    let { VEEDataStructure } = this.state;
    if( !VEEDataStructure || VEEDataStructure.get('_loading') ) {
      return <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
    }
    return (
      <div className='data-quality-maintenance-wrapper'>
        {VEEDataStructure.get('HasHierarchy') && this.state.showLeft &&
        <Left
          selectedNode={this.state.selectedNode}
          onSelectNode={(nodeData) => this.setState(() => ({selectedNode: nodeData}))}
          hierarchy={VEEDataStructure.getIn(['Tree', 0, 'Children'])}
          onOpenHierarchy={this._openSSOHierarchyUrl}
          startDate={new Date(this.state.startTime)}
          endDate={new Date(this.state.endTime)}
          onDateSelectorChanged={(startDate,endDate)=>{
                  this.setState({
                    startTime:moment(startDate),
                    endTime:moment(endDate)
                  },()=>{this._getVEEDataStructure()})
          }}
        />}
        {VEEDataStructure.get('HasHierarchy') &&
        <Right
          showLeft={this.state.showLeft}
          selectedNode={this.state.selectedNode}
          onToggle={()=>{this.setState({showLeft:!this.state.showLeft})}}
        />}
        {!VEEDataStructure.get('HasHierarchy') && this._renderNon()}
        {this._renderNeedRefresh()}
      </div>
    );
  }
}
