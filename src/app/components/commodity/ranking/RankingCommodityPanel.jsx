'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress} from 'material-ui';
import HierTreeButton from './RankingHierTreeButton.jsx';
import CommodityList from './RankingCommodityList.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';
import CommodityStore from '../../../stores/CommodityStore.jsx';
import Immutable from 'immutable';

var RankingCommodityPanel = React.createClass({

  propTypes: {
    ecType:React.PropTypes.string,
    //checkedCommodity:{commodityId:XX,commodityName:XX}
    checkedCommodity: React.PropTypes.object,
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
  _getTreeNode:function(){
    var _rankingTreeList=CommodityStore.getRankingTreeList();
    var treeNode=Immutable.List([]);
    _rankingTreeList.forEach(function(item){
      treeNode=treeNode.push(Immutable.fromJS(
        {
          Id:item.hierId,
          Name:item.hierName
        }
      ));
    });
    return treeNode;
  },
  getInitialState:function(){
    return{
      isLoading:false,
      commodityList:Immutable.List([]),
      checkedTreeNodes:this._getTreeNode()
    };
  },

  componentDidMount: function() {
  CommodityStore.addRankingCommodityListListener(this._onRankingCommodityListChange);

  if(this.state.checkedTreeNodes){
    CommodityAction.loadRankingCommodityList(this.state.checkedTreeNodes);
    this.setState({
      isShow:true
    });
  }
  },

  componentWillUnmount: function() {
  CommodityStore.removeRankingCommodityListListener(this._onRankingCommodityListChange);
  },
  render:function(){

    var content;

      content=(this.state.isLoading?<CircularProgress  mode="indeterminate" size={1} />
                                        :<CommodityList ecType={this.props.ecType}
                                                        checkedCommodity={this.props.checkedCommodity}
                                                        commdityList={this.state.commodityList}/>);

    return(
      <div className="jazz-dataselectmainpanel">
        <div className="header">
            <HierTreeButton checkedTreeNodes={this.state.checkedTreeNodes} onConfirm={this._onTreeConfirm} />
        </div>
        {content}
      </div>
    )
  }
  });



module.exports = RankingCommodityPanel;
