import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import YearPicker from '../../controls/YearPicker.jsx';

let BaselineModify = React.createClass({
    mixins:[Navigation,State],
    getInitialState:function(){
			return {
        disable: true,
			}
		},

    handleCheck:function(e){
      console.log(e.target.value)
    },

    handleEdit: function(){
      this.setState({
        disable : false,
      });
      console.log("handle Edit");
		},

    handleSave: function(){
      //save
      console.log("handleSave");
      this.setState({
        disable : true,
      });
    },

    handleCancel: function(){
        console.log("handleCancel");
        this.setState({
        disable : true,
      });
    },

    showDialog: function(){
      console.log("showDialog");
      this.refs.baselineModifyDialog.show();
    },

    dismiss(){
        this.refs.baselineModifyDialog.dismiss();
    },

    onYearPickerSelected(yearDate){

    },

    loadDataByYear: function(year){

    },
    
    render: function () {
      let months =[
                   {LeftMonth:"一", LeftValue:'100',RightMonth:"二", RightValue:'200'},
                   {LeftMonth:"三", LeftValue:'300',RightMonth:"四",RightValue:'400'},
                   {LeftMonth:"五", LeftValue:'500',RightMonth:"六",RightValue:'600'},
                   {LeftMonth:"七", LeftValue:'700',RightMonth:"八",RightValue:'800'},
                   {LeftMonth:"九", LeftValue:'900',RightMonth:"十",RightValue:'1000'},
                   {LeftMonth:"十一", LeftValue:'1100',RightMonth:"十二",RightValue:'1200'}
                  ];
     let uom = '千瓦时';
     var status = this.state.disable;
      var monthItems = months.map(function(month) {
        let props = {
          line:month,
          uom:uom,
          disable:status
        };
        return (
          <MonthItem  {...props}/>
        );
      });

      return (
        <div title="基准值修改" ref="baselineModifyDialog">
          <div style={{width:'500px',display:'flex','flex-flow':'column'}} >
            <span>
              请选择配置年份进行编辑
               <YearPicker ref='yearSelector' onYearPickerSelected={this.onYearPickerSelected}/>;
              <br/>
              <br/>
            </span>
            <span>
              年度基准值
              <br/>
              年度 <input type="text" style={{width:'50px'}} value="100"  disabled={this.state.disable}/> 千瓦时
            </span>
            <br/>
            <span>
              月基准值
              <br/>
              {monthItems}
            </span>

            <button type="submit" hidden={!this.state.disable} style={{width:'50px'}} onClick={this.handleEdit}> 修正 </button>
            <span>
              <button type="submit" hidden={this.state.disable} style={{width:'50px'}} onClick={this.handleSave}> 保存 </button>
              <button type="submit" hidden={this.state.disable} style={{width:'50px'}} onClick={this.handleCancel}> 放弃 </button>
            </span>
          </div>
      </div>

      );
  }
});

    let MonthItem = React.createClass({


    	render() {
    		  let line = this.props.line;
          let Uom = this.props.uom;
          let disable = this.props.disable;
    		return (
          <table width="100%" border="1">

            <tr>
              <td align="left">
        				 <span style={{display:'inline-block', width:'30%'}} >{line.LeftMonth}月</span>
                 <span style={{display:'inline-block',width:'40%'}}>
                   <input style={{display:'inline-block',width:'100%'}} type="text" value={line.LeftValue}  disabled={disable}/>
                 </span>
                <span style={{display:'inline-block', width:'20%', 'marginLeft':'5%'}}>{Uom}</span>
              </td>
              <td align="right">
                 <span style={{display:'inline-block', width:'30%'}}>{line.RightMonth}月</span>
                 <span style={{display:'inline-block',width:'40%'}}>
                   <input type="text" style={{display:'inline-block',width:'100%'}} value={line.RightValue}  disabled={disable}/>
                 </span>
                <span style={{display:'inline-block', width:'20%', 'margin-left':'1%'}}>{Uom}</span>
              </td>
            </tr>
          </table>
    		);
    	}
    });

module.exports = BaselineModify;
