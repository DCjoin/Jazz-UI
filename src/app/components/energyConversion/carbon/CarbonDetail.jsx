'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import Regex from '../../../constants/Regex.jsx';
import CarbonAction from '../../../actions/energyConversion/CarbonAction.jsx';
import CarbonStore from '../../../stores/energyConversion/CarbonStore.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import DeletableItem from '../../../controls/DeletableItem.jsx';
import NewDialog from '../../../controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var CarbonDetail = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    carbon: PropTypes.object,
    setEditStatus: PropTypes.func,
    handlerCancel: PropTypes.func,
    handleSaveCarbon: PropTypes.func,
    handleDeleteCarbon: PropTypes.func,
    toggleList: PropTypes.func,
  },
  getInitialState: function() {
    return {
      dialogStatus: false
    };
  },
  _handleSaveCarbon: function() {
    var {carbon} = this.props,
      factors = carbon.get('Factors'),
      carbonData = {
        Id: (!!carbon.get('Id')) ? carbon.get('Id') : null,
        CommodityId: carbon.getIn(['ConversionPair', 'SourceCommodity', 'Id']),
        FactorType: carbon.getIn(['ConversionPair', 'FactorType']),
        Version: (!!carbon.get('Version')) ? carbon.get('Version') : null,
        Factors: []
      };
    factors.forEach(factor => {
      let factorValue = parseFloat(factor.get('FactorValue'));
      carbonData.Factors.push(factor.set('FactorValue', factorValue).toJS());
    });
    this.props.handleSaveCarbon(carbonData);

  },
  _handelAddFactor: function() {
    CarbonAction.addFactor();
  },
  _handleDeleteFactor: function(index) {
    CarbonAction.deleteFactor(index);
  },
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    var carbon = that.props.carbon;
    let sourceCommodity = carbon.getIn(['ConversionPair', 'SourceCommodity', 'Comment']),
      sourceUom = carbon.getIn(['ConversionPair', 'SourceUom', 'Comment']),
      destinationCommodity = carbon.getIn(['ConversionPair', 'DestinationCommodity', 'Comment']),
      destinationUom = carbon.getIn(['ConversionPair', 'DestinationUom', 'Comment']),
      label = sourceCommodity + ' ( ' + sourceUom + ' ) ' + '- ' + destinationCommodity + ' ( ' + destinationUom + ' )';

    return (
      <NewDialog open={this.state.dialogStatus} title={I18N.Setting.CarbonFactor.DeleteTitle} modal={true} actions={[
        <FlatButton
        label={I18N.Template.Delete.Delete}
        inDialog={true}
        primary={true}
        onClick={() => {
          that.props.handleDeleteCarbon(carbon);
          closeDialog();
        }} />,
        <FlatButton
        label={I18N.Template.Delete.Cancel}
        onClick={closeDialog} />
      ]}>
      {I18N.format(I18N.Setting.CarbonFactor.DeleteContent, label)}
    </NewDialog>
      );
  },
  _renderHeader: function() {
    var that = this,
      {carbon} = this.props,
      selectedIndex = 0,
      conversionText = '',
      isADD = that.props.formStatus == formStatus.ADD;
    var getItems = function() {
      var Items = [];
      if (isADD) {
        var carbons = CarbonStore.getSelectableCarbons();
        Items.push({
          payload: 0,
          text: I18N.Setting.CarbonFactor.Source,
          disabled: true
        });
        carbons.forEach((item, index) => {
          Items.push({
            payload: index + 1,
            text: item.getIn(['SourceCommodity', 'Comment']) + ' ( ' + item.getIn(['SourceUom', 'Comment']) + ' )'
          });
          if (!!carbon.get('ConversionPair')) {
            if (carbon.get('ConversionPair') == item) {
              selectedIndex = index + 1;
              conversionText = ' - ' + item.getIn(['DestinationCommodity', 'Comment']) + ' ( ' + item.getIn(['DestinationUom', 'Comment']) + ' )';
            }
          }
        });
      } else {
        var carbons = CarbonStore.getCarbons();
        carbons.forEach((item, index) => {
          Items.push({
            payload: index,
            text: item.getIn(['ConversionPair', 'SourceCommodity', 'Comment']) + ' ( ' + item.getIn(['ConversionPair', 'SourceUom', 'Comment']) + ' )'
          });
          if (carbon.get('Id') == item.get('Id')) {
            selectedIndex = index;
            conversionText = ' - ' + item.getIn(['ConversionPair', 'DestinationCommodity', 'Comment']) + ' ( ' + item.getIn(['ConversionPair', 'DestinationUom', 'Comment']) + ' )';
          }
        });
      }
      return Items;
    };
    var titleItems = getItems();
    var sourceProps = {
      isViewStatus: !isADD,
      title: "",
      selectedIndex: selectedIndex,
      textField: "text",
      dataItems: titleItems,
      didChanged: value => {
        CarbonAction.merge({
          value: {
            value: value,
            items: titleItems
          },
          path: "ConversionPair"
        });
      }
    };
    return (
      <div className="pop-manage-detail-header">
        <div className={classnames("jazz-carbon-detail-header-name", "jazz-carbon-header")}>
          <ViewableDropDownMenu {...sourceProps} />
          <div className={classnames({
        "isAdd": isADD
      })}>
              {conversionText}
          </div>

        </div>
      </div>
      )
  },
  _renderContent: function() {
    var that = this,
      {carbon} = this.props,
      isView = (that.props.formStatus == formStatus.VIEW),
      items = [];
    var factors = carbon.get('Factors');
    var errors = carbon.get('Errors');
    factors.forEach((factor, index) => {
      var titleItems = [{
          payload: 0,
          text: I18N.Setting.CarbonFactor.EffectiveYear,
          disabled: true
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
          title: I18N.Setting.CarbonFactor.EffectiveYear,
          selectedIndex: selectedId,
          textField: "text",
          dataItems: titleItems,
          didChanged: value => {
            CarbonAction.merge({
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
          title: I18N.Setting.CarbonFactor.Title,
          defaultValue: factor.get("FactorValue"),
          regex: Regex.FactorRule,
          errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
          maxLen: 200,
          isRequired: true,
          didChanged: value => {
            CarbonAction.merge({
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
        <div className='jazz-carbon-factorItem' key={factors.size  + '_' + index}>
          <DeletableItem {...deleteProps}>
            <ViewableDropDownMenu {...yearProps} />
            <div className='jazz-carbon-addItem-errorText'>{error}</div>
            <div style={{
          marginTop: '25px'
        }}><ViewableTextField  {...conversionProps} /></div>
          </DeletableItem>
        </div>

      )
    })
    return (
      <div className="pop-manage-detail-content">
        <div className="jazz-carbon-addItem">
          <div>{I18N.Setting.CarbonFactor.Title}</div>
          <div className={classnames({
        "jazz-carbon-addItem-addBtn": true,
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
      {carbon} = this.props,
      that = this;
    var error = (!!carbon.get('Errors')) ? carbon.get('Errors').size != 0 : false;
    if (!carbon.get('ConversionPair') || error) {
      disabledSaveButton = true
    }
    carbon.get('Factors').forEach(factor => {
      if (factor.get("EffectiveYear") == 0 || factor.get("EffectiveYear") == I18N.Setting.CarbonFactor.EffectiveYear) {
        disabledSaveButton = true
      }
      if (!Regex.FactorRule.test(factor.get("FactorValue"))) {
        disabledSaveButton = true
      }
    })
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveCarbon}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        that.props.setEditStatus()
      }}/>
      )
  },
  render: function() {
    var that = this;

    if (this.props.carbon.size != 0) {
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
            {that._renderDialog()}
          </Panel>
        </div>
        )
    } else {
      return (
        <div className={classnames({
          "jazz-framework-right-expand": that.props.closedList,
          "jazz-framework-right-fold": !that.props.closedList
        })}>
        </div>
        )
    }

  },
});

module.exports = CarbonDetail;
