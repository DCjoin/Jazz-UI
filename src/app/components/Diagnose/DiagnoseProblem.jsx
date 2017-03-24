import React, { Component } from 'react';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { IconButton, IconMenu,MenuItem} from 'material-ui';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isSeniorFull() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class DiagnoseProblem extends Component {


  constructor(props, ctx) {
  				super(props);
  				this._onTitleMenuSelect = this._onTitleMenuSelect.bind(this);

  		}

  state={
  				dialogType:null
  		}

  _onTitleMenuSelect(e, item) {
  		this.setState({
  			dialogType:item.key
  		})
  	}

  _onIgnore(){

	}

	_onSuspend(){

	}

  _onDateSelectorChanged(){

  }
  
	_renderIconMenu(){
		var IconButtonElement = <IconButton iconClassName="icon-arrow-down" iconStyle={{
			fontSize: '16px'
		}} style={{
			padding: '0px',
			height: '18px',
			width: '18px',
			marginLeft: '10px',
			marginTop: '5px'
		}}/>;
		var iconMenuProps = {
			iconButtonElement: IconButtonElement,
			openDirection: "bottom-right",
			desktop: true
		};
		return(
			<IconMenu {...iconMenuProps} onItemTouchTap={this._onTitleMenuSelect}>
															<MenuItem key="Ignore" primaryText={I18N.Setting.Diagnose.Ignore}/>
															<MenuItem key="Suspend" primaryText={I18N.Setting.Diagnose.Suspend}/>
															<MenuItem key="Edit" primaryText={I18N.Setting.Diagnose.Edit}/>
													 </IconMenu>
		)

	}

  	_renderIgnoreDialog(){
      var styles={
        content:{
          padding:'30px',
          display:'flex',
          justifyContent:'center'
        },
        action:{
          padding:'0 30px'
        }
      };
  		var {Name}=this.props.selectedNode.toJS();
      return(
        <NewDialog
          open={true}
          actionsContainerStyle={styles.action}
          overlayStyle={{zIndex:'1000'}}
          contentStyle={styles.content}
          actions={[
              <RaisedButton
                label={I18N.Setting.Diagnose.Ignore}
                onClick={this._onIgnore} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.IgnoreDiagnoseProblem,Name)}</div></NewDialog>
      )
    }

  	_renderSuspendDialog(){
      var styles={
        content:{
          padding:'30px',
          display:'flex',
          justifyContent:'center'
        },
        action:{
          padding:'0 30px'
        }
      };
  		var {Name}=this.props.selectedNode.toJS();
      return(
        <NewDialog
          open={true}
          actionsContainerStyle={styles.action}
          overlayStyle={{zIndex:'1000'}}
          contentStyle={styles.content}
          actions={[
              <RaisedButton
                label={I18N.Platform.ServiceProvider.PauseStatus}
                onClick={this._onSuspend} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.SuspendDiagnoseProblem,Name)}</div></NewDialog>
      )
    }


  render(){
    var {Status,Name}=this.props.selectedNode.toJS();
    var dialog;

    switch (this.state.dialogType) {
    			case 'Ignore':
    				dialog=this._renderIgnoreDialog();
    				break;
    			case 'Suspend':
    					dialog=this._renderSuspendDialog();
    				break;
    			default:

    		}

  var isFull=this.props.isBasic?isBasicFull():isSeniorFull();
    return(
      <div className="content">
        <div className="content-head">
            <div className="text">{Name}</div>
          {isFull && <div className="side">
                      {this._renderIconMenu()}
                      </div>}
        </div>
        <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={this._onDateSelectorChanged} showTime={true}/>
        {dialog}
      </div>
    )
  }
}

DiagnoseProblem.propTypes={
  selectedNode:React.PropTypes.object,
  isBasic:React.PropTypes.bool,
}
