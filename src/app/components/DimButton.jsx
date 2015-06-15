'use strict';
import React from "react";
import classnames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper} from 'material-ui';
import DimTree from './DimTree.jsx';
import DimAction from "../actions/DimAction.jsx";
import DimStore from "../stores/DimStore.jsx";
var testList=[
{"Name":"1","Id":1,"HierarchyId":101},
{"Name":"2","Id":2,"HierarchyId":101},
{"Name":"3","Id":3,"HierarchyId":101,Children:[
  {"Name":"4","Id":4,"HierarchyId":3},
  {"Name":"5","Id":5,"HierarchyId":3},
  ]},
]
let DimButton=React.createClass({
  propTypes: {
    active:React.PropTypes.bool,
    parentNode:React.PropTypes.object.isRequired,
    onButtonClick:React.PropTypes.func.isRequired,
    show:React.PropTypes.bool,
    onTreeClick:React.PropTypes.func.isRequired
  },

    getInitialState: function() {
      return {
        open: false,
        dimList:null,
        selectedNode:null,
        buttonName:"全部维度"
      };
    },
    _onShowPaper:function(){
      this.setState({open:!this.state.open});
      this.props.onButtonClick();
    },
    _onChange(){
      var data=DimStore.getData();

      if(data && this.props.parentNode){
        var tree={};
        tree.Id=this.props.parentNode.Id;
        tree.Name=this.props.parentNode.Name;
        tree.Children=data;
        this.setState({
          dimList:tree,
          selectedNode:tree
        })
      }

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
        };
        if(!nextProps.show){
          this.setState({
            open:false
          })
        };
        this.setState({

          dimList:null,
          selectedNode:null
        })

      },
      _onTreeClick:function(node){
        this.props.onTreeClick(node);
        this.setState({
          open: false,
          selectedNode:node,
          buttonName:node.Name
        })
      },

    render:function(){


      var buttonStyle = {
               minHeight:'48px',
           },
           fontStyle={
              margin:'5px',
           };

      var dropdownPaper;
      if(!this.props.active){
        fontStyle={
           color:'rgb(187, 184, 184)',
        };
      };
      if((this.state.open) && (this.props.active) && (this.props.show)) {

        dropdownPaper=<DimTree allNode={this.state.dimList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick}/>;

      };
      return(
            <div className='jazz-hierarchybutton' style={{display:'inline-block'}}>
              <FlatButton style={buttonStyle} onClick={this._onShowPaper}>

                  <span className="mui-flat-button-label" style={fontStyle} >{this.state.buttonName}</span>
              </FlatButton>
                {dropdownPaper}
            </div>
      )
    }
});

module.exports = DimButton;
