'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton,TextField,Paper} from 'material-ui';
import Tree from '../tree/Tree.jsx';
import FolderStore from '../../stores/FolderStore.jsx';

var Copy = React.createClass({
  propTypes: {
    title:React.PropTypes.string,//复制文件夹 or 图表另存为
    label:React.PropTypes.string,//文件夹名称 or 图表名称
    labelName:React.PropTypes.string,
    firstActionLabel:React.PropTypes.string,//复制 or 保存
    onFirstActionTouchTap:React.PropTypes.func,
    onSecondActionTouchTap:React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    errorText:React.PropTypes.string,
    treeNode:React.PropTypes.object,
  },
  _onFirstActionTouchTap:function(){
    this.refs.dialog.dismiss();
    if(this.props.onFirstActionTouchTap){
      this.props.onFirstActionTouchTap(this.state.selectedNode,this.state.labelName);
    }
  },
  _onSecondActionTouchTap:function(){
    this.refs.dialog.dismiss();
    if(this.props.onSecondActionTouchTap){
      this.props.onSecondActionTouchTap();
    }
  },
  _onNameChanged:function(e){
    this.setState({
      labelName:e.target.value
    })
  },
  _onTreeSelect:function(){
    this.setState({
      treeShow:true
    })
  },
  _onSelectNode:function(node){
    this.setState({
      selectedNode:node,
      treeShow:false
    });
  },
  _onBlur:function(){
    console.log("**wyh**");
  },
  getInitialState:function(){
    return{
      labelName:this.props.labelName,
      allNode:FolderStore.getFolderTree(),
      selectedNode:this.props.treeNode,
      treeShow:false
    };
  },
  componentWillReceiveProps:function(){
    var selectedNode=FolderStore.getSelectedNode();
    if(selectedNode===null){
      selectedNode=FolderStore.getFolderTree()
    }
    this.setState({
      labelName:this.props.labelName,
      allNode:FolderStore.getFolderTree(),
      selectedNode:selectedNode,
      treeShow:false
    });
  },
  render:function(){
      //style
      let paperStyle = {
                    backgroundColor: '#ffffff',
                    zIndex: '100',
                    width:'320px',
                    height:'220px',
                    position:'absolute',
                    border:'1px solid #c9c8c8',
                    margin:'12px 10px',
                    overflow:'auto'
                  },
          titleStyle={
            fontSize:'20px',
            color:'#464949',
            marginLeft:'26px'
          };

      let actions = [
            <FlatButton
              label={this.props.firstActionLabel}
              onTouchTap={this._onFirstActionTouchTap}
            />,
            <FlatButton
              label={I18N.Template.Copy.Cancel}
              onTouchTap={this._onSecondActionTouchTap}
            />
            ];
      //props
      let treeProps={
        collapsedLevel:0,
        allNode:this.state.allNode,
        allHasCheckBox:false,
        allDisabled:false,
        onSelectNode:this._onSelectNode,
        selectedNode:this.state.selectedNode,
        isFolderOperationTree:true
      },
      dialogProps={
        ref:'dialog',
        title:this.props.title,
        actions:actions,
        modal:true,
        openImmediately:true,
        onDismiss:this.props.onDismiss,
        titleStyle:titleStyle
      };

      //component
      let nameField=(
                <div>
                  <div>
                    {this.props.label}
                  </div>
                  <TextField value={this.state.labelName} onChange={this._onNameChanged} errorText={this.props.errorText}/>
                </div>
              );
      let icon = (
                <div className="icon">
                  <div className="icon-arrow-down"/>
                </div>
                );
      let FolderTreeField=(
                <div style={{'margin-top':'20px'}}>
                    <div>
                      {I18N.Template.Copy.DestinationFolder}
                    </div>
                    <div className='jazz-copytemplate-treeselect' onClick={this._onTreeSelect}>
                      {this.state.selectedNode.get('Name')}
                      {icon}
                    </div>
                  </div>
    );
    let FolderTree=(this.state.treeShow?<Paper style={paperStyle}><Tree {...treeProps}/></Paper>:null);



    return(
      <div className='jazz-copytemplate-dialog'>
        <Dialog {...dialogProps}>
          {nameField}
          {FolderTreeField}
          <div onBlur={this._onBlur}>
              {FolderTree}
          </div>

        </Dialog>
      </div>

    )
  }

});

module.exports = Copy;
