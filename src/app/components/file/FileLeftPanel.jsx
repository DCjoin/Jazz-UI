'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {IconButton,IconMenu,FontIcon,FlatButton} from 'material-ui';
import SearchBox from './FileSearchBox.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');

var PanelContainer = React.createClass({

  _onItemTouchTap:function(e, item){
    //item.ref="Menu1"...
  },
  render:function(){
    //style
    var menuStyle={
          marginTop:"35px",
        },
        iconStyle={
          paddingTop:'0px'
        };
    //icon
    var IconButtonElement=<IconButton iconClassName="icon-log"/>,
        menuIcon=<FontIcon className="icon-language" style={iconStyle}/>;
    //props
    var iconMenuProps={
        iconButtonElement:IconButtonElement,
        openDirection:"bottom-right",
        menuStyle:menuStyle
        };

    return(
      <div className="jazz-file-leftpanel-container">

        <div className="jazz-file-leftpanel-header">
          <div className="newfile">
            <IconButton iconClassName="icon-column-fold"/>
          </div>
          <div className="newchart">
            <IconMenu {...iconMenuProps} onItemTouchTap={this._onItemTouchTap}>
               <MenuItem ref="Menu1" primaryText={I18N.File.NewChart.Menu1} leftIcon={menuIcon}/>
               <MenuItem ref="Menu2" primaryText={I18N.File.NewChart.Menu2} leftIcon={menuIcon}/>
               <MenuItem ref="Menu3" primaryText={I18N.File.NewChart.Menu3} leftIcon={menuIcon}/>
               <MenuItem ref="Menu4" primaryText={I18N.File.NewChart.Menu4} leftIcon={menuIcon}/>
               <MenuItem ref="Menu5" primaryText={I18N.File.NewChart.Menu5} leftIcon={menuIcon}/>
            </IconMenu>
          </div>
        </div>

        <div className="jazz-file-leftpanel-search">
          <SearchBox></SearchBox>
        </div>

      </div>
    )
  }
});
var FileLeftPanel = React.createClass({
  propTypes: {
    isShow:React.PropTypes.bool,
    onToggle:React.PropTypes.func,
},
  _onToggle:function(){
    this.props.onToggle();
    this.setState({
        isShow:!this.state.isShow
    })
  },
  getInitialState: function() {
      return {
        isShow: this.props.isShow
      };
    },
  componentWillReceiveProps:function(nextProps){
      this.setState({
        isShow: nextProps.isShow
      })
    },
  render:function(){
    var buttonStyle = {
      minWidth:'36px',
      width:'36px',
      height:'36px',
      margin:'300px -36px 0 0 ',
    },
    iconStyle={
      fontSize:'36px'
    };
    var panel=(this.state.isShow?(<div style={{display:'flex'}}><PanelContainer></PanelContainer> </div>)
                    :(<div style={{display:'none'}}><PanelContainer></PanelContainer></div>)
              );
    return(
      <div style={{display:'flex'}}>
        {panel}
        <FlatButton   style={buttonStyle} onClick={this._onToggle}>
          <FontIcon className="icon-taglist-fold" style={iconStyle}/>
        </FlatButton>
      </div>
    )
  }
});

module.exports = FileLeftPanel;
