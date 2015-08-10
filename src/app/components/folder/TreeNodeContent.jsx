'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {TextField,Mixins} from 'material-ui';
import TreeConstants from '../../constants/TreeConstants.jsx';
import classNames from 'classnames';
let { nodeType } = TreeConstants;

var TreeNodeContent = React.createClass({
  mixins: [Mixins.ClickAwayable],

    propTypes: {
      nodeData: React.PropTypes.object,
      edited:React.PropTypes.bool,
      selectedNode: React.PropTypes.object,
    },
    _onClick:function(){
      if(this.state.isSelect===null){
        this.setState({
          isSelect:true,
        })
      }


    },
    _onChanged:function(e){
      this.setState({
        text:e.target.value
      })
    },
    getInitialState:function(){
      return{
        isSelect:(this.props.nodeData.get('Id')==this.props.selectedNode.get('Id')),
        errorText:null,
        text:this.props.nodeData.get("Name"),
      };
    },
    componentDidMount:function(){
        if(this.props.nodeData.get('Id')<-1){
      this.refs.textField.focus();
    }
    },
    componentClickAway:function(){
      this.setState({
          isSelect:null,
      })

        if(this.props.nodeData.get("Name")!=this.state.text){
          console.log("**wyh***");
        }


      },
    render:function(){
      var type = this.props.nodeData.get("Type");
      var isSenderCopy = this.props.nodeData.get("IsSenderCopy");
      var icon = (
      <div className="node-content-icon">
        <div className={classNames({
          //add for file operation
          "icon-column-fold" : type == nodeType.Folder,
          "icon-image" : type == nodeType.Widget
        })}/>
      </div>
      );
      var textStyle={
        marginLeft: '6px',
        fontSize: '14px',
        color: '#767a7a'
      };
      var text;
      if(this.props.nodeData.get('Id')<-1){
        text=  <TextField ref="textField" style={textStyle} value={this.state.text}  errorText={this.state.errorText} onChange={this._onChanged}/>
      }
      else {
        text= (!this.state.isSelect?
                  <div className="node-content-text" title={this.state.text}>{this.state.text}</div>:
                  <TextField ref="textField" style={textStyle} value={this.state.text}  errorText={this.state.errorText} onChange={this._onChanged}/>
              );
      }

      var isSenderCopyIcon = <div className={classNames({
                                //add for file operation
                                "icon-humidity" : isSenderCopy,
                              })}/>;
      return(
        <div className="tree-node-content" onClick={this._onClick} onBlur={this._onBlur}>
          {icon}
          {text}
          {isSenderCopyIcon}
        </div>
      )

    }
});

module.exports = TreeNodeContent;
