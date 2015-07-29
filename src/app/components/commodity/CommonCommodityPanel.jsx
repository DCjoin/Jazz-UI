'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import CommodityStore from '../../stores/CommodityStore.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import CommonCommodityList from './CommonCommodityList.jsx';
import HierarchyButton from '../Hierarchy/HierarchyButton.jsx';
import DimButton from '../Dim/DimButton.jsx';

var CommonCommodityPanel = React.createClass({
  mixins:[Navigation,State],
  _onHierachyTreeClick:function(node){
      if(node!=this.state.dimParentNode){
        CommodityAction.setCurrentHierarchyInfo(node.Id,node.Name);
        this.setState({
          dimActive:true,
          dimParentNode:node,
          HierarchyShow:false,
          DimShow:true
        });
      }

  },
  _onHierarchButtonClick:function(){
    this.setState({
      HierarchyShow:true,
      DimShow:false
    });
  },
  handleHierClickAway:function(){
    this.setState({
      HierarchyShow:false
    })
  },
  _onDimTreeClick:function(node){
    if(node.Id!==0){
      CommodityAction.setCurrentDimId(node.Id);
    }
    else {
      CommodityAction.setCurrentDimId(null);
    }
    this.setState({
      HierarchyShow:true,
      DimShow:false
    });
  },
  _onDimButtonClick:function(){
    this.setState({
      HierarchyShow:false,
      DimShow:true
    })
  },
  handleDimClickAway:function(){
    this.setState({
      DimShow:false
    })
  },
  _onEnergyConsumptionTypeChange:function(){
    this.setState({
      ecType:CommodityStore.getEnergyConsumptionType()
    });
  },
  getInitialState:function(){
    return{
      ecType:CommodityStore.getEnergyConsumptionType(),
      HierarchyShow:false,
      dimActive:false,
      dimParentNode:null,
      DimShow:false,
    };
  },
  componentWillReceiveProps :function(){
    this.setState({
      ecType:CommodityStore.getEnergyConsumptionType()
    })
  },
  componentDidMount: function() {
    CommodityStore.addEnergyConsumptionTypeListener(this._onEnergyConsumptionTypeChange);
  },

  componentWillUnmount: function() {
    CommodityStore.removeEnergyConsumptionTypeListener(this._onEnergyConsumptionTypeChange);
  },
  render:function(){

    let CurrentHierId=CommodityStore.getCurrentHierarchyId();

    let header,content;
    //header

    if(this.state.ecType=="Carbon"){
      header=(
        <div className="header">
          <HierarchyButton hierId={CurrentHierId}
                            onTreeClick={this._onHierachyTreeClick}
                            onButtonClick={this._onHierarchButtonClick}
                            show={this.state.HierarchyShow}
                            handleClickAway={this.handleHierClickAway}/>
        </div>


                            )
    }
    else{
      if(this.state.ecType=="Cost"){
        header=(
          <div className="header">
            <HierarchyButton hierId={CurrentHierId}
                              onTreeClick={this._onHierachyTreeClick}
                              onButtonClick={this._onHierarchButtonClick}
                              show={this.state.HierarchyShow}
                              handleClickAway={this.handleHierClickAway}/>

            <div style={{color:'#ffffff'}}>-</div>

            <DimButton ref={'dimButton'}
                       active={this.state.dimActive}
                       onTreeClick={this._onDimTreeClick}
                       parentNode={this.state.dimParentNode}
                       onButtonClick={this._onDimButtonClick}
                       show={this.state.DimShow}
                       handleClickAway={this.handleDimClickAway}/>
          </div>

        )



      }
    }
    //content
    if(CurrentHierId!==null){
      content=<div style={{display:'flex'}}><CommonCommodityList /></div>
    }
    return(
      <div className="jazz-dataselectmainpanel">
          {header}
          {content}        
      </div>
    )
  }
});

module.exports = CommonCommodityPanel;
