'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {CircularProgress,Mixins} from 'material-ui';
import HierarchyStore from '../../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../../actions/HierarchyAction.jsx';
import HierView from './RankingHierView.jsx';
import Immutable from 'immutable';

var RankingHierTreeButton = React.createClass({

  mixins: [Mixins.ClickAwayable],
  propTypes: {
    checkedTreeNodes:React.PropTypes.array,
    onConfirm:React.PropTypes.func,
    onButtonClick:React.PropTypes.func
  },
  _onChange(){
    var data=HierarchyStore.getData();
    this.setState({
      hieList:data,
      isLoading:false
    });
  },
  setButtonName:function(checkedTreeNodes){
    var name;
    if(checkedTreeNodes){
      checkedTreeNodes.forEach(function(node,i){
        if(i===0){
          name=node.get('Name');
        }
        else {
          name+=','+node.get('Name');
        }
      });
      this.setState({
        buttonName:name
      });
    }

  },
  _onShowPaper:function(){
    this.props.onButtonClick();

    if(this.state.display=='none'){
    this.setState({
      display:'block'
    });
    }
    else {
      this.setState({
        display:'none'
      });
    }
  },
  _onConfirm:function(list){
    this.setButtonName(list);
    this.props.onConfirm();
    this.setState({
      display:'none'
    });
  },
  _onClear:function(){
    this.setState({
      buttonName:I18N.Hierarchy.RankingButtonName
    })
  },
  getInitialState: function() {
      return {
        open: false,
        hieList:null,
        buttonName:I18N.Hierarchy.RankingButtonName,
        display:'none'
      };
    },
  componentWillReceiveProps: function(nextProps) {
      if((nextProps.checkedTreeNodes!==null) && (nextProps.checkedTreeNodes!=this.props.checkedTreeNodes)){
        //let checkedTreeNodes=Immutable.fromJS(nextProps.checkedTreeNodes);
        this.setButtonName(nextProps.checkedTreeNodes);
      }
        },
  componentDidMount:function(){
    HierarchyStore.addHierarchyNodeListener(this._onChange);
    HierarchyAction.loadall(window.currentCustomerId);

    if(this.props.checkedTreeNodes){
      //let checkedTreeNodes=Immutable.fromJS(this.props.checkedTreeNodes);
      this.setButtonName(this.props.checkedTreeNodes);
    }

    this.setState({
      isLoading:true,
      hieList:null,
    });
  },
  componentWillUnmount:function(){
    HierarchyStore.removeHierarchyNodeListener(this._onChange);
  },
  render:function(){
    var dropdownPaper,
        paperStyle = {
              backgroundColor: '#ffffff',
              zIndex: '100',
              width:'300px',
              height:'390px',
              position:'absolute',
              border:'1px solid #c9c8c8',
              margin:'12px 10px'
            };

    return(
      <div className='jazz-ranking-hierarchybutton' style={{display:'inline-block'}}>
          <div className='hiername' title={this.state.buttonName} onClick={this._onShowPaper}>
            {this.state.buttonName}
          </div>
          <div style={{display:this.state.display}}>
          <HierView allNode={this.state.hieList} onConfirm={this._onConfirm} onClear={this._onClear} checkedTreeNodes={this.props.checkedTreeNodes}/>
          </div>

        </div>
    )
  }
});

module.exports = RankingHierTreeButton;
