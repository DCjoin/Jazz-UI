'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress,Checkbox} from 'material-ui';
import CommodityStore from '../../stores/CommodityStore.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import Immutable from 'immutable';

var CommonCommodityList = React.createClass({

  mixins:[Navigation,State],

  _onCommodityListChange:function(){
    this.setState({
      commdityList:CommodityStore.getCommodityList(),
      commodityStatus:CommodityStore.getCurrentHierIdCommodityStatus(),
      isLoading:false
    })
  },
  _loadCommodityList:function(){
    var hierId=CommodityStore.getCurrentHierarchyId(),
        dimId=CommodityStore.getCurrentDimId();

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
      let id=commodityId+'';
      let index=this.state.commodityStatus.indexOf(id);
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
      commodityStatus:CommodityStore.getCurrentHierIdCommodityStatus()
    })
  },
  getInitialState:function(){
    return{
      isLoading:false,
      commdityList:[],
      commodityStatus:CommodityStore.getCurrentHierIdCommodityStatus()
    };
  },
  componentWillReceiveProps:function(){
    this._loadCommodityList();
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
    var list=[
        <Checkbox label={I18N.Commodity.Overview}
                  value={-1}
                  name={I18N.Commodity.Overview}
                  checked={status}
                  onCheck={this._onCheck}/>
    ];
    this.state.commdityList.forEach(function(element){
      status=that.isCommoditySingleItemSelected(element.Id);
      list.push(
        <Checkbox label={element.Comment}
                  value={element.Id}
                  name={element.Comment}
                  checked={status}
                  onCheck={that._onCheck}/>
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
