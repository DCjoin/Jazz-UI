'use strict';
import React from "react";
import ReactDOM from 'react-dom';
import { FontIcon, TextField } from 'material-ui';
import Search from './FolderSearchPaper.jsx';
import FolderStore from '../../stores/FolderStore.jsx';

import Immutable from 'immutable';

var FolderSearchBox = React.createClass({
  propTypes: {
    onSearchClick: React.PropTypes.func.isRequired,
  },
  _onSearchClick: function() {
    ReactDOM.findDOMNode(this.refs.searchIcon).style.display = 'none';
    if (this.state.searchValue) {
      this.setState({
        showPaper: true,
      });
    }
  },
  _onSearchChange: function(e) {
    var value = e.target.value;

    if (value) {
      ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'block';
      this.setState({
        showPaper: true,
        searchValue: value
      });
    } else {
      ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'none';
      this.setState({
        showPaper: false,
        searchValue:''
      });
    }
  },
  _onCleanButtonClick: function() {
    ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    this.setState({
      showPaper: false,
      searchValue:''
    });
  },
  _onSearchBlur: function(e) {
    if (!e.target.value) {
      ReactDOM.findDOMNode(this.refs.searchIcon).style.display = 'block';
    }
  },
  _onSearchNodeClick: function(node) {
    this.props.onSearchClick(Immutable.fromJS(node));
    //this.refs.searchText.setValue(node.Name);
    this.setState({
      showPaper: false,
      searchValue:node.Name
    });
  },
  _handleClickAway: function() {
    this.setState({
      showPaper: false
    });
  },
  getInitialState: function() {
    return {
      showPaper: false,
      searchValue: ''
    };
  },
  render: function() {
    var searchIconStyle = {
        fontSize: '14px',
        marginLeft: '5px'
      },
      cleanIconStyle = {
        fontSize: '16px',
        display: 'none',
        marginRight: '5px'
      },
      textFieldStyle = {
        flex: '1',
        height: '24px'
      };
    var searchPaper;
    if (this.state.showPaper) {
      var tree = FolderStore.getFolderTree();
      var searchProps = {
        allNode: tree.toJSON(),
        onSearchNodeClick: this._onSearchNodeClick,
        searchValue: this.state.searchValue,
        handleClickAway: this._handleClickAway
      };
      searchPaper = <Search {...searchProps}/>;
    }
    ;

    return (
      <div>
        <label className="jazz-folder-leftpanel-searchbox" onBlur={this._onSearchBlur}>
            <FontIcon className="icon-search" color="#ffffff" style={searchIconStyle} ref="searchIcon"/>
            <TextField style={textFieldStyle} className="input" ref="searchText"  value={this.state.searchValue} onClick={this._onSearchClick} onChange={this._onSearchChange}/>
            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
        </label>
        {searchPaper}
      </div>

      )
  }

});
module.exports = FolderSearchBox;
