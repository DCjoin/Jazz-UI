'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Classable} from 'material-ui';
import PropTypes from 'prop-types';
import DataSelectMainPanel from './DataSelectMainPanel.jsx';
var createReactClass = require('create-react-class');
let DataSelectPanel=createReactClass({
    //mixins:[Classable,Navigation,State],

    propTypes: {
      onButtonClick:PropTypes.func,
      linkFrom: PropTypes.string,
      defaultStatus:PropTypes.bool,
      widgetType:PropTypes.string, //Energy,Unit,Ratio,Label
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
          open: this.props.defaultStatus
        };
      },
      /*
    componentWillReceiveProps: function(nextProps) {
        this.setState({
          open:nextProps.defaultStatus
        })
      },
*/

    render:function(){
      var mainpanel;
   if(this.state.open) {
        mainpanel=<div style={{display:'flex',width:'320px'}}> <DataSelectMainPanel linkFrom={this.props.linkFrom} widgetType={this.props.widgetType}/></div>;
      }
      else{
        mainpanel=<div style={{display:'none'}}> <DataSelectMainPanel linkFrom={this.props.linkFrom} widgetType={this.props.widgetType}/></div>;

      }
    //  if(this.state.open) mainpanel=<DataSelectMainPanel linkFrom={this.props.linkFrom}/>;
        var buttonStyle = {

          minWidth:'36px',
          width:'36px',
          height:'36px',
        //  border:'solid 2px #efefef',
          verticalAlign:'middle',
          margin:'10px 0 0 -36px',
        //  margin:'10px 0 0',
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
