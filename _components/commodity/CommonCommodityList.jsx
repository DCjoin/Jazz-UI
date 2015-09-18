'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress,Checkbox} from 'material-ui';
import CommodityStore from '../../stores/CommodityStore.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import Immutable from 'immutable';

var CommonCommodityList = React.createClass({

  mixins:[Navigation,State],
  propTypes: {
    checkedCommodityList: React.PropTypes.object,
  },
  _onCommodityListChange:function(){
    this.setState({
      commdityList:CommodityStore.getCommodityList(),
      isLoading:false
    });
  },
  _loadCommodityList:function(){
    var hierId=CommodityStore.getCurrentHierarchyId(),
        dimId=!!CommodityStore.getCurrentDimNode()?CommodityStore.getCurrentDimNode().dimId:null;

        if(dimId!==null){
          CommodityAction.loadCommodityList(null,dimId);
        }
        else{
          CommodityAction.loadCommodityList(hierId,null);
        }
        this.setState({
          isLoading:true
        });
  },
  isCommoditySingleItemSelected:function(commodityId){
      let id=commodityId;
      let index=this.state.commodityStatus.findIndex((item)=>item.get('Id')==id);
      if(index>=0){
        return true;
      }
      else {
        return false;
      }

  },
  _onCheck:function(e, checked){
    CommodityAction.setCommoditySelectStatus(e.target.value,e.target.name,checked);
  },
  _onCommodityStatusChange:function(){
    this.setState({
      commodityStatus:CommodityStore.getCommodityStatus()
    });
  },
  getInitialState:function(){
    return{
      isLoading:false,
      commdityList:[],
      commodityStatus:(this.props.checkedCommodityList)?this.props.checkedCommodityList:Immutable.List([])
    };
  },
  componentWillReceiveProps:function(){
    this._loadCommodityList();
    this.setState({
      commodityStatus:CommodityStore.getCommodityStatus()
    });
  },
  componentDidMount: function() {
    CommodityStore.addCommoddityListListener(this._onCommodityListChange);
    CommodityStore.addCommoddityStautsListener(this._onCommodityStatusChange);

    this._loadCommodityList();
  },

  componentWillUnmount: function() {
    CommodityStore.removeCommoddityListListener(this._onCommodityListChange);
    CommodityStore.removeCommoddityStautsListener(this._onCommodityStatusChange);
  },
  render:function(){
    var that=this;
    var status=this.isCommoditySingleItemSelected(-1);
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
    var list=[];
    if(this.state.commdityList.length!==0){
      list.push(
        <Checkbox label={I18N.Commodity.Overview}
                  value={-1}
                  name={I18N.Commodity.Overview}
                  checked={status}
                  onCheck={this._onCheck}
                  style={style}
                  iconStyle={iconStyle}
                  labelStyle={labelStyle}/>
      );
    }

    this.state.commdityList.forEach(function(element){
      status=that.isCommoditySingleItemSelected(element.Id);
      list.push(
        <Checkbox label={element.Comment}
                  value={element.Id}
                  name={element.Comment}
                  checked={status}
                  onCheck={that._onCheck}
                  style={style}
                  iconStyle={iconStyle}
                  labelStyle={labelStyle}/>
      )
    })

    if(this.state.isLoading){
      return(
        <CircularProgress  mode="indeterminate" size={1} />
      )
    }
    else {
      return(
        <div>
            {list}
        </div>

      )
    }
  }
});

module.exports = CommonCommodityList;
