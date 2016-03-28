'use strict';

import React from "react";
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import ComAndUom from '../ComAndUom.jsx';

var LabelBasic = React.createClass({
  propTypes: {
    selectedLabel: React.PropTypes.object,
    mergeLabel: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _mergeLabel: function(data) {
    if (this.props.mergeLabel) {
      this.props.mergeLabel(data);
    }
  },
  _isValid: function() {
    var kpiTypeIsValid = this.refs.kpiType.isValid(),
      gradeIsValid = this.refs.grade.isValid(),
      orderIsValid = this.refs.order.isValid();
    var commentIsValid = true;
    if (this.refs.comment) {
      commentIsValid = this.refs.comment.isValid();
    }
    return kpiTypeIsValid && gradeIsValid && orderIsValid && commentIsValid;
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
  _getLabelGradeList: function() {
    var uom = I18N.Setting.CustomizedLabeling.Grade;
    let labelGradeList = [{
      payload: 3,
      text: I18N.format(uom, 3)
    }, {
      payload: 4,
      text: I18N.format(uom, 4)
    }, {
      payload: 5,
      text: I18N.format(uom, 5)
    }, {
      payload: 6,
      text: I18N.format(uom, 6)
    }, {
      payload: 7,
      text: I18N.format(uom, 7)
    }, {
      payload: 8,
      text: I18N.format(uom, 8)
    }];
    return labelGradeList;
  },
  _getOrderList: function() {
    let orderList = [
      {
        payload: 0,
        text: I18N.Setting.CustomizedLabeling.Ascending
      }, {
        payload: 1,
        text: I18N.Setting.CustomizedLabeling.Declining
      }];
    return orderList;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedLabel = this.props.selectedLabel,
      {LabellingType, Grade, Order, Comment} = selectedLabel.toJS();
    var kpiTypeProps = {
        ref: 'kpiType',
        isViewStatus: isView,
        title: I18N.Setting.CustomizedLabeling.KPIType,
        defaultValue: LabellingType,
        dataItems: me._getKpiTypeList(),
        didChanged: value => {
          me.props.mergeLabel({
            value,
            path: "LabellingType"
          });
        }
      },
      gradeProps = {
        ref: 'grade',
        isViewStatus: isView,
        title: I18N.Setting.Labeling.Label.LabelingGrade,
        defaultValue: Grade,
        dataItems: me._getLabelGradeList(),
        didChanged: value => {
          me.props.mergeLabel({
            value,
            path: "Grade"
          });
        }
      },
      orderProps = {
        ref: 'order',
        isViewStatus: isView,
        title: I18N.Setting.CustomizedLabeling.OrderMode,
        defaultValue: Order,
        dataItems: me._getOrderList(),
        didChanged: value => {
          me.props.mergeLabel({
            value,
            path: "Order"
          });
        }
      },
      commentProps = {
        ref: 'comment',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Comment,
        defaultValue: Comment,
        isRequired: false,
        multiLine: true,
        maxLen: null,
        didChanged: value => {
          me.props.mergeLabel({
            value,
            path: "Comment"
          });
        }
      };
    var comment = !Comment && isView ? null : (<div className="jazz-customer-label-detail-content-item">
        <ViewableTextField {...commentProps}/>
      </div>);
    return (
      <div className={"jazz-customer-label-detail-content"}>
          <ComAndUom ref='comAndUom' selectedItem={selectedLabel} mergeItem={this._mergeLabel} isViewStatus={isView} isFirst={true}/>
          <div className="jazz-customer-label-detail-content-item">
            <ViewableDropDownMenu {...kpiTypeProps}/>
          </div>
          {comment}
          <div className="jazz-customer-label-detail-content-item">
            <ViewableDropDownMenu {...gradeProps}/>
          </div>
          <div className="jazz-customer-label-detail-content-item">
            <ViewableDropDownMenu {...orderProps}/>
          </div>
      </div>
      );
  },
});

module.exports = LabelBasic;
