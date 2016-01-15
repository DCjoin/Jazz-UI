'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import { Toggle } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import TariffAction from '../../../actions/energyConversion/TariffAction.jsx';
import TariffStore from '../../../stores/energyConversion/TariffStore.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import DeletableItem from '../../../controls/DeletableItem.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import FromEndTime from '../../../controls/FromEndTime.jsx';
import FromEndDate from '../../../controls/FromEndDate.jsx';

var TariffDetail = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  propTypes: {
    formStatus: React.PropTypes.bool,
    infoTab: React.PropTypes.bool,
    tariff: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveTariff: React.PropTypes.func,
    handleDeleteTariff: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dialogStatus: false
    };
  },
  _handleSaveTariff: function() {
    var {tariff} = this.props,
      factors = tariff.get('Factors'),
      tariffData = {
        Id: (!!tariff.get('Id')) ? tariff.get('Id') : null,
        CommodityId: tariff.getIn(['ConversionPair', 'SourceCommodity', 'Id']),
        FactorType: tariff.getIn(['ConversionPair', 'FactorType']),
        Version: (!!tariff.get('Version')) ? tariff.get('Version') : null,
        Factors: []
      };
    factors.forEach(factor => {
      let factorValue = parseFloat(factor.get('FactorValue'));
      tariffData.Factors.push(factor.set('FactorValue', factorValue).toJS());
    });
    this.props.handleSaveTariff(tariffData);

  },
  _handelAddPeakTimeRange: function() {},
  _handelAddValleyTimeRange: function() {},
  _handelAddPulsePeakDateTimeRange: function() {},
  _handelDeletePeakTimeRange: function(index) {},
  _handelDeleteValleyTimeRange: function(index) {},
  _handelDeletePulsePeakDateTimeRange: function(index) {},
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    if (!this.state.dialogStatus) {
      return null;
    } else {
      var tariff = that.props.tariff;
      let sourceCommodity = tariff.getIn(['ConversionPair', 'SourceCommodity', 'Comment']),
        sourceUom = tariff.getIn(['ConversionPair', 'SourceUom', 'Comment']),
        destinationCommodity = tariff.getIn(['ConversionPair', 'DestinationCommodity', 'Comment']),
        destinationUom = tariff.getIn(['ConversionPair', 'DestinationUom', 'Comment']),
        label = sourceCommodity + ' ( ' + sourceUom + ' ) ' + '- ' + destinationCommodity + ' ( ' + destinationUom + ' )';

      return (

        <Dialog openImmediately={this.state.dialogStatus} title={"删除转换因子 “" + label + "”"} modal={true} actions={[
          <FlatButton
          label="删除"
          primary={true}
          onClick={() => {
            that.props.handleDeleteTariff(tariff);
            closeDialog();
          }} />,
          <FlatButton
          label="放弃"
          onClick={closeDialog} />
        ]}>
        {"转换因子 “" + label + "” 将被删除"}
      </Dialog>
        );
    }
  },
  _renderHeader: function() {
    var that = this,
      {tariff} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      tariffNameProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.Name,
        defaultValue: tariff.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          // TariffAction.merge({
          //   value,
          //   path: "Name"
          // })
        }
      };
    return (
      <div className="pop-manage-detail-header">
      <div className="pop-manage-detail-header-name">
        <ViewableTextField  {...tariffNameProps} />
          {
      isAdd ? null :
        <div className="pop-user-detail-tabs">
      <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTab
        })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
      <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !that.props.infoTab
        })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.PulsePeak}</span>
    </div>
      }
      </div>
    </div>
      )

  },
  _renderPeakTimeRange: function(peakPriceItem) {
    var Items = [],
      isView = this.props.formStatus === formStatus.VIEW,
      that = this;
    var onTimeChange = function(index, times) {};
    if (!!peakPriceItem) {
      peakPriceItem.get('TimeRange').forEach((time, index) => {
        Items.push(
          <div className='jazz-item-in-margin'>
            <FromEndTime index={index}
          onTimeChange={onTimeChange}
          isViewStatus={isView}
          hasDeleteButton={peakPriceItem.get('TimeRange').size > 1}
          startTime={time.get('m_Item1')}
          endTime={time.get('m_Item2')}
          onDeleteTimeData={that._handelDeletePeakTimeRange.bind(index)}/>
          </div>
        )
      })
    } else {
      Items.push(
        <div className='jazz-item-in-margin'>
          <FromEndTime onTimeChange={onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}/>
        </div>

      )
    }
    return (
      <div>
        {Items}
      </div>
      )

  },
  _renderValleyTimeRange: function(valleyPriceItem) {
    var Items = [],
      isView = this.props.formStatus === formStatus.VIEW,
      that = this;
    var onTimeChange = function(index, times) {};
    if (!!valleyPriceItem) {
      valleyPriceItem.get('TimeRange').forEach((time, index) => {
        Items.push(
          <div className='jazz-item-in-margin'>
            <FromEndTime index={index}
          onTimeChange={onTimeChange}
          isViewStatus={isView}
          hasDeleteButton={valleyPriceItem.get('TimeRange').size > 1}
          startTime={time.get('m_Item1')}
          endTime={time.get('m_Item2')}
          onDeleteTimeData={that._handelDeleteValleyTimeRange.bind(index)}/>
          </div>
        )
      })
    } else {
      Items.push(
        <div className='jazz-item-in-margin'>
          <FromEndTime onTimeChange={onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}/>
        </div>

      )
    }
    return (
      <div>
        {Items}
      </div>
      )

  },
  _renderInfoTab: function() {
    var touTariff = this.props.tariff.get('TouTariffItems'),
      isView = this.props.formStatus === formStatus.VIEW,
      plainPriceItem, peakPriceItem, valleyPriceItem,
      plainPrice, peakPrice, valleyPrice;
    if (!!touTariff) {
      plainPriceItem = touTariff.find(item => item.get("ItemType") == 2);
      peakPriceItem = touTariff.find(item => item.get("ItemType") == 1);
      valleyPriceItem = touTariff.find(item => item.get("ItemType") == 3);
      plainPrice = (!!plainPriceItem) ? plainPriceItem.get('Price') : null;
      peakPrice = peakPriceItem.get('Price');
      valleyPrice = valleyPriceItem.get('Price');
    }

    //props
    var plainPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PlainPrice,
        defaultValue: plainPrice,
        regex: Regex.FactorRule,
        errorMessage: "该输入项只能是正数",
        maxLen: 200,
        didChanged: value => {
          // CarbonAction.merge({
          //   value: {
          //     value: value,
          //     factorIndex: index
          //   },
          //   path: "FactorValue"
          // });
        }
      },
      peakPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PeakPrice,
        defaultValue: peakPrice,
        regex: Regex.FactorRule,
        errorMessage: "该输入项只能是正数",
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          // CarbonAction.merge({
          //   value: {
          //     value: value,
          //     factorIndex: index
          //   },
          //   path: "FactorValue"
          // });
        }
      },
      valleyPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.ValleyPrice,
        defaultValue: valleyPrice,
        regex: Regex.FactorRule,
        errorMessage: "该输入项只能是正数",
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          // CarbonAction.merge({
          //   value: {
          //     value: value,
          //     factorIndex: index
          //   },
          //   path: "FactorValue"
          // });
        }
      };
    var peakBtn = (<div className="jazz-carbon-addItem">
          <div>{I18N.Setting.TOUTariff.PeakTimeRange}</div>
          <div className={classnames({
        "jazz-carbon-addItem-addBtn": true,
        "inactive": isView
      })} onClick={this._handelAddPeakTimeRange}>
          {I18N.Common.Button.Add}
        </div>
      </div>),
      valleyBtn = (<div className="jazz-carbon-addItem">
            <div>{I18N.Setting.TOUTariff.ValleyTimeRange}</div>
            <div className={classnames({
        "jazz-carbon-addItem-addBtn": true,
        "inactive": isView
      })} onClick={this._handelAddValleyTimeRange}>
            {I18N.Common.Button.Add}
          </div>
        </div>);
    return (
      <div>
        <div className='jazz-tariff-infoTab-notice'>
          {I18N.Setting.TOUTariff.BasicPropertyTip}
        </div>
        {
      (!isView || !!plainPrice) ? <div className='jazz-item-margin'>
                    <ViewableTextField  {...plainPriceProps} />
                  </div> : null
      }
        <div className='jazz-item-margin'>
          <ViewableTextField  {...peakPriceProps} />
        </div>
        <div className='jazz-item-margin'>
          {peakBtn}
        </div>
        {this._renderPeakTimeRange(peakPriceItem)}
        <div className='jazz-item-margin'>
          <ViewableTextField  {...valleyPriceProps} />
        </div>
        <div className='jazz-item-margin'>
          {valleyBtn}
        </div>
        {this._renderValleyTimeRange(valleyPriceItem)}
      </div>
      )

  },
  _renderPeakTab: function() {
    var PeakTariff = this.props.tariff.get('PeakTariff'),
      isView = this.props.formStatus === formStatus.VIEW,
      that = this;

    var toggleBtn = <Toggle
    label={I18N.Setting.TOUTariff.PulsePeakPriceSetting}
    labelStyle={{
      fontSize: '14px',
      color: '#464949',
      width: 'auto'
    }}
    disabled={isView}
    defaultToggled={this.props.tariff.get('onOff')}
    onToggle={(event, toggled) => {

    }}/>;

    var onDateChange = function(startMonth, startDay, endMonth, endDay) {},
      onTimeChange = function(index, times) {};

    var peakTariffItems;
    if (this.props.tariff.get('onOff')) {
      var props = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PulsePeakPrice,
        defaultValue: PeakTariff.get('Price'),
        regex: Regex.FactorRule,
        errorMessage: "该输入项只能是正数",
        maxLen: 200,
        didChanged: value => {
          // CarbonAction.merge({
          //   value: {
          //     value: value,
          //     factorIndex: index
          //   },
          //   path: "FactorValue"
          // });
        }
      };
      var peakItems = [],
        fontStyle = {
          fontSize: '14px',
          color: '#abafae'
        };
      PeakTariff.get('TimeRanges').forEach((time, index) => {
        var deleteProps = {
          isDelete: !isView && (PeakTariff.get('TimeRanges').size > 1),
          onDelete: () => {
            that._handelDeletePulsePeakDateTimeRange(index);
          }
        };
        peakItems.push(<div className='jazz-item-in-margin'>
        <DeletableItem {...deleteProps}>
          <div className='jazz-item-in-margin' style={fontStyle}>
            {I18N.Setting.TOUTariff.DateTimeRange}
          </div>
          <div className='jazz-item-in-margin'>
            <FromEndDate index={index}
        isViewStatus={isView}
        startMonth={time.get('StartMonth')}
        startDay={time.get('StartDay')}
        endMonth={time.get('EndMonth')}
        endDay={time.get('EndDay')}
        onDateChange={onDateChange}/>
          </div>
          <div className='jazz-item-in-margin' style={fontStyle}>
            {I18N.Setting.TOUTariff.PeakValueTimeRange}
          </div>
          <div className='jazz-item-in-margin'>
            <FromEndTime index={index}
        onTimeChange={onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}
        startTime={time.get("StartTime")}
        endTime={time.get('EndTime')}/>
          </div>
        </DeletableItem>
      </div>)
      })

      peakTariffItems = (
        <div>
          <div className='jazz-item-margin'>
            <ViewableTextField  {...props} />
          </div>
          <div className='jazz-item-margin'>
            <div className="jazz-carbon-addItem">
                  <div>{I18N.Setting.TOUTariff.PulsePeakDateTime}</div>
                  <div className={classnames({
          "jazz-carbon-addItem-addBtn": true,
          "inactive": isView
        })} onClick={this._handelAddPulsePeakDateTimeRange}>
                  {I18N.Common.Button.Add}
                </div>
              </div>
          </div>
          {peakItems}
        </div>
      )
    }
    return (
      <div>
      {toggleBtn}
      {peakTariffItems}
    </div>
      )

  },
  _renderContent: function() {
    return (
      <div className="pop-manage-detail-content">
        {this.props.infoTab ? this._renderInfoTab() : this._renderPeakTab()}
      </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = false,
      {tariff} = this.props,
      that = this;
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveTariff}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      allowDelete={that.props.infoTab}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus()
      }}/>

      )
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
      <Panel onToggle={this.props.toggleList}>
        {header}
        {content}
        {footer}
      </Panel>
    </div>
      )
  },
});

module.exports = TariffDetail;
