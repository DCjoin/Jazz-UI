import React, { Component } from 'react';
import ReactDom from 'react-dom';
import FontIcon from 'material-ui/FontIcon';
import Move from './Move.jsx';
import FadeOut from './FadeOut.jsx';

export default class DisappareItem extends Component {

  constructor(props) {
    super(props);
  }

  state={
    disappare:false,
    ecmIconShow:false,
    x:null,
    y:null
  }

  componentDidMount(){
    var panel=ReactDom.findDOMNode(this).getBoundingClientRect();
    this.setState({
      x:panel.left,
      y:panel.top
    })
  }

  _getMoveProps(){
    return{
      destX:this.props.destX-this.state.x,
      destY:this.props.destY-this.state.y,
      originX:this.props.width/2,
      originY:90,
      onEnd:this.props.onEnd
    }
  }

  render(){
    let iconStyle = {
        fontSize: '40px'
      },
      style = {
        padding: '0px',
        height: '40px',
        width: '40px',
        fontSize: '40px',
        top:'90px',
        left:`${this.props.width/2}px`,
        position:'absolute'
      };
    return(
      <div className="disappareitem">
        {!this.state.disappare && <div style={{position:'relative'}}>
          {this.props.children}
          <FadeOut width={this.props.width}
              onEnd={()=>{
              this.setState({disappare: true,
                      ecmIconShow:false,})}}
                onEcmIconShow={()=>{
                  this.setState({ecmIconShow:true})
                }}/>
        </div>}
        {this.state.ecmIconShow && <FontIcon className="icon-to-ecm" iconStyle ={iconStyle} style = {style} />}
        {this.state.disappare && this.state.x &&  this.state.y &&<Move {...this._getMoveProps()}/>}
      </div>
    )
  }
}