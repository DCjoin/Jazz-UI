'use strict';
import React from "react";
import classnames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper} from 'material-ui';
import HierarchyTree from './HierarchyTree.jsx';
let HierarchyButton=React.createClass({
    getInitialState: function() {
      return {
        open: false
      };
    },
    _onShowPaper:function(){
      this.setState({open:!this.state.open});
    },
    render:function(){

      var buttonStyle = {
               height:'48px',
           };
      var classes = {
            'jazz-hierarchybutton': true,
            'mui-open': this.state.open
      };


      var dropdownPaper;
      if(this.state.open) dropdownPaper=<HierarchyTree/>;
      return(
            <div className='jazz-hierarchybutton' style={{display:'inline-block'}}>
              <FlatButton style={buttonStyle} onClick={this._onShowPaper}>
                  <FontIcon className="fa fa-th-large" />
                  <span className="mui-flat-button-label" >请选择层级节点</span>
              </FlatButton>
              {dropdownPaper}

            </div>

      )
    }
});

module.exports = HierarchyButton;
