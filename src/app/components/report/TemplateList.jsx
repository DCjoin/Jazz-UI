'use strict';

import React from 'react';
import TemplateItem from './TemplateItem.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


let TemplateList = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  render() {
    let me = this;
    let templateList = this.props.templateList;
    let templateItems = null;
    if (templateList && templateList.size !== 0) {
      templateItems = templateList.map(function(item) {
        let props = {
          id: item.get('Id'),
          name: item.get('Name'),
          createUser: item.get('CreateUser'),
          createTime: item.get('CreateTime'),
          email: item.get('Email'),
          roleName: item.get('RoleName'),
          telephone: item.get('Telephone'),
          isReference: item.get('IsReference')
        };
        return (
          <TemplateItem {...props}></TemplateItem>
          );
      });
    }

    return (
      <div>
        {templateItems}
      </div>
      );
  }
});

module.exports = TemplateList;
