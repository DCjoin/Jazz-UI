import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';

let { Dialog, DropDownMenu, FlatButton, TextField } = mui;

let YearPicker = React.createClass({
  getInitialState() {
    let date = new Date();
    let yearMenuItems =[];
    for(var i=2010, thisYear=date.getFullYear(); i<=thisYear; i++){
      yearMenuItems.push({text:i+'',value:i});
    }
      return {
          _yearItems: yearMenuItems
      };
  },
  getDate: function() {
    return this.state.date;
  },

  setDate: function(d) {
    this.setState({
      date: d
    });
    //this.refs.input.setValue(this.props.formatDate(d));
  },
  _onDialogSubmit(){
    this.refs.dialogWindow.dismiss();
  },
  _onDialogCancel(){
    this.refs.dialogWindow.dismiss();
  },
  _handleInputFocus: function(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },
  _handleInputTouchTap: function(e) {
    this.setState({
      dialogDate: this.getDate()
    });

    this.refs.dialogWindow.show();
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  },
  render(){
    var _buttonActions = [
            <FlatButton
            label="确定"
            secondary={true}
            onClick={this._onDialogSubmit} />,
            <FlatButton
            label="取消"
            primary={true}
            onClick={this._onDialogCancel} />
        ];
    var style={
        //width:'480px'
    };
    var dialog = <Dialog style={style} title="Month Picker" actions={_buttonActions} modal={true} ref="dialogWindow">
      <DropDownMenu menuItems={this.state._yearItems} />
    </Dialog>;

    var textField = <TextField hintText='select year' onFocus={this._handleInputFocus} onTouchTap={this._handleInputTouchTap}/>;

    return <div>
      {textField}
      {dialog}
    </div>;
  }
});

module.exports = YearPicker;
