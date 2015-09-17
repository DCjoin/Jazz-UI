'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {RadioButton,RadioButtonGroup} from 'material-ui';
import CommodityStore from '../../../stores/CommodityStore.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';

var RankingCommodityList = React.createClass({

  propTypes: {
    ecType: React.PropTypes.string,
    checkedCommodity:React.PropTypes.object,
    commdityList:React.PropTypes.array,
  },

  getNamebyId:function(id){
    var comment=I18N.Commodity.Overview;
    var Id=id+'';
   this.props.commdityList.forEach(function(element){
     if(element.Id==Id){
       comment=element.Comment;
     }
   })
   return comment;
 },
  _onChange:function(event, selected){
    var name=this.getNamebyId(selected);
    CommodityAction.setRankingCommodity(selected,name);
  },


  render:function(){
    var that=this;
    //style
    var style={
      height:'46px',
      width:'320px',
      borderBottom:'1px solid #e4e7e6',
    },
      iconStyle={
        marginLeft:'10px',
        marginTop:'5px'
      },
      labelStyle={
        marginTop:'10px',
        marginLeft:'5px',
        fontSize:'16px',
        color:'#464949'
      };
    var content=[],
        defaultSelected=((!!this.props.checkedCommodity)?this.props.checkedCommodity.Id:null);
    if(this.props.ecType!=='Energy' && this.props.commdityList.length>0){
      content.push(
        <RadioButton value={-1} label={I18N.Commodity.Overview}
                      style={style} iconStyle={iconStyle} labelStyle={labelStyle}/>
      )
    };
    if(this.props.commdityList!==null){
      this.props.commdityList.forEach(function(element){
        content.push(
          <RadioButton value={element.Id} label={element.Comment}
                      style={style} iconStyle={iconStyle} labelStyle={labelStyle}/>
        )
      })
    }

    return(
       <RadioButtonGroup  defaultSelected={defaultSelected} onChange={this._onChange}>
         {content}
       </RadioButtonGroup>

    )
  }
});

module.exports = RankingCommodityList;
