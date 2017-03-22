import React, { Component } from 'react';
import classnames from "classnames";
import {Type,DiagnoseStatus} from '../../constants/actionType/Diagnose.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';

export default class LabelTreeNode extends Component {

  constructor(props, ctx) {
    super(props);

  }

  _onAdd(){

  }

  _renderText(){
    var {Status,ChildrenCount,Name}=this.props.nodeData.toJS();

    var styles={
      label:{
        fontSize:'14px'
      }
    };

    var SuspendIcon = <div className={classnames({
      "jazz-icon-read": (Status===DiagnoseStatus.Suspend)
    })}/>;

    var addBtn;
    var count;

    if(this.props.isFromProbem){
      count=ChildrenCount>0?<div className="count">{ChildrenCount}</div>:null
    }else {
      addBtn=<div className="hasAddBtn">
              <div className="addBtn">
                <FlatButton label={I18N.Setting.Diagnose.Diagnose} labelStyle={styles.label} icon={<FontIcon className="icon-more" style={styles.label}/>} onClick={this._onAdd}/>
              </div>
            </div>
    }

    return(
      <div className={classnames({"diagnose-label-node":true,'selected':this.props.selectedNode.get('Id')===this.props.nodeData.get('Id')})}>
        <div>
          <div className="node-content-text">{Name}</div>
          {count}
          {SuspendIcon}
        </div>
        {addBtn}
      </div>
    )
  }

  render(){
    var {NodeType}=this.props.nodeData.toJS();

    var icon = (
    <div className="node-content-icon" style={{
      color: '#ffffff'
    }}>
        <div className={classnames({
      "icon-folder": NodeType === Type.Label,
      "icon-chart": NodeType === Type.Problem
    })}/>
      </div>
    );

    return (
      <div className="tree-node-content" onClick={this._onClick} style={{
        color: '#ffffff',
        whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
      }}>
               {icon}
               {this._renderText()}
        </div>
      )
  }
}

LabelTreeNode.propTypes = {
  nodeData: React.PropTypes.object,
  selectedNode: React.PropTypes.object,
  isFromProbem:React.PropTypes.bool,
};
