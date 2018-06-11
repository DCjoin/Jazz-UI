'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import _isBoolean from 'lodash-es/isBoolean';
import CustomDropDownMenu from './CustomDropDownMenu.jsx';
var createReactClass = require('create-react-class');

let SelectablePanel = createReactClass({
  propTypes: {
    addBtnLabel: PropTypes.string,
    onAddBtnClick: PropTypes.func,
    // filterBtnLabel: PropTypes.string,
    // onFilterBtnClick: PropTypes.object,
    sortItems: PropTypes.array,
    sortBy: PropTypes.string,
    changeSortBy: PropTypes.func,
    contentItems: PropTypes.array,
    isAddStatus: PropTypes.bool,
    isViewStatus: PropTypes.bool,
    isLoading: PropTypes.bool,
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
        // backgroundColor: 'transparent',
        height: '32px'
      };

    var dropDownMenuProps = {
      valueMember: "type",
      displayMember: "label",
      value: this.props.sortBy,
      listStyle: {
        width: 320,
        left: 0,
      },
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
      sort = <CustomDropDownMenu value={this.props.sortBy} onChange={(event, index, value) => {
                this.props.changeSortBy(value);
              }}>{this.props.sortItems.map( item => <MenuItem  primaryText={item.label} value={item.type} />)}</CustomDropDownMenu>
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
