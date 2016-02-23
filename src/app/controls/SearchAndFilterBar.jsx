'use strict';
import React from "react";
import classNames from 'classnames';
import SearchBar from '../controls/SearchBar.jsx';
import { FlatButton, FontIcon } from 'material-ui';

let SearchAndFilterBar = React.createClass({
  propTypes: {
    onFilter: React.PropTypes.func,
    filterStatus: React.PropTypes.bool,
    onSearch: React.PropTypes.func,
    onSearchCleanButtonClick: React.PropTypes.func,
  },
  render: function() {
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };
    return (
      <div className="jazz-search-filter-bar">
        <div className='jazz-search'>
          <SearchBar onSearch={this.props.onSearch} onSearchCleanButtonClick={this.props.onSearchCleanButtonClick}/>
        </div>
        <div className='jazz-filter'>
          <FlatButton onClick={this.props.onFilter} style={buttonStyle}>
            <FontIcon  className="fa icon-add btn-icon"/>
            <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Filter}</span>
          </FlatButton>
        </div>
      </div>
      );
  },
});
module.exports = SearchAndFilterBar;
