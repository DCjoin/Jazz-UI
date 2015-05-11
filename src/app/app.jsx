'use strict';

import React from 'react';

import Router  from 'react-router';
import injectTapEventPlugin from "react-tap-event-plugin";
import App from './components/App.jsx';

import './less/main.less';

let { Route, DefaultRoute, Redirect, RouteHandler, Link,Navigation,State } = Router;
//import {Styles} from 'material-ui';
//let {ThemeManager} = Styles;

//var theme = new ThemeManager();



//Theme.set({});

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();






var routes = (
    <Route name="app" path="/:lang?" handler={App}>

   </Route>
);



Router.run(routes, Router.HistoryLocation, (Root, state) => {
    //var muiTheme=theme.getCurrentTheme();
    var muiTheme=null;
    React.render(<Root {...state} muiTheme={muiTheme} />, document.getElementById('emopapp'));

});
