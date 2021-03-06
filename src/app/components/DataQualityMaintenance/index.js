import React, { Component } from 'react';

import moment from 'moment';

import { CircularProgress } from 'material-ui';
import Button from '@emop-ui/piano/button';
import Dialog from '@emop-ui/piano/dialog';
import Toast from '@emop-ui/piano/toast';
import { nodeType } from 'constants/TreeConstants.jsx';
import DataQuality from 'constants/actionType/data_quality.jsx';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

import Left from './panel_left.jsx';
import Right from './panel_right.jsx';
import MonitorTimeDlg from './monitor_time_dlg.jsx';
import CloseMonitorDlg from './close_monitor_dlg.jsx';
import NeedRefreshDlg from './need_refresh_dlg.jsx';

import RulesConfigration from './multi_tags_rule_configuration.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

var isDataQualityFull=()=>privilegeUtil.isFull( PermissionCode.DATA_QUALITY_MAINTENANCE, CurrentUserStore.getCurrentPrivilege() )

function formatMomentToDateStr(date) {
  return date.toJSON();
}

function isBuilding( node ) {
  return node && node.get('NodeType') === nodeType.Building;
}

function hasNodeIdInTree( id, tree ) {
  return tree.get('Id') === id || tree.get('Children').some( hasNodeIdInTree.bind(null, id) );
}

