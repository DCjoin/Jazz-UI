'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { FontIcon, TextField } from 'material-ui';

let SearchBar = React.createClass({

  propTypes: {
    onSearch: React.PropTypes.func,
    onSearchCleanButtonClick: React.PropTypes.func,
    hintText: React.PropTypes.string,
  },
  mixins: [Navigation, State],
  _onSearchBlur: function(e) {
    if (!e.target.value) {
      React.findDOMNode(this.refs.searchIcon).style.display = 'block';
    }
  },
  _onSearchClick: function() {
    React.findDOMNode(this.refs.searchIcon).style.display = 'none';
  },
  _onSearch: function(e) {
    var value = e.target.value;
    if (value) {
      React.findDOMNode(this.refs.cleanIcon).style.display = 'block';
    } else {
      React.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    }
    this.props.onSearch(value);
  },
  _onCleanButtonClick: function() {
    React.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    this.refs.searchText.setValue("");
    this.props.onSearchCleanButtonClick();
  },
  clearSearchText: function() {
    this.refs.searchText.setValue("");
  },
  displaySearchIcon: function() {
    React.findDOMNode(this.refs.cleanIcon).style.display = 'block';
  },
  render: function() {
    var searchIconStyle = {
        fontSize: '16px',
        marginLeft: '5px',
        marginTop: '3px'
      },
      cleanIconStyle = {
        marginTop: '3px',
        fontSize: '16px',
        display: 'none'
      },
      textFieldStyle = {
        flex: '1',
        height: '26px'
      },
      hintTextStyle = {
        bottom: '0px'
      };
    return (
      <div className="jazz-dataselectmainpanel filter">
        <label className="search" onBlur={this._onSearchBlur}>
        <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
        <TextField style={textFieldStyle} hintStyle={hintTextStyle} hintText={this.props.hintText} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch}/>
        <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
    </label>
      </div>

      );
  },
});
module.exports = SearchBar;
