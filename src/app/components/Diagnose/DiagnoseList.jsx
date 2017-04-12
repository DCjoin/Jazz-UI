import React, { Component } from 'react';
import {DiagnoseStatus} from '../../constants/actionType/Diagnose.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { FontIcon, IconButton, IconMenu,MenuItem,CircularProgress} from 'material-ui';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';

function privilegeWithSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class DiagnoseList extends Component {


  constructor(props, ctx) {
  				super(props);
  				this._onTitleMenuSelect = this._onTitleMenuSelect.bind(this);
					this._onChanged = this._onChanged.bind(this);
          this._onDelete = this._onDelete.bind(this);
          this._onResume = this._onResume.bind(this);
  		}

  state={
  				dialogType:null,
					chartData:null
  		}

	_onChanged(){
		this.setState({
			chartData:DiagnoseStore.getDiagnoseChartData()
		})
	}

  _onTitleMenuSelect(e, item) {
  		this.setState({
  			dialogType:item.key
  		},()=>{
        if(item.key==='Edit'){
          this.props.onEdit(this.props.selectedNode)
        }
      })
  	}

  _onDelete(){
		this.setState({
										dialogType: null
									},()=>{
										DiagnoseAction.deletediagnose(this.props.selectedNode.get('Id'))
									})
	}

	_onResume(){
		this.setState({
			dialogType: null
		},()=>{
			DiagnoseAction.pauseorrecoverdiagnose(this.props.selectedNode.get('Id'),DiagnoseStatus.Normal);
		})
	}

	_renderIconMenu(){
		var {Status}=this.props.selectedNode.toJS();
		var IconButtonElement = <IconButton iconClassName="icon-more" iconStyle={{
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
															{Status===DiagnoseStatus.Suspend && <MenuItem key="Resume" primaryText={I18N.Setting.Diagnose.Resume}/>}
															<MenuItem key="Edit" primaryText={I18N.Common.Button.Edit}/>
															<MenuItem key="Delete" primaryText={I18N.Common.Button.Delete}/>
													 </IconMenu>
		)

	}

  	_renderRusumeDialog(){
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
                label={I18N.Platform.ServiceProvider.Reset}
                onClick={this._onResume} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.ResumeDiagnoseList,Name)}</div></NewDialog>
      )
    }

  	_renderDeleteDialog(){
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
                label={I18N.Common.Button.Delete}
                onClick={this._onDelete} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.DeleteDiagnoseList,Name)}</div></NewDialog>
      )
    }

	componentDidMount(){
		DiagnoseStore.addChangeListener(this._onChanged);
		DiagnoseAction.getdiagnosedata(this.props.selectedNode.get('Id'));
	}

  componentWillReceiveProps(nextProps){
    if(this.props.selectedNode.get('Id')!==nextProps.selectedNode.get('Id')){
      DiagnoseAction.getdiagnosedata(nextProps.selectedNode.get('Id'));
    }
  }

	componentWillUnmount(){
		DiagnoseStore.removeChangeListener(this._onChanged);
	}

  render(){
    var {Status,Name}=this.props.selectedNode.toJS();
    var dialog;

    switch (this.state.dialogType) {
    			case 'Resume':
    				dialog=this._renderRusumeDialog();
    				break;
    			case 'Delete':
    					dialog=this._renderDeleteDialog();
    				break;
    			default:

    		}

    return(
      <div className="content">
        <div className="content-head">
          <div className="side">
            <div className="text">{Name}</div>
            {Status===DiagnoseStatus.Suspend && <FontIcon className="icon-more" style={{fontSize:'14px',marginLeft:'15px'}}/>}
          </div>
          {isFull() && this._renderIconMenu()}
        </div>
				<div className="content-chart">
					{this.state.chartData?<DiagnoseChart data={this.state.chartData}/>
															 :<div className="flex-center" style={{flex:'none'}}>
         						 							<CircularProgress  mode="indeterminate" size={80} />
       													</div>}
				</div>
        {dialog}
      </div>
    )
  }
}

DiagnoseList.propTypes={
  selectedNode:React.PropTypes.object,
  onEdit:React.PropTypes.func,
}