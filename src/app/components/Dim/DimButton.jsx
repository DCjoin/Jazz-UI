'use strict';
import React from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import Popover from 'material-ui/Popover';
import DimTree from './DimTree.jsx';
import DimAction from "../../actions/DimAction.jsx";
import DimStore from "../../stores/DimStore.jsx";
import ClickAway from "../../controls/ClickAwayListener.jsx";

let DimButton = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    parentNode: React.PropTypes.object,
    onButtonClick: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool,
    onTreeClick: React.PropTypes.func.isRequired,
    handleClickAway: React.PropTypes.func
  },
  _onShowPaper: function() {
    this.setState({
      open: !this.state.open,
      anchorEl: ReactDOM.findDOMNode(this)
    });
    this.props.onButtonClick();
  },
  _onChange() {
    var data = DimStore.getData();

    if (data && this.props.parentNode) {
      var tree = {};
      //  tree.Id=this.props.parentNode.Id;
      tree.Id = 0;
      tree.Name = I18N.Dim.AllButtonName;
      tree.Children = data;
      this.setState({
        dimList: tree,
        selectedNode: tree
      });
    }

  },
  _onTreeClick: function(node) {
    this.props.onTreeClick(node);
    this.setState({
      open: false,
      anchorEl: null,
      selectedNode: node,
      buttonName: node.Name
    });
  },
  resetButtonName: function() {
    this.setState({
      buttonName: I18N.Dim.AllButtonName,
      selectedNode: null
    });
  },
  selectDimItem(dimId, isCallClickEvent) {
    let item = this.getDimById(dimId);

    if (item)
      this.setState({
        selectedNode: item,
        buttonName: item.Name
      });

    if (!!isCallClickEvent) {
      this.props.onTreeClick(item);
    }
  },
  getDimById(dimId) {
    var data = DimStore.getData();
    var tree = {};
    //  tree.Id=this.props.parentNode.Id;
    tree.Id = 0;
    tree.Name = I18N.Dim.AllButtonName;
    tree.Children = data;
    if (data) {
      let item = DimStore.findDimItem(tree, dimId);
      return item;
    }
    return null;
  },
  getInitialState: function() {

    return {
      open: false,
      anchorEl: null,
      dimList: null,
      selectedNode: null,
      buttonName: I18N.Dim.ButtonName
    };


  },
  componentDidMount: function() {
    DimStore.addChangeListener(this._onChange);
    if (this.props.parentNode) {
      this.resetButtonName();
      DimAction.loadall(this.props.parentNode.Id);
    }
    if (this.props.dimId !== null) {
      this.selectDimItem(this.props.dimId, false);
    }
  },
  componentWillUnmount: function() {
    DimStore.removeChangeListener(this._onChange);

  },

  componentWillReceiveProps: function(nextProps) {
    if ((nextProps.parentNode) && (nextProps.parentNode != this.props.parentNode || nextProps.lang != this.props.lang)) {
      this.resetButtonName();
      DimAction.loadall(nextProps.parentNode.Id);
      this.setState({
        dimList: null,
        selectedNode: null
      });
    }
    if (nextProps.dimId !== null) {
      this.selectDimItem(nextProps.dimId, false);
    }
    if (!nextProps.show) {
      this.setState({
        open: false
      });
    }

  },

  onClickAway: function() {
    if ((this.props.show) && (this.state.open)) {
      this.props.handleClickAway();
    }

  },

  render: function() {

    var dropdownPaper;

    if ((this.state.open) && (this.props.active) && (this.props.show)) {
      if (this.state.selectedNode) {
        dropdownPaper = <DimTree allNode={this.state.dimList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick} />
      } else {
        dropdownPaper = <DimTree allNode={this.state.dimList} selectedNode={this.state.dimList} onTreeClick={this._onTreeClick} />
      }


    }
    ;
    return (
      <div className='jazz-dimbutton' style={{
        display: 'inline-block'
      }}>
              <div className={classNames({
        "dimname": true,
        "active": (this.props.active)
      })} onClick={this._onShowPaper}>
                {this.state.buttonName}
              </div>
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                onRequestClose={this.props.handleClickAway}
              >
                {dropdownPaper}
              </Popover>
            </div>
      )
  }
});

module.exports = DimButton;
