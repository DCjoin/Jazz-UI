'use strict';
import React from "react";
import { CircularProgress } from 'material-ui';
import Item from '../../../controls/SelectableItem.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import LeftPanel from './TagList.jsx';
import RightPanel from './TagNode.jsx';
import TagStore from '../../../stores/customrSetting/TagStore.jsx';
import TagAction from '../../../actions/customrSetting/TagAction.jsx';


let Tag = React.createClass({
  getInitialState: function() {
    return {
      isLoading: true,
      formStatus: formStatus.VIEW
    };
  },
  componentDidMount: function() {},
  componentWillUnMount: function() {},
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidUpdate: function() {
    if (window.lastLanguage !== window.currentLanguage) {
      document.title = I18N.MainMenu.CustomerSetting;
      window.lastLanguage = window.currentLanguage;
    }
  },
  render() {
    var me = this;
    if (me.state.isLoading) {
      return (<div className='jazz-tag-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
    } else {
      return (
        <div style={{
          display: 'flex',
          flex: 1
        }}>
          </div>
        );
    }
  },
});

module.exports = Tag;
