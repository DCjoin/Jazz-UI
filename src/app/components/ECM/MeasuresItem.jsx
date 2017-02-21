import React, { Component } from 'react';
import Config from 'config';
import assign from 'object-assign';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';

function getUrl(url) {
	return "url(" + Config.ServeAddress + url+")";
}

class IconText extends Component{
  render(){
    var style=assign({},{color:'#464949',marginLeft:'30px'},this.props.style);
    return(
      <div style={style}>
        <div style={{display:'flex',flexDirection:'row'}}>
          {this.props.icon}
          <div style={{fontSize:'12px'}}>{this.props.label}</div>
        </div>
        <div style={{fontSize:'14px'}}>{this.props.value}</div>
      </div>
    )
  }
}

IconText.propTypes = {
  icon:React.PropTypes.string,
  label:React.PropTypes.bool,
  value:React.PropTypes.func,
  style:React.PropTypes.object,
};

export default class MeasuresItem extends Component {

    constructor(props) {
      super(props);
      this._onValueChange = this._onValueChange.bind(this);
    }

    _renderContent(){
      var {measure}=this.props;
      var {cost,sum,period}=measure.toJS();
      let iconStyle = {
          fontSize: '16px'
        },
        style = {
          padding: '0px',
          height: '18px',
          width: '18px',
          fontSize: '18px',
          marginTop:'-5px'
        };
      var costIcon=<FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />,
          sumIcon=<FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />,
          periodIcon=<FontIcon className="icon-line" iconStyle ={iconStyle} style = {style} />;
      return(
        <div className="content">
          <div className="left">
            <div className="image" style={{backgroundImage:getUrl(measure.getIn(['Url',0]))}}></div>
            <IconText icon={costIcon} label={I18N.Setting.ECM.EstimatedAnnualCostSavings} value={cost}/>
            <IconText icon={sumIcon} label={I18N.Setting.ECM.InvestmentAmount} value={sum}/>
            <IconText icon={periodIcon} label={I18N.Setting.ECM.PaybackPeriod} value={period}/>
          </div>
        </div>
      )
    }

    _renderName(){
      return(
        <div className="name">
          <Checkbox value={this.props.measure.get('Id')}
                    label={this.props.measure.get("Name")}
                    checked={this.props.isChecked}
                    onCheck={this.props.onChecked}/>
        </div>
      )
    }

	render() {

    return(
      <div className="jazz-energy-conservation-measuresItem">
        {this._renderName()}
      </div>
    )

  }
}
MeasuresItem.propTypes = {
  measure:React.PropTypes.string,
  isChecked:React.PropTypes.bool,
  onChecked:React.PropTypes.func,
};
