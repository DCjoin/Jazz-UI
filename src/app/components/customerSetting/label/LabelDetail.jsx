'use strict';

import React from "react";
import classnames from "classnames";
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import LabelBasic from './LabelBasic.jsx';
import GradeContainer from './GradeContainer.jsx';
import ChartComponent from './ChartComponent.jsx';
import CommonFuns from '../../../util/Util.jsx';
import UOMStore from '../../../stores/UOMStore.jsx';

var LabelDetail = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    showLeft: React.PropTypes.bool,
    showDeleteDialog: React.PropTypes.bool,
    selectedLabel: React.PropTypes.object,
    onCancel: React.PropTypes.func,
    onSave: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onDeleteLabel: React.PropTypes.func,
    onCloseDialog: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    mergeLabel: React.PropTypes.func,
    enableSave: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _mergeLabel: function(data) {
    this.props.mergeLabel(data);
  },
  _onUomChange: function() {
    var selectedLabel = this.props.selectedLabel;
    var uom = CommonFuns.getUomById(selectedLabel.get('UomId')).Code;
    var kpiList = this._getKpiTypeList();
    var index = kpiList.findIndex((item) => {
      if (item.payload === selectedLabel.get('LabellingType')) {
        return true;
      }
    });
    if (index !== -1) {
      uom += kpiList[index].uom;
    }
    this.setState({
      uom: uom
    });
  },
  _getKpiTypeList: function() {
    let kpiTypeList = [
      {
        payload: 7,
        uom: '',
        text: I18N.EM.Unit.UnitOriginal /*'指标原值'*/
      }, {
        payload: 1,
        uom: I18N.Common.Per.Person,
        text: I18N.EM.Unit.UnitPopulation /*'单位人口'*/
      }, {
        payload: 2,
        uom: I18N.Common.Per.m2,
        text: I18N.EM.Unit.UnitArea /*'单位面积'*/
      }, {
        payload: 3,
        uom: I18N.Common.Per.m2,
        text: I18N.EM.Unit.UnitColdArea /*'单位供冷面积'*/
      }, {
        payload: 4,
        uom: I18N.Common.Per.m2,
        text: I18N.EM.Unit.UnitWarmArea /*'单位采暖面积'*/
      }, {
        payload: 8,
        uom: I18N.Common.Per.Room,
        text: I18N.EM.Unit.UnitRoom
      }, {
        payload: 9,
        uom: I18N.Common.Per.Room,
        text: I18N.EM.Unit.UnitUsedRoom
      }, {
        payload: 10,
        uom: I18N.Common.Per.Bed,
        text: I18N.EM.Unit.UnitBed
      }, {
        payload: 11,
        uom: I18N.Common.Per.Bed,
        text: I18N.EM.Unit.UnitUsedBed
      }, {
        payload: 5,
        uom: '',
        text: I18N.EM.DayNightRatio /*'昼夜能耗比'*/
      }, {
        payload: 6,
        uom: '',
        text: I18N.EM.WorkHolidayRatio
      }];
    return kpiTypeList;
  },
  _renderDeleteDialog() {
    if (!this.props.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.Common.Button.Delete}
      primary={true}
      onClick={this.props.onDeleteLabel} />,

      <FlatButton
      label={I18N.Common.Button.Cancel}
      onClick={this.props.onCloseDialog} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={this.props.showDeleteDialog}
      title={I18N.Setting.CustomizedLabeling.DeleteLabel}
      actions={dialogActions}
      modal={true}>
        <div className='jazz-customer-label-delete'>{I18N.format(I18N.Setting.CustomizedLabeling.DeleteTip, this.props.selectedLabel.get('Name'))}</div>
      </Dialog>);
  },
  _renderHeader: function() {
    var me = this;
    var selectedLabel = me.props.selectedLabel,
      isView = me.props.formStatus === formStatus.VIEW;
    var labelNameProps = {
      isViewStatus: isView,
      title: I18N.Setting.Tag.TagName,
      defaultValue: selectedLabel.get('Name'),
      isRequired: true,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Name"
        });
      }
    };
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...labelNameProps} />
        </div>
      </div>
      );

  },

  _renderContent: function() {
    var content = null;
    var isView = this.props.formStatus === formStatus.VIEW;
    var selectedLabel = this.props.selectedLabel;

    return (
      <div className="pop-manage-detail-content">
        <div>
          <LabelBasic ref='labelBasic' selectedLabel={selectedLabel} isViewStatus={isView} mergeLabel={this._mergeLabel}/>
        </div>
        <div className='jazz-customer-label-chart'>
          <GradeContainer ref='gradeContainer' labelGradeList={selectedLabel.get('LabellingItems')} isViewStatus={isView} mergeLabel={this._mergeLabel} uom={this.state.uom} order={selectedLabel.get('Order')}/>
          <ChartComponent levelCount={selectedLabel.get('Grade')}/>
        </div>
      </div>
      );
  },
  _renderFooter: function() {
    var bottom = (
    <FormBottomBar allowDelete={true} allowEdit={true} enableSave={this.props.enableSave} ref="actionBar" status={this.props.formStatus} onSave={this.props.onSave} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onCancel={this.props.onCancel} />
    );

    return bottom;
  },
  componentWillMount: function() {},
  componentDidMount: function() {
    UOMStore.addChangeListener(this._onUomChange);
  },
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onUomChange);
  },

  render: function() {
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter(),
      deleteDialog = this._renderDeleteDialog();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": !this.props.showLeft,
        "jazz-framework-right-fold": this.props.showLeft
      })}>
      <Panel onToggle={this.props.onToggle}>
        {header}
        {content}
        {footer}
        {deleteDialog}
      </Panel>
    </div>
      );
  },
});

module.exports = LabelDetail;
