'use strict';
import React from "react";


let BlankPage = React.createClass({
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
