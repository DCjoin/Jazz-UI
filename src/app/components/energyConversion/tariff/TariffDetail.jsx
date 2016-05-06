'use strict';

import React from "react";
import classnames from "classnames";
import { List } from 'immutable';
import { Toggle } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import TariffAction from '../../../actions/energyConversion/TariffAction.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import DeletableItem from '../../../controls/DeletableItem.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import FromEndTime from '../../../controls/FromEndTime.jsx';
import FromEndDate from '../../../controls/FromEndDate.jsx';

var TariffDetail = React.createClass({

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
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  getInitialState: function() {
    return {
      dialogStatus: false
    };
  },
  _handleSaveTariff: function() {
    var {tariff} = this.props,
      touTariff = tariff.get('TouTariffItems'),
      tariffData;
    if (this.props.infoTab) {
      let plainPriceItem = touTariff.find(item => item.get("ItemType") == 2),
        peakPriceItem = touTariff.find(item => item.get("ItemType") == 1),
        valleyPriceItem = touTariff.find(item => item.get("ItemType") == 3);
      tariffData = {
        Id: tariff.get('Id'),
        Name: tariff.get('Name'),
        PlainPrice: (!!plainPriceItem) ? plainPriceItem.get('Price') : null,
        PeakPrice: peakPriceItem.get('Price'),
        ValleyPrice: valleyPriceItem.get('Price'),
        Version: tariff.get('Version')
      };
      let items = new List();
      plainPriceItem = (!!plainPriceItem) ? plainPriceItem.set('Price', parseFloat(plainPriceItem.get('Price'))) : null;
      peakPriceItem = peakPriceItem.set('Price', parseFloat(peakPriceItem.get('Price')));
      valleyPriceItem = valleyPriceItem.set('Price', parseFloat(valleyPriceItem.get('Price')));
      if (!!plainPriceItem) {
        items = items.push(plainPriceItem);
        items = items.push(peakPriceItem);
        items = items.push(valleyPriceItem);
      } else {
        items = items.push(peakPriceItem);
        items = items.push(valleyPriceItem);
      }
      tariffData.TouTariffItems = items.toJS();
    } else {
      if (!!tariff.get('PeakTariff')) {
        tariffData = tariff.get('PeakTariff').toJS();
        tariffData.TouTariffId = tariff.get('TouTariffId') ? tariff.get('TouTariffId') : tariff.get('Id');
        tariffData.onOff = tariff.get('onOff');
      } else {
        tariffData = {
          TouTariffId: tariff.get('Id'),
          onOff: tariff.get('onOff'),
          Version: tariff.get('Version')
        };
      }

    }
    this.props.handleSaveTariff(tariffData);
  },
  _handelAddPeakTimeRange: function() {
    TariffAction.addPeakTimeRange();
  },
  _handelAddValleyTimeRange: function() {
    TariffAction.addValleyTimeRange();
  },
  _handelAddPulsePeakDateTimeRange: function() {
    TariffAction.addPulsePeakDateTimeRange();
  },
  _handelDeletePeakTimeRange: function(index) {
    TariffAction.deletePeakTimeRange(index);
  },
  _handelDeleteValleyTimeRange: function(index) {
    TariffAction.deleteValleyTimeRange(index);
  },
  _handelDeletePulsePeakDateTimeRange: function(index) {
    TariffAction.deletePulsePeakDateTimeRange(index);
  },

  onTimeChange: function(index, times) {
    TariffAction.merge({
      value: {
        value: times,
        index: index,
        path: 'Time'
      },
      path: "PeakTariff"
    });
  },
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

      return (

        <Dialog openImmediately={this.state.dialogStatus} title={I18N.Setting.TOUTariff.DeleteTitle} modal={true} actions={[
          <FlatButton
          label={I18N.Template.Delete.Delete}
          primary={true}
          onClick={() => {
            that.props.handleDeleteTariff(tariff);
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Template.Delete.Cancel}
          onClick={closeDialog} />
        ]}>
        {I18N.format(I18N.Setting.TOUTariff.DeleteContent, tariff.get('Name'))}
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
        isViewStatus: isView || !this.props.infoTab,
        title: I18N.Setting.TOUTariff.Name,
        defaultValue: tariff.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          TariffAction.merge({
            value,
            path: "Name"
          })
        }
      };
    return (
      <div className="pop-manage-detail-header">
      <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
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
      that = this,
      errors = this.props.tariff.getIn(['Errors', 'Peak']);
    var onTimeChange = function(index, times) {
      TariffAction.merge({
        value: {
          value: times,
          ItemType: 1,
          path: 'TimeRange',
          index: index
        },
        path: "TouTariffItems"
      });
    };
    if (!!peakPriceItem) {
      peakPriceItem.get('TimeRange').forEach((time, index) => {
        var error = (!!errors) ? errors.getIn([index]) : null;
        Items.push(
          <div style={{
            marginTop: '5px'
          }}>
            <FromEndTime index={index}
          onTimeChange={onTimeChange}
          isViewStatus={isView}
          hasDeleteButton={peakPriceItem.get('TimeRange').size > 1}
          startTime={time.get('Item1')}
          endTime={time.get('Item2')}
          onDeleteTimeData={that._handelDeletePeakTimeRange.bind(index)}
          lang={window.currentLanguage}/>
        <div className='jazz-carbon-addItem-errorText'>{error}</div>
          </div>
        )
      })
    } else {
      Items.push(
        <div style={{
          marginTop: '5px'
        }}>
          <FromEndTime onTimeChange={onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}
        lang={window.currentLanguage}/>
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
      that = this,
      errors = this.props.tariff.getIn(['Errors', 'Valley']);
    var onTimeChange = function(index, times) {
      TariffAction.merge({
        value: {
          value: times,
          ItemType: 3,
          path: 'TimeRange',
          index: index
        },
        path: "TouTariffItems"
      });
    };
    if (!!valleyPriceItem) {
      valleyPriceItem.get('TimeRange').forEach((time, index) => {
        var error = (!!errors) ? errors.getIn([index]) : null;
        Items.push(
          <div style={{
            marginTop: '5px'
          }}>
            <FromEndTime index={index}
          onTimeChange={onTimeChange}
          isViewStatus={isView}
          hasDeleteButton={valleyPriceItem.get('TimeRange').size > 1}
          startTime={time.get('Item1')}
          endTime={time.get('Item2')}
          onDeleteTimeData={that._handelDeleteValleyTimeRange.bind(index)}
          lang={window.currentLanguage}/>
        <div className='jazz-carbon-addItem-errorText'>{error}</div>
          </div>
        )
      })
    } else {
      Items.push(
        <div style={{
          marginTop: '5px'
        }}>
          <FromEndTime onTimeChange={onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}
        lang={window.currentLanguage}/>
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
      peakPrice = (!!peakPriceItem) ? peakPriceItem.get('Price') : null;
      valleyPrice = (!!valleyPriceItem) ? valleyPriceItem.get('Price') : null;
    }

    //props
    var plainPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PlainPrice,
        defaultValue: plainPrice,
        regex: Regex.FactorRule,
        errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
        maxLen: 200,
        didChanged: value => {
          TariffAction.merge({
            value: {
              value: value,
              ItemType: 2
            },
            path: "TouTariffItems"
          });
        }
      },
      peakPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PeakPrice,
        defaultValue: peakPrice,
        regex: Regex.FactorRule,
        errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          TariffAction.merge({
            value: {
              value: value,
              ItemType: 1,
              path: 'Price'
            },
            path: "TouTariffItems"
          });
        }
      },
      valleyPriceProps = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.ValleyPrice,
        defaultValue: valleyPrice,
        regex: Regex.FactorRule,
        errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          TariffAction.merge({
            value: {
              value: value,
              ItemType: 3,
              path: 'Price'
            },
            path: "TouTariffItems"
          });
        }
      };
    var peakBtn = (<div className={classnames({
        "jazz-carbon-addItem": true,
        "isView": isView
      })}>
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
    var uomStyle = isView ? {
      marginTop: '25px',
      marginLeft: '-250px'
    } : {
      marginTop: '40px'
    };
    return (
      <div>
        <div className='jazz-tariff-infoTab-notice'>
          {I18N.Setting.TOUTariff.BasicPropertyTip}
        </div>
        {
      (!isView || !!plainPrice) ? <div className='jazz-item-margin' style={{
        display: 'flex'
      }}>
                    <ViewableTextField  {...plainPriceProps} />
                    <div className='jazz-tariff-electrovalenceUom' style={uomStyle}>{I18N.Setting.Labeling.ElectrovalenceUom}</div>
                  </div> : null
      }
        <div className='jazz-item-margin' style={{
        display: 'flex'
      }}>
          <ViewableTextField  {...peakPriceProps} />
          <div className='jazz-tariff-electrovalenceUom' style={uomStyle}>{I18N.Setting.Labeling.ElectrovalenceUom}</div>
        </div>
        <div className='jazz-item-margin'>
          {peakBtn}
        </div>
        {this._renderPeakTimeRange(peakPriceItem)}
        <div className='jazz-item-margin' style={{
        marginTop: '35px',
        display: 'flex'
      }}>
          <ViewableTextField  {...valleyPriceProps} />
          <div className='jazz-tariff-electrovalenceUom' style={uomStyle}>{I18N.Setting.Labeling.ElectrovalenceUom}</div>
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
      that = this,
      errors = this.props.tariff.get('Errors');

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
      TariffAction.merge({
        value: {
          value: toggled,
          path: 'onOff'
        },
        path: "PeakTariff"
      });
    }}/>;



    var peakTariffItems;
    if (this.props.tariff.get('onOff')) {
      var props = {
        isViewStatus: isView,
        title: I18N.Setting.TOUTariff.PulsePeakPrice,
        defaultValue: PeakTariff.get('Price'),
        regex: Regex.FactorRule,
        errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
        maxLen: 200,
        didChanged: value => {
          TariffAction.merge({
            value: {
              value: value,
              path: 'Price'
            },
            path: "PeakTariff"
          });
        }
      };
      var peakItems = [],
        fontStyle = {
          fontSize: '14px',
          color: '#abafae'
        };
      var uomStyle = isView ? {
        marginTop: '25px',
        marginLeft: '-250px'
      } : {
        marginTop: '40px'
      };
      PeakTariff.get('TimeRanges').forEach((time, index) => {
        var dateError = (!!errors) ? errors.getIn(['Date', index]) : null,
          timeError = (!!errors) ? errors.getIn(['Time', index]) : null;
        var deleteProps = {
          isDelete: !isView && (PeakTariff.get('TimeRanges').size > 1),
          onDelete: () => {
            that._handelDeletePulsePeakDateTimeRange(index);
          }
        };
        peakItems.push(<div className='jazz-item-margin'>
        <DeletableItem {...deleteProps}>
          <div className='jazz-item-in-margin' style={fontStyle}>
            {I18N.Setting.TOUTariff.DateTimeRange}
          </div>
          <div className='jazz-item-in-margin' style={{
          marginTop: '5px'
        }}>
            <FromEndDate index={index}
        isViewStatus={isView}
        startMonth={time.get('StartMonth')}
        startDay={time.get('StartDay')}
        endMonth={time.get('EndMonth')}
        endDay={time.get('EndDay')}
        onDateChange={(startMonth, startDay, endMonth, endDay) => {
          that.onDateChange(index, startMonth, startDay, endMonth, endDay);
        }}
        lang={window.currentLanguage}/>
          <div className='jazz-carbon-addItem-errorText'>{dateError}</div>
          </div>
          <div className='jazz-item-margin' style={fontStyle}>
            {I18N.Setting.TOUTariff.PeakValueTimeRange}
          </div>
          <div style={{
          marginTop: '5px'
        }}>
            <FromEndTime index={index}
        onTimeChange={that.onTimeChange}
        isViewStatus={isView}
        hasDeleteButton={false}
        startTime={time.get("StartTime")}
        endTime={time.get('EndTime')}
        lang={window.currentLanguage}/>
        <div className='jazz-carbon-addItem-errorText'>{timeError}</div>
          </div>
        </DeletableItem>
      </div>)
      })

      peakTariffItems = (
        <div>
          <div className='jazz-item-margin' style={{
          display: 'flex'
        }}>
            <ViewableTextField  {...props} />
            <div className='jazz-tariff-electrovalenceUom' style={uomStyle}>{I18N.Setting.Labeling.ElectrovalenceUom}</div>
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
    var error = (!!tariff.get('Errors')) ? true : false;
    if (this.props.infoTab) {
      if (!tariff.get('Name') || error || !tariff.get('TouTariffItems')) {
        disabledSaveButton = true
      } else {
        var peakPriceItem = tariff.get('TouTariffItems').find(item => item.get("ItemType") == 1),
          valleyPriceItem = tariff.get('TouTariffItems').find(item => item.get("ItemType") == 3);
        if (!peakPriceItem || !valleyPriceItem) {
          disabledSaveButton = true
        } else {
          tariff.get('TouTariffItems').forEach(item => {
            if (item.get("ItemType") == 2) {
              if (!!item.get('Price')) {
                if (!Regex.FactorRule.test(item.get('Price'))) {
                  disabledSaveButton = true
                }
              }
            } else {
              if (!item.get('Price') || !Regex.FactorRule.test(item.get('Price')) || !item.get('TimeRange')) {
                disabledSaveButton = true
              } else {
                item.get('TimeRange').forEach(time => {
                  if (time.get('Item1') < 0 || time.get('Item2') < 0) {
                    disabledSaveButton = true
                  }
                })

              }
            }

          })
        }
      }

    } else {
      if (tariff.get('onOff')) {
        if (!tariff.getIn(['PeakTariff', 'Price']) || !Regex.FactorRule.test(tariff.getIn(['PeakTariff', 'Price']))) {
          disabledSaveButton = true
        }
        tariff.getIn(['PeakTariff', 'TimeRanges']).forEach(time => {
          let {StartDay, StartMonth, StartTime, EndTime, EndMonth, EndDay} = time.toJS();
          if (StartDay < 0 || StartMonth < 0 || StartTime < 0 || EndTime < 0 || EndMonth < 0 || EndDay < 0) {
            disabledSaveButton = true
          }
        })
      }
    }
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
  onDateChange: function(index, startMonth, startDay, endMonth, endDay) {
    TariffAction.merge({
      value: {
        value: [startMonth, startDay, endMonth, endDay],
        index: index,
        path: 'Date'
      },
      path: "PeakTariff"
    });
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
      {that._renderDialog()}
    </div>
      )
  },
});

module.exports = TariffDetail;
