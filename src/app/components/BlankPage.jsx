'use strict';
import React from "react";
var createReactClass = require('create-react-class');


let BlankPage = createReactClass({
  render() {

    return (
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'auto',
        alignItems: "center",
        justifyContent: "center"
      }}>
      {I18N.BlankPage}
        </div>
      );
  },
});

module.exports = BlankPage;
