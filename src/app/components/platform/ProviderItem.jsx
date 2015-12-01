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
      status = [I18N.Platform.ServiceProvider.PauseStatus, I18N.Platform.ServiceProvider.NormalStatus];
    var date = startTime.format("YYYY" + I18N.Map.Date.Year + 'M' + I18N.Map.Date.Month + 'D' + I18N.Map.Date.Day);
    var info = I18N.Platform.ServiceProvider.OperationTime + ':' + date + ' ' + I18N.Platform.ServiceProvider.Status + ':' + status[this.props.provider.Status];
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
