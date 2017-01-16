'use strict';
import React from "react";
import { Checkbox } from 'material-ui';
import TagList from './TagList.jsx';
import Header from 'controls/HierAndDimHeader.jsx';
import SearchBar from 'controls/SearchBar.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import Immutable from 'immutable';

var filters = null;

var customerId;
let TagSelectWindow = React.createClass({
  //mixins: [Navigation, State],
  contextTypes:{
        currentRoute: React.PropTypes.object
    },
  getInitialState: function() {
    return {
      isLeftLoading: null,
      isRightLoading: true,
      checkAll: false,
      checkAllDisabled: true,
      tagList: Immutable.fromJS([]),
      selectedTagList: Immutable.fromJS([]),
      searchValue:''
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
    var index,
      i;
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
    if (tagList.size === 0) {
      checkAll = false;
    } else {
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
    }
    this.setState({
      tagList: tagList,
      isLeftLoading: false,
      checkAll: checkAll
    });
  },
  _onSelectedTagListChange: function() {
    var selectedTagList = ReportStore.getSelectedTagList();
    var tagList = this.state.tagList;
    var index;
    var checkAll = true;
    if (tagList.size === 0) {
      checkAll = false;
    } else {
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
    }
    this.setState({
      selectedTagList: selectedTagList,
      isRightLoading: false,
      checkAll: checkAll
    });
  },
  _onTagItemSelected: function(id) {
    var tagList = this.state.tagList;
    var index;
    var checkAll = true;
    var addTag = tagList.find((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    var selectedTagList = this.state.selectedTagList;
    if (addTag) {
      selectedTagList = selectedTagList.push(addTag);
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
        selectedTagList: selectedTagList,
        checkAll: checkAll
      });
    }
  },
  _onTagItemUnselected: function(id) {
    var tagList = this.state.tagList;
    var selectedTagList = this.state.selectedTagList;
    var index;
    var checkAll = true;
    var deleteTagIndex = selectedTagList.findIndex((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    if (deleteTagIndex !== -1) {
      selectedTagList = selectedTagList.delete(deleteTagIndex);
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
      if(selectedTagList.size===0){
        checkAll = false;
      }
      this.setState({
        selectedTagList: selectedTagList,
        checkAll: checkAll
      });
    }

  },
  _onHierachyTreeClick: function(node,optionType) {
    if (node.Id === this.state.nodeId && optionType === this.state.optionType) {
      return;
    }
    //this.refs.searchBar.clearSearchText();
    filters = null;

    ReportAction.getTagData(customerId,node.Id, optionType, filters,this.props.type);
    this.setState({
      isLeftLoading: true,
      nodeId: node.Id,
      optionType: optionType,
      searchValue:''
    });
  },
  _onSearch: function(value) {
    filters = [
      {
        "type": "string",
        "value": [value],
        "field": "Name"
      }
    ];
    this.setState({
      searchValue:value
    },()=>{
      ReportAction.getTagData(customerId,this.state.nodeId, this.state.optionType, filters,this.props.type);
    })

  },
  _onSearchCleanButtonClick: function() {
    filters = null;
    this.setState({
      searchValue:''
    },()=>{
      ReportAction.getTagData(customerId,this.state.nodeId, this.state.optionType, filters,this.props.type);
    })

  },
  componentWillMount:function(){
    customerId=this.context.currentRoute.params.customerId;
  },
  componentWillReceiveProps: function(nextProps) {
    var selectedTaglist = nextProps.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(customerId,selectedTagIds);
    }
  },
  componentDidMount: function() {
    var selectedTaglist = this.props.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(customerId,selectedTagIds);
    } else if (selectedTaglist.size === 0) {
      this.setState({
        selectedTagList: Immutable.fromJS([]),
        isRightLoading: false
      });
    }
    ReportAction.getTagData(customerId,this.props.hierarchyId, 2, null,this.props.type);
    ReportStore.addTagListChangeListener(this._onTagListChange);
    ReportStore.addSelectedTagListChangeListener(this._onSelectedTagListChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeTagListChangeListener(this._onTagListChange);
    ReportStore.removeSelectedTagListChangeListener(this._onSelectedTagListChange);
  },
  render() {
    var leftPanelField,
      rightPanel = null;
    var leftTagListHeader = <div style={{
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '7px',
      backgroundColor: '#fbfbfb',
      height: '30px',
      minHeight: '30px',
      'line-height': '30px'
    }}>
        <div className='jazz-report-tag-checkbox'><Checkbox disabled={this.props.disabled} checked={this.state.checkAll} onCheck={this._onCheckAll}/></div>
        <div style={{
      width: '150px'
    }}>{I18N.Common.Glossary.Name}</div>
      </div>;
    var rightTagListHeader = <div style={{
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '7px',
      backgroundColor: '#efefef',
      height: '30px',
      minHeight: '30px',
      'line-height': '30px'
    }}>
          <div style={{
      width: '45px'
    }}>{I18N.Common.Glossary.Index}</div>
          <div style={{
      width: '150px'
    }}>{I18N.Common.Glossary.Name}</div>
          <div>{I18N.Setting.KPI.Report.Hierarchy}</div>
          <div></div>
        </div>;

    leftPanelField = (<div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
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
            <Header hierarchyId={this.props.hierarchyId} onHierachyTreeClick={this._onHierachyTreeClick}/>
          </div>
          <div className='filter'>
            <SearchBar ref='searchBar' value={this.state.searchValue} onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}/>
          </div>
        </div>
        {leftTagListHeader}
        <div className='jazz-report-taglist'>
          <TagList tagList={this.state.tagList} selectedTagList={this.state.selectedTagList} isLoading={this.state.isLeftLoading} disabled={this.props.disabled} leftPanel={true} onTagItemSelected={this._onTagItemSelected} onTagItemUnselected={this._onTagItemUnselected}></TagList>
        </div>
      </div></div>);
    rightPanel = <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      marginRight: '23px'
    }}><div style={{
      marginLeft: '10px',
      marginBottom: '10px'
    }}>{I18N.EM.Report.SelectedTag}</div><div className='jazz-report-taglist-container-right'>
      {rightTagListHeader}
      <div className='jazz-report-taglist'>
          <TagList tagList={this.state.selectedTagList} isLoading={this.state.isRightLoading}  disabled={this.props.disabled} leftPanel={false} onTagItemUnselected={this._onTagItemUnselected}></TagList>
        </div></div></div>;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1
      }}>
          {leftPanelField}
          {rightPanel}
        </div>
      );
  },
});

module.exports = TagSelectWindow;
