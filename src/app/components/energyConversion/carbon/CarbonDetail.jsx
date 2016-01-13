'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import CarbonAction from '../../../actions/energyConversion/CarbonAction.jsx';
import CarbonStore from '../../../stores/energyConversion/CarbonStore.jsx';
import Panel from '../../../controls/MainContentPanel.jsx';

import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import FormBottomBar from '../../../controls/FormBottomBar.jsx';
import DeletableItem from '../../../controls/DeletableItem.jsx';

var CarbonDetail = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.bool,
    carbon: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveCarbon: React.PropTypes.func,
    handleDeleteCarbon: React.PropTypes.func,
    toggleList: React.PropTypes.func,
  },
  _handleSaveRole: function() {},
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
          text: I18N.Setting.CarbonFactor.Source
        });
        carbons.forEach((item, index) => {
          Items.push({
            payload: index + 1,
            text: item.getIn(['SourceCommodity', 'Comment']) + ' ( ' + item.getIn(['SourceUom', 'Comment']) + ' )'
          });
          if (!!carbon.get('ConversionPair')) {
            if (carbon.get('ConversionPair') == item) {
              selectedIndex = index;
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
      title: I18N.Setting.CarbonFactor.Source,
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
        <div className="jazz-carbon-detail-header-name">
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
    var props = {
      isDelete: !isView && (factors.size > 1)
    };
    factors.forEach(factor => {
      var titleItems = [{
          payload: 0,
          text: I18N.Setting.CarbonFactor.EffectiveYear
        }],
        selectedId = 0;
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
          // CarbonAction.merge({
          //   value: {
          //     value: value,
          //     items: titleItems
          //   },
          //   path: "ConversionPair"
          // });
        }
      };
      items.push(
        <DeletableItem {...props}>
          <ViewableDropDownMenu {...yearProps} />
        </DeletableItem>
      )
    })
    return (
      <div className="pop-manage-detail-content">
        <div className="jazz-carbon-addItem">
          {I18N.Setting.CarbonFactor.Title}
          <div className={classnames({
        "jazz-carbon-addItem-addBtn": true,
        "inactive": isView
      })}>
          {I18N.Common.Button.Add}
        </div>
        </div>
        {items}
      </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = false,
      that = this;
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveRole}
      onDelete={function() {
        // that.setState({
        //   dialogStatus: true
        // });
      }}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        //  that.clearErrorTextBatchViewbaleTextFiled();
        that.props.setEditStatus()
      }}/>
      )
  },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <Panel onToggle={this.props.toggleList}>
        {header}
        {content}
        {footer}
      </Panel>
      )
  },
});

module.exports = CarbonDetail;
