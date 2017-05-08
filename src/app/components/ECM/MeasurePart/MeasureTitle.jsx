import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'controls/CustomTextField.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

export class EnergySys extends Component {

  _renderEnergySys(){
    var {EnergySys}=this.props.measure.get('EnergyProblem').toJS();
    var energySysList=MeasuresStore.getAllEnergySys();
    return(
      <DropDownMenu style={{marginTop:'-10px',border:'1px solid #d7d7d7',height:'30px',borderRadius:'4px',width: '95px',
                            height: '28px'}}
                    labelStyle={{lineHeight:'30px',paddingLeft:'5px',paddingRight:'0'}}
                    iconStyle={{marginTop:'-10px',padding:'0',right:'0',width:'24px'}}
                    underlineStyle={{border:'none'}}
                    value={EnergySys}
                    onChange={(e, selectedIndex, value)=>{
                      this.props.merge(['EnergyProblem','EnergySys'],value)
                    }}>
      <MenuItem primaryText={energySysList.AirConditioning.label} value={energySysList.AirConditioning.value}/>
      <MenuItem primaryText={energySysList.Boiler.label} value={energySysList.Boiler.value}/>
      <MenuItem primaryText={energySysList.StrongElectricity.label} value={energySysList.StrongElectricity.value}/>
      <MenuItem primaryText={energySysList.WeakElectricity.label} value={energySysList.WeakElectricity.value}/>
      <MenuItem primaryText={energySysList.Drainage.label} value={energySysList.Drainage.value}/>
      <MenuItem primaryText={energySysList.AirCompression.label} value={energySysList.AirCompression.value}/>
      <MenuItem primaryText={energySysList.Other.label} value={energySysList.Other.value}/>
    </DropDownMenu>
    )
  }

  render(){
    var {canEnergySysEdit,measure}=this.props;
    var {EnergyProblem}=measure.toJS();
    return(
      <div style={{display:'flex',justifyContent:'cneter'}}>
        {canEnergySysEdit?this._renderEnergySys()
                         :<div style={{fontSize:'16px',minWidth:'40px'}}>{MeasuresStore.getEnergySys(EnergyProblem.EnergySys)}</div>}
      </div>
    )
  }
}

EnergySys.propTypes = {
  measure:React.PropTypes.object,
  canNameEdit:React.PropTypes.bool,
  canEnergySysEdit:React.PropTypes.bool,
  merge:React.PropTypes.func,
};

export class MeasureTitle extends Component {

    constructor(props) {
      super(props);
    }

    _renderName(){
      var {canNameEdit,measure}=this.props;
      var {EnergySolution}=measure.toJS();
      return(
        <div style={{display:'flex',fontSize:'16px',alignItems:'center',fontWeight: '500', color: '#1b1f2c'}}>
          <span style={{marginRight:'15px',minWidth:'80px'}}>{I18N.Setting.ECM.Solution}</span>
            {canNameEdit?<TextField key={'EnergySolution_'+EnergySolution.Id+'_Name'}
                                    isNumber={false}
                                    onChange={(ev,value)=>{
                                      if(value===''){value=null}
                                      this.props.merge(['EnergySolution','Name'],value)
                                    }}
                                    value={EnergySolution.Name}
                                    style={{marginTop:'-5px'}}
                                    displayFn={(value)=>{
                                                if(value===''){value=null}
                                                 return MeasuresStore.getDisplayText(value)
                                              }}/>
                                  :<div className="jazz-ecm-measure-viewabletext">{EnergySolution.Name || '-'}</div>}
              </div>
      )
    }


    render(){
      return(
        <div className="jazz-ecm-measure-title">
          {this._renderName()}
        </div>
      )
    }

  }

  MeasureTitle.propTypes = {
    measure:React.PropTypes.object,
    canNameEdit:React.PropTypes.bool,
    canEnergySysEdit:React.PropTypes.bool,
    merge:React.PropTypes.func,
  };
