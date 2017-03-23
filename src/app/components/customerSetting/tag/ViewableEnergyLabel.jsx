import React, { Component, Children } from 'react';
import FlatButton from '../../../controls/FlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import DiagnoseStore from '../../../stores/DiagnoseStore.jsx';

export default class ViewableEnergyLabel extends Component {

  static propTypes = {
    isViewStatus: React.PropTypes.bool,
    value: React.PropTypes.number,
  };

  static defaultProps = {
    value:-1
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

  handleItemTouchTap = (id) => {
    this.setState({
      open: false
    }, () => {
      if (this.props.onItemTouchTap) {
        this.props.onItemTouchTap(id);
      }
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  _renderList(label){
    return(
      <div style={{marginTop:'10px'}}>
        <FlatButton key={label} label={I18N.Setting.Diagnose[label]} disabled={true} style={{textAlign:'start'}}/>
        <div className='list'>
          {DiagnoseStore.getLabelList(label).map(item=>(
            <FlatButton key={item.get('Id')} label={item.get('value')} style={{textAlign:'start'}} onClick={()=>{this.handleItemTouchTap(item.get('Id'))}}/>
          ))}
        </div>
      </div>
    )

  }

  _rederMenu(){
    return(
      <div>
        <FlatButton key='-1' label={I18N.Common.CaculationType.Non} style={{textAlign:'start'}} onClick={()=>{this.handleItemTouchTap(-1)}}/>
        {this._renderList('LightingPower')}
        {this._renderList('HVAC')}
        {this._renderList('EnvironmentalParameters')}
      </div>
    )
  }

  render() {
    var labelValue=DiagnoseStore.getLabelById(this.props.value);
    var dropDownMenu;

    if(this.props.isViewStatus){
      dropDownMenu=(
        <div>
          <div className="pop-viewable-title">{I18N.Setting.Diagnose.EnergyLabel}</div>
          <div className="pop-viewable-value">{labelValue}</div>
        </div>

      )
    }else {
      dropDownMenu=(
        <div>
          <div className="pop-viewable-title">{I18N.Setting.Diagnose.EnergyLabel}</div>
          <div className="viewable-energy-label" onClick={this.handleTouchTap}>
            {labelValue}
            <FontIcon className="icon-arrow-down" style={{fontSize: '10px',marginRight: '10px'}}/>
          </div>
          <Popover
            style={{
              overflow:'visible',
              maxWidth:'500px',
              padding:'10px'
            }}
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            {this._rederMenu()}
          </Popover>
        </div>
      )

    }

    return(
      <div className="pop-viewableDropDownMenu  pop-viewableTextField">
                {dropDownMenu}
      </div>
    )
  }
}
