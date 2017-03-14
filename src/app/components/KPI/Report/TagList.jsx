'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { CircularProgress} from 'material-ui';
import TagItem from './TagItem.jsx';
import dragula from 'react-dragula';
import 'react-dragula/dist/dragula.min.css';

let _drake = null,
_cancelDrop = false;

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

  componentDidUpdate: function(prevProps) {
    if( !this.props.leftPanel ) {
      if( prevProps.isLoading && !this.props.isLoading ) {        
        var container = ReactDom.findDOMNode(this).querySelector('#dragula_container');
        if( container ) {
          _drake = dragula([container], {revertOnSpill: true});
          _drake.on('dragend', (el) => {
            if( _cancelDrop ) {
              _cancelDrop = false;
            } else {
              let toIdx = 0,
              fromIdx = el.dataset['idx'];
              if(el.previousElementSibling) {
                toIdx = el.previousElementSibling.dataset['idx'];
              }
              this.props.onChangeOrder(fromIdx*1, toIdx*1);
            }
          });
          _drake.on('cancel', () => {
            _cancelDrop = true;
          });
        }
      }
    }
  },
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
          key: item.get('Id'),
          id: item.get('Id'),
          name: item.get('Name'),
          code: item.get('Code'),
          disabled: me.props.disabled,
          checked: me._getCheckStatus(item.get('Id')),
          onTagItemUnselected: me._onTagItemUnselected,
          onTagItemSelected: me._onTagItemSelected,
          leftPanel: me.props.leftPanel,
          index: i,
          tag:item
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
      displayDom = <div id='dragula_container'>
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
