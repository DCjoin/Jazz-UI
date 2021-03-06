'use strict';
import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SearchBar from '../controls/SearchBar.jsx';
var createReactClass = require('create-react-class');
let SearchAndFilterBar = createReactClass({
  propTypes: {
    onFilter: PropTypes.func,
    isFilter: PropTypes.bool,
    onSearch: PropTypes.func,
    onSearchCleanButtonClick: PropTypes.func,
    value: PropTypes.string
  },
  render: function() {
    var filterIconClasses = {
      'jazz-filter-item-icon': true,
      'icon-filter': !this.props.isFilter,
      'icon-filtered': this.props.isFilter
    };
    return (
      <div className="jazz-search-filter-bar">
        <div className='jazz-search'>
          <SearchBar ref='searchBar' onSearch={this.props.onSearch} hintText={I18N.Setting.Tag.SearchText} value={this.props.value} onSearchCleanButtonClick={this.props.onSearchCleanButtonClick}/>
        </div>
        <div className='jazz-filter'>
          <span onClick={this.props.onFilter} className="jazz-filter-item">
            <span className={classNames(filterIconClasses)}></span>
            {I18N.Common.Button.Filter}
          </span>
        </div>
      </div>
      );
  },
});
module.exports = SearchAndFilterBar;
