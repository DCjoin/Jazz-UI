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
    formStatus: React.PropTypes.bool,
    ruleId: React.PropTypes.number,
  },
  getInitialState: function() {
    return ({
      page: 1,
      taglist: null,
      isLoading: true,
      association: 4,
      addingTags: emptyList()
    })
  },
  _handlerSave: function() {
    // this.setState({
    //   isLoading: true
    // });
    return this.state.addingTags;
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
    var tags = this.state.addingTags;
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
  _onFilter: function() {},
  _onSearch: function() {},
  _onSearchCleanButtonClick: function() {},
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
          <div className='jazz-vee-monitor-tag-content-list'>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Name')}>{tag.get('Name')}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{tag.get('Code')}</div>
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
        <div>
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
      })
    };
    var getTableBody = function() {
      var list = [];
      that.state.taglist.forEach(tag => {
        list.push(
          <div className='jazz-vee-monitor-tag-content-list' onClick={onTagClick.bind(this, tag)}>
            <div className={classnames("jazz-vee-monitor-tag-content-item", "hiddenEllipsis")} title={tag.get('Name')}>
              <div className='jazz-vee-monitor-tag-selectfiled-allcheck'>
                <Checkbox
          onCheck={onTagClick.bind(this, tag)}
          key={tag.get('Id')}
          style={allCheckStyle}
          labelStyle={labelstyle}
          checked={that.state.addingTags.findIndex(item => item.get('Id') === tag.get('Id')) > -1}
          />
                <div style={fontStyle} className='name'>
                  {tag.get('Name')}
                </div>
              </div>
            </div>
            <div className='jazz-vee-monitor-tag-content-item'>{tag.get('Code')}</div>
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
            <div className="jazz-tag-search-filter-bar">
            <SearchAndFilterBar onFilter={this._onFilter}
      onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}
      isFilter={true}/>
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
    VEEAction.getAssociatedTag(this.state.page, this.props.ruleId, this.state.association)
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
        addingTags: emptyList()
      }, () => {
        that.getAssociatedTag();
      })
    }
  },
  componentWillUnmount: function() {
    VEEStore.removeTagChangeListener(this._onChange);
  },
  render: function() {
    var isView = this.props.formStatus === formStatus.VIEW;
    var loading = <div style={{
      display: 'flex',
      flex: 1,
      'alignItems': 'center',
      'justifyContent': 'center'
    }}>
            <CircularProgress  mode="indeterminate" size={2} />
          </div>;
    return (
      <div className="pop-manage-detail-content" style={{
        display: 'flex'
      }}>
        {this.state.isLoading ? loading : (isView ? this._renderDisplayTag() : this._renderSelectTag())  }
      </div>
      )
  },

});
module.exports = MonitorTag;
