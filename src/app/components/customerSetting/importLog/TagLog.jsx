'use strict';
import React from "react";
import { CircularProgress } from 'material-ui';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagLogList from './TagLogList.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';


var TagLog = React.createClass({
  getInitialState: function() {
    return {
      isLoading: true
    };
  },
  _onChange() {
    this.setState({
      tagLogList: TagStore.getTagLogList(),
      isLoading: false
    });
  },

  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidMount: function() {
    TagAction.getTagLogListByCustomerId();
    TagStore.addTagLogListChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    TagStore.removeTagLogListChangeListener(this._onChange);
  },

  render: function() {
    var templateContent = (this.state.isLoading ? <div style={{
      textAlign: 'center',
      marginTop: '400px'
    }}><CircularProgress  mode="indeterminate" size={80} /></div> : <TagLogList ref='tagLogList' tagLogList={this.state.tagLogList}/>);
    return (
      <div className="jazz-template-container">
        <div className="jazz-template-content">
          <div className="jazz-template-center">
            <div className="jazz-template-list">
              {templateContent}
            </div>
          </div>
        </div>
      </div>
      );
  }
});

module.exports = TagLog;
