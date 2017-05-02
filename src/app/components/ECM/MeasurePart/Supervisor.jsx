'use strict';
import React, {Component,PropTypes} from 'react';
import classNames from 'classnames';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import CircularProgress from 'material-ui/CircularProgress';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import Immutable from 'immutable';
import FlatButton from 'controls/FlatButton.jsx';
import Regex from 'constants/Regex.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import _ from 'lodash';
import NewDialog from 'controls/NewDialog.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import {IconText} from '../MeasuresItem.jsx';

class SupervisorDialog extends Component{

  constructor(props, ctx) {
    super(props);
    this._onChanged=this._onChanged.bind(this);
    this.handleClickFinish=this.handleClickFinish.bind(this);
    this.handleClickCancel=this.handleClickCancel.bind(this);
  }

  state={
    person:this.props.person
  }

  _onChanged(path,value){
    this.setState({
      person:this.state.person.set(path,value)
    })

  }

  _getSysList(){
    var energySysList=Immutable.fromJS(MeasuresStore.getAllEnergySys());
    let sysList = [{
      payload: -1,
      text: I18N.EM.Report.Select,
      disabled:true
    }];
      energySysList.forEach(sys => {
        sysList.push({
          payload: sys.get('value'),
          text: sys.get('label')
        });
      });

    return sysList;
  }

  _checkValid(){
  var {Name,PhoneNumber,EnergySys}=this.state.person.toJS();
  if(_.isEmpty(_.trim(Name)) || _.isEmpty(_.trim(EnergySys))) return false
  if(_.isEmpty(_.trim(PhoneNumber)) || !Regex.TelephoneRule.test(PhoneNumber)) return false
  return true
  }

  handleClickFinish(){
    MeasuresAction.saveSupervisor(this.state.person.toJS(),(supervisor)=>{
      this.props.onSuperviorClick(supervisor.Id)
    });
    this.props.onSave();
  }

  handleClickCancel(){
    this.props.onCancle();
  }

  componentDidMount() {
    if (this.refs.name) {
      this.refs.name.focus();
    }
  }

  render(){
    var energySysList=MeasuresStore.getAllEnergySys();
    var nameProps = {
      defaultValue: this.state.person.get('Name') || "",
      isRequired: true,
      didChanged: (value)=>{this._onChanged('Name',value)},
      title: I18N.Template.User.Name,
      hintText:I18N.Setting.ECM.InputSuperviorNameHintText,
      autoFocus: true
    };
    var name = (
      <ViewableTextField isViewStatus={false} ref="name" {...nameProps}/>
    );
    var phoneNumberProps = {
      defaultValue: this.state.person.get('PhoneNumber') || "",
      isRequired: true,
      didChanged: (value)=>{this._onChanged('PhoneNumber',value)},
      title: I18N.Setting.UserManagement.Telephone,
      hintText:I18N.Setting.ECM.InputSuperviorTeleHintText,
      regex: Regex.MobilePhoneRule,
      errorMessage: I18N.Setting.ECM.TelephoneErrorMsg,
    };
    var phoneNumber = (
      <ViewableTextField ref="phone" {...phoneNumberProps}/>
    );
    var sysProps = {
        ref: 'sys',
        isViewStatus: false,
        title: I18N.Setting.ECM.SysTitle,
        defaultValue: this.state.person.get('EnergySys') || -1,
        dataItems: this._getSysList(),
        didChanged: value => {this._onChanged('EnergySys',value)}
      };
    var sys=(<ViewableDropDownMenu {...sysProps}/>);
    var disabled = !this._checkValid();
    var saveButtonTitle = I18N.Setting.ECM.SaveAndAssign;

    return (
      <NewDialog
        title={I18N.Setting.ECM.SuperviorInfo}
        actions={[
          <FlatButton
            label={saveButtonTitle}
            disabled={disabled}
            onTouchTap = {this.handleClickFinish} />,
          <FlatButton
            label={I18N.Common.Button.Cancel2}
            onTouchTap={
              this.handleClickCancel
            }/>]}
            dismissOnClickAway={false}
            modapacl={true}
            open={true}
            ref="dialog1"
            style={{
              zIndex: 200
            }}>
            <div className="supervisor-window" onClick={(e)=>{e.stopPropagation()}}>
              <ul>
                <li>{name}</li>
                <li>{phoneNumber}</li>
                <li>{sys}</li>
              </ul>
            </div>
          </NewDialog>
  );
  }
}

