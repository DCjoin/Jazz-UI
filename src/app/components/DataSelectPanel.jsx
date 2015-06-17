'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Classable} from 'material-ui';

import DataSelectMainPanel from './DataSelectMainPanel.jsx';

let DataSelectPanel=React.createClass({
    mixins:[Classable,Navigation,State],

    propTypes: {
      onButtonClick:React.PropTypes.func,
      linkFrom: React.PropTypes.string,
      defaultStatus:React.PropTypes.bool
    },
    _onToggle:function(){

      if(this.props.onButtonClick){
        this.props.onButtonClick();
      };

      this.setState({ open: !this.state.open });
      return this;
    },

    getInitialState: function() {
        return {
          open: false
        };
      },
    componentWillMount: function() {
        this.setState({
          open:this.props.defaultStatus
        })
      },


    render:function(){
      var mainpanel;
      if(this.state.open) mainpanel=<DataSelectMainPanel linkFrom={this.props.linkFrom}/>;
        var buttonStyle = {
          float:'right',
          width:'initial',
          height:'48px',
          border:'solid 2px gray',
          verticalAlign:'middle',
          marginTop:'250px'
             };
      return(
        <div className="jazz-dataselectpanel">

            <FlatButton   style={buttonStyle} onClick={this._onToggle}>
              <FontIcon className="fa fa-list" style={{color:'black'}}/>
            </FlatButton>
          {mainpanel}

        </div>
      )
    }
});
module.exports = DataSelectPanel;
