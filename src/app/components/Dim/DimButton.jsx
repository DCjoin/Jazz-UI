'use strict';
import React from "react";
import classNames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper,Mixins} from 'material-ui';
import DimTree from './DimTree.jsx';
import DimAction from "../../actions/DimAction.jsx";
import DimStore from "../../stores/DimStore.jsx";

let DimButton=React.createClass({
  mixins: [Mixins.ClickAwayable],
  propTypes: {
    active:React.PropTypes.bool,
    parentNode:React.PropTypes.object.isRequired,
    onButtonClick:React.PropTypes.func.isRequired,
    show:React.PropTypes.bool,
    onTreeClick:React.PropTypes.func.isRequired,
    handleClickAway:React.PropTypes.func
  },
  _onShowPaper:function(){
    this.setState({open:!this.state.open});
    this.props.onButtonClick();
  },
  _onChange(){
    var data=DimStore.getData();

    if(data && this.props.parentNode){
      var tree={};
    //  tree.Id=this.props.parentNode.Id;
      tree.Id=0;
      tree.Name="全部维度";
      tree.Children=data;
      this.setState({
        dimList:tree,
        selectedNode:tree
      });
    }

  },
  resetButtonName:function(){
    this.setState({
      buttonName:"全部维度"
    });
  },
  _onTreeClick:function(node){
    this.props.onTreeClick(node);
    this.setState({
      open: false,
      selectedNode:node,
      buttonName:node.Name
    });
  },
    getInitialState: function() {

        return {
          open: false,
          dimList:null,
          selectedNode:null,
          buttonName:"维度节点"
        };


    },
    componentDidMount: function() {
      DimStore.addChangeListener(this._onChange);

     },
    componentWillUnmount: function() {
       DimStore.removeChangeListener(this._onChange);

      },

    componentWillReceiveProps: function(nextProps) {
        if(nextProps.parentNode){
          DimAction.loadall(nextProps.parentNode.Id);
        }
        if(!nextProps.show){
          this.setState({
            open:false
          });
        }
        this.setState({
          dimList:null,
          selectedNode:null
        });
      },

      componentClickAway:function(){
        if((this.props.show) && (this.state.open)){
                this.props.handleClickAway();
        }

        },

    render:function(){

      var dropdownPaper;

      if((this.state.open) && (this.props.active) && (this.props.show)) {
        if(this.state.selectedNode){
            dropdownPaper=<DimTree allNode={this.state.dimList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick} />
        }
        else {
            dropdownPaper=<DimTree allNode={this.state.dimList} selectedNode={this.state.dimList} onTreeClick={this._onTreeClick} />
        }


      };
      return(
            <div className='jazz-dimbutton' style={{display:'inline-block'}}>
              <div className={classNames({
                            "dimname": true,
                            "active": (this.props.active)})} onClick={this._onShowPaper}>
                {this.state.buttonName}
              </div>
                {dropdownPaper}
            </div>
      )
    }
});

module.exports = DimButton;
