'use strict';

import React from "react";
import classnames from "classnames";
import { CircularProgress, Checkbox, Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter } from 'material-ui';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import VEEAction from '../../../actions/customerSetting/VEEAction.jsx';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import Pagination from '../../../controls/paging/Pagination.jsx';

var MonitorTag = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.bool,
    ruleId: React.PropTypes.number,
  },
  getInitialState: function() {
    return ({
      page: 1,
      taglist: null,
      selectedTags: [],
      isLoading: true,
      association: 1
    })
  },
  _onChange: function() {
    this.setState({
      taglist: VEEStore.getTagList(),
      isLoading: false
    })
  },
  getAssociatedTag: function() {
    VEEAction.getAssociatedTag(this.state.page, this.props.ruleId, this.state.association)
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
    console.log('_onDeleteTag');
  },
  _renderDisplayTag: function() {
    var commodities = window.allCommodities,
      uoms = window.uoms,
      that = this;
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
            <div className='jazz-vee-monitor-tag-content-item'>{tag.get('Name')}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{tag.get('Code')}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findCommodityById(tag.get('CommodityId'))}</div>
            <div className='jazz-vee-monitor-tag-content-item'>{VEEStore.findUOMById(tag.get('UomId'))}</div>
            <div className='jazz-vee-monitor-tag-content-operation-item' onClick={that._onDeleteTag}>{I18N.Common.Button.Delete}</div>
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
        association: (nextProps.formStatus === formStatus.VIEW ? 1 : 4)
      }, () => {
        that.getAssociatedTag();
      })
    // if (nextProps.formStatus === formStatus.VIEW) {
    //   VEEAction.getAssociatedTag(this.state.page, this.props.ruleId, 1)
    // } else {
    //   VEEAction.getAssociatedTag(this.state.page, this.props.ruleId, 4)
    // }
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
