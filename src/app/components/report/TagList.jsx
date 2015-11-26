'use strict';

import React from 'react';
import { CircularProgress, Checkbox } from 'material-ui';
import TagItem from './TagItem.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


let TagList = React.createClass({
  getInitialState: function() {
    return {
      checked: false
    };
  },
  _getCheckStatus: function(id) {
    if (!this.props.leftPanel) {
      return null;
    } else {
      var tagItem = null;
      var selectedTagList = this.props.selectedTagList;
      tagItem = selectedTagList.find((item) => {
        if (id === item.get('Id')) {
          return true;
        }
      });
      if (tagItem) {
        return true;
      } else {
        return false;
      }
    }
  },


  componentDidMount: function() {},
  componentWillUnmount: function() {},
  render() {
    let me = this;
    if (me.props.isLoading === null) {
      return null;
    }
    let tagList = me.props.tagList;
    let tagItems = null;
    if (tagList && tagList.size !== 0) {
      tagItems = tagList.map(function(item) {
        let props = {
          id: item.get('Id'),
          name: item.get('Name'),
          code: item.get('Code'),
          commodityId: item.get('CommodityId'),
          checked: me._getCheckStatus(item.get('Id')),
          onItemUnselected: me._onTagItemUnselected,
          onItemSelected: me._onTagItemSelected,
          leftPanel: me.props.leftPanel
        };
        return (
          <TagItem {...props}></TagItem>
          );
      });
    }
    var displayDom = null;
    if (this.props.isLoading) {
      displayDom = <div style={{
        margin: 'auto',
        width: '100px'
      }}>
            <CircularProgress  mode="indeterminate" size={1} />
          </div>;
    } else {
      displayDom = <div>
          {tagItems}
        </div>;
    }
    var checkAllButton = null;
    if (this.props.leftPanel) {
      checkAllButton = <Checkbox checked={this.state.checked} onCheck={this._onCheckAll}/>;
    }
    return (
      <div>
        <div style={{
        display: 'flex',
        'flex-direction': 'row'
      }}>
          <div style={{
        width: '40px'
      }}>{checkAllButton}</div>
          <div style={{
        width: '100px'
      }}>{I18N.Common.Glossary.Name}</div>
          <div style={{
        width: '100px'
      }}>{I18N.Common.Glossary.Code}</div>
          <div style={{
        width: '100px'
      }}>{I18N.Common.Glossary.Commodity}</div>
        </div>
        {displayDom}
      </div>
      );

  }
});

module.exports = TagList;
