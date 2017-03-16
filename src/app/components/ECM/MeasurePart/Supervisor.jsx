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
            modal={true}
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
  }

  state={
    operationMenuOpen:false,
    anchorEl:null,
    editDialogShow:false
  }

  render(){
    var {person}=this.props;
    var me=this;

    var styles={
      btnStyle:{
        height:'25px',
        lineHeight:'25px',
        border:'1px solid #abafae',
        borderRadius:'20px'
      },
      label:{
        fontSize:'12px'
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
            style={{overflowY: 'auto',maxWidth:'230px',maxHeight:'500px',padding:'15px',overflowX:'hidden'}}
          >
          {
            this.props.supervisorList===null
                                    ? <div className="flex-center">
                                          <CircularProgress  mode="indeterminate" size={80} />
                                      </div>
                                    :  this.props.supervisorList.size===0
                                                            ? <div style={{height:'40px',width:'100px',fontSize:'14px'}}>
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
                                                <div className="edit" onClick={(e)=>{
                                                    this.setState({
                                                      editDialogShow:true,
                                                      editPerson:Immutable.fromJS(supervisor),
                                                      operationMenuOpen: false,
                                                    });
                                                    e.stopPropagation();
                                                  }}>{I18N.Common.Button.Edit}</div>
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
            }}>{I18N.Setting.ECM.AddSupervior}</div>
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
      </div>
    )
  }

}

SupervisorDropDownMenu.propTypes={
  person:PropTypes.object,
  onSuperviorClick:PropTypes.func,
  superviorList:PropTypes.array
}

export default class Supervisor extends Component {

  _renderEditContent(){
    var classname=this.props.usedInDetail?"indetail":null;
    return(
      <div className={classname}>
        <div className="labelitem">{I18N.Setting.CustomerManagement.Principal}</div>
        {this.props.usedInDetail && ':'}
        <SupervisorDropDownMenu {...this.props}/>
      </div>
    )
  }

  _renderViewContent(){
    var classname=this.props.usedInDetail?"indetail":null;
    return(
      <div className={classname}>
        <div className="labelitem">{I18N.Setting.CustomerManagement.Principal}</div>
        {this.props.usedInDetail && ':'}
        <div>{this.props.person===null?'-':`${this.props.person.get('Name')} ${this.props.person.get('PhoneNumber')}`}</div>
      </div>
    )
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
  supervisorList:PropTypes.array
}
