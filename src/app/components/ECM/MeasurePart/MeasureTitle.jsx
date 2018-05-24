import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'controls/CustomTextField.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import IconButton from 'material-ui/IconButton';

export class EnergySys extends Component {

  _renderEnergySys(){
    var {EnergySys}=this.props.measure.get('Problem').toJS();
    var energySysList=MeasuresStore.getAllEnergySys();
    return(<div style={{marginLeft:'30px'}}>
            <div className='jazz-ecm-push-operation-label'>{I18N.Setting.DataAnalysis.EnergyProblem.Mark}</div>
            <DropDownMenu
                    style={{height: '36px',width:'220px',marginTop:'8px'}}
                    labelStyle={{fontSize:'14px',color:"#626469",border:"1px solid #e6e6e6",borderRadius: "4px",lineHeight:'36px',height:'36px',paddingLeft:'11px',paddingRight:'28px'}}
                      iconButton={<IconButton iconClassName="icon-arrow-unfold" iconStyle={{fontSize:"10px"}} style={{width:14,height:14}}/>}
                      iconStyle={{marginTop:'-12px',padding:'0',right:'15',width:'24px',top:'8px'}}
                      underlineStyle={{border:'none'}}
                      menuItemStyle={{width:'220px'}}
                      menuStyle={{width:'220px'}}
                      listStyle={{width:'220px'}}
                    value={EnergySys}
                    onChange={(e, selectedIndex, value)=>{
                      this.props.merge(['Problem','EnergySys'],value)
                    }}>
      <MenuItem primaryText={energySysList.AirConditioning.label} value={energySysList.AirConditioning.value}/>
      <MenuItem primaryText={energySysList.Boiler.label} value={energySysList.Boiler.value}/>
      <MenuItem primaryText={energySysList.StrongElectricity.label} value={energySysList.StrongElectricity.value}/>
      <MenuItem primaryText={energySysList.WeakElectricity.label} value={energySysList.WeakElectricity.value}/>
      <MenuItem primaryText={energySysList.Drainage.label} value={energySysList.Drainage.value}/>
      <MenuItem primaryText={energySysList.AirCompression.label} value={energySysList.AirCompression.value}/>
      <MenuItem primaryText={energySysList.Other.label} value={energySysList.Other.value}/>
    </DropDownMenu>

    </div>

    )
  }

  render(){
    var {canEnergySysEdit,measure}=this.props;
    var {Problem}=measure.toJS();
    return(
      <div style={{display:'flex',justifyContent:'cneter'}}>
        {canEnergySysEdit?this._renderEnergySys()
                         :<div style={{marginLeft:'30px'}}>
                           <div className='jazz-ecm-push-operation-label'>{I18N.Setting.DataAnalysis.EnergyProblem.Mark}</div>
                           <div style={{fontSize:'14px',color:'#666666',marginTop:'16px',width:'220px'}}>{MeasuresStore.getEnergySys(Problem.EnergySys)}</div>
                           </div>}
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
      var {Solutions}=measure.toJS();
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
