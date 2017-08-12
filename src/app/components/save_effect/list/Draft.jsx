import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import {ItemForDraft} from './Item.jsx';
import { CircularProgress,Dialog} from 'material-ui';
import FlatButton from "controls/NewFlatButton.jsx";
import {deleteItem,getDrafts} from 'actions/save_effect_action.js';
import ListStore from 'stores/save_effect/ListStore.jsx';

export class Draft extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
        this._onDraftDelete = this._onDraftDelete.bind(this);
  }

  _onDraftDelete(index){
    this.setState({
      deleteConfirmShow:true,
      deleteIndex:index
    })
  }

  _renderDeleteDialog(){
    let draft=this.state.effect.get('Drafts').getIn([this.state.deleteIndex]);
    let actions = [
      <FlatButton
      inDialog={true}
      primary={true}
      label={I18N.Template.Delete.Delete}
      style={{backgroundColor:'#dc0a0a',marginRight:'20px'}}
      onTouchTap={()=>{
        this.setState({
          deleteConfirmShow:false,
          deleteIndex:null
        },()=>{
          deleteItem(draft.get('EnergyEffectItemId'));
        })
      }}
      />,
      <FlatButton
      label={I18N.Common.Button.Cancel2}
      style={{borderRadius: "2px",border: 'solid 1px #9fa0a4'}}
      onTouchTap={()=>{
        this.setState({
          deleteConfirmShow:false,
          deleteIndex:null
        })
      }}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      actions: actions,
      modal: true,
      open: true,
    };
    return(
      <Dialog {...dialogProps}>
        <div style={{
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            fontSize: "14px",
            color: "#626469"
          }}>
          {I18N.format(I18N.SaveEffect.DraftDeleteConfirm,draft.get('TagName'))}
        </div>

      </Dialog>
    )
  }

  componentDidMount(){
    getDrafts(this.context.hierarchyId);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }

  render(){
    if(this.state.effect===null){
      return (
        <div className="jazz-effect-list flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else{
      return(
        <div className="jazz-effect-overlay">
        <div className="jazz-effect-list">
          <div className="jazz-effect-list-header">
            <div className="jazz-effect-list-title" style={{margin:'20px 0 5px 0'}}>{I18N.SaveEffect.Draft}</div>
          </div>
          {this.state.effect.get('Drafts').size===0?
            <div className="jazz-effect-list-content flex-center">
              <FontIcon className="icon-weather-thunder" style={{fontSize:'60px'}} color="#32ad3d"/>
             <div className="nolist-font">{I18N.SaveEffect.NoDraft}</div>
           </div>
            :<div className="jazz-effect-list-content">
          {this.state.effect.get('Drafts').map((item,index)=>(<ItemForDraft effect={item} onDelete={()=>{this._onDraftDelete(index)}} canEdit={isFull()}/>))}
          </div>}
          {this.state.deleteConfirmShow && this._renderDeleteDialog()}
        </div>
      </div>
      )
    }
  }
}