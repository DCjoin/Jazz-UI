'use strict';
import React from "react";
import classnames from 'classnames';
import {FlatButton,FontIcon,Menu,Paper,CircularProgress,Mixins} from 'material-ui';
import HierarchyTree from './HierarchyTree.jsx';
import HierarchyAction from "../../actions/HierarchyAction.jsx";
import HierarchyStore from "../../stores/HierarchyStore.jsx";

let HierarchyButton=React.createClass({
    mixins: [Mixins.ClickAwayable],
  propTypes: {
      onTreeClick:React.PropTypes.func.isRequired,
      onButtonClick:React.PropTypes.func.isRequired,
      show:React.PropTypes.bool,
      hierId:React.PropTypes.number,
      handleClickAway:React.PropTypes.func
  },
  _onShowPaper:function(){
    this.setState({open:!this.state.open});
    this.props.onButtonClick();
  },
  _onChange(){
    var data=HierarchyStore.getData();
    this.setState({
      hieList:data,
        isLoading:HierarchyStore.getNodeLoading()
    });
  },
  _onNodeLoadingChange:function(){
    this.setState({
      isLoading:HierarchyStore.getNodeLoading()
    });
    if(this.props.hierIdAndClick!=null){
        this.selectHierItem(this.props.hierIdAndClick,true);
    }
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
        buttonName:I18N.Hierarchy.ButtonName,
        isLoading:false
      };
    },
  componentDidMount: function() {
      HierarchyStore.addHierarchyNodeListener(this._onChange);
      HierarchyStore.addNodeLoadingListener(this._onNodeLoadingChange);
      HierarchyAction.loadall(window.currentCustomerId);
      if(this.props.hierId!==null){
        this.selectHierItem(this.props.hierId,false);
      }
     },
   componentWillUnmount: function() {
       HierarchyStore.removeHierarchyNodeListener(this._onChange);
        HierarchyStore.removeNodeLoadingListener(this._onNodeLoadingChange);

      },
<<<<<<< HEAD
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.hierId!==null){
      this.selectHierItem(nextProps.hierId,false);
    }
        if(!nextProps.show){
          this.setState({
            open:false
          });
        }
      },
=======
  // componentWillReceiveProps: function(nextProps) {
  //   if(nextProps.hierId!==null){
  //     this.selectHierItem(nextProps.hierId,false);
  //   }
  //       if(!nextProps.show){
  //         this.setState({
  //           open:false
  //         });
  //       }
  //     },
>>>>>>> parent of e0f8a75... for pull
  componentClickAway:function(){
    if(this.props.show){
      if(this.props.handleClickAwa){
        this.props.handleClickAway();
      }
        else {
          this.setState({
            open:false
          })
        }

    }

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

      if(this.state.open && this.props.show) {
        if(this.state.isLoading){
          dropdownPaper=(
            <Paper style={paperStyle}>
              <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',marginTop:'160px'}}>
              <CircularProgress  mode="indeterminate" size={1} />
            </div>
          </Paper>
          )
        }
        else {
          if(this.state.selectedNode){
            dropdownPaper=<HierarchyTree allNode={this.state.hieList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick}/>;
          }else{
            dropdownPaper=<HierarchyTree allNode={this.state.hieList} selectedNode={this.state.hieList} onTreeClick={this._onTreeClick}/>;
          }
        }



      };
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
