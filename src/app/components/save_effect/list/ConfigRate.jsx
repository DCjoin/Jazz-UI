import React, { Component } from 'react';
import NewDialog from 'controls/NewDialog.jsx';
import {getEffectRateTag,saveeffectratetag} from 'actions/save_effect_action.js';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import { CircularProgress} from 'material-ui';
import classNames from 'classnames';
import Immutable from "immutable";
import CommonFuns from '../../../util/Util.jsx';
import TagSelect from '../../KPI/Single/TagSelect.jsx';
import FlatButton from "controls/NewFlatButton.jsx";

export default class ConfigRate extends Component {

  contextTypes:{
      currentRoute: React.PropTypes.object,
  }

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
        this._onDialogDismiss = this._onDialogDismiss.bind(this);
        this._onTagSave = this._onTagSave.bind(this);
  }

  state={
    taglist:null,
    tagNo:1,
    tagDialogShow:false,
    configIndex:null
  }

  _onChanged(){
    this.setState({
      taglist:ListStore.getRateTagList()
    })
  }

  _switchTab(index){
    this.setState({
      tagNo:index
    })
  }

  _tagShow(index){
    this.setState({
      tagDialogShow:true,
      configIndex:index
    })
  }

  _onDialogDismiss(){
    this.setState({
      tagDialogShow:false,
      configIndex:null
    })
  }

  _onTagSave(tag){
    var list=this.state.taglist;
    if(this.state.tagNo===1){
      list=list.setIn(["CommodityEffectRateTag",this.state.configIndex,'TagId'],tag.get('Id'));
      list=list.setIn(["CommodityEffectRateTag",this.state.configIndex,'TagName'],tag.get('Name'));
    }else{
      list=list.setIn(["EnergySystemEffectRateTag",this.state.configIndex,'TagId'],tag.get('Id'));
      list=list.setIn(["EnergySystemEffectRateTag",this.state.configIndex,'TagName'],tag.get('Name'));
    }
    this.setState({
      taglist:list,
      tagDialogShow:false,
      configIndex:null
    })
  }

  _renderTab(){
    return(
      <div className="jazz-rate_config-tabs">
        <span className={classNames({
            "selected":this.state.tagNo===1
          })} onClick={this._switchTab.bind(this,1)}>{I18N.Common.Glossary.Commodity}</span>
          <span className={classNames({
              "selected":this.state.tagNo===2
            })} onClick={this._switchTab.bind(this,2)}>{I18N.SaveEffect.EnergySystem}</span>
      </div>
    )
  }

  _renderCommodity(){
    var list=this.state.taglist.get("CommodityEffectRateTag");
    if(list.size!==0){
      return(
        <div className="jazz-rate_config-list">
          {list.map((item,index)=>(
            <div className="jazz-rate_config-list-item">
              <span className="name">{CommonFuns.getCommodityById(item.get("CommodityId")).Comment}</span>
              <span>
                {item.get("TagId")?<div className="tagshow">
                                      <span className="name">{item.get("TagName")}</span>
                                      <span className="operation" style={{marginLeft:'10px'}} onClick={this._tagShow.bind(this,index)}>{I18N.SaveEffect.SelectTagAgain}</span>
                                    </div>
                                  :<div className="operation" onClick={this._tagShow.bind(this,index)}>{I18N.SaveEffect.SelectTag}</div>}
              </span>
            </div>
          ))}
        </div>
      )
    }

  }

  _renderEnergySystem(){
    var list=this.state.taglist.get("EnergySystemEffectRateTag");
    if(list.size!==0){
      return(
      <div className="jazz-rate_config-list">
        {list.map((item,index)=>(
          <div className="jazz-rate_config-list-item">
            <span className="name">{ListStore.getEnergySystem(item.get("EnergySystem"))}</span>
            <span>
              {item.get("TagId")?<div className="tagshow">
                                    <span className="name">{item.get("TagName")}</span>
                                    <span className="operation" style={{marginLeft:'10px'}} onClick={this._tagShow.bind(this,index)}>{I18N.SaveEffect.SelectTagAgain}</span>
                                  </div>
                                :<div className="operation" onClick={this._tagShow.bind(this,index)}>{I18N.SaveEffect.SelectTag}</div>}
            </span>
          </div>
        ))}
      </div>
    )
  }
  }


  componentDidMount(){
    getEffectRateTag(this.props.hierarchyId);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }


  render(){
    if(this.state.taglist===null){
      return(
        <NewDialog
          open={true}
          modal={false}
          isOutsideClose={false}
          onRequestClose={this.props.onClose}>
          <div className="flex-center">
           <CircularProgress  mode="indeterminate" size={80} />
         </div>
        </NewDialog>
      )
    }else {
      var tagProps={
        key:'tagselect',
        hierarchyId:this.props.hierarchyId,
        hierarchyName:this.props.hierarchyName,
        title:I18N.EM.Report.SelectTag,
        onSave:this._onTagSave,
        onCancel:this._onDialogDismiss
      },
      actions=[
        <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right'}} onTouchTap={this.props.onClose}/>,
        <FlatButton label={I18N.Common.Button.Save} primary={true} style={{float:'right',marginRight:'20px'}} onTouchTap={()=>{this.props.onSave(this.state.taglist)}}/>
      ];
      return(
        <NewDialog
          open={true}
          isOutsideClose={false}
          onRequestClose={this.props.onClose}
          titleStyle={{margin:'0 22px',padding:"15px 0 15px 8px",fontSize:'14px', fontWeight: 600,borderBottom:'1px solid #e6e6e6'}}
          contentStyle={{overflowY:"auto",display:'block',paddingLeft:"8px",margin:"0 22px",borderBottom:'1px solid #e6e6e6'}}
          actionsContainerStyle={{margin:'15px 22px'}}
          title={I18N.SaveEffect.ConfigSaveRatio}
          actions={actions}
          >
          {this._renderTab()}
          {this.state.tagNo===1?this._renderCommodity():this._renderEnergySystem()}
          {this.state.tagDialogShow && <TagSelect {...tagProps}/>}

        </NewDialog>
      )
    }

  }
}

ConfigRate.propTypes = {
  hierarchyName:React.PropTypes.string,
  hierarchyId:React.PropTypes.number,
  onClose:React.PropTypes.func,
  onSave:React.PropTypes.func,
};
