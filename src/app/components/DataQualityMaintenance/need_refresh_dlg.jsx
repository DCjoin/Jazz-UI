import React, { Component } from 'react';

import Button from '@emop-ui/piano/button';
import Dialog from '@emop-ui/piano/dialog';

export default class NeedRefreshDlg extends Component {
  render() {
    let { open, onRefresh } = this.props;
    return (
      <Dialog
        open={open}
        actions={[
          <div>
            <Button flat secondary
              label={'刷新页面'}
              labelStyle={{
                color: '#32ad3c',
              }}
              style={{
                float: 'right',
              }}
              onClick={onRefresh}
            />
          </div>
        ]}
        contentStyle={{
          padding: '24px 0 18px'
        }}
      >{'刷新页面获取新数据流架构'}</Dialog>
    );
  }
}
