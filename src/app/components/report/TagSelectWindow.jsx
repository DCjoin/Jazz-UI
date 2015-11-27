'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { Checkbox } from 'material-ui';

import assign from "object-assign";

import TagList from './TagList.jsx';
import Header from '../../controls/HierAndDimHeader.jsx';
import SearchBar from '../../controls/SearchBar.jsx';
import Pagination from '../../controls/paging/Pagination.jsx';
import ReportStore from '../../stores/ReportStore.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import Immutable from 'immutable';

var filters = null;
var page = 0;
let TagSelectWindow = React.createClass({
  mixins: [Navigation, State],
  getInitialState: function() {
    return {
      isLeftLoading: null,
      isRightLoading: true,
      checkAll: false
    };
  },
  _getTagIds: function(tagList) {
    return tagList.map((item) => {
      return item.get('TagId');
    }).toJS();
  },
  _onTagListChange: function() {
    this.setState({
      tagList: ReportStore.getTagList(),
      total: ReportStore.getTagTotalPage(),
      isLeftLoading: false
    });
  },
  _onSelectedTagListChange: function() {
    var selectedTagList = ReportStore.getSelectedTagList();
    this.setState({
      selectedTagList: selectedTagList,
      isRightLoading: false
    });
  },
  _onHierachyTreeClick: function(node) {
    filters = null;
    page = 1;
    ReportAction.getTagData(node.Id, 2, 1, filters);
    this.setState({
      isLeftLoading: true,
      tagId: node.Id,
      nodeId: node.Id,
      optionType: 2,
    });
  },
  _onDimTreeClick: function(node) {
    page = 1;
    if (node.Id !== 0) {
      ReportAction.getTagData(node.Id, 6, 1, filters);
      this.setState({
        dimId: node.Id,
        nodeId: node.Id,
        optionType: 6,
        isLeftLoading: true
      });
    } else {
      var id = this.state.tagId;
      ReportAction.getTagData(id, 2, 1, filters);
      this.setState({
        dimId: null,
        nodeId: id,
        optionType: 2,
        isLeftLoading: true
      });
    }
  },
  _onSearch: function(value) {
    filters = [
      {
        "type": "string",
        "value": [value],
        "field": "Name"
      }
    ];
    ReportAction.getTagData(this.state.nodeId, this.state.optionType, page, filters);
  },
  _onSearchCleanButtonClick: function() {
    filters = null;
    ReportAction.getTagData(this.state.nodeId, this.state.optionType, page, filters);
  },
  _onPrePage: function() {
    if (page > 1) {
      page = page - 1;
      ReportAction.getTagData(this.state.nodeId, this.state.optionType, page, filters);
    }
  },
  _onNextPage: function() {
    if (20 * page < this.state.total) {
      page = page + 1;
      ReportAction.getTagData(this.state.nodeId, this.state.optionType, page, filters);
    }
  },
  jumpToPage: function(targetPage) {
    page = targetPage;
    ReportAction.getTagData(this.state.nodeId, this.state.optionType, page, filters);
  },

  componentWillReceiveProps: function(nextProps) {
    var selectedTaglist = nextProps.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(selectedTagIds);
    }
  },
  componentDidMount: function() {
    var selectedTaglist = this.props.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(selectedTagIds);
    }
    ReportStore.addTagListChangeListener(this._onTagListChange);
    ReportStore.addSelectedTagListChangeListener(this._onSelectedTagListChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeTagListChangeListener(this._onTagListChange);
    ReportStore.removeSelectedTagListChangeListener(this._onSelectedTagListChange);
  },
  render() {
    var leftPanelField,
      rightPanel = null,
      pagination = null;
    var totalPageNum = parseInt((this.state.total + 19) / 20),
      hasJumpBtn = (this.state.total === 0) ? false : true;
    var me = this;
    if (this.state.tagList) {
      pagination = <Pagination previousPage={this._onPrePage}
      nextPage={this._onNextPage}
      jumpToPage={this.jumpToPage}
      curPageNum={page}
      totalPageNum={totalPageNum}
      hasJumpBtn={hasJumpBtn}/>;
    }
    var leftTagListHeader = <div style={{
      display: 'flex',
      'flex-direction': 'row'
    }}>
        <div style={{
      width: '40px'
    }}><Checkbox checked={this.state.checkAll} onCheck={this._onCheckAll}/></div>
        <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Name}</div>
        <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Code}</div>
        <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Commodity}</div>
      </div>;
    var rightTagListHeader = <div style={{
      display: 'flex',
      'flex-direction': 'row'
    }}>
          <div style={{
      width: '40px'
    }}></div>
          <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Name}</div>
          <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Code}</div>
          <div style={{
      width: '100px'
    }}>{I18N.Common.Glossary.Commodity}</div>
        </div>;

    leftPanelField = (<div className='jazz-report-taglist-container'>
      <div className="jazz-dataselectmainpanel" >
        <div className="header">
          <Header onHierachyTreeClick={this._onHierachyTreeClick} onDimTreeClick={this._onDimTreeClick}/>
        </div>
        <div>
          <SearchBar onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}/>
        </div>
      </div>
      {leftTagListHeader}
      <div className='jazz-report-taglist'>
        <TagList tagList={this.state.tagList} selectedTagList={this.state.selectedTagList} isLoading={this.state.isLeftLoading} leftPanel={true}></TagList>
      </div>
      {pagination}
    </div>);
    rightPanel = <div className='jazz-report-taglist-container'>
      {rightTagListHeader}
      <div className='jazz-report-taglist'>
          <TagList tagList={this.state.selectedTagList} isLoading={this.state.isRightLoading} leftPanel={false}></TagList>
        </div></div>;

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
          {leftPanelField}
          {rightPanel}
        </div>
      );
  },
});

module.exports = TagSelectWindow;
