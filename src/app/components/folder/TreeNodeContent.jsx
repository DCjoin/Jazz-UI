'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {TextField,Mixins,Snackbar} from 'material-ui';
import TreeConstants from '../../constants/TreeConstants.jsx';
import classNames from 'classnames';
let { nodeType } = TreeConstants;
import FolderAction from '../../actions/FolderAction.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import Draggable from 'react-draggable2';
import dragula from 'react-dragula';

var TreeNodeContent = React.createClass({
  mixins: [Mixins.ClickAwayable],

    propTypes: {
      nodeData: React.PropTypes.object,
      selectedNode: React.PropTypes.object,
      readStatus :React.PropTypes.bool,
    },
    _onClick:function(){
      if(this.state.isSelect===null){
        this.setState({
          isSelect:true,
        });
      }

      if(this.props.nodeData.get('IsSenderCopy') && !this.props.nodeData.get('IsRead')){
        FolderAction.ModifyFolderReadStatus(this.props.nodeData);
        this.setState({
          readStatus:false
        });
      }

    },
    _onChanged:function(e){
      this.setState({
        text:e.target.value
      });
    },

    getInitialState:function(){
      return{
        isSelect:(this.props.nodeData.get('Id')==this.props.selectedNode.get('Id')),
        text:this.props.nodeData.get("Name"),
        readStatus:true
      };
    },
    componentWillReceiveProps:function(nextProps){
      this.setState({
        text:nextProps.nodeData.get("Name"),
      })
    },
    componentDidMount:function(){
        if(this.props.nodeData.get('Id')<-1){
      this.refs.textField.focus();
    }



  //  FolderStore.addModifyNameErrorListener(this._onModifyNameError);
    },
    componentWillUnmount:function(){

  //  FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
    },
    componentClickAway:function(){
      this.setState({
          isSelect:null,
      });

        if(this.props.nodeData.get("Name")!=this.state.text){
          FolderAction.modifyFolderName(this.props.nodeData,this.state.text);
        }


      },
    render:function(){
      var type = this.props.nodeData.get("Type");
      var isSenderCopy = this.props.nodeData.get("IsSenderCopy");
      var isRead = this.props.nodeData.get("IsRead");
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
        text=  <TextField ref="textField" style={textStyle} value={this.state.text} onChange={this._onChanged}/>
      }
      else {
        text= (!this.state.isSelect?
                  <div className="node-content-text" title={this.state.text}>{this.state.text}</div>:
                  <TextField ref="textField" style={textStyle} value={this.state.text} onChange={this._onChanged}/>
              );
      };

      var isSenderCopyIcon = <div className={classNames({
                                //add for file operation
                                "icon-humidity" : (isSenderCopy && !isRead && !this.props.readStatus && this.state.readStatus),
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
