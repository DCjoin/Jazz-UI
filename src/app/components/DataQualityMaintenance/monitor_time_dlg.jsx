import React, { Component } from 'react';

import classnames from 'classnames';

import Popover from 'material-ui/Popover';

import Dialog from '@emop-ui/piano/dialog';
import Button from '@emop-ui/piano/button';
import Calendar from '@emop-ui/piano/calendar';
import TextFiled from '@emop-ui/piano/text';

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
                    date.getMonth() + 1,
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
          suffixIconClassName='icon-historical-comparison'
          style={style}
          width={width}
          disabled={disabled}
          onClick={this.handleTouchTap}
          value={value || text}/>
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
                    date.getMonth() + 1,
                    date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                  ].join('-'));
                }
              }}/>
          </Popover>
      </div>
    );
  }
}

export default class MonitorTimeDlg extends Component {
  render() {
    let { open, onChange, onSubmit, onCancel, locale } = this.props;
    return (
      <Dialog
        open={false}
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
              onClick={onCancel}
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
              onClick={onSubmit}
            />
          </div>,
        ]}
      >
        <div className={classnames('monitor-time-dlg-field', {empty: true})}>
          <TextCalendar locale={locale} width={240} text={'选择开始监测日期'} onChange={() => {
            console.log('aaa');
          }} />
        </div>
        <div className={classnames('monitor-time-dlg-field', {empty: true})}>
          <TextSelect locale={locale} width={100} text={'选择时间'} onChange={() => {
            console.log('aaa');
          }} />
        </div>
      </Dialog>
    );
  }
}
