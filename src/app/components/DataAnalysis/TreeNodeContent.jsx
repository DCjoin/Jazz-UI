'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import TextField from 'material-ui/TextField';
import TreeConstants from 'constants/TreeConstants.jsx';
import classNames from 'classnames';
let {nodeType} = TreeConstants;
import FolderAction from 'actions/FolderAction.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import ClickAway from "controls/ClickAwayListener.jsx";

let i = 0;
const opern = ['+3', '+2', '+1', '7', '6', '5', '6', '7', '+3', '+2', '+1', '7', '6', '5', '6', '7', '+3', '+2', '+1', '7', '6', '5', '6', '7', '+1', '7', '6', '5', '4', '3', '4', '2',

'-1', '7', '+1', '1', '-7', '5', '2', '3', '1', '+1', '7', '6', '7', '+3', '+5', '+6', '+4', '+3', '+2', '+4', '+4', '+3', '+1', '7', '6', '5', '4', '3', '2', '4', '3', '2', '+1', '7', '+1', '1', '-7', '5', '2', '3', '1', '+1', '7', '6', '7', '+3', '+5', '+6', '+4', '+3', '+2', '+4', '+3', '+2', '+1', '7', '6', '5', '4', '3', '2', '4', '3', '5',

'+5', '+3', '+4', '+5', '+3', '+4', '+5', '5', '6', '7', '+1', '+2', '+3', '+4', '+3', '+1', '+2', '+3', '3', '4', '5', '6', '5', '4', '5', '3', '4', '5', '4', '6', '5', '4', '3', '2', '3', '2', '1', '2', '3', '4', '5', '6', '4', '6', '5', '6', '7', '+1', '+2', '+3', '+4', '+5', '+3', '+1', '+2', '+3', '+2', '+1', '+2', '7', '+1', '+2', '+3', '+2', '+1', '7', '+1', '6', '7', '+1', '1', '2', '3', '4', '3', '2', '3', '+1', '7', '+1', '6', '+1', '7', '6', '5', '4', '5', '4', '3', '4', '5', '6', '7', '+1', '6', '+1', '7', '+1', '7', '6', '7', '+1', '+2', '+1', '7', '+1', '6', '7',
];

/*function egg() {
  if( i >= opern.length ) {
    return;
  }
  audioCtx.play(coverNumToHz(opern[i++]));
}*/

const ONE_LINED_NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
const DIATONIC_SCALE = ['subsubcontra', 'subcontra', 'contra', 'great', 'small', 'one-lined', 'two-lined', 'three-lined', 'four-lined', 'five-lined', 'six-lined'];
let DiatonicNotes = {
  [DIATONIC_SCALE[0]]: ONE_LINED_NOTES.map(note => note / 32),
  [DIATONIC_SCALE[1]]: ONE_LINED_NOTES.map(note => note / 16),
  [DIATONIC_SCALE[2]]: ONE_LINED_NOTES.map(note => note / 8),
  [DIATONIC_SCALE[3]]: ONE_LINED_NOTES.map(note => note / 4),
  [DIATONIC_SCALE[4]]: ONE_LINED_NOTES.map(note => note / 2),
  [DIATONIC_SCALE[5]]: ONE_LINED_NOTES,
  [DIATONIC_SCALE[6]]: ONE_LINED_NOTES.map(note => note * 2),
  [DIATONIC_SCALE[7]]: ONE_LINED_NOTES.map(note => note * 4),
  [DIATONIC_SCALE[8]]: ONE_LINED_NOTES.map(note => note * 8),
  [DIATONIC_SCALE[9]]: ONE_LINED_NOTES.map(note => note * 16),
  [DIATONIC_SCALE[10]]: ONE_LINED_NOTES.map(note => note * 32),
};
/*
let audioCtx = new AudioCtx();

let scaleIdx = 0,
noteIdx = 0,
asc = true;


function coverNumToHz(num) {
  num = num + '';
  let baseScaleIdx = 5;
  if( num.indexOf('-') > -1 ) {
    baseScaleIdx = baseScaleIdx - (num.length - 1)
  } else if(num.indexOf('+') > -1) {        
    baseScaleIdx = baseScaleIdx + (num.length - 1)
  }

  return DiatonicNotes[DIATONIC_SCALE[baseScaleIdx]][num.substr(-1) - 1]
}

function AudioCtx() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if( window.AudioContext ) {
    this.audioCtx = new AudioContext();
  }
  return false;
}
AudioCtx.prototype.play = function(frequency) {
  let audioCtx = this.audioCtx;
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.type = 'sine';

  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
  oscillator.start(audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
  oscillator.stop(audioCtx.currentTime + 1);
}*/


