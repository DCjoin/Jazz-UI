'use strict';
import React from "react";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FlatButton, FontIcon, Menu, Paper, CircularProgress, Mixins } from 'material-ui';
import HierarchyTree from './HierarchyTree.jsx';
import HierarchyAction from "../../actions/HierarchyAction.jsx";
import HierarchyStore from "../../stores/HierarchyStore.jsx";
import ClickAway from "../../controls/ClickAwayListener.jsx";
var createReactClass = require('create-react-class');
let HierarchyButton = createReactClass({
  //mixins: [Mixins.ClickAwayable],
  propTypes: {
    onTreeClick: PropTypes.func.isRequired,
    onButtonClick: PropTypes.func.isRequired,
    show: PropTypes.bool,
    hierId: PropTypes.number,
    handleClickAway: PropTypes.func,
    isDimTreeShow: PropTypes.bool,
  },
  contextTypes:{
      currentRoute: PropTypes.object
  },
  getDefaultProps: function() {
    return {
      isDimTreeShow: true,
    };
  },
  _onShowPaper: function() {
    this.setState({
      open: !this.state.open
    });
    this.props.onButtonClick();
  },
  _onChange() {
    var data = HierarchyStore.getData();
    this.setState({
      hieList: data,
      isLoading: HierarchyStore.getNodeLoading()
    });
    if (this.props.hierId !== null && this.state.buttonName == I18N.Hierarchy.ButtonName) {
      this.selectHierItem(this.props.hierId, false);
    }
  },
  _onNodeLoadingChange: function() {
    this.setState({
      isLoading: HierarchyStore.getNodeLoading()
    });
    if (this.props.hierIdAndClick != null) {
      this.selectHierItem(this.props.hierIdAndClick, true);
    }
  },
  selectHierItem(hierId, isCallClickEvent) {
    let item = this.getHierById(hierId);

    if (item)
      this.setState({
        selectedNode: item,
        buttonName: item.Name
      });

    if (!!isCallClickEvent) {
      this.props.onTreeClick(item);
    }
  },
  getHierById(hierId) {
    var data = HierarchyStore.getData();
    if (data) {
      let item = HierarchyStore.findHierItem(data, hierId);
      return item;
    }
    return null;
  },
  setErrorText: function(newErrorText) {
    this.setState({
      errorText: newErrorText
    });
  },
  _onTreeClick: function(node) {
    this.props.onTreeClick(node);
    this.setState({
      open: false,
      selectedNode: node,
      buttonName: node.Name
    });
  },
  getInitialState: function() {
    return {
      open: false,
      hieList: null,
      selectedNode: null,
      buttonName: I18N.Hierarchy.ButtonName,
      isLoading: false
    };
  },
  componentWillMount: function() {
    HierarchyAction.loadall(this.context.currentRoute.params.customerId, this.props.isDimTreeShow);
  },
  componentDidMount: function() {
    HierarchyStore.addHierarchyNodeListener(this._onChange);
    HierarchyStore.addNodeLoadingListener(this._onNodeLoadingChange);

    if (this.props.hierId !== null) {
      this.selectHierItem(this.props.hierId, false);
    }
  },
  componentWillUnmount: function() {
    HierarchyStore.removeHierarchyNodeListener(this._onChange);
    HierarchyStore.removeNodeLoadingListener(this._onNodeLoadingChange);

  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hierId !== null && nextProps.hierId != this.props.hierId) {
      this.selectHierItem(nextProps.hierId, false);
    }
    if (!nextProps.show) {
      this.setState({
        open: false
      });
    }
  },
  onClickAway: function() {
    if (this.props.show) {
      if (this.props.handleClickAwa) {
        this.props.handleClickAway();
      } else {
        this.setState({
          open: false
        })
      }

    }

  },
  render: function() {
    var dropdownPaper,
      paperStyle = {
        backgroundColor: '#ffffff',
        zIndex: '100',
        width: '300px',
        height: '390px',
        position: 'fixed',
        border: '1px solid #c9c8c8',
        margin: '12px 10px'
      };

    if (this.state.open && this.props.show) {
      if (this.state.isLoading) {
        dropdownPaper = (
          <Paper style={paperStyle}>
              <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '160px'
          }}>
              <CircularProgress  mode="indeterminate" size={80} />
            </div>
          </Paper>
        )
      } else {
        if (this.state.selectedNode) {
          dropdownPaper = <HierarchyTree onClickAway={this.onClickAway} allNode={this.state.hieList} selectedNode={this.state.selectedNode} onTreeClick={this._onTreeClick}/>;
        } else {
          dropdownPaper = <HierarchyTree onClickAway={this.onClickAway} allNode={this.state.hieList} selectedNode={this.state.hieList} onTreeClick={this._onTreeClick}/>;
        }
      }



    }
    ;
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

    return (
      <div className='jazz-hierarchybutton' style={{
        display: 'inline-block'
      }}>
              <div className='hiername' onClick={this._onShowPaper} title={this.state.buttonName}>
                {this.state.buttonName}
              </div>
              {errorTextElement}
                {dropdownPaper}
            </div>
      );
  }
});

module.exports =HierarchyButton;
