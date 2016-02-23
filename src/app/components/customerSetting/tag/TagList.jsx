'use strict';

import React from 'react';
import classNames from 'classnames';
import { FlatButton, FontIcon } from 'material-ui';
import SearchAndFilterBar from '../../../controls/SearchAndFilterBar.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';

let TagList = React.createClass({
  propTypes: {
    onAddBtnClick: React.PropTypes.func,
    onImportBtnClick: React.PropTypes.func,
    onExportBtnClick: React.PropTypes.func,
    onPrePage: React.PropTypes.func,
    onNextPage: React.PropTypes.func,
    jumpToPage: React.PropTypes.func,
    curPageNum: React.PropTypes.number,
    totalPageNum: React.PropTypes.number,
    hasJumpBtn: React.PropTypes.bool,
    onSearch: React.PropTypes.func,
    onSearchCleanButtonClick: React.PropTypes.func,
    filterStatus: React.PropTypes.bool,
    contentItems: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool
  },
  render: function() {
    var addBtnClasses = {
        'btn-container': true,
        'btn-container-active': this.props.isViewStatus
      },
      buttonStyle = {
        backgroundColor: 'transparent',
        height: '32px'
      };

    return (
      <div className="jazz-tag-leftpanel">
        <div className="jazz-tag-leftpanel-header">
          <div className={classNames(addBtnClasses)}>
            <FlatButton disabled={!this.props.isViewStatus}  onClick={this.props.onAddBtnClick} style={buttonStyle}>
              <FontIcon className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Add}</span>
            </FlatButton>
          </div>
          <div className='jazz-tag-leftpanel-button'>
            <FlatButton onClick={this.props.onImportBtnClick} style={buttonStyle}>
              <FontIcon className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Import}</span>
            </FlatButton>
          </div>
          <div className='jazz-tag-leftpanel-button'>
            <FlatButton onClick={this.props.onExportBtnClick} style={buttonStyle}>
              <FontIcon className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Export}</span>
            </FlatButton>
          </div>
        </div>
        <div className="jazz-tag-search-filter-bar">
          <SearchAndFilterBar onFilter={this.props.onFilter}
      onSearch={this.props.onSearch} onSearchCleanButtonClick={this.props.onSearchCleanButtonClick}
      filterStatus={this.props.filterStatus}/>
        </div>
        <div className="jazz-tag-list">
          {this.props.contentItems}
        </div>
        <div className="jazz-tag-pagination">
          <Pagination previousPage={this.props.onPrePage}
      nextPage={this.props.onNextPage}
      jumpToPage={this.props.jumpToPage}
      curPageNum={this.props.curPageNum}
      totalPageNum={this.props.totalPageNum}
      hasJumpBtn={this.props.hasJumpBtn}/>
        </div>
      </div>
      );
  },
});
module.exports = TagList;