const normalStyle = {
  backgroundColor: '#ffffff',
  color: '#626469'
};
const selectedStyle = {
  backgroundColor: '#32ad3d',
  color: '#ffffff'
};
const parentStyle = {
  backgroundColor: '#ffffff',
  color: '#32ad3d'
};

var TreeNodeContent = React.createClass({

  propTypes: {
    nodeData: React.PropTypes.object,
    selectedNode: React.PropTypes.object,
    panel: React.PropTypes.object,
  },
  _onClick: function() {
    if (this.state.isSelect === null) {
      this.setState({
        isSelect: true,
      });
    } else if (this.state.isSelect) {
      this.props.panel.setEditNode(this.props.nodeData);
    }

    if (this.props.nodeData.get('IsSenderCopy') && !this.props.nodeData.get('IsRead')) {
      FolderAction.modifyFolderReadStatus(this.props.nodeData);
    }

  },
  _onChanged: function(e) {
    this.setState({
      text: e.target.value
    });
  },
  getInitialState: function() {
    return {
      isSelect: null,
      text: this.props.nodeData.get("Name"),
      readStatus: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.nodeData.get("Name"),
    });
  },
  componentDidMount: function() {
    if (this.props.nodeData.get('Id') < -1) {
      this.refs.textField.focus();
    }
  },
  onClickAway: function() {
    this.setState({
      isSelect: null,
    });

    if (this.props.nodeData.get("Name") != this.state.text) {
      FolderAction.modifyFolderName(this.props.nodeData, this.state.text);
      this.props.panel.setEditNode(null);
    }


  },
  render: function() {
    var type = this.props.nodeData.get("Type");
    var isSenderCopy = this.props.nodeData.get("IsSenderCopy");
    var isRead = this.props.nodeData.get("IsRead");
    var icon = (
    <div className="node-content-icon">
        <div className={classNames({
      "icon-folder": type == nodeType.Folder,
      "icon-chart": type == nodeType.Widget
    })}/>
      </div>
    );
    var textStyle = {
      marginLeft: '10px',
      fontSize: '14px'
    };
    var text;
    if (this.props.nodeData.get('Id') < -1) {
      text = <div className='jazz-foldertree-node-textfield'>
        <input ref="textField" 
          style={textStyle} 
          value={this.state.text} 
          onChange={this._onChanged}
          onKeyPress={(e) => {
            if( e.charCode === 13 ) {
              this.onClickAway();
            }
          }}/>
        </div>
    } else {
      text = (!this.state.isSelect || this.props.nodeData !== this.props.selectedNode || this.props.nodeData.get('Id') === -1 ?
        <div className="node-content-text" title={this.state.text}>{this.state.text}</div> :
        <div className='jazz-foldertree-node-textfield'>
          <input ref="textField" 
            style={textStyle} 
            value={this.state.text} 
            onChange={this._onChanged}
            onKeyPress={(e) => {
              if( e.charCode === 13 ) {
                this.onClickAway();
              }
            }}/>
        </div>
      );
    }
    ;

    var isSenderCopyIcon = <div className={classNames({
      "jazz-icon-read": (isSenderCopy && !isRead)
    })}/>;

  var {indent,indentUnit,nodeOriginPaddingLeft}=this.props.panel.props;
    return (
      <div className="tree-node-content" onClick={this._onClick} style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}>
               {icon}
               {text}
               {isSenderCopyIcon}
        </div>
      );
  }
});

module.exports = ClickAway(TreeNodeContent);
