import React, { Component } from 'react';

import moment from 'moment';
import classnames from 'classnames';

import Popover from 'material-ui/Popover';

import Dialog from '@emop-ui/piano/dialog';
import Button from '@emop-ui/piano/button';
import Calendar from '@emop-ui/piano/calendar';
import TextFiled from '@emop-ui/piano/text';

import CalendarTime from 'controls/CalendarTime2.jsx';
import ItemButton from 'controls/ItemButton.jsx';

class TextCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    let { value, disabled, onChange, hasJumpToday, style, minDate, maxDate, text, shouldDisableDate, width, locale } = this.props;
    return (
      <div>
        <TextFiled
          suffixIconClassName='icon-calendar1'
          style={style}
          width={width}
          disabled={disabled}
          onClick={this.handleTouchTap}
          value={(value && moment(value).format('YYYY-MM-DD')) || text || ''}/>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <Calendar hasJumpToday={hasJumpToday} value={text || !value ? new Date() : new Date(value)}
              minDate={minDate && new Date(minDate)}
              maxDate={maxDate && new Date(maxDate)}
              shouldDisableDate ={shouldDisableDate }
              locale={locale}
              onChange={ date => {
                this.handleRequestClose();
                if( date === undefined ) {
                  onChange();
                } else{
                  onChange([
                    date.getFullYear(),
                    (date.getMonth() < 9 ? '0' : '' ) + (date.getMonth() + 1),
                    date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                  ].join('-'));
                }
              }}/>
          </Popover>
      </div>
    );
  }
}


class TextSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget.parentNode,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    let { text, value, onChange, style, width } = this.props;
    return (
      <div>
        <TextFiled
          suffixIconClassName='icon-historical-comparison'
          style={style}
          width={width}
          onClick={this.handleTouchTap}
          value={value || text}/>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          style={{width: 100, height: 240}}
        >
        {(Array(24) + '').split(',').map( ( val, i ) => {
          let text = ('0' + i).substr(-2) + ':00';
          return (
            <div
              className={classnames('select-hour-item', {
                selected: text === value
              })}
              onClick={() => {
                this.setState({open: false});
                onChange(text);
              }}>
              {text}
            </div>
          )
        })}
        </Popover>
      </div>
    );
  }
}

export default class MonitorTimeDlg extends Component {
  constructor(props) {
    super(props);

    this.state = this._onOpenState(this.props);

    this._onSubmit = this._onSubmit.bind(this);
    this._onCancel = this._onCancel.bind(this);
  }
  componentWillReceiveProps( nextProps ) {
    this.setState(this._onOpenState(nextProps));
  }
  _onOpenState(props) {
    let date = '';
    let time = '';
    if( props && props.open ) {
      if(props.startTime) {
        let startTime = moment(props.startTime)/*.subtract(8, 'hours')*/;
        date = startTime.format('YYYY-MM-DD');
        time = startTime.format('HH:mm');
      }
    }
    return {
      date,
      time,
    };
  }
  _onCancel() {
    this.setState(this._onOpenState());
    this.props.onCancel();
  }
  _onSubmit() {
    let { date, time } = this.state;
    if( date && time ) {
      this.props.onSubmit( date + 'T' + time + ':00.000Z' );
      this._onCancel();
    } else {
      this.setState({
        error: true,
      });
    }
  }
  render() {
    let { open, onChange, onSubmit, locale } = this.props,
    { date, time, error } = this.state;
    return (
      <Dialog
        open={open}
        title={'请选择开始监测时间'}
        titleStyle={{
          padding: 0,
          margin: '24px 24px 16px',
          fontSize: '16px',
          color: '#666666',
          height: 24,
          lineHeight: '24px',
        }}
        contentStyle={{
          padding: 0,
          flexDirection: 'row',
          position: 'relative',
        }}
        actions={[
          <div>
            <Button flat secondary
              label={'取消'}
              labelStyle={{
                color: '#666666',
              }}
              style={{
                float: 'right',
              }}
              onClick={this._onCancel}
            />
          </div>,
          <div>
            <Button flat secondary
              label={'确定'}
              labelStyle={{
                color: '#32ad3c',
              }}
              style={{
                float: 'right',
              }}
              onClick={this._onSubmit}
            />
          </div>,
        ]}
      >
        <div className={classnames('monitor-time-dlg-field', {empty: !this.state.date})}>
          <TextCalendar
            maxDate={new Date()}
            locale={locale}
            width={240}
            text={'选择开始监测日期'}
            value={this.state.date}
            onChange={(val) => {
              this.setState({date: val, error: false});
            }}
          />
        </div>
        <div className={classnames('monitor-time-dlg-field', {empty: !this.state.time})}>
          <TextSelect
            width={100}
            text={'选择时间'}
            value={this.state.time}
            onChange={(val) => {
              this.setState({time: val, error: false});
            }}
          />
        </div>
        {error && <div style={{
          color: '#dc0a0a',
          position: 'absolute',
          fontSize: '12px',
          top: 44.
        }}>{'请完整填写监测日期和时间'}</div>}
      </Dialog>
    );
  }
}
