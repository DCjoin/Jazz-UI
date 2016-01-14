'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
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
  _handelAddFactor: function() {
    TariffAction.addFactor();
  },
  _handleDeleteFactor: function(index) {
    TariffAction.deleteFactor(index);
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
      </div>
    </div>
      )

  },
  _renderContent: function() {
    var that = this,
      {tariff} = this.props,
      isView = (that.props.formStatus == formStatus.VIEW),
      items = [];
    var factors = tariff.get('Factors');
    var errors = tariff.get('Errors');
    factors.forEach((factor, index) => {
      var titleItems = [{
          payload: 0,
          text: I18N.Setting.TariffFactor.EffectiveYear
        }],
        selectedId = 0,
        error = (!!errors) ? errors.getIn([index]) : null;
      let date = new Date();
      let yearMenuItems = [];
      let yearRange = 10;
      for (var thisYear = date.getFullYear(), i = thisYear - yearRange; i <= thisYear; i++) {
        titleItems.push({
          payload: 11 - (thisYear - i),
          text: i
        });
        if (factor.get('EffectiveYear') == i) {
          selectedId = 11 - (thisYear - i);
        }
      }
      var yearProps = {
          isViewStatus: isView,
          title: I18N.Setting.TariffFactor.EffectiveYear,
          selectedIndex: selectedId,
          textField: "text",
          dataItems: titleItems,
          didChanged: value => {
            TariffAction.merge({
              value: {
                value: value,
                titleItems: titleItems,
                factorIndex: index
              },
              path: "EffectiveYear"
            });
          }
        },
        conversionProps = {
          isViewStatus: isView,
          title: I18N.Setting.TariffFactor.Title,
          defaultValue: factor.get("FactorValue"),
          regex: Regex.FactorRule,
          errorMessage: "该输入项只能是正数",
          maxLen: 200,
          isRequired: true,
          didChanged: value => {
            TariffAction.merge({
              value: {
                value: value,
                factorIndex: index
              },
              path: "FactorValue"
            });
          }
        },
        deleteProps = {
          isDelete: !isView && (factors.size > 1),
          onDelete: () => {
            that._handleDeleteFactor(index);
          }

        };

      items.push(
        <div className='jazz-tariff-factorItem'>
          <DeletableItem {...deleteProps}>
            <ViewableDropDownMenu {...yearProps} />
            <div className='jazz-tariff-addItem-errorText'>{error}</div>
            <div style={{
          marginTop: '25px'
        }}><ViewableTextField  {...conversionProps} /></div>
          </DeletableItem>
        </div>

      )
    })
    return (
      <div className="pop-manage-detail-content">
        <div className="jazz-tariff-addItem">
          <div>{I18N.Setting.TariffFactor.Title}</div>
          <div className={classnames({
        "jazz-tariff-addItem-addBtn": true,
        "inactive": isView
      })} onClick={this._handelAddFactor}>
          {I18N.Common.Button.Add}
        </div>
        </div>
        {items}
      </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = false,
      {tariff} = this.props,
      that = this;
    return (
      <div style={{
        flex: '1'
      }}>
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
      </div>

      )
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      // content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
      <Panel onToggle={this.props.toggleList}>
        {header}
        {footer}
      </Panel>
    </div>
      )
  },
});

module.exports = TariffDetail;