class SupervisorDropDownMenu extends Component{

  static contextTypes = {
      hierarchyId: React.PropTypes.string
    };

  constructor(props, ctx) {
    super(props);
    this._onDelete=this._onDelete.bind(this);
  }

  state={
    operationMenuOpen:false,
    anchorEl:null,
    editDialogShow:false,
    deleteDialogShow:false
  }

  _onDelete(event){
    event.preventDefault();
    event.stopPropagation();
    MeasuresAction.deleteSupervisor(this.state.editPerson.get('Id'))
    this.setState({
                    editPerson: null,
                    deleteDialogShow:false
                  })
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
    var {Name,PhoneNumber}=this.state.editPerson.toJS();
    var content=I18N.format(I18N.Setting.ECM.DeleteSupervior,`${Name} ${PhoneNumber}`);
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
              onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.setState({
                              editPerson: null,
                              deleteDialogShow:false
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
  }

  render(){
    var {person}=this.props;
    var me=this;

    var styles={
      btnStyle:{
        width: '155px',
        height: '28px',
        borderRadius: '4px',
        border: 'solid 1px #cbcbcb',
        lineHeight:'28px',
      },
      label:{
        fontSize: '14px',
        color: '#626469',
        paddingLeft:'5px'
      }
    };

    var   handleTouchTap = (event) => {
    // This prevents ghost click.
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        operationMenuOpen: true,
        anchorEl: event.currentTarget,
      });
    };

    var handleRequestClose = () => {
      this.setState({
        operationMenuOpen: false,
      });
    };

    var handleMenuItemClick= (person)=>{
      handleRequestClose();
      if(this.props.person===null || this.props.person.get('Id')!==person.Id){
        this.props.onSuperviorClick(person.Id);
      }

    };

    var label=person?`${person.get('Name')} ${person.get('PhoneNumber')}`:I18N.Setting.ECM.SelectSupervior;
    return(
      <div>
        <FlatButton label={label} labelPosition="before" labelStyle={styles.label} style={styles.btnStyle} icon={<FontIcon className="icon-arrow-down" style={styles.label}/>} onClick={handleTouchTap}/>
          <Popover
            open={this.state.operationMenuOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={handleRequestClose}
            style={{overflowY: 'auto',maxWidth:'220px',maxHeight:'500px',overflowX:'hidden'}}
            className="person-list"
          >
          {
            this.props.supervisorList===null
                                    ? <div className="flex-center">
                                          <CircularProgress  mode="indeterminate" size={80} />
                                      </div>
                                    :  this.props.supervisorList.size===0
                                                            ? <div style={{height:'33px',width:'220px',fontSize:'14px',color:"#0f0f0f"}}>
                                                                  {I18N.Setting.ECM.NoSupervior}
                                                              </div>
                                                              :this.props.supervisorList.map(supervisorList=>{
                                          var list=[];
                                          var {EnergySys,Supervisors}=supervisorList.toJS();
                                          list.push(
                                            <div className="person-item-sys">{MeasuresStore.getEnergySys(EnergySys)}
                                            </div>
                                          )
                                          Supervisors.forEach(supervisor=>{
                                            var {Name,PhoneNumber,Id}=supervisor;
                                            list.push(
                                              <div className={classNames({
                                            'person-item': true,
                                            'selected':person && person.get('Id')===Id
                                          })} onClick={()=>{handleMenuItemClick(supervisor)}}>
                                                <div className="name">{`${Name} ${PhoneNumber}`}</div>
                                                <div className="operate">
                                                  <span className="edit" onClick={(e)=>{
                                                      this.setState({
                                                        editDialogShow:true,
                                                        editPerson:Immutable.fromJS(supervisor),
                                                        operationMenuOpen: false,
                                                      });
                                                      e.stopPropagation();
                                                    }}>{I18N.Common.Button.Edit}</span>
                                                  <span className="delete" onClick={(e)=>{
                                                        this.setState({
                                                          deleteDialogShow:true,
                                                          editPerson:Immutable.fromJS(supervisor),
                                                          operationMenuOpen: false,
                                                        });
                                                        e.stopPropagation();
                                                      }}>{I18N.Common.Button.Delete}</span>
                                                </div>

                                              </div>
                                            )
                                          })
                                          return list
                                        })
          }
          <div className="add" onClick={(e)=>{
              this.setState({
                editDialogShow:true,
                editPerson:Immutable.fromJS({}),
                operationMenuOpen: false,
              })
            }}>
            <FontIcon className="icon-cost_saving" color="#3dcd58" style={{marginRight:'5px',fontSize:'14px'}}/>
            {I18N.Setting.ECM.AddSupervior}</div>
          </Popover>
          {this.state.editDialogShow && <SupervisorDialog person={this.state.editPerson}
                                                          onCancle={()=>{
                                                            this.setState({
                                                              editDialogShow:false,
                                                              operationMenuOpen: true,
                                                            })
                                                          }}
                                                          onSave={()=>{
                                                            this.setState({
                                                              editDialogShow:false,
                                                              operationMenuOpen: false,
                                                            })
                                                          }}
                                                          onSuperviorClick={this.props.onSuperviorClick}/>}
         {this.state.deleteDialogShow && this._renderDeleteDialog()}
      </div>
    )
  }

}

SupervisorDropDownMenu.propTypes={
  person:PropTypes.object,
  onSuperviorClick:PropTypes.func,
  supervisorList:PropTypes.array
}

export default class Supervisor extends Component {

