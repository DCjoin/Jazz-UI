import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import {ItemForDraft} from './Item.jsx';
import { CircularProgress,Dialog,Snackbar} from 'material-ui';
import FlatButton from "controls/NewFlatButton.jsx";
import {deleteItem,getDrafts} from 'actions/save_effect_action.js';
import ListStore from 'stores/save_effect/ListStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import Create from '../create';
import util from 'util/Util.jsx';

function privilegeWithSaveEffect( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}
function isFull() {
	return privilegeWithSaveEffect(privilegeUtil.isFull.bind(privilegeUtil));
}

export default class Draft extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
        this._onDraftDelete = this._onDraftDelete.bind(this);
  }

  state={
    drafts:null,
		createShow:false,
		configIndex:null
  }

  _onDraftDelete(index){
    this.setState({
      deleteConfirmShow:true,
      deleteIndex:index
    })
  }

	_onConfig(index){
		this.setState({
			configIndex:index,
			createShow:true
		})
	}

  _onChanged(){
    this.setState({
      drafts:ListStore.getDrafts()
    })
  }

  _renderDeleteDialog(){
    let draft=this.state.drafts.getIn([this.state.deleteIndex]);
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
          deleteItem(draft.get('Id'));
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

	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this.setState({
			drafts:null
		},()=>{
			getDrafts(nextContext.hierarchyId);
		});
		}
	}

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }

  render(){
    if(this.state.drafts===null){
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
          {this.state.drafts.size===0?
            <div className="jazz-effect-list-content flex-center">
              <FontIcon className="icon-energymost" style={{fontSize:'60px'}} color="#32ad3d"/>
             <div className="nolist-font">{I18N.SaveEffect.NoDraft}</div>
           </div>
            :<div className="jazz-effect-list-content">
          {this.state.drafts.map((item,index)=>(<ItemForDraft effect={item} onDelete={()=>{this._onDraftDelete(index)}} canEdit={isFull()} onContinue={this._onConfig.bind(this,index)}/>))}
          </div>}
          {this.state.deleteConfirmShow && this._renderDeleteDialog()}
					{this.state.createShow && true && <Create
						filterObj ={this.state.drafts.getIn([this.state.configIndex]).toJS()}
						onSubmitDone={()=>{getDrafts(this.context.hierarchyId);}}
						onClose={(isSuccess)=>{
							if(isSuccess){
								this.setState({
									createShow:false,
									configIndex:null,
									saveSuccessText:I18N.SaveEffect.ConfigSuccess,
									drafts:null
								})
							}else {
								this.setState({
									createShow:false,
									configIndex:null,
									drafts:null
								},()=>{
									getDrafts(this.context.hierarchyId)
								})
							}

						}}/>}
					<Snackbar ref="snackbar" autoHideDuration={4000} open={!!this.state.saveSuccessText} onRequestClose={()=>{this.setState({saveSuccessText:null})}} message={this.state.saveSuccessText}/>
        </div>
      </div>
      )
    }
  }
}
