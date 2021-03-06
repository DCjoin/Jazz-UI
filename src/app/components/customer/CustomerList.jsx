'use strict';

import React from "react";
import PropTypes from 'prop-types';
import classnames from "classnames";
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';
import CustomerAction from '../../actions/CustomerAction.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import { DataConverter } from '../../util/Util.jsx';
import moment from 'moment';
var createReactClass = require('create-react-class');
var CustomerList = createReactClass({
  propTypes: {
    formStatus: PropTypes.bool,
    onCustomerClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    customers: PropTypes.object,
    selectedId: PropTypes.number,
    changeSortBy: PropTypes.func,
    sortBy: PropTypes.string,
  },
  // getInitialState: function() {
  //   return {
  //     sortBy: 'customername@asc'
  //   };
  // },
  _renderCustomerItems: function() {
    var items = [],
      that = this;
    var onItemClick = function(index) {
      that.props.onCustomerClick(index);
    };
    that.props.customers.forEach(customer => {
      var j2d = DataConverter.JsonToDateTime,
        startTime = moment(j2d(customer.get('StartTime'), false)),
        date = startTime.format("YYYY" + I18N.Map.Date.Year + 'M' + I18N.Map.Date.Month + 'D' + I18N.Map.Date.Day);
      let props = {
        index: customer.get('Id'),
        label: customer.get('Name'),
        text: I18N.Platform.ServiceProvider.OperationTime + ':' + date,
        selectedIndex: that.props.selectedId,
        onItemClick: onItemClick
      };
      items.push(<Item {...props}/>);
    });
    return items;
  },
  _changeSortBy: function(type) {
    // this.setState({
    //   sortBy: type
    // });
    CustomerAction.GetCustomers(type == 'customername@asc' ? 'Name' : 'StartTime');
    this.props.changeSortBy(type);
  },
  render: function() {
    var that = this;
    var props = {
      addBtnLabel: I18N.Common.Glossary.Customer,
      onAddBtnClick: that.props.onAddBtnClick,
      isViewStatus: that.props.formStatus === formStatus.VIEW,
      isLoading: false,
      contentItems: that._renderCustomerItems(),
      sortItems: [
        {
          type: 'customername@asc',
          label: I18N.Platform.ServiceProvider.CustomerName
        },
        {
          type: 'starttime@desc',
          label: I18N.Platform.ServiceProvider.StartTime
        },
      ],
      changeSortBy: that._changeSortBy,
      sortBy: that.props.sortBy
    };
    return (
      <SelectablePanel {...props}/>
      )
  },
});
module.exports = CustomerList;
