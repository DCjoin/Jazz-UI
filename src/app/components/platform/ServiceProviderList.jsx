'use strict';

import React from 'react';

import MainAppBar from '../MainAppBar.jsx';
import CustomDropDownMenu from '../../controls/CustomDropDownMenu.jsx';
import classSet from 'classnames';
import { FlatButton, FontIcon, MenuItem, DropDownMenu } from 'material-ui';
import ProviderItem from './ProviderItem.jsx';

let ServiceProviderList = React.createClass({
  getDefaultProps: function() {
    return {
      sortBy: "customername@asc",
      providerList: null,
      selectProvider: null
    };
  },
  render: function() {
    var that = this;
    var providers = that.props.providerList;
    var providerItems = [];
    if (providers !== null) {
      providers.forEach(provider => {
        providerItems.push(<ProviderItem provider={provider} selectItem={this.props.selectProvider}/>)
      });
    }
    var newFolderClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': !this.props.addBtnDisabled
    };
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };
    var dropDownMenuProps = {
      value: this.props.sortBy,
      onChange: function(e, selectedIndex, value) {
        that.props.changeSortBy(value);
      }
    };

    return (
      <div className="jazz-folder-leftpanel-container">

        <div className="jazz-folder-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{
        margin: '0 30px'
      }}>
            <FlatButton disabled={this.props.addBtnDisabled} onClick={this.props.onAddServiceProvider} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Platform.ServiceProvider.SP}</span>
            </FlatButton>
          </div>
        </div>


          <CustomDropDownMenu {...dropDownMenuProps}>            
            <MenuItem value={'customername@asc'} primaryText={I18N.Platform.ServiceProvider.CustomerName}/>
            <MenuItem value={'starttime@asc'} primaryText={I18N.Platform.ServiceProvider.StartTime}/>
          </CustomDropDownMenu>


        <div className="jazz-provider-list">
{providerItems}
        </div>
      </div>
      )
  },
});
module.exports = ServiceProviderList;
