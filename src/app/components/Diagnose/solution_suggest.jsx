import React, { Component } from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';
import Checkbox from 'material-ui/Checkbox';
import { Snackbar} from 'material-ui';
import FlatButton from 'controls/FlatButton.jsx';
import MuiFlatButton from 'material-ui/FlatButton';
import Dialog from 'controls/NewDialog.jsx';
import ImagGroupPanel from 'controls/ImagGroupPanel.jsx';
import Toast from '@emop-ui/piano/toast';
/*

 inputStyle={{width: 42, height: 76}} iconStyle={{padding: '67px 33px'}}

*/
const BACK_DIALOG = 'BACK_DIALOG';
const CANCEL_DIALOG = 'CANCEL_DIALOG';

class SolutionDetailSidebar extends Component {
  render() {
    let { SolutionName, ProblemName, ProblemDescription, ROI, DSIndustryNames, SolutionDescription, Images, RiskDescription, CreatorUserName, onClose } = this.props;
    return (
    <div className='solution-detail-sidebar'>
      <header className='solution-detail-sidebar-header'>{SolutionName}<span onClick={onClose} className='icon-close' /></header>
      <div style={{marginTop: 20}}>
        <div className="session-title">{I18N.Setting.Diagnose.SolutionDetail}</div>
        {SolutionDescription && <div className='session-content'>{SolutionDescription}</div>}
        {ROI !== undefined && ROI !== null && <div className='session-content'>{I18N.Setting.Diagnose.ROI + ': ' + ROI + I18N.EM.Year}</div>}
        <div className='session-content'>{I18N.Setting.Diagnose.Industry + ': ' + DSIndustryNames.map( industry => industry.Name ).join('、')}</div>
        {Images && Images.length > 0 && <div className='session-content'><ImagGroupPanel diagrams={Immutable.fromJS(Images.map(({Url}) => ({
          ImageUrl: Url,
        })))} width={145} height={100} editable={false}/></div>}
      </div>
      <div style={{marginTop: 30}}>
        <div className="session-title">{I18N.Setting.Diagnose.ProblemDetail}</div>
        <div className='session-content' style={{color: '#0f0f0f'}}>{ProblemName}</div>
        <div className='session-content' style={{marginTop: 8}}>{ProblemDescription}</div>
        {RiskDescription && <div className='session-content' style={{color: '#0f0f0f'}}>{I18N.Setting.Diagnose.RiskDescription}</div>}
        {RiskDescription && <div className='session-content' style={{marginTop: 8}}>{RiskDescription}</div>}
      </div>
      <footer className='solution-detail-sidebar-footer'>{I18N.Setting.ECM.PushPanel.CreateUser + ': ' + CreatorUserName}</footer>
    </div>
    );
  }
}

export default class SolutionSuggest extends Component {
  state = {
    dialogKey: null,
    open: false,
    showDetailId: null,
  }
  render() {
    let { plans, checkedPlan, onChange, onNext, onCustom, onBack, onCancel } = this.props;

                /*<Snackbar style={{
          maxWidth: 'none',
          borderRadius: 2,
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2)',
          height: 40,
        }} bodyStyle={{
          backgroundColor: '#fff',
          minWidth: 0,
          padding: '0 16px',
        }}
        message={<div className='icon-clean'>{I18N.Setting.Diagnose.SolutionSuggestErrorTip}</div>} autoHideDuration={4000} open={this.state.open} onRequestClose={() => {
          this.setState({
            open: false,
          })
        }}/>*/
    return (
      <div className='solution-suggest'>
        <div className='solution-suggest-content'>
        <header className='solution-suggest-header'>
          <span className='icon-return' onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {I18N.Setting.Diagnose.SolutionSuggest}
          <span className='icon-close' onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </header>
        <div className='solution-suggest-tip'>{I18N.Setting.Diagnose.SolutionSuggestTip1}</div>
        {plans.map( (plan, idx) => (
          <div key={plan.get('Id')} className='solution-suggest-item' style={{
            marginBottom: idx < plans.size - 1 ? 16 : 70
          }} onClick={() => {
            this.setState({
              showDetailId: plan.get('Id')
            })
          }}>
            <div style={{width: 84, height: 152, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={(e, checked) => {
              if( !~checkedPlan.map( plan => plan.Id ).indexOf(plan.get('Id')) ) {
                onChange( checkedPlan.concat(plan.toJS()) );
              } else {
                onChange( checkedPlan.filter( checked => checked.Id !== plan.get('Id') ) );

                if( plan.get('Id') === this.state.showDetailId ) {
                  this.setState({
                    showDetailId: null
                  })
                }
              }
              e.stopPropagation();
            }}>
              <Checkbox checked={ ~checkedPlan.map( plan => plan.Id ).indexOf(plan.get('Id')) } style={{width: 'auto'}} iconStyle={{marginRight: 0}}/>
            </div>
            <div className='solution-suggest-item-content'>
              <div className='solution-suggest-name'>{plan.get('SolutionName')}</div>
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{I18N.Setting.Diagnose.ProblemName + '：'}</span>{plan.get('ProblemName')}</div>
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{I18N.Setting.Diagnose.ProblemDescription + '：'}</span>{plan.get('ProblemDescription')}</div>
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{I18N.Setting.Diagnose.SolutionDescription + '：'}</span>{plan.get('SolutionDescription')}</div>
            </div>
          </div>
        ) )}
        <footer className='solution-suggest-footer'>
          <div style={{width: 800}}>
            <MuiFlatButton style={{
              borderRadius: 2,
              border: 'solid 1px #32ad3c',
              backgroundColor: '#32ad3c',
              color: '#ffffff',
              marginRight: 16,
            }} label={I18N.Setting.Diagnose.UsageSuggestSolution} onClick={() => {
              if( !checkedPlan || checkedPlan.length === 0 ) {
                this.setState({
                  open: true
                })
              } else {
                onNext();
              }
            }}/>
            <MuiFlatButton style={{
              borderRadius: 2,
              border: 'solid 1px #32ad3c',
              color: '#32ad3c',
              marginRight: 16,
            }} label={I18N.Setting.Diagnose.UsageCustomSolution + ' >'} onClick={onCustom}/>
            <span className='icon-no_ecm'>{I18N.Setting.Diagnose.SolutionSuggestTip2}</span>
          </div>
        </footer>
        </div>
        <Toast autoHideDuration={4000} className="toast-tip" open={this.state.open} onRequestClose={() => {
          this.setState({
            open: false,
          })
        }}><div className='icon-clean'>{I18N.Setting.Diagnose.SolutionSuggestErrorTip}</div></Toast>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.ReturnPage} onClick={this.props.onBack}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.ReturnPageTip}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={this.props.onCancel}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.LeavePageTip}</Dialog>
        { this.state.showDetailId && <SolutionDetailSidebar onClose={() => { this.setState({showDetailId: null}) }} {...plans.find(plan => plan.get('Id') === this.state.showDetailId).toJS()}/> }
      </div>
    );
  }
}
