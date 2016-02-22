'use strict';

import React from 'react';
import classNames from 'classnames';
import { FlatButton, FontIcon, DropDownMenu, CircularProgress } from 'material-ui';
import SearchAndFilterBar from '../../../controls/SearchAndFilterBar.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';

let SelectablePanel = React.createClass({
  propTypes: {
    onAddBtnClick: React.PropTypes.func,
    onImportBtnClick: React.PropTypes.func,
    onExportBtnClick: React.PropTypes.func,
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
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Add}</span>
            </FlatButton>
          </div>
          <div className="jazz-tag-leftpanel-header-file">
            <FlatButton onClick={this.props.onImportBtnClick} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Import}</span>
            </FlatButton>
            <FlatButton onClick={this.props.onExportBtnClick} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Common.Button.Export}</span>
            </FlatButton>
          </div>
        </div>
        <div className="jazz-tag-search-filter-bar">
          <SearchAndFilterBar/>
        </div>
        <div className="jazz-tag-list">
          {this.props.contentItems}
        </div>
        <div className="jazz-tag-pagination">
          <Pagination/>
        </div>
      </div>
      );
  },
});
module.exports = SelectablePanel;