  _renderEditContent(){

    var prop={
      person:this.props.person,
      onSuperviorClick:this.props.onSuperviorClick,
      supervisorList:MeasuresStore.getSupervisorListByEnergySys(this.props.supervisorList,this.props.energySys)
    };

    if(this.props.usedInDetail){
      return(
        <div className="indetail">
          <div className="jazz-ecm-push-operation-label">{I18N.Setting.CustomerManagement.Principal+':'}</div>
          <SupervisorDropDownMenu {...prop}/>
        </div>
      )
    }
    else {
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
        var costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} style = {style} />;
      return(
        <IconText icon={costIcon} label={I18N.Setting.CustomerManagement.Principal}>
          <div style={{marginTop:'10px'}}>
            <SupervisorDropDownMenu {...prop}/>
          </div>

          </IconText>
      )
    }
  }

  _renderViewContent(){
    if(this.props.usedInDetail){
      return(
        <div className="indetail">
          <div className="jazz-ecm-push-operation-label">{I18N.Setting.CustomerManagement.Principal+':'}</div>
          <div style={{fontSize:'14px',color:'#0f0f0f',marginLeft:'5px'}}>{this.props.person===null?'-':`${this.props.person.get('Name')} ${this.props.person.get('PhoneNumber')}`}</div>
        </div>
      )
    }
    else {
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
        var costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} style = {style} />;
      return(
        <IconText icon={costIcon} label={I18N.Setting.CustomerManagement.Principal} uom={this.props.person===null?'-':`${this.props.person.get('Name')} ${this.props.person.get('PhoneNumber')}`}/>
      )
    }


  }

  render(){
    return(
      <div className="person">
      {this.props.canEdit?this._renderEditContent():this._renderViewContent()}
      </div>
    )
  }
}

Supervisor.propTypes={
  person:PropTypes.object,
  canEdit:PropTypes.bool,
  usedInDetail:PropTypes.bool,
  onSuperviorClick:PropTypes.func,
  supervisorList:PropTypes.array,
  energySys:PropTypes.number
}