export default class DataQualityMaintenance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      needRefresh: false,
      startTime: moment().subtract(1, 'months').add(1, 'day').startOf('day'),
      endTime: moment().startOf('day').add(1,'d'),
      showLeft: true,
      filterType: 1,
      showConfig:false,
      exceptionNodeOnly:false
    };
    this._openSSOHierarchyUrl = this._openSSOHierarchyUrl.bind(this);
    this._onChange = this._onChange.bind(this);
    this._showConfig = this._showConfig.bind(this);

    DataQualityMaintenanceStore.addChangeListener(this._onChange);

    this._getVEEDataStructure();
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    let storeVEEDataStructure = DataQualityMaintenanceStore.getVEEDataStructure();
    let selectedNodeId = this.state.selectedNodeId;
    if( storeVEEDataStructure !== this.state.VEEDataStructure && !storeVEEDataStructure.get('_loading') && selectedNodeId && !hasNodeIdInTree( selectedNodeId, storeVEEDataStructure.getIn(['Tree', 0]) ) ) {

      this.setState({
        VEEDataStructure: storeVEEDataStructure,
        scanSwitch: DataQualityMaintenanceStore.getScanSwitch(),
        selectedNodeId: null,
      });
    } else {
      this.setState({
        VEEDataStructure: storeVEEDataStructure,
        scanSwitch: DataQualityMaintenanceStore.getScanSwitch(),
      });
    }
  }

  _getVEEDataStructure(state = this.state) {
    DataQualityMaintenanceAction.getVEEDataStructure({
      ExceptionType: state.filterType,
      StartTime: state.startTime.toJSON(),
      EndTime: state.endTime.toJSON(),
      CustomerId: this.props.router.params.customerId,
      UserId: CurrentUserStore.getCurrentUser().Id,
      ExceptionNodeOnly:this.state.exceptionNodeOnly

      // "ExceptionType": 1,
      // "StartTime": "2018-07-01T01:42:55.030Z",
      // "EndTime": "2018-07-05T01:42:55.030Z",
      // "CustomerId":345208,
      // "UserId":301825,

    });

  }

  _openSSOHierarchyUrl() {
    let { customerId, lang } = this.props.router.params;
    window.open(`/${lang}/sso-redirect-hierarchy/${customerId}?callbackURL=${location.href}`);
    this.setState(() => ({needRefresh: true}));
  }

  _renderNon() {
    return isDataQualityFull()?(<div className='flex-center'><Button onClick={this._openSSOHierarchyUrl} label={'+ ' + I18N.VEE.CreateDataStructure} outline secondary /></div>)
                              :(<div className="flex-center" style={{fontSixe:'16px',color:'#666666'}}>{I18N.VEE.NoPrivilege}</div>)
  }

  _showConfig(){
    this.setState({
      showConfig:true
    })
  }

  render() {
    // filterType 字段控制负值、空值、跳变等字段的显示
    let { VEEDataStructure, scanSwitch, selectedNodeId, filterType,exceptionNodeOnly } = this.state;
    var selectedNode=DataQualityMaintenanceStore.getDataNodeById(selectedNodeId);
    if( !VEEDataStructure || VEEDataStructure.get('_loading') ) {
      return <div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
    }
    return (
      <div className='data-quality-maintenance-wrapper'>
        {VEEDataStructure.get('HasHierarchy') && this.state.showLeft &&
        <Left
          isBuilding={isBuilding(selectedNode)}
          scanSwitch={scanSwitch}
          selectedNode={selectedNode}
          onSelectNode={(nodeData) => {
            this.setState(() => ({selectedNodeId: nodeData.get("Id")}));
            if( isBuilding(nodeData) ) {
              DataQualityMaintenanceAction.getScanSwitch( nodeData.get('Id') );
            }
          }}
          hierarchy={VEEDataStructure.getIn(['Tree', 0, 'Children'])}
          onOpenHierarchy={this._openSSOHierarchyUrl}
          startDate={new Date(this.state.startTime)}
          endDate={new Date(this.state.endTime)}
          onDateSelectorChanged={(startDate,endDate)=>{
            this.setState({
              startTime:moment(startDate),
              endTime:moment(endDate)
            }, ()=>{this._getVEEDataStructure()})
          }}
          switchMonitorTime={() => {
            if( scanSwitch.get('IsOpen') ) {
              this.setState({
                closeMonitorDlg: true,
              });
            } else {
              this.setState({
                openMonitorTimeDlg: true,
              });
            }
          }}
          onChangeFilterType={ val => this.setState({filterType: val}, this._getVEEDataStructure) }
          filterType={filterType}
          showConfig={this._showConfig}
          exceptionNodeOnly={exceptionNodeOnly}
          onChangeExceptionNodeOnly={(e,value)=>this.setState({exceptionNodeOnly:value},this._getVEEDataStructure)}
        />}
        {VEEDataStructure.get('HasHierarchy') &&
        <Right
          showLeft={this.state.showLeft}
          selectedNode={selectedNode}
          onToggle={()=>{this.setState({showLeft:!this.state.showLeft})}}
          filterType={filterType}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />}
        {!VEEDataStructure.get('HasHierarchy') && this._renderNon()}
        <NeedRefreshDlg open={this.state.needRefresh} onRefresh={() => {
          this.setState(() => ({needRefresh: false}));
          this._getVEEDataStructure();
        }}/>
        <MonitorTimeDlg
          startTime={scanSwitch.get('UpdateTime')}
          locale={this.props.router.params.lang}
          open={this.state.openMonitorTimeDlg}
          onSubmit={( startTimeStr ) => {
            DataQualityMaintenanceAction.saveScanSwitch(
              scanSwitch
                .set('UpdateTime', startTimeStr)
                .set('IsOpen', true)
                .set("CustomerId",this.props.router.params.customerId).toJS());

            this.setState({
              openMonitorToast: true,
            });
          }}
          onCancel={() => {this.setState({openMonitorTimeDlg: false})}}
        />
        <CloseMonitorDlg
          open={this.state.closeMonitorDlg}
          onSubmit={() => {
            DataQualityMaintenanceAction.saveScanSwitch(
              scanSwitch.set('IsOpen', false).set("CustomerId",this.props.router.params.customerId).toJS());
            this.setState({
              closeMonitorToast: true,
            });
          }}
          onCancel={() => {this.setState({closeMonitorDlg: false})}}
        />

        {this.state.showConfig && <RulesConfigration customerId={this.props.router.params.customerId} onCancel={()=>{this.setState({showConfig:false})}}/>}

        <Toast autoHideDuration={4000} className='toast-tip' open={this.state.openMonitorToast} onRequestClose={() => {
          this.setState({
            openMonitorToast: false,
          })
        }}><div className='icon-check-circle'>{I18N.VEE.StartMonitor}</div></Toast>
        <Toast autoHideDuration={4000} className='toast-tip' open={this.state.closeMonitorToast} onRequestClose={() => {
          this.setState({
            closeMonitorToast: false,
          })
        }}><div className='icon-check-circle'>{I18N.VEE.CloseMonitor}</div></Toast>
      </div>
    );
  }
}
