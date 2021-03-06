'use strict';

import React from "react";
import PropTypes from 'prop-types';
import classnames from "classnames";
import { CircularProgress } from 'material-ui';
import TagFilter from './TagFilter.jsx';
import SearchAndFilterBar from '../../../controls/SearchAndFilterBar.jsx';
import CommonFuns from '../../../util/Util.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';
var createReactClass = require('create-react-class');
var timeoutID = null;
var MonitorTag = createReactClass({
  propTypes: {
    tagId: PropTypes.number,
    onRowClick: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object,
  },
  getInitialState: function() {
    var filterObj = this._getInitFilterObj();
    return ({
      page: 1,
      isLoading: true,
      filterObj: filterObj,
      isFilter: false,
      showFilter: false,
      searchValue:''
    });
  },
  _getInitFilterObj: function() {
    var filterObj = {
      CommodityId: null,
      UomId: null,
      LikeCodeOrName: ''
    };
    return filterObj;
  },
  _handleShowFilterSideNav: function() {
    this.setState({
      showFilter: true
    });
  },
  _onSearch: function(value) {
    var me = this;
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = value;
    this.setState({
      filterObj: filterObj,
      page: 1,
      searchValue:value
    }, () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        me.getTagList();
        timeoutID = null;
      }, 200);
    });
  },
  _onSearchCleanButtonClick: function() {
    var me = this;
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = null;
    this.setState({
      filterObj: filterObj,
      page: 1,
      searchValue:''
    }, () => {
      me.getTagList();
    });
  },
  _handleFilter: function() {
    var me = this;
    var isFilter;
    var filterObj = this.state.filterObj;
    TagAction.setFormulaFilterObj(filterObj);
    if (filterObj.CommodityId === null && filterObj.UomId === null) {
      isFilter = false;
    } else {
      isFilter = true;
    }
    this.setState({
      page: 1,
      showFilter: false,
      isFilter: isFilter
    }, () => {
      me.getTagList();
    });
  },
  _handleCloseFilterSideNav: function() {
    var filterObj = TagStore.getFormulaFilterObj().toJS();
    this.setState({
      showFilter: false,
      filterObj: filterObj
    });
  },
  _mergeFilterObj: function(data) {
    var filterObj = this.state.filterObj;
    filterObj[data.path] = data.value;
    this.setState({
      filterObj: filterObj
    });
  },
  _onChange: function() {
    this.setState({
      taglist: TagStore.getAllTagList(),
      total: TagStore.getTotal(),
      isLoading: false
    });
  },

  _previousPage: function() {
    var me = this;
    this.setState({
      page: this.state.page - 1,
      isLoading: true,
    }, () => {
      me.getTagList();
    });
  },
  _nextPage: function() {
    var me = this;
    this.setState({
      page: this.state.page + 1,
      isLoading: true,
    }, () => {
      me.getTagList();
    });
  },
  _jumpToPage: function(page) {
    var me = this;
    this.setState({
      page: page,
      isLoading: true,
    }, () => {
      me.getTagList();
    });
  },
  _renderHeader: function() {
    return (
      <div className="jazz-tag-formula-content-taglist-top">
        <div className="jazz-tag-formula-content-taglist-top-text">{I18N.Setting.Tag.TagList}</div>
        <div className="jazz-vee-tag-search-filter-bar"><SearchAndFilterBar value={this.state.searchValue} onFilter={this._handleShowFilterSideNav}
      onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}
      isFilter={this.state.isFilter}/></div>
  </div>);
  },
  _renderDisplayTag: function() {
    var me = this;
    var pagingPropTypes= {
      curPageNum: this.state.page,
      totalPageNum: parseInt((this.state.total + 19) / 20),
      previousPage: this._previousPage,
      nextPage: this._nextPage,
      jumpToPage: this._jumpToPage,
      hasJumpBtn: true
    };
    var getTableBody = function() {
      var list = [];
      me.state.taglist.forEach(tag => {
        list.push(
          <div className='jazz-formula-monitor-tag-content-list' onClick={me.props.onRowClick.bind(null, tag.get('Type'), tag.get('Code'))}>
            <div className="jazz-formula-monitor-tag-content-item" title={tag.get('Name')}>{tag.get('Name')}</div>
            <div className="jazz-formula-monitor-tag-content-item" title={tag.get('Code')}>{tag.get('Code')}</div>
            <div className='jazz-formula-monitor-tag-content-item'>{CommonFuns.getCommodityById(tag.get('CommodityId')).Comment}</div>
            <div className='jazz-formula-monitor-tag-content-item'>{CommonFuns.getUomById(tag.get('UomId')).Comment}</div>
            <div className='jazz-formula-monitor-tag-content-item'>{tag.get('Type') === 1 ? I18N.Setting.Tag.PTagManagement : I18N.Setting.Tag.VTagManagement}</div>
      </div>
        );
      });
      return list;
    };
    if (me.state.taglist.size === 0) {
      return null;
    } else {
      return (
        <div className='jazz-vee-monitor-tag-background'>
          <div className='jazz-vee-monitor-tag-header'>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Name}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Code}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Commodity}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.UOM}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Type}</div>
          </div>
          <div className='jazz-formula-monitor-tag'>
            <div className='jazz-formula-monitor-tag-content'>
              {getTableBody()}
            </div>
            <div className='jazz-formula-monitor-tag-paging'>
              <Pagination {...pagingPropTypes}/>
            </div>
          </div>
        </div>
        );
    }
  },
  getTagList: function() {
    TagAction.getTagList(this.context.router.params.customerId,this.state.page, this.state.filterObj);
  },
  componentDidMount: function() {
    TagStore.addAllTagListChangeListener(this._onChange);
    this.getTagList();
  },
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {
    TagStore.removeAllTagListChangeListener(this._onChange);
  },
  render: function() {
    var loading = <div style={{
      display: 'flex',
      flex: 1,
      'alignItems': 'center',
      'justifyContent': 'center'
    }}>
            <CircularProgress  mode="indeterminate" size={80} />
          </div>;
    var header = this._renderHeader();
    var filterPanel = null;
    var filterProps = {
      handleFilter: this._handleFilter,
      onClose: this._handleCloseFilterSideNav,
      filterObj: this.state.filterObj,
      mergeFilterObj: this._mergeFilterObj,
      side: 'right'
    };
    if (this.state.showFilter) {
      filterPanel = <TagFilter {...filterProps}/>;
    }
    return (
      <div className="jazz-tag-formula-content-taglist">
        {header}
        <div className="jazz-tag-formula-content-taglist-content">
          {this.state.isLoading ? loading : this._renderDisplayTag()}
        </div>
        {filterPanel}
      </div>
      );
  },

});
module.exports = MonitorTag;
