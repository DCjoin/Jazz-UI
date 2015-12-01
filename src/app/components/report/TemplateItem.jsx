'use strict';

import React from 'react';
import CommonFuns from '../../util/Util.jsx';
import classNames from 'classnames';


let TemplateItem = React.createClass({
  _getDisplayText() {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var createTime = j2d(this.props.createTime, true);
    var createUser = this.props.createUser;
    var time = CommonFuns.formatChinaDate(createTime, true);
    var str = createUser + ' 创建于' + time;
    return str;
  },

  render() {
    var me = this;
    var displayStr = me._getDisplayText();
    return (
      <div className='jazz-template-grid-tr-item'>
        <div>{me.props.name}</div>
        <div>{displayStr}</div>
      </div>
      );
  }
});

module.exports = TemplateItem;
