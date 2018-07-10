import React, { Component } from 'react';

import classnames from 'classnames';

import Popover from 'material-ui/Popover';

import Dialog from '@emop-ui/piano/dialog';
import Button from '@emop-ui/piano/button';
import Calendar from '@emop-ui/piano/calendar';
import TextFiled from '@emop-ui/piano/text';

import CalendarTime from 'controls/CalendarTime2.jsx';
import ItemButton from 'controls/ItemButton.jsx';

export default class CloseMonitorDlg extends Component {
  constructor(props) {
    super(props);

    this._onSubmit = this._onSubmit.bind(this);
  }
  _onSubmit() {
    this.props.onSubmit();
    this.props.onCancel();
  }
  render() {
    let { open, onSubmit, onCancel } = this.props;
    return (
      <Dialog
        open={open}
        title={I18N.VEE.CloseMonitorTip}
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
              label={I18N.Common.Button.Cancel2}
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
              label={I18N.Common.Button.Confirm}
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
      </Dialog>
    );
  }
}
