'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress, Checkbox, FontIcon } from 'material-ui';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import VEEAction from '../../../actions/customerSetting/VEEAction.jsx';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';
import { List } from 'immutable';
import SearchAndFilterBar from '../../../controls/SearchAndFilterBar.jsx';
import TagFilter from '../tag/TagFilter.jsx';
function emptyList() {
  return new List();
}
let AddTagItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    removeTag: React.PropTypes.func,
  },
  _onCleanButtonClick: function() {
    this.props.removeTag(this.props.tag);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.tag.get('Id') !== this.props.tag.get('Id');
  },
  render: function() {
    var cleanIconStyle = {
      marginLeft: '10px',
      marginRight: '7.5px',
      fontSize: '16px',
    };
    return (
      <div className='jazz-mailfield-recieveritem'>
          <div className='node-content-text' style={{
        marginLeft: '7.5px'
      }}>
            {this.props.tag.get('Name')}
          </div>
          <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
        </div>

      )
  }
});

var MonitorTag = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    ruleId: React.PropTypes.number,
    onUpdate: React.PropTypes.func,
  },
  getInitialState: function() {
    return ({
      page: 1,
      taglist: null,
      isLoading: true,
      association: 4,
      addingTags: emptyList(),
      showFilter: false,
      filterObj: this._getInitFilterObj(),
      isFilter: false
    })
  },
  _getInitFilterObj: function() {
    var filterObj = {
      CommodityId: null,
      UomId: null,
      IsAccumulated: null,
      LikeCodeOrName: ''
    };
    return filterObj;
  },
  _getResetFiltObj: function() {
    var filterObj = this.state.filterObj;
    filterObj.CommodityId = null;
    filterObj.UomId = null;
    filterObj.IsAccumulated = null;
    return filterObj;
  },
  _handlerSave: function() {
    // this.setState({
    //   isLoading: true
    // });
    return this.state.addingTags;
  },
  _handleCloseFilterSideNav: function() {
    var filterObj = this._getResetFiltObj();
    this.setState({
      showFilter: false,
      filterObj: filterObj
    });
  },
  _handleFilter: function() {
    var that = this;
    this.setState({
      page: 1,
      showFilter: false
    }, () => {
      that.getAssociatedTag();
    });
  },
  _mergeFilterObj: function(data) {
    var filterObj = this.state.filterObj;
    filterObj[data.path] = data.value;
    var isFilter;
    if (filterObj.CommodityId === null && filterObj.UomId === null && filterObj.IsAccumulated === null) {
      isFilter = false;
    } else {
      isFilter = true;
    }
    this.setState({
      filterObj: filterObj,
      isFilter: isFilter
    });
  },
  _onChange: function() {
    this.setState({
      taglist: VEEStore.getTagList(),
      isLoading: false
    })
  },

  _previousPage: function() {
    var that = this;
    this.setState({
      page: this.state.page - 1,
      isLoading: true,
    }, () => {
      that.getAssociatedTag();
    })
  },
  _nextPage: function() {
    var that = this;
    this.setState({
      page: this.state.page + 1,
      isLoading: true,
    }, () => {
      that.getAssociatedTag();
    })
  },
  _jumpToPage: function(page) {
    var that = this;
    this.setState({
      page: page,
      isLoading: true,
    }, () => {
      that.getAssociatedTag();
    })
  },
  _onDeleteTag: function(tag) {
    VEEAction.modifyVEETags(null, [tag.get('Id')]);
    this.setState({
      isLoading: true
    })
  },
  _onAllTagsSelected: function(event, checked) {
    var tags = this.state.addingTags,
      that = this;
    this.state.taglist.forEach(tag => {
      let index = tags.findIndex(item => item.get('Id') === tag.get('Id'));
      if (checked) {
        if (index < 0) {
          tags = tags.push(tag)
        }

      } else {
        if (index > -1) {
          tags = tags.delete(index)
        }
      }
    })
    this.setState({
      addingTags: tags
    }, () => {
      that.props.onUpdate()
    })

  },
  _onCheckAllSelected: function() {
    var len = 0,
      that = this;
    this.state.addingTags.forEach(tag => {
      if (that.state.taglist.findIndex(item => item.get('Id') === tag.get('Id')) > -1) {
        len++
      }
    })
    if (len === that.state.taglist.size && that.state.taglist.size !== 0) {
      return true
    }
    return false
  },
  _onFilter: function() {
    this.setState({
      showFilter: true
    });
  },
  _onSearch: function(value) {
    var filterObj = this.state.filterObj,
      that = this;
    filterObj.LikeCodeOrName = value;
    this.setState({
      filterObj: filterObj,
      page: 1
    }, () => {
      that.getAssociatedTag();
    });
  },
  _onSearchCleanButtonClick: function() {
    this._onSearch('')
  },
  _renderDisplayTag: function() {
    var that = this;
    var pagingPropTypes = {
      curPageNum: this.state.page,
      totalPageNum: VEEStore.getTotal(),
      previousPage: this._previousPage,
      nextPage: this._nextPage,
      jumpToPage: this._jumpToPage,
      hasJumpBtn: true
    };
    var getTableBody = function() {
      var list = [];
      that.state.taglist.forEach(tag => {
        list.push(
          <div className='jazz-vee-monitor-tag-content-list' key={tag.get('Id')}>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Name')} style={{
            marginTop: '10px'
          }}>{tag.get('Name')}</div>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Code')} style={{
            marginTop: '10px'
          }}>{tag.get('Code')}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findCommodityById(tag.get('CommodityId'))}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findUOMById(tag.get('UomId'))}</div>
            <div className='jazz-vee-monitor-tag-content-operation-item' onClick={that._onDeleteTag.bind(this, tag)}>{I18N.Common.Button.Delete}</div>
      </div>
        )
      })
      return list
    };
    if (that.state.taglist.size === 0) {
      return (
        <div style={{
          color: '#abafae'
        }}>
          {I18N.Setting.VEEMonitorRule.AddTagInfo}
        </div>
        )
    } else {
      return (
        <div className='jazz-vee-monitor-tag-background'>
          <div className='jazz-vee-monitor-tag-header'>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Name}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Code}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Commodity}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.UOM}</div>
            <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Operation}</div>
          </div>
          <div className='jazz-vee-monitor-tag'>
            <div className='jazz-vee-monitor-tag-content'>
              {getTableBody()}
            </div>
            <div className='jazz-vee-monitor-tag-paging'>
              <Pagination {...pagingPropTypes}/>
            </div>
          </div>
        </div>
        )
    }

  },
  _renderSelectTag: function() {
    var addingTags = [],
      that = this;
    var allCheckStyle = {
        marginLeft: '20px',
        width: '36px',
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      },
      fontStyle = {
        fontSize: '14px',
        color: '#abafae'
      };
    var pagingPropTypes = {
      curPageNum: this.state.page,
      totalPageNum: VEEStore.getTotal(),
      previousPage: this._previousPage,
      nextPage: this._nextPage,
      jumpToPage: this._jumpToPage,
      hasJumpBtn: true
    };
    var removeTag = function(tag) {
      let tags = that.state.addingTags;
      tags = tags.delete(tags.findIndex(item => item.get('Id') === tag.get('Id')));
      that.setState({
        addingTags: tags
      }, () => {
        that.props.onUpdate()
      })
    };
    var onTagClick = function(tag) {
      let tags = that.state.addingTags,
        index = tags.findIndex(item => item.get('Id') === tag.get('Id'));
      if (index < 0) {
        tags = tags.push(tag);
      } else {
        tags = tags.delete(index);
      }

      that.setState({
        addingTags: tags
      }, () => {
        that.props.onUpdate()
      })
    };
    var getTableBody = function() {
      var list = [];
      that.state.taglist.forEach(tag => {
        list.push(
          <div className='jazz-vee-monitor-tag-content-list' onClick={onTagClick.bind(this, tag)} key={tag.get('Id')}>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Name')}>
              <div className='jazz-vee-monitor-tag-selectfiled-allcheck'>
                <Checkbox
          onCheck={onTagClick.bind(this, tag)}
          key={tag.get('Id')}
          style={allCheckStyle}
          labelStyle={labelstyle}
          checked={that.state.addingTags.findIndex(item => item.get('Id') === tag.get('Id')) > -1}
          />
                <div className='name'>
                  {tag.get('Name')}
                </div>
              </div>
            </div>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Code')}>{tag.get('Code')}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findCommodityById(tag.get('CommodityId'))}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findUOMById(tag.get('UomId'))}</div>
      </div>
        )
      })
      return list
    };
    if (this.state.addingTags.size === 0) {
      addingTags = <div className='jazz-vee-monitor-tag-hintMsg'>{I18N.Setting.VEEMonitorRule.AddingTagsInfo}</div>
    } else {
      this.state.addingTags.forEach(tag => {
        addingTags.push(
          <AddTagItem tag={tag}
          removeTag={removeTag}/>
        )
      })
    }
    return (
      <div className='jazz-vee-monitor-tag-background'>
        <div className='jazz-vee-monitor-tag-title'>
          {I18N.Setting.VEEMonitorRule.AddTag}
        </div>
        <div className='jazz-vee-monitor-tag-addcontent'>
          {addingTags}
        </div>
        <div className='jazz-vee-monitor-tag-selectfiled'>
          <div className='jazz-vee-monitor-tag-selectfiled-header'>
            <div className='jazz-vee-monitor-tag-title'>
              {I18N.Setting.VEEMonitorRule.TagList}
            </div>
            <div className="jazz-vee-tag-search-filter-bar">
            <SearchAndFilterBar onFilter={this._onFilter}
      onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}
      isFilter={this.state.isFilter}/>
    </div>
          </div>
          <div className='jazz-vee-monitor-tag-selectfiled-list' style={{
        cursor: 'pointer'
      }}>
            <div className='jazz-vee-monitor-tag-header'>
              <div className='jazz-vee-monitor-tag-header-item'>
                <div className='jazz-vee-monitor-tag-selectfiled-allcheck'>
                  <Checkbox
      onCheck={this._onAllTagsSelected}
      ref="checkall"
      style={allCheckStyle}
      labelStyle={labelstyle}
      checked={this._onCheckAllSelected()}
      disabled={this.state.taglist.size === 0}
      />
                  <div style={fontStyle} className='name'>
                    {I18N.Common.Glossary.Name}
                  </div>
                </div>
              </div>
              <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Code}</div>
              <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.Commodity}</div>
              <div className='jazz-vee-monitor-tag-header-item'>{I18N.Common.Glossary.UOM}</div>
            </div>
            <div className='jazz-vee-monitor-tag'>
              <div className='jazz-vee-monitor-tag-content'>
                {getTableBody()}
              </div>
              <div className='jazz-vee-monitor-tag-paging'>
                <Pagination {...pagingPropTypes}/>
              </div>
            </div>
          </div>

        </div>

      </div>
      )
  },
  getAssociatedTag: function() {
    VEEAction.getAssociatedTag(this.state.page, this.props.ruleId, this.state.association, this.state.filterObj)
  },
  componentDidMount: function() {
    VEEStore.addTagChangeListener(this._onChange);
    this.getAssociatedTag();
  },
  componentWillReceiveProps: function(nextProps) {
    var that = this;
    if (nextProps.formStatus !== this.props.formStatus) {
      this.setState({
        taglist: null,
        isLoading: true,
        page: 1,
        association: (nextProps.formStatus === formStatus.VIEW ? 4 : 1),
        addingTags: emptyList(),
        showFilter: false
      }, () => {
        that.getAssociatedTag();
      })
    }
  },
  componentWillUnmount: function() {
    VEEStore.removeTagChangeListener(this._onChange);
  },
  render: function() {
    var isView = this.props.formStatus === formStatus.VIEW,
      filterProps = {
        handleFilter: this._handleFilter,
        onClose: this._handleCloseFilterSideNav,
        filterObj: this.state.filterObj,
        mergeFilterObj: this._mergeFilterObj,
        side: 'right'
      };
    var loading = <div style={{
      display: 'flex',
      flex: 1,
      'alignItems': 'center',
      'justifyContent': 'center'
    }}>
            <CircularProgress  mode="indeterminate" size={2} />
          </div>;
    var filterPanel = null;
    if (this.state.showFilter) {
      filterPanel = <TagFilter {...filterProps}/>;
    }
    return (
      <div className="pop-manage-detail-content" style={{
        display: 'flex'
      }}>
        {this.state.isLoading ? loading : (isView ? this._renderDisplayTag() : this._renderSelectTag())  }
        {filterPanel}
      </div>
      )
  },

});
module.exports = MonitorTag;
