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
      startTime: moment().subtract(1, 'months').startOf('day'),
      endTime: moment().startOf('day'),
      showLeft: true,
      filterType: 1,
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
    let storeVEEDataStructure = DataQualityMaintenanceStore.getVEEDataStructure();
    let selectedNode = this.state.selectedNode;
    if( storeVEEDataStructure !== this.state.VEEDataStructure && !storeVEEDataStructure.get('_loading') && selectedNode && !hasNodeIdInTree( selectedNode.get('Id'), storeVEEDataStructure.getIn(['Tree', 0]) ) ) {
      selectedNode = undefined;

      this.setState({
        VEEDataStructure: storeVEEDataStructure,
        scanSwitch: DataQualityMaintenanceStore.getScanSwitch(),
        selectedNode: null,
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
    });

  }

  _openSSOHierarchyUrl() {
    let { customerId, lang } = this.props.router.params;
    window.open(`/${lang}/sso-redirect-hierarchy/${customerId}?callbackURL=${location.href}`);
    this.setState(() => ({needRefresh: true}));
  }

  _renderNon() {
    return (<div className='flex-center'><Button onClick={this._openSSOHierarchyUrl} label={'+ ' + '新建数据流架构'} outline secondary /></div>)
  }
  render() {
    let { VEEDataStructure, scanSwitch, selectedNode, filterType } = this.state;
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
            this.setState(() => ({selectedNode: nodeData}));
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
            }, this._getVEEDataStructure())
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
        />}
        {VEEDataStructure.get('HasHierarchy') &&
        <Right
          showLeft={this.state.showLeft}
          selectedNode={this.state.selectedNode}
          onToggle={()=>{this.setState({showLeft:!this.state.showLeft})}}
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
                .set('IsOpen', true).toJS());

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
              scanSwitch.set('IsOpen', false).toJS());
            this.setState({
              closeMonitorToast: true,
            });
          }}
          onCancel={() => {this.setState({closeMonitorDlg: false})}}
        />

        <Toast autoHideDuration={4000} className='toast-tip' open={this.state.openMonitorToast} onRequestClose={() => {
          this.setState({
            openMonitorToast: false,
          })
        }}><div className='icon-check-circle'>{'该建筑已开启数据监测'}</div></Toast>
        <Toast autoHideDuration={4000} className='toast-tip' open={this.state.closeMonitorToast} onRequestClose={() => {
          this.setState({
            closeMonitorToast: false,
          })
        }}><div className='icon-check-circle'>{'该建筑已关闭数据监测'}</div></Toast>
      </div>
    );
  }
}
