'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import NetworkChecker from '../../controls/NetworkChecker.jsx';
import classSet from 'classnames';
import { CircularProgress, FlatButton, FontIcon, IconButton, IconMenu, Dialog, DropDownMenu } from 'material-ui';
import ProviderItem from './ProviderItem.jsx';

let ServiceProviderList = React.createClass({
  _onAddServiceProvider: function() {},
  getDefaultProps: function() {
    return {
      sortBy: "customername@asc",
      providerList: null
    };
  },
  getInitialState: function() {
    return {
      buttonDisabled: false

    };
  },
  render: function() {
    var that = this;
    var providers = that.props.providerList;
    var providerItems = [];
    if (providers != null) {
      providers.forEach(provider => {

        providerItems.push(<ProviderItem provider={provider}/>)

      });
    }
    ;
    var newFolderClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': !this.state.buttonDisabled
    };
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };
    var dropDownMenuProps = {

      menuItems: [
        {
          type: 'customername@asc',
          label: '按客户名称排列'
        },
        {
          type: 'starttime@desc',
          label: '按最近的运营时间排列'
        },
      ],
      valueMember: "type",
      displayMember: "label",
      value: this.props.sortBy,
      labelStyle: {
        color: "#fff",
        padding: '0'
      },
      underlineStyle: {
        display: "none"
      },
      iconStyle: {
        display: "none"
      },
      onChange: function(e, selectedIndex, menuItem) {
        that.props.changeSortBy(menuItem.type);
      }
    };

    return (
      <div className="jazz-folder-leftpanel-container">

        <div className="jazz-folder-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{
        margin: '0 30px'
      }}>
            <FlatButton disabled={this.state.buttonDisabled} onClick={this._onAddServiceProvider} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Platform.ServiceProvider}</span>
            </FlatButton>
          </div>
        </div>


        <div className="jazz-serviceprovider-sortbar">
          <DropDownMenu {...dropDownMenuProps} />
          <span className="icon-arrow-down jazz-serviceprovider-sortbar-icon" />

        </div>

        <div className="jazz-provider-list">
{providerItems}
        </div>
      </div>
      )
  },
});
module.exports = ServiceProviderList;
