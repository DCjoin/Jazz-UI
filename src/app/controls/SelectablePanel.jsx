'use strict';

import React from 'react';
import classNames from 'classnames';
import { FlatButton, FontIcon, DropDownMenu, MenuItem, CircularProgress } from 'material-ui';
import _isBoolean from 'lodash/lang/isBoolean';

let SelectablePanel = React.createClass({
  propTypes: {
    addBtnLabel: React.PropTypes.string,
    onAddBtnClick: React.PropTypes.func,
    // filterBtnLabel: React.PropTypes.string,
    // onFilterBtnClick: React.PropTypes.object,
    sortItems: React.PropTypes.array,
    sortBy: React.PropTypes.string,
    changeSortBy: React.PropTypes.func,
    contentItems: React.PropTypes.array,
    isAddStatus: React.PropTypes.bool,
    isViewStatus: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
  },
  render: function() {
    var filter, sort,
      list = this.props.isLoading ? <CircularProgress  mode="indeterminate" size={1} style={{
        margin: '250px 135px'
      }}/> : this.props.contentItems,
      that = this;

    var addBtnClasses = {
        'se-dropdownbutton': true,
        'btn-container': true,
        'btn-container-active': _isBoolean(this.props.isAddStatus) ? !this.props.isAddStatus : this.props.isViewStatus
      },
      buttonStyle = {
        backgroundColor: 'transparent',
        height: '32px'
      };

    var dropDownMenuProps = {
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
      onChange: function(e, selectedIndex, value) {
        that.props.changeSortBy(value);
      }
    };

    // if (!!this.props.filterBtnLabel) {
    //   filter = <div className={classNames(addBtnClasses)}>
    //               <FlatButton disabled={!this.props.isViewStatus}  onClick={this.props.onFilterBtnClick} style={buttonStyle}>
    //                 <FontIcon  className="fa icon-filter btn-icon"/>
    //                 <span className="mui-flat-button-label btn-text">{this.props.filterBtnLabel}</span>
    //               </FlatButton>
    //             </div>
    // }

    if (!!this.props.sortBy) {
      sort = <div className="jazz-serviceprovider-sortbar">
                <DropDownMenu {...dropDownMenuProps} >{this.props.sortItems.map( item => <MenuItem  primaryText={item.label} value={item.type} />)}</DropDownMenu>
                <span className="icon-arrow-down jazz-serviceprovider-sortbar-icon" />
              </div>
    }

    return (
      <div className="jazz-folder-leftpanel-container">
        <div className="jazz-folder-leftpanel-header" style={{
        padding: '0 30px'
      }}>
          <div className={classNames(addBtnClasses)}>
            <FlatButton disabled={_isBoolean(this.props.isAddStatus) ? this.props.isAddStatus : !this.props.isViewStatus}  onClick={this.props.onAddBtnClick} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{this.props.addBtnLabel}</span>
            </FlatButton>
          </div>
        </div>
        {sort}
        <div className="jazz-provider-list">
          {list}
        </div>
      </div>
      )
  },
});
module.exports = SelectablePanel;
