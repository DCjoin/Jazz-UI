'use strict';

import React from 'react';
import MainAppBar from './MainAppBar.jsx';
import classNames from 'classnames';

var SelectCustomer = React.createClass({
    _onClose() {
        this.props.close();
    },
    render: function() {
        var closeButton = (
            <em className="icon-close pop-close-overlay-icon" onClick={this._onClose} style={{
                margin: -10,
                padding: 10,
                position: 'absolute',
                zIndex: 100,
                top: '30px',
                right: '30px'
            }}></em>
        );
        return (
            <div>
                <div className="jazz-selectbg" ></div>
                {closeButton}
            </div>

        );
    }
});

module.exports = SelectCustomer;
