'use strict';
import React from "react";
import classnames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper} from 'material-ui';
import HierarchyTree from './HierarchyTree.jsx';
import HierarchyAction from "../actions/HierarchyAction.jsx";
import HierarchyStore from "../stores/HierarchyStore.jsx";

let HierarchyButton=React.createClass({
  propTypes: {
      onTreeClick:React.PropTypes.func.isRequired,
      onButtonClick:React.PropTypes.func.isRequired,
      show:React.PropTypes.bool,
      hierId:React.PropTypes.number
  },
  _onShowPaper:function(){
    this.setState({open:!this.state.open});
    this.props.onButtonClick();
  },
  _onChange(){
    var data=HierarchyStore.getData();

    this.setState({
      hieList:data,

    });
  },
  selectHierItem(hierId, isCallClickEvent){
    let item = this.getHierById(hierId);

    if(item)
      this.setState({selectedNode:item, buttonName:item.Name});

      if(!!isCallClickEvent){
        this.props.onTreeClick(item);
      }
  },
  getHierById(hierId){
    var data=HierarchyStore.getData();
    if(data){
      let item = HierarchyStore.findHierItem(data, hierId);
      return item;
    }
    return null;
  },
  setErrorText: function(newErrorText) {
    this.setState({errorText: newErrorText});
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
        hieList:null,
        selectedNode:null,
        buttonName:"请选择层级节点"
      };
    },
  componentDidMount: function() {
      HierarchyStore.addChangeListener(this._onChange);
      HierarchyAction.loadall(window.currentCustomerId);
      if(this.props.hierId!=null){
        this.selectHierItem(this.props.hierId,false)
      }
     },
   componentWillUnmount: function() {
       HierarchyStore.removeChangeListener(this._onChange);

      },
  componentWillReceiveProps: function(nextProps) {
        if(!nextProps.show){
          this.setState({
            open:false
          });
        }
      },

  render:function(){
      var dropdownPaper;

      if(this.state.open && this.props.show) {
        if(this.state.selectedNode){
          dropdownPaper=<HierarchyTree allNode={this.state.hieList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick}/>;
        }else{
          dropdownPaper=<HierarchyTree allNode={this.state.hieList} selectedNode={this.state.hieList} onTreeClick={this._onTreeClick}/>;
        }


      }
      var errorStyle = {
        position: 'absolute',
        bottom: -10,
        fontSize: '12px',
        lineHeight: '12px',
        color: 'red'
      };
      var errorTextElement = this.state.errorText ? (
        <div style={errorStyle}>{this.state.errorText}</div>
      ) : null;

      return(
            <div className='jazz-hierarchybutton' style={{display:'inline-block'}}>
              <div className='hiername' onClick={this._onShowPaper}>
                {this.state.buttonName}
              </div>
              {errorTextElement}
                {dropdownPaper}
            </div>
      );
    }
});

module.exports = HierarchyButton;
