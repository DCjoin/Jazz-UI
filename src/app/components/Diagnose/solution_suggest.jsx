import React, { Component } from 'react';
import classnames from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import { Snackbar} from 'material-ui';
import FlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';

/*

 inputStyle={{width: 42, height: 76}} iconStyle={{padding: '67px 33px'}}

*/
const BACK_DIALOG = 'BACK_DIALOG';
const CANCEL_DIALOG = 'CANCEL_DIALOG';

export default class SolutionSuggest extends Component {
  state = {
    dialogKey: null,
    open: false,
  }
  render() {
    let { plans, checkedPlan, onChange, onNext, onCustom, onBack, onCancel } = this.props;
    return (
      <div className='solution-suggest'>
        <header className='solution-suggest-header'>
          <span className='icon-return' onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {I18N.Setting.Diagnose.SolutionSuggest}
          <span className='icon-close' onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </header>
        <div className='solution-suggest-tip'>{I18N.Setting.Diagnose.SolutionSuggestTip1}</div>
        {plans.map( (plan, idx) => (
          <div key={plan.get('Id')} className='solution-suggest-item' style={{
            marginBottom: idx < plans.size - 1 ? 16 : 70
          }}>
            <div style={{width: 84, height: 152, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={(e, checked) => {
              if( !~checkedPlan.map( plan => plan.Id ).indexOf(plan.get('Id')) ) {
                onChange( checkedPlan.concat(plan.toJS()) );
              } else {
                onChange( checkedPlan.filter( checked => checked.Id !== plan.get('Id') ) );
              }
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
          <FlatButton primary label={I18N.Setting.Diagnose.UsageSuggestSolution} onClick={() => {
            if( !checkedPlan || checkedPlan.length === 0 ) {
              this.setState({
                open: true
              })
            } else {
              onNext();
            }
          }}/>
          <FlatButton style={{marginRight: 16}} label={I18N.Setting.Diagnose.UsageCustomSolution + ' >'} onClick={onCustom}/>
          <span className='icon-no_ecm'>{I18N.Setting.Diagnose.SolutionSuggestTip2}</span>
        </footer>
        <Snackbar style={{
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
        }}/>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.ReturnPage} onClick={this.props.onBack}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.ReturnPageTip}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={this.props.onCancel}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.LeavePageTip}</Dialog>
      </div>
    );
  }
}
