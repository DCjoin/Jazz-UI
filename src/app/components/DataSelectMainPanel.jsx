'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
var menuItems = [
   { payload: '1', text: '全部' },
   { payload: '2', text: '报警已配置' },
   { payload: '3', text: '基准值已配置' },
   { payload: '4', text: '未配置' },

];

let DataSelectMainPanel=React.createClass({
    mixins:[Navigation,State],


    render:function(){
      var buttonStyle = {
               height:'48px',
           };
      return(
        <div className="jazz-dataselectmainpanel">
          <div  style={{display:'flex','flex-flow':'row nowrap','align-items':'center'}}>
            <HierarchyButton />

            <FontIcon className="fa fa-minus "/>
            <FlatButton style={buttonStyle}>
              <div className="mui-flat-button-label" >全部维度</div>
            </FlatButton>
          </div>

          <div  style={{display:'inline-block','padding':'5px 0','border-width':'2px','border-style':'solid','border-color':'green transparent'}}>
            <label style={{display:'inline-block',width:'156px',height:'25px',border:'3px solid gray','border-radius':'20px','margin-top':'10px'}}>
             <img style={{float:'left'}} src={require('../less/images/search-input-search.png')}/>
             <input style={{width:'130px',height:'20px','background-color':'transparent',border:'transparent'}} placeholder="XX"/>
           </label>

           <DropDownMenu autoWidth={false} className="select-dropdownmenu" menuItems={menuItems} />

         </div>
      </div>
      )
    }
  });


  module.exports = DataSelectMainPanel;
