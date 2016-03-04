'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress } from 'material-ui';
import { formStatus } from '../../../constants/FormStatus.jsx';
import CommonFuns from '../../../util/Util.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';

var MonitorTag = React.createClass({
  propTypes: {
    tagId: React.PropTypes.number,
  },
  getInitialState: function() {
    return ({
      page: 1,
      isLoading: true
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
  _renderDisplayTag: function() {
    var that = this;
    var pagingPropTypes = {
      curPageNum: this.state.page,
      totalPageNum: this.state.total,
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
            <div className='jazz-vee-monitor-tag-content-item'>{CommonFuns.getCommodityById(tag.get('CommodityId'))}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{CommonFuns.getUomById(tag.get('UomId'))}</div>
            <div className='jazz-vee-monitor-tag-content-operation-item'>{tag.get('Type') === 1 ? I18N.Setting.Tag.PTagManagement : I18N.Setting.Tag.VTagManagement}</div>
      </div>
        );
      });
      return list;
    };
    if (that.state.taglist.size === 0) {
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
          <div className='jazz-vee-monitor-tag'>
            <div className='jazz-vee-monitor-tag-content'>
              {getTableBody()}
            </div>
            <div className='jazz-vee-monitor-tag-paging'>
              <Pagination {...pagingPropTypes}/>
            </div>
          </div>
        </div>
        );
    }
  },
  getTagList: function() {
    TagAction.getTagList(this.state.page, this.props.tagId);
  },
  componentDidMount: function() {
    TagStore.addAllTagChangeListener(this._onChange);
    this.getTagList();
  },
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {
    TagStore.removeAllTagChangeListener(this._onChange);
  },
  render: function() {
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
        {this.state.isLoading ? loading : this._renderDisplayTag() }
      </div>
      );
  },

});
module.exports = MonitorTag;
