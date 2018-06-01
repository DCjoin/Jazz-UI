'use strict';

import React from 'react';
import { Checkbox, FontIcon } from 'material-ui';
import classNames from 'classnames';
import ReportStore from 'stores/KPI/ReportStore.jsx';
var createReactClass = require('create-react-class');

let TagItem = createReactClass({
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
      fontSize: '16px'
    };
    var checkBox = null,
      deleteButton = null,
      displayIndex = null,
      hierarchyName=null;
    if (this.props.leftPanel) {
      checkBox = <div><Checkbox checked={me.props.checked} onCheck={me._onTagItemChecked} disabled={me.props.disabled}></Checkbox></div>;
    } else {
      if (!me.props.disabled) {
        deleteButton = <div className="jazz-kpi-tag-deleteBtn"><FontIcon className="icon-clean" hoverColor='#6b6b6b' color="#939796" onClick={me._onTagItemUnselected} style={cleanIconStyle}></FontIcon></div>;
      }
      displayIndex = <div>{(me.props.index < 9 ? '0' : '') + (me.props.index + 1)}</div>;
      let name=ReportStore.getHierarchyName(this.props.tag);
      hierarchyName=<div title={name}>{name}</div>
    }

    return (
      <div data-idx={me.props.index} className={classNames(
        {
          'jazz-report-tag-item-left': me.props.leftPanel,
          'jazz-report-tag-item-right': !me.props.leftPanel
        }
      )}
      style={{fontSize:'14px',color:"#626469"}}>
        {checkBox}
        {displayIndex}
        <div title={me.props.name} >{me.props.name}</div>
        {hierarchyName}
        {deleteButton}
      </div>
      );
  }
});

module.exports = TagItem;
