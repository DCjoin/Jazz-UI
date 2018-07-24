import React, { Component, PureComponent } from 'react';

import classnames from 'classnames';

import { CircularProgress } from 'material-ui';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import TextFiled from '@emop-ui/piano/text';
import Button from '@emop-ui/piano/button';
import { nodeType } from 'constants/TreeConstants.jsx';

import {dateAdd} from 'util/Util.jsx';

import Tree from 'controls/tree/Tree.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import PopupPaper from 'controls/popup_paper.jsx';
import Toggle from 'material-ui/Toggle';
import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

var isDataQualityFull=()=>privilegeUtil.isFull( PermissionCode.DATA_QUALITY_MAINTENANCE, CurrentUserStore.getCurrentPrivilege() )

function hasNodeIdInTree( id, tree ) {
  return tree.get('Id') === id || tree.get('Children').some( hasNodeIdInTree.bind(null, id) );
}

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

const FilterItems = [{
  Id: 1,
  Text: I18N.Setting.VEEMonitorRule.NullValue,
}, {
  Id: 2,
  Text: I18N.Setting.VEEMonitorRule.NegativeValue,
}, {
  Id: 4,
  Text: I18N.Setting.VEEMonitorRule.JumpValue,
}, {
  Id: 0,
  Text: I18N.VEE.AllNode,
}, ]

class FilterBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null,
    };
    this._handleRequestClose = this._handleRequestClose.bind(this);
  }
  _handleRequestClose() {
    this.setState(() => ({
      open: false,
    }));
  }
  render() {
    let { value, onChange } = this.props;
    return (
      <div className="data-quality-maintenance-filter-node" style={{position:'relative'}}>
        <TextFiled
          suffixIconClassName='icon-drop-down'
          width={294}
          onClick={(e) => {
            this.setState({
              open: true,
              anchorEl: e.currentTarget.parentNode,
            });
          }}
          value={FilterItems.filter( item => item.Id === value )[0].Text}
        />
        <PopupPaper
          open={this.state.open}
          onRequestClose={this._handleRequestClose}
          style={{width: 232,position:'absolute',top:'48px'}}
        >
        <div style={{padding:'6px 0'}}>
        {FilterItems.map( item =>
          <div
            style={{
              width: 192
            }}
            className={classnames('select-hour-item', {
              selected: item.Id === value
            })}
            onClick={() => {
              this._handleRequestClose();
              onChange(item.Id);
            }}>
            {item.Text}
          </div>
        )}</div>
        
        </PopupPaper>
      </div>
    );
  }
}

