'use strict';

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';


var Test = React.createClass({

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
