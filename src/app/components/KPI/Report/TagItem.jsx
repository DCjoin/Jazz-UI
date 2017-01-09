'use strict';

import React from 'react';
import { Checkbox, FontIcon } from 'material-ui';
import classNames from 'classnames';
import ReportStore from 'stores/KPI/ReportStore.jsx';


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
        deleteButton = <div><FontIcon className="icon-clean" hoverColor='#6b6b6b' color="#939796" onClick={me._onTagItemUnselected} style={cleanIconStyle}></FontIcon></div>;
      }
      displayIndex = <div>{me.props.index + 1}</div>;
      let name=ReportStore.getHierarchyNameByTagId(this.props.id);
      hierarchyName=<div title={name}>{name}</div>
    }

    return (
      <div className={classNames(
        {
          'jazz-report-tag-item-left': me.props.leftPanel,
          'jazz-report-tag-item-right': !me.props.leftPanel
        }
      )}>
        {checkBox}
        {displayIndex}
        <div title={me.props.name}>{me.props.name}</div>
        {hierarchyName}
        {deleteButton}
      </div>
      );
  }
});

module.exports = TagItem;
