import React, { Component } from 'react';
import classnames from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import { Snackbar} from 'material-ui';
import FlatButton from 'controls/FlatButton.jsx';

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
    let { plans, checkedPlan, onChange, onNext, onBack, onCancel } = this.props;
    return (
      <div className='solution-suggest'>
        <header className='solution-suggest-header'>
          <span className='icon-return' onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {'解决方案推荐'}
          <span classNames='icon-close' onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </header>
        <div className='solution-suggest-tip'>{'您可以勾选一个或多个方案来生成解决方案。'}</div>
        {plans.map( plan => (
          <div key={plan.get('Id')} className='solution-suggest-item'>
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
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'问题名称：'}</span>{plan.get('ProblemName')}</div>
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'问题描述：'}</span>{plan.get('ProblemDescription')}</div>
              <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'方案描述：'}</span>{plan.get('SolutionDescription')}</div>
            </div>
          </div>
        ) )}
        <footer className='solution-suggest-footer'>
          <FlatButton primary label={'使用推荐方案'} onClick={() => {
            if( !checkedPlan || checkedPlan.length === 0 ) {
              this.setState({
                open: true
              })
            } else {
              onNext();
            }
          }}/>
          <FlatButton style={{marginRight: 16}} label={'自定义方案 >'} onClick={onNext}/>
          <span className='icon-no_ecm'>{'若以上方案都不符合，您可自定义方案。'}</span>
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
        message={<div className='icon-clean'>{'请至少选择一个推荐方案'}</div>} autoHideDuration={4000} open={this.state.open} onRequestClose={() => {
          this.setState({
            open: false,
          })
        }}/>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={'返回上一页'} onClick={this.props.onBack}/>,
          <FlatButton label={'取消'} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{'当前页面所有操作将不会保存，确定返回上一页吗？'}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={'离开页面'} onClick={this.props.onCancel}/>,
          <FlatButton label={'取消'} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{'当前页面所有操作将不会保存，确定离开当前页面吗？'}</Dialog>
      </div>
    );
  }
}
