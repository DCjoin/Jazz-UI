import React from 'react';
import {FlatButton} from 'material-ui';
import Dialog from '../../controls/NewDialog.jsx';
import classSet from 'classnames';

let ErrorStepDialog = React.createClass({
  getDefaultProps() {
    return {
      stepBtnList: [],
      errorMessage: ''
    };
  },
  getInitialState() {
    return {
      destroyed: false
    };
  },
  _onDialogCancel() {
    this.refs.dialogWindow.dismiss();
  },
  _onDismiss() {
    this._onAction('cancel');
  },
  _onAction(code) {
    if (this.props.onErrorDialogAction) {
      this.props.onErrorDialogAction(code, this.props.stepBtnList);
    }
    this.setState({
      destroyed: true
    });
  },
  render() {
    if (this.state.destroyed === true) {
      return <div></div>;
    }

    let stepBtnList = this.props.stepBtnList;
    let _buttonActions = [];
    let me = this;
    stepBtnList.forEach(stepObj => {
      _buttonActions.push(<FlatButton secondary={true} onClick={me._onAction.bind(me, stepObj.code)}
      label = {I18N.EM['Use' + stepObj.text]} />
      );
    });
    _buttonActions.push(
      <FlatButton
      label={I18N.Common.Button.Cancel}
      primary={true}
      onClick={me._onAction.bind(me, 'cancel')} />
    );

    var dialog = <Dialog contentStyle={{
      width: '400px'
    }} actions={_buttonActions} modal={true}
    onDismiss={this._onDismiss} ref="dialogWindow" open={true}>
      <div style={{
      marginTop: '15px'
    }}>
        {this.props.errorMessage}
      </div>
    </Dialog>;

    return <div>
      {dialog}
    </div>;
  }
});

module.exports = ErrorStepDialog;
