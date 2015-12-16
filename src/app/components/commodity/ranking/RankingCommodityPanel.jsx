'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { CircularProgress } from 'material-ui';
import HierTreeButton from './RankingHierTreeButton.jsx';
import CommodityList from './RankingCommodityList.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';
import CommodityStore from '../../../stores/CommodityStore.jsx';
import Immutable from 'immutable';

var RankingCommodityPanel = React.createClass({

  propTypes: {
    ecType: React.PropTypes.string,
    //checkedCommodity:{commodityId:XX,commodityName:XX}

  },
  _onTreeConfirm: function() {
    CommodityStore.clearRankingCommodity();
    this.setState({
      isCommodityLoading: true,
      isShow: true,
      checkedCommodity: CommodityStore.getRankingCommodity(),
    });
  },
  _onRankingCommodityListChange: function() {
    this.setState({
      isCommodityLoading: false,
      commodityList: CommodityStore.getCommodityList()
    });
  },
  _getTreeNode: function() {
    var _rankingTreeList = CommodityStore.getRankingTreeList();
    var treeNode = Immutable.List([]);
    _rankingTreeList.forEach(function(item) {
      treeNode = treeNode.push(Immutable.fromJS(
        {
          Id: item.hierId,
          Name: item.hierName
        }
      ));
    });
    return treeNode;
  },
  _onTreeLoad: function(status) {
    this.setState({
      isTreeLoading: status
    });
  },
  _onRankingCommodityStatustChange: function() {
    this.setState({
      checkedCommodity: CommodityStore.getRankingCommodity(),
    });
  },
  getInitialState: function() {
    return {
      isCommodityLoading: false,
      isTreeLoading: false,
      commodityList: [],
      checkedTreeNodes: this._getTreeNode(),
      checkedCommodity: CommodityStore.getRankingCommodity(),
    };
  },
  componentWillReceiveProps: function() {
    this.setState({
      checkedCommodity: CommodityStore.getRankingCommodity(),
    });
  },
  componentDidMount: function() {
    CommodityStore.addRankingCommodityListListener(this._onRankingCommodityListChange);
    CommodityStore.addRankingCommodityStatusListener(this._onRankingCommodityStatustChange);

    if (this.state.checkedTreeNodes) {
      CommodityAction.loadRankingCommodityList(this.state.checkedTreeNodes);
      this.setState({
        isShow: true
      });
    }
  },

  componentWillUnmount: function() {
    CommodityStore.removeRankingCommodityListListener(this._onRankingCommodityListChange);
    CommodityStore.removeRankingCommodityStatusListener(this._onRankingCommodityStatustChange);
  },
  render: function() {

    var content;

    content = ((this.state.isCommodityLoading || this.state.isTreeLoading) ? <CircularProgress  mode="indeterminate" size={1} />
      : <CommodityList ecType={this.props.ecType}
      checkedCommodity={this.state.checkedCommodity}
      commdityList={this.state.commodityList}
      />);

    return (
      <div className="jazz-dataselectmainpanel">
        <div className="header">
            <HierTreeButton checkedTreeNodes={this.state.checkedTreeNodes} onConfirm={this._onTreeConfirm} onLoad={this._onTreeLoad}/>
        </div>
        {content}
      </div>
      )
  }
});



module.exports = RankingCommodityPanel;
