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
      checkAll: false,
      checkAllDisabled: true,
      total: 0,
      tagList: Immutable.fromJS([])
    };
  },
  _getSelectedTagList() {
    return this.state.selectedTagList.map((item, i) => {
      return Immutable.fromJS({
        TagId: item.get('Id'),
        TagIndex: i
      });
    });
  },
  _getTagIds: function(tagList) {
    return tagList.map((item) => {
      return item.get('TagId');
    }).toJS();
  },
  _onCheckAll: function(e, checked) {
    var index, i;
    var tagList = this.state.tagList;
    var selectedTagList = this.state.selectedTagList;
    if (tagList.size !== 0) {
      if (checked) {
        for (i = 0; i < tagList.size; i++) {
          index = selectedTagList.findIndex((item) => {
            if (tagList.getIn([i, 'Id']) === item.get('Id')) {
              return true;
            }
          });
          if (index === -1) {
            selectedTagList = selectedTagList.push(tagList.get(i));
          }
        }
      } else {
        for (i = 0; i < tagList.size; i++) {
          index = selectedTagList.findIndex((item) => {
            if (tagList.getIn([i, 'Id']) === item.get('Id')) {
              return true;
            }
          });
          if (index !== -1) {
            selectedTagList = selectedTagList.delete(index);
          }
        }
      }
    }
    this.setState({
      checkAll: checked,
      selectedTagList: selectedTagList
    });
  },
  _onTagListChange: function() {
    var checkAll = true;
    var tagList = ReportStore.getTagList();
    var selectedTagList = this.state.selectedTagList;
    var index;
    for (var i = 0; i < tagList.size; i++) {
      index = selectedTagList.findIndex((item) => {
        if (tagList.getIn([i, 'Id']) === item.get('Id')) {
          return true;
        }
      });
      if (index === -1) {
        checkAll = false;
        break;
      }
    }
    this.setState({
      tagList: ReportStore.getTagList(),
      total: ReportStore.getTagTotalPage(),
      isLeftLoading: false,
      checkAll: checkAll
    });
  },
  _onSelectedTagListChange: function() {
    var selectedTagList = ReportStore.getSelectedTagList();
    this.setState({
      selectedTagList: selectedTagList,
      isRightLoading: false
    });
  },
  _onTagItemSelected: function(id) {
    var addTag = this.state.tagList.find((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    var obj = {};
    var selectedTagList = this.state.selectedTagList;
    if (addTag) {
      selectedTagList = selectedTagList.push(addTag);
      obj.selectedTagList = selectedTagList;
      if (selectedTagList.size === this.state.tagList.size) {
        obj.checkAll = true;
      }
      this.setState(obj);
    }
  },
  _onTagItemUnselected: function(id) {
    var selectedTagList = this.state.selectedTagList;
    var deleteTagIndex = selectedTagList.findIndex((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    var obj = {};
    if (deleteTagIndex !== -1) {
      selectedTagList = selectedTagList.delete(deleteTagIndex);
      obj.selectedTagList = selectedTagList;
      if (selectedTagList.size < this.state.tagList.size) {
        obj.checkAll = false;
      }
      this.setState(obj);
    }

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
    } else if (selectedTaglist.size === 0) {
      this.setState({
        selectedTagList: Immutable.fromJS([]),
        isRightLoading: false
      });
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
      'flex-direction': 'row',
      paddingLeft: '7px',
      backgroundColor: '#fbfbfb',
      height: '30px',
      'line-height': '30px'
    }}>
        <div className='jazz-report-tag-checkbox'><Checkbox disabled={this.props.disabled} checked={this.state.checkAll} onCheck={this._onCheckAll}/></div>
        <div style={{
      width: '150px'
    }}>{I18N.Common.Glossary.Name}</div>
        <div>{I18N.Common.Glossary.Code}</div>
      </div>;
    var rightTagListHeader = <div style={{
      display: 'flex',
      'flex-direction': 'row',
      paddingLeft: '7px',
      backgroundColor: '#efefef',
      height: '30px',
      'line-height': '30px'
    }}>
          <div style={{
      width: '45px'
    }}>{I18N.Common.Glossary.Index}</div>
          <div style={{
      width: '150px'
    }}>{I18N.Common.Glossary.Name}</div>
          <div>{I18N.Common.Glossary.Code}</div>
          <div></div>
        </div>;

    leftPanelField = (<div style={{
      flex: 1,
      display: 'flex',
      'flex-direction': 'column',
      marginLeft: '20px',
      marginRight: '45px'
    }}>
      <div style={{
      marginLeft: '10px',
      marginBottom: '10px'
    }}>{I18N.EM.Report.AllTag}</div>
      <div className='jazz-report-taglist-container-left'>
        <div className="jazz-report-taglist-tagselect" >
          <div className="header">
            <Header onHierachyTreeClick={this._onHierachyTreeClick} onDimTreeClick={this._onDimTreeClick}/>
          </div>
          <div className='filter'>
            <SearchBar onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}/>
          </div>
        </div>
        {leftTagListHeader}
        <div className='jazz-report-taglist'>
          <TagList tagList={this.state.tagList} selectedTagList={this.state.selectedTagList} isLoading={this.state.isLeftLoading} disabled={this.props.disabled} leftPanel={true} onTagItemSelected={this._onTagItemSelected} onTagItemUnselected={this._onTagItemUnselected}></TagList>
        </div>
        {pagination}
      </div></div>);
    rightPanel = <div style={{
      flex: 1,
      display: 'flex',
      'flex-direction': 'column',
      marginRight: '23px'
    }}><div style={{
      marginLeft: '10px',
      marginBottom: '10px'
    }}>{I18N.EM.Report.SelectTag}</div><div className='jazz-report-taglist-container-right'>
      {rightTagListHeader}
      <div className='jazz-report-taglist'>
          <TagList tagList={this.state.selectedTagList} isLoading={this.state.isRightLoading}  disabled={this.props.disabled} leftPanel={false} onTagItemUnselected={this._onTagItemUnselected}></TagList>
        </div></div></div>;

    return (
      <div style={{
        display: 'flex',
        'flex-direction': 'row',
        flex: 1
      }}>
          {leftPanelField}
          {rightPanel}
        </div>
      );
  },
});

module.exports = TagSelectWindow;
