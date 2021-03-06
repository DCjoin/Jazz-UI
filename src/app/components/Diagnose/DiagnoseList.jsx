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
import PropTypes from 'prop-types';
function privilegeWithSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return (privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege())
  || privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege()));
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
          this._onUpdate = this._onUpdate.bind(this);
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

  _onUpdate(){
    this.setState({
      chartData:null
    },()=>{
      DiagnoseAction.clearDiagnoseChartData();
      DiagnoseAction.getdiagnosedata(this.props.selectedNode.get('Id'));
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
			fontSize: '14px'
		}} style={{
      width:'30px',
      height:'30px',
      backgroundColor:'#ffffff',
      border:'solid 1px #e3e3e3',
      padding:'0'
		}}/>;
		var iconMenuProps = {
			iconButtonElement: IconButtonElement,
			openDirection: "bottom-right",
			desktop: true
		};
		return(
			<IconMenu {...iconMenuProps} onItemClick={this._onTitleMenuSelect}>
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
    DiagnoseStore.addUpdateDiagnoseListener(this._onUpdate);
		DiagnoseAction.getdiagnosedata(this.props.selectedNode.get('Id'));
	}

  componentWillReceiveProps(nextProps){
    if(this.props.selectedNode.get('Id')!==nextProps.selectedNode.get('Id')){
      this.setState({
        chartData:null
      },()=>{
        DiagnoseAction.getdiagnosedata(nextProps.selectedNode.get('Id'));
      })
    }
  }

	componentWillUnmount(){
		DiagnoseStore.removeChangeListener(this._onChanged);
    DiagnoseStore.removeUpdateDiagnoseListener(this._onUpdate);
	}

  render(){
    var {Status,Name, DiagnoseModel}=this.props.selectedNode.toJS();
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
      <div className="detail-content-content">
        <div className="detail-content-content-head">
          <div className="side">
            <div className="name">{Name}</div>
            {Status===DiagnoseStatus.Suspend && <div className="suspend-font" style={{marginLeft:'10px'}}>{I18N.Setting.Diagnose.Suspend}</div>}
          </div>
          {isFull() && this._renderIconMenu()}
        </div>
				<div className="detail-content-content-problem-chart ">
					{this.state.chartData?<DiagnoseChart isTypeC={DiagnoseModel === 3} data={this.state.chartData}/>
															 :<div className="flex-center">
         						 							<CircularProgress  mode="indeterminate" size={80} />
       													</div>}
				</div>
        {dialog}
      </div>
    )
  }
}

DiagnoseList.propTypes={
  selectedNode:PropTypes.object,
  onEdit:PropTypes.func,
}
