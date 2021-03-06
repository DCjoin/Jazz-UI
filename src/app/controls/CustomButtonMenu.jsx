import React, { Component, Children } from 'react';
import {Menu} from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import PropTypes from 'prop-types';

export default class CustomButtonMenu extends Component {
  static propTypes= {
    label: PropTypes.string,
    children: PropTypes.node,
    onItemTouchTap: PropTypes.func,
    height: PropTypes.stringOrNumber,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    disabled:PropTypes.string,
  };
  static defaultProps = {
    height: 36,
    //backgroundColor: '#fff',
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
      if (this.props.onItemTouchTap) {
        this.props.onItemTouchTap(event, index, child.props.value);
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
    var menuButton = <RaisedButton labelPosition="before" style={{
      maxWidth: '140px',
      height: '36px',
      marginBottom: '5px',
      lineHeight:'34px',
      backgroundColor:this.props.backgroundColor
    }} label={this.props.label} onClick={this.handleTouchTap} disabled={this.props.disabled}>
                      <FontIcon className="icon-arrow-unfold" style={{
      fontSize: '10px',
      marginRight: '10px',
      marginLeft: '-5px'
    }}
    />
                    </RaisedButton>;
    return (
      <div className='jazz-custom-dropdown-menu' style={{
        height: this.props.height,
        backgroundColor: this.props.backgroundColor,
        color: this.props.color,
      }}>
        {menuButton}
        <Popover
          style={{
            overflow:'visible'
          }}
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