var NodeFilterBar=function({exceptionNodeOnly,onChangeExceptionNodeOnly}){
  var style={
    height: '40px',
    backgroundColor: '#f7f7f7',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    padding:'0 16px'
  }
  return(
    <div style={style}>
      <div style={{    fontSize:'14px',
      color:'#626469'}}>{I18N.VEE.ExceptionNodeOnly}</div>
      <Toggle style={{width:'46px'}} toggled={exceptionNodeOnly} onToggle={onChangeExceptionNodeOnly}/>
    </div>
  )
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
    this._checkCollapseStatus = this._checkCollapseStatus.bind(this);
  }
  _handleRequestClose() {
    this.setState(() => ({
      openPopover: false,
    }));
  }
  _checkCollapseStatus(node) {
    // console.log(node.toJS());
    if( !node || !node.get('Children') || !node.get('Children').size ) {
      return true;
    }

    let { selectedNode } = this.props,
    children = node.get('Children');
    if( selectedNode ) {
      return !(selectedNode.get('ParentId') === node.get('Id')) && !hasNodeIdInTree(selectedNode.get("Id"),node)
    }
    return children.some(child => child.get('NodeType') === 999);

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
    }else{

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
          'icon-Gateway': type == nodeType.GateWay,
          'icon-image': type == nodeType.Widget,
          'icon-dimension-node': type == nodeType.Area,
        })}/>
      </div>
    );
    let contentStyle = {};
    if( nodeData.get('HasException') ) {
      contentStyle.color = '#dc0a0a';
    }
    let alarm = null;
    if( nodeData.get('IsNotRead')) {
      alarm = (<div style={{
        width: 6,
        height: 6,
        minWidth:6,
        marginRight:'10px',
        borderRadius: 3,
        backgroundColor: '#ff4d4d',
        alignSelf: 'flex-start',
      }}/>);
    }
    if( nodeData.get('NodeType') === 999 ) {
      icon = null;
    }

    return (
      <div className='tree-node-content' style={contentStyle}>
        {icon}
        <div className='node-content-text' title={nodeData.get('Name')}>{nodeData.get('Name')}</div>
        {alarm}
      </div>
    );
  }
  render() {
    let {
      hierarchy,
      isBuilding,
      selectedNode,
      onSelectNode,
      onOpenHierarchy,
      startDate,
      endDate,
      switchMonitorTime,
      scanSwitch,
      onChangeFilterType,
      filterType,
      showConfig,
      exceptionNodeOnly,
      onChangeExceptionNodeOnly
    } = this.props;

    // <div onClick={(e) => {
    //   // if( isBuilding ) {
    //     this.setState({
    //       openPopover: true,
    //       popoverAnchorEl: e.target,
    //     });
    //   // } else {
    //   //   onOpenHierarchy();
    //   // }
    // }} className="data-quality-maintenance-morebtn"><div className='icon-drop-down'>{I18N.Common.Button.More}</div></div>
    return (
      <div className='data-quality-maintenance-left'>
        <div className='data-quality-maintenance-filter-time'>
          <div className="text">{I18N.VEE.MonitorTime+"："}</div>
          <DateTimeSelector disabled={!filterType} isDateViewStatus={true} ref='dateTimeSelector' showTime={false} endLeft='-100px' startDate={startDate} endDate={endDate}  _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <FilterBar onChange={onChangeFilterType} value={filterType} />
        {filterType!==0 && <NodeFilterBar exceptionNodeOnly={exceptionNodeOnly} onChangeExceptionNodeOnly={onChangeExceptionNodeOnly}/>}
        <div className='data-quality-maintenance-hierarchy'>
          <PureTree hierarchy={hierarchy} selectedNode={selectedNode} onSelectNode={onSelectNode} generateNodeConent={this._generateNodeConent} checkCollapseStatus={this._checkCollapseStatus}/>
        </div>
        {isDataQualityFull() && <div className='data-quality-maintenance-actions-bar'>
          <div onClick={showConfig}>{I18N.VEE.ConfigRule}</div>
         
        {isBuilding?<Button label={I18N.Common.Button.More}
                labelPosition="after"
                outline secondary
                iconClassName="icon-drop-down"
                style={{flex:1}}
                iconStyle={{marginTop: '4px'}}
                onClick={(e) => {
                  // if( isBuilding ) {
                    this.setState({
                      openPopover: true,
                      popoverAnchorEl: e.currentTarget,
                    });
                  // } else {
                  //   onOpenHierarchy();
                  // }
                }}/>:<Button label={I18N.VEE.ManageData}
                outline secondary
                style={{flex:1}}
                onClick={(e) => {
                  onOpenHierarchy();
                }}/>}
        </div>}
        {this.state.openPopover && <Popover
          style={{
            padding:'6px 0',
            
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
            {I18N.VEE.ManageData}
          </div>
          {isBuilding && <div className='data-quality-maintenance-actions-popover-item' onClick={() => {
            if( !scanSwitch.get('_loading') ) {
              this.setState({
                openPopover: false,
              });
              switchMonitorTime();
            }
          }}>{scanSwitch.get('_loading') ?
            <div className='flex-center'><CircularProgress size={20}/></div> :
            (scanSwitch.get('IsOpen') ? I18N.VEE.CloseMonitorBtn : I18N.VEE.StartMonitorBtn)}
          </div>}
        </Popover>}
      </div>
    );
  }
}
