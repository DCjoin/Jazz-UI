'use strict';

import React from "react";
import { Checkbox } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';

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
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag;

  },

  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    return (
      <div className={"jazz-tag-formula-content"}>
      </div>
      );
  },
});

module.exports = TagFormula;
