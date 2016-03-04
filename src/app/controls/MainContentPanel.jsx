'use strict';

import React from 'react';
import classNames from 'classnames';
import { FlatButton, FontIcon } from 'material-ui';
import OrigamiPanel from './OrigamiPanel.jsx';

let MainContentPanel = React.createClass({
  propTypes: {
    onToggle: React.PropTypes.func,
  },
  render: function() {
    var collapseButton = (
    <div className="fold-btn pop-framework-right-actionbar-top-fold-btn" style={{
      "color": "#939796"
    }}>
        <FontIcon className={classNames("icon", "icon-column-fold")} onClick={this.props.onToggle}/>
      </div>
    );
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }} className='jazz-content'>
      <div className="pop-framework-right-actionbar">
          <div className="pop-framework-right-actionbar-top">
            <OrigamiPanel />
            {collapseButton}
          </div>

      </div>
      {this.props.children}
    </div>
      )
  },
});
module.exports = MainContentPanel;
