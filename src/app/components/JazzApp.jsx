'use strict';

import React from 'react';
import Router from 'react-router';
import MainMenu from './MainMenu.jsx';


import keyMirror from   'keymirror';

let { Route, DefaultRoute, RouteHandler, Link, Navigation, State } = Router;

let JazzApp = React.createClass({
    mixins:[Navigation,State],
    childContextTypes:{
        muiTheme: React.PropTypes.object.isRequired
    },
    getChildContext() {
        return {
            muiTheme: this.props.muiTheme
        };
    },
    _showLoading:function(argument) {
        this.setState({loading:true},function (argument) {
            this.refs.ajax._show();
        });
    },
    _hideLoading:function(argument) {
        this.refs.ajax._hide();
    },
    _showError:function(msg) {
        this.setState({loading:true},function (argument) {
            this.refs.ajax._error(msg);
        });
    },
    componentDidMount: function() {
        var params = this.getParams();
        var lang = params.lang;
        var query = this.getQuery();
        var routes = this.getRoutes();
        var me = this;
        var afterLoadLang = function(b) {
            window.I18N=b;
            me.replaceWith('main',{lang:lang});

            //me.transitionTo('main',{lang:lang});
        };

        if(!lang){
            lang = window.navigator.language.toLowerCase();
            //this.setState({shouldRender : true});
            this.replaceWith('app',{lang:lang});
        }

        if(lang.toLowerCase() == 'en-us'){
            require(['../lang/zh-cn.js'],afterLoadLang);//should be changed when support english
        }
        else{
            require(['../lang/zh-cn.js'],afterLoadLang);
        }
    },
    getInitialState: function() {
        return {
            shouldRender:false,
            loading:false
        };
    },
    render: function () {
        // if(!this.state.shouldRender){
        //     return (<div><RouteHandler {...this.props} ajax={this.state.ajaxCommon}  /></div>);
        // }
        var loading = null;
        if(this.state.loading){
            loading = '';//(<AjaxDialog ref="ajax" />);
        }

        return (
          <div className="jazz-app">
              <RouteHandler {...this.props} showLoading={this._showLoading} hideLoading={this._hideLoading} showError={this._showError} />
              {loading}
          </div>
        );
    }
});

module.exports = JazzApp;
