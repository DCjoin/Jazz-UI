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
   if(this.state.open) {
        mainpanel=<div style={{display:'flex',width:'320px'}}> <DataSelectMainPanel linkFrom={this.props.linkFrom}/></div>;
      }
      else{
        mainpanel=<div style={{display:'none'}}> <DataSelectMainPanel linkFrom={this.props.linkFrom}/></div>;

      }
    //  if(this.state.open) mainpanel=<DataSelectMainPanel linkFrom={this.props.linkFrom}/>;
        var buttonStyle = {

          float:'right',
          minWidth:'36px',
          height:'36px',
        //  border:'solid 2px #efefef',
          verticalAlign:'middle',
          marginTop:'10px'
        },
        iconStyle={
          fontSize:'36px'
        };

      return(
        <div className="jazz-dataselectpanel">
            <FlatButton   style={buttonStyle} onClick={this._onToggle}>
              <FontIcon className="icon-taglist-fold" style={iconStyle}/>
            </FlatButton>
          {mainpanel}

        </div>
      )
    }
});
module.exports = DataSelectPanel;
