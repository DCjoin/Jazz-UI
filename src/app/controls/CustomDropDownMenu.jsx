import React, { Component, Children } from 'react';
import {Menu} from 'material-ui/Menu';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';


export default class CustomDropDownMenu extends Component {
  static propTypes = {
    value: React.PropTypes.any,
    children: React.PropTypes.node,
    onChange: React.PropTypes.func,
    height: React.PropTypes.stringOrNumber,
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
  };
  static defaultProps = {
    height: 40,
    backgroundColor: '#354052',
    color: '#fff'
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
      anchorEl: event.currentTarget.parentNode,
      width: event.currentTarget.parentNode.clientWidth
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
          <Menu desktop={true} value={this.props.value} width={this.state.width} onItemTouchTap={this.handleItemTouchTap}>
            {this.props.children}
          </Menu>
        </Popover>
      </div>
    );
  }
}