'use strict';
import React from "react";
import classNames from 'classnames';
import SearchBar from '../controls/SearchBar.jsx';

let SearchAndFilterBar = React.createClass({
  propTypes: {
    onFilter: React.PropTypes.func,
    isFilter: React.PropTypes.bool,
    onSearch: React.PropTypes.func,
    onSearchCleanButtonClick: React.PropTypes.func,
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
          <SearchBar onSearch={this.props.onSearch} hintText={I18N.Setting.Tag.SearchText} onSearchCleanButtonClick={this.props.onSearchCleanButtonClick}/>
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
