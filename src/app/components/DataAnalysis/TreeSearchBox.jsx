'use strict';
import React from "react";
import ReactDOM from 'react-dom';
import { FontIcon, TextField } from 'material-ui';
// import Search from './FolderSearchPaper.jsx';
import FolderStore from 'stores/FolderStore.jsx';

import Immutable from 'immutable';

const TreeSearchBox = React.createClass({
  propTypes: {
    onSearchClick: React.PropTypes.func.isRequired,
  },
  _onSearchClick: function() {
    // ReactDOM.findDOMNode(this.refs.searchIcon).style.display = 'none';
    this.setState({
        showSearchIcon: false,      
    });
    if (this.state.searchValue) {
      this.setState({
        showPaper: true,
      });
    }
  },
  _onSearchChange: function(e) {
    var value = e.target.value;

    if (value) {
      // ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'block';
      this.setState({
        showPaper: true,
        searchValue: value
      });
    } else {
      // ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'none';
      this.setState({
        showPaper: false,
        searchValue:''
      });
    }
  },
  _onCleanButtonClick: function() {
    // ReactDOM.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    this.setState({
      showPaper: false,
      searchValue:''
    });
  },
  _onSearchBlur: function(e) {
    if (!e.target.value) {
      this.setState({
        showSearchIcon: true
      });
      // ReactDOM.findDOMNode(this.refs.searchIcon).style.display = 'block';
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
      showSearchIcon: true,
      searchValue: ''
    };
  },
  render: function() {
    var searchIconStyle = {
        fontSize: '14px',
      },
      cleanIconStyle = {
        fontSize: '16px',
        marginRight: 5
      },
      textFieldStyle = {
        flex: 1,
        height: 24
      };
    var searchPaper;
    // if (this.state.showPaper) {
    //   var tree = FolderStore.getFolderTree();
    //   var searchProps = {
    //     allNode: tree.toJSON(),
    //     onSearchNodeClick: this._onSearchNodeClick,
    //     searchValue: this.state.searchValue,
    //     handleClickAway: this._handleClickAway
    //   };
    //   searchPaper = <Search {...searchProps}/>;
    // }

    return (
      <div>
        <label className='jazz-new-folder-leftpanel-searchbox' onBlur={this._onSearchBlur}>
            {this.state.showSearchIcon && <FontIcon className='icon-search' style={searchIconStyle} ref='searchIcon'/>}
            <TextField underlineShow={false} style={textFieldStyle} ref="searchText"  value={this.state.searchValue} onClick={this._onSearchClick} onChange={this._onSearchChange}/>
            {this.state.searchValue && <FontIcon className='icon-clean' style={cleanIconStyle} hoverColor='#6b6b6b' color='#939796' ref='cleanIcon' onClick={this._onCleanButtonClick}/>}
        </label>
        {searchPaper}
      </div>

      )
  }

});

module.exports = TreeSearchBox;