'use strict';

import React from 'react';
import classNames from 'classnames';


let AlarmTagItem = React.createClass({

	_onTagItemSelected(){
		if(this.props.onTagItemClick){
			this.props.onTagItemClick(this.props.hierarchyId, this.props.tagId);
		}
  },

    render() {
      var me = this;
      return (
          <div className={classNames(
                  {
                    'jazz-alarm-grid-tr-item':true,
                    'jazz-alarm-grid-tr-item-extended': !!me.props.extended
                  }
              )} onClick={me._onTagItemSelected}>{me.props.tagName}</div>
      );
    }
	});

module.exports = AlarmTagItem;
