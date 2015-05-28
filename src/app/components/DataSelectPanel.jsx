'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Classable} from 'material-ui';

import DataSelectMainPanel from './DataSelectMainPanel.jsx';

let DataSelectPanel=React.createClass({
    mixins:[Classable,Navigation,State],

    getInitialState: function() {
        return {
          open: false
        };
      },
    _onToggle:function(){
      this.setState({ open: !this.state.open });
      return this;
    },
    render:function(){
      var mainpanel;
      if(this.state.open) mainpanel=<DataSelectMainPanel />;

      return(
        <div className="jazz-dataselectpanel">
          <FlatButton className="jazz-dataselectpanel-button"  onClick={this._onToggle}>
            <FontIcon className="fa fa-list" style={{color:'black'}}/>
          </FlatButton>

          {mainpanel}

        </div>
      )
    }
});
module.exports = DataSelectPanel;
