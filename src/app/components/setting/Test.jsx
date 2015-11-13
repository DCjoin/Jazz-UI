'use strict';

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter } from 'material-ui';
import Header from '../../controls/HierAndDimHeader.jsx';
import SearchBar from '../../controls/SearchBar.jsx';


var Test = React.createClass({
  _onHierachyTreeClick: function() {},
  _onDimTreeClick: function() {},
  _onSearch: function() {},
  _onSearchCleanButtonClick: function() {},

  render: function() {
    return (
      <div className="jazz-dataselectmainpanel" >

          <div  className="header">
        <Header onHierachyTreeClick={this._onHierachyTreeClick} onDimTreeClick={this._onDimTreeClick}/>
      </div>
      <SearchBar onSearch={this._onSearch} onSearchCleanButtonClick={this._onSearchCleanButtonClick}/>
    </div>
      )
  }
});

module.exports = Test;
