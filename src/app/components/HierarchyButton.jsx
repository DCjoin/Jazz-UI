'use strict';
import React from "react";
import classnames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper} from 'material-ui';
import HierarchyTree from './HierarchyTree.jsx';
import HierarchyAction from "../actions/HierarchyAction.jsx";
import HierarchyStore from "../stores/HierarchyStore.jsx";
var testnode={
  "Name":"111",
  "Id":111,
  "Type":-1,
  Children:[
  {  "Name":"101",
    "Id":101,
    "ParentId":111,
    "Type":0}
  ]

};
let HierarchyButton=React.createClass({
  propTypes: {
      onTreeClick:React.PropTypes.func.isRequired,
      onButtonClick:React.PropTypes.func.isRequired,
      show:React.PropTypes.bool
  },
    getInitialState: function() {
      return {
        open: false,
        hieList:null,
        selectedNode:null,
        buttonName:"请选择层级节点"
      };
    },

    _onShowPaper:function(){
      this.setState({open:!this.state.open});
      this.props.onButtonClick();
    },
    _onChange(){
      var data=HierarchyStore.getDate();

      this.setState({
        hieList:data,
        selectedNode:data
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
      var data=HierarchyStore.getDate();
      if(data){
        let item = HierarchyStore.findHierItem(data, hierId);
        return item;
      }
      return null;
    },
    setErrorText: function(newErrorText) {
      this.setState({errorText: newErrorText});
    },
    componentDidMount: function() {
      HierarchyStore.addChangeListener(this._onChange);
      HierarchyAction.loadall(window.currentCustomerId);
     },
     componentWillUnmount: function() {

       HierarchyStore.removeChangeListener(this._onChange);

      },
      _onTreeClick:function(node){
        this.props.onTreeClick(node);

        this.setState({
          open: false,
          selectedNode:node,
          buttonName:node.Name
        });
      },
    render:function(){

      var buttonStyle = {
               minHeight:'48px',
           };

      var dropdownPaper;
      if(this.state.open) {
        dropdownPaper=<HierarchyTree allNode={this.state.hieList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick}/>;

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
              <FlatButton style={buttonStyle} onClick={this._onShowPaper}>
                  <FontIcon className="fa fa-th-large" />
                  <span className="mui-flat-button-label" style={{margin:'5px'}} >{this.state.buttonName}</span>
              </FlatButton>
              {errorTextElement}
                {dropdownPaper}
            </div>
      );
    }
});

module.exports = HierarchyButton;
