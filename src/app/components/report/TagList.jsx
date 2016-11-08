'use strict';

import React from 'react';
import { CircularProgress, Checkbox } from 'material-ui';
import TagItem from './TagItem.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


let TagList = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  _getCheckStatus: function(id) {
    if (!this.props.leftPanel) {
      return null;
    } else {
      var tagItem = null;
      var selectedTagList = this.props.selectedTagList;
      if (selectedTagList === null || selectedTagList.size === 0) {
        return false;
      }
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
  _onTagItemSelected: function(id) {
    this.props.onTagItemSelected(id);
  },
  _onTagItemUnselected: function(id) {
    this.props.onTagItemUnselected(id);
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
      tagItems = tagList.map(function(item, i) {
        let props = {
          id: item.get('Id'),
          name: item.get('Name'),
          code: item.get('Code'),
          disabled: me.props.disabled,
          checked: me._getCheckStatus(item.get('Id')),
          onTagItemUnselected: me._onTagItemUnselected,
          onTagItemSelected: me._onTagItemSelected,
          leftPanel: me.props.leftPanel,
          index: i
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
            <CircularProgress  mode="indeterminate" size={80} />
          </div>;
    } else {
      displayDom = <div>
          {tagItems}
        </div>;
    }
    return (
      <div>
        {displayDom}
      </div>
      );

  }
});

module.exports = TagList;
