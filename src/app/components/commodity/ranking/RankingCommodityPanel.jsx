'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress} from 'material-ui';
import HierTreeButton from './RankingHierTreeButton.jsx';
import CommodityList from './RankingCommodityList.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';
import CommodityStore from '../../../stores/CommodityStore.jsx';

var RankingCommodityPanel = React.createClass({

  propTypes: {
    checkedTreeNodes: React.PropTypes.array,
    ecType:React.PropTypes.string,
    //checkedCommodity:{commodityId:XX,commodityName:XX}
    checkedCommodity: React.PropTypes.object,
  },
  _onRankingECTypeChange:function(){
    this.setState({
      ecType:CommodityStore.getRankingECType(),
    });
  },
  _onTreeConfirm:function(){
    this.setState({
      isLoading:true,
      isShow:true,
    });
  },
  _onRankingCommodityListChange:function(){
    this.setState({
      isLoading:false,
      commodityList:CommodityStore.getCommodityList()
    });
  },
  _onButtonClick:function(){
    this.setState({
      isShow:false,
    })
  },
  getInitialState:function(){
    return{
      ecType:this.props.ecType,
      isLoading:false,
      isShow:false,
      commodityList:null,
    };
  },
  componentWillReceiveProps :function(){
    this.setState({
      ecType:CommodityStore.getRankingECType()
    })
  },
  componentDidMount: function() {
  CommodityStore.addRankingECTypeListener(this._onRankingECTypeChange);
  CommodityStore.addRankingCommodityListListener(this._onRankingCommodityListChange);

  if(this.props.checkedCommodity!==null){
    CommodityAction.loadRankingCommodityList(this.props.checkedTreeNodes);
    this.setState({
      isShow:true
    })
  }
  },

  componentWillUnmount: function() {
  CommodityStore.removeRankingECTypeListener(this._onRankingECTypeChange);
  CommodityStore.removeRankingCommodityListListener(this._onRankingCommodityListChange);
  },
  render:function(){

    var content;
    if(this.state.isShow){
      content=(this.state.isLoading?<CircularProgress  mode="indeterminate" size={1} />
                                        :<CommodityList ecType={this.state.ecType}
                                                        checkedCommodity={this.props.checkedCommodity}
                                                        commdityList={this.state.commodityList}/>);
    };
    return(
      <div className="jazz-dataselectmainpanel">
        <div className="header">
            <HierTreeButton checkedTreeNodes={this.props.checkedTreeNodes} onConfirm={this._onTreeConfirm} onButtonClick={this._onButtonClick}/>
        </div>
        {content}
      </div>
    )
  }
  });



module.exports = RankingCommodityPanel;
