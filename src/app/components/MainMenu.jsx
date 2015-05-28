'use strict';

import React from 'react';
import { Link,Navigation,State,RouteHandler } from 'react-router';
import lang from '../lang/lang.jsx';

var f = lang.f;

var MainMenu = React.createClass({
    mixins:[Navigation,State],
    _onChange:function() {

    },
    render: function() {

        var params = this.getParams();
        var links = this.props.items.map(item=>{
            return (<Link to={item.name} params={params}>{item.title}</Link>);
        });

        return (
            <div className="pop-mainmenu" id="pop_mainmenu">
                <div className="pop-logo">
                    <img alt="logo" src={this.props.logoUrl}/>
                </div>
                <div className="pop-menu">
                    {links}

                </div>
            </div>

        );
    }

});

module.exports = MainMenu;
