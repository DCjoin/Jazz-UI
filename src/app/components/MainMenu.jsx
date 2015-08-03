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
            if(item.disabled){
              return (<span>{item.title}</span>);
            }
            return (<Link to={item.name} params={params}>{item.title}</Link>);
        });

        return (
            <div className="jazz-mainmenu">
                <div className="jazz-logo">
                  <div className='jazz_logo_img' style={{backgroundImage:'url(' + this.props.logoUrl +')' }}></div>  
                </div>
                <div className="jazz-menu">
                    {links}

                </div>
            </div>

        );
    }

});

module.exports = MainMenu;
