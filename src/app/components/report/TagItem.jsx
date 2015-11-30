'use strict';

import React from 'react';
import { Checkbox, FontIcon } from 'material-ui';
import CommonFuns from '../../util/Util.jsx';
import classNames from 'classnames';


let TagItem = React.createClass({
  getInitialState: function() {
    return {

    };
  },
  _onTagItemChecked: function(e, checked) {
    if (checked) {
      if (this.props.onTagItemSelected) {
        this.props.onTagItemSelected(this.props.id);
      }
    } else {
      if (this.props.onTagItemUnselected) {
        this.props.onTagItemUnselected(this.props.id);
      }
    }
  },
  _onTagItemUnselected: function() {
    if (this.props.onTagItemUnselected) {
      this.props.onTagItemUnselected(this.props.id);
    }
  },

  render() {
    var me = this;
    var cleanIconStyle = {
      marginTop: '3px',
      fontSize: '16px'
    };
    var checkBox = null,
      deleteButton = null,
      displayIndex = null;
    if (this.props.leftPanel) {
      checkBox = <div style={{
        width: '40px'
      }}><Checkbox checked={me.props.checked} onCheck={me._onTagItemChecked} disabled={me.props.disabled}></Checkbox></div>;
    } else {
      if (!me.props.disabled) {
        deleteButton = <div style={{
          width: '20px'
        }}><FontIcon className="icon-clean" hoverColor='#6b6b6b' color="#939796" onClick={me._onTagItemUnselected} style={cleanIconStyle}></FontIcon></div>;
      }
      displayIndex = <div style={{
        width: '40px'
      }}>{me.props.index + 1}</div>;
    }

    return (
      <div style={{
        display: 'flex',
        'flex-direction': 'row'
      }}>
        {checkBox}
        {displayIndex}
        <div style={{
        width: '110px'
      }}>{me.props.name}</div>
        <div style={{
        width: '110px'
      }}>{me.props.code}</div>
        <div style={{
        width: '60px'
      }}>{CommonFuns.getCommodityById(me.props.commodityId).Comment}</div>
        {deleteButton}
      </div>
      );
  }
});

module.exports = TagItem;
