'use strict';

import React from "react";
import { Checkbox } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import MonitorTag from './MonitorTag.jsx';

var TagFormula = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    mergeTag: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  _renderFormula: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag;
    var fomulaProps = {
      ref: 'fomula',
      isViewStatus: isView,
      defaultValue: selectedTag.get('Formula'),
      isRequired: true,
      multiLine: true,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Formula"
        });
      }
    };
    return (<div className={"jazz-tag-formula-content-top"}>
    <div>{I18N.Setting.Tag.Formula}</div>
    <div className={"jazz-tag-formula-content-input"}>
      <ViewableTextField {...fomulaProps}/>
    </div>
  </div>);
  },
  _renderTable: function() {
    var table = null;
    if (this.props.selectedTag.get('Formula') === '') {
      table = <div>{I18N.Setting.Tag.FormulaText}</div>;
    } else if (!this.props.isView) {
      table = <MonitorTag tagId={this.props.selectedTag.get('Id')}/>;
    }
    return table;
  },

  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var formula = this._renderFormula();
    return (
      <div className={"jazz-tag-formula-content"}>
        {formula}
      </div>
      );
  },
});

module.exports = TagFormula;
