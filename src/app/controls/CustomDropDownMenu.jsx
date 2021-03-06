import React, { Component, Children } from 'react';
import {Menu} from 'material-ui/Menu';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import PropTypes from 'prop-types';

export default class CustomDropDownMenu extends Component {
  static propTypes= {
    value: PropTypes.any,
    children: PropTypes.node,
    onChange: PropTypes.func,
    height: PropTypes.stringOrNumber,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    selfTarget: PropTypes.bool,
  };
  static defaultProps = {
    height: 40,
    backgroundColor: '#ffffff',
    color: '#626469',
    selfTarget: false
  };
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: this.props.selfTarget ? event.currentTarget : event.currentTarget.parentNode,
      width: this.props.selfTarget ? event.currentTarget.clientWidth : event.currentTarget.parentNode.clientWidth
    });
  };
  handleItemTouchTap = (event, child, index) => {
    this.setState({
      open: false
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(event, index, child.props.value);
      }
    });
  };
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  render() {
    let displayValue = '';
    Children.forEach(this.props.children, (child) => {
      if (child && this.props.value === child.props.value) {
        displayValue = child.props.label || child.props.primaryText;
      }
    });

    return (
      <div className='jazz-custom-dropdown-menu' style={{
        height: this.props.height,
        backgroundColor: this.props.backgroundColor,
        color: this.props.color,
      }}>
        <div className='jazz-custom-dropdown-menu-label' onClick={this.handleTouchTap}>
          <span>{displayValue}</span>
          <span className="icon-arrow-down" />
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu desktop={true} value={this.props.value} width={this.state.width} onItemClick={this.handleItemTouchTap}>
            {this.props.children}
          </Menu>
        </Popover>
      </div>
    );
  }
}
