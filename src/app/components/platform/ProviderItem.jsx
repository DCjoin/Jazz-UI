'use strict';

import React from 'react';
import { DataConverter } from '../../util/Util.jsx';
import moment from 'moment';

let ProviderItem = React.createClass({
  propTypes: {
    provider: React.PropTypes.object,
  },
  render: function() {
    var j2d = DataConverter.JsonToDateTime,
      startTime = moment(j2d(this.props.provider.StartDate, false)),
      status = ['暂停', '正常'];
    var date = startTime.format("YYYY" + I18N.Map.Date.Year + 'M' + I18N.Map.Date.Month + 'D' + I18N.Map.Date.Day);
    var info = '运营时间:' + date + ' ' + '状态' + status[this.props.provider.Status];
    return (
      <div className='jazz-provider-item'>
        <div className='providername'>
          {this.props.provider.Name}
        </div>
        <div className='providerinfo'>
          {info}
        </div>
      </div>
      )
  },
});
module.exports = ProviderItem;
