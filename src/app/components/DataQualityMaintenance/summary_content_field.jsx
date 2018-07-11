'use strict';

import React, { Component}  from "react";
import Panel from 'controls/toggle_icon_panel.jsx';
import classnames from 'classnames';
import AbnormalMonitor from './abnomal_monitor.jsx';
import PropTypes from 'prop-types';
import ViewableTextField from 'controls/ViewableTextField.jsx';

export default class SummaryContentField extends Component {

    _renderHeader() {
    var tagNameProps = {
      ref: 'name',
      isViewStatus: true,
      title: I18N.VEE.SummaryNode,
      defaultValue: this.props.nodeData.get('Name') || '',
      isRequired: true,
    };
    return (
      <div className="pop-manage-detail-header" style={{paddingTop:'10px',paddingLeft:'20px',paddingBottom:'8px'}}>
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...tagNameProps} />
            {
      false &&
        <div className="pop-user-detail-tabs">
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": me.props.showBasic
        })} data-tab-index="1" onClick={me._onSwitchTab}>{I18N.Setting.Tag.BasicProperties}</span>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !me.props.showBasic
        })} data-tab-index="2" onClick={me._onSwitchTab}>{displayStr}</span>
                </div>
      }
        </div>
      </div>
      );
    }

      _renderContent() {
          var content = null;
          var style = {
            display: 'flex',
            paddingTop:'24px',
            paddingLeft:'20px',
            paddingRight:'10px'
          };

          content=<AbnormalMonitor nodeData={this.props.nodeData} showLeft={this.props.showLeft} anomalyType={this.props.anomalyType}/>

          return (
            <div className="pop-manage-detail-content" style={style}>
              {content}
            </div>
            );
  }

    render() {

        return (
          <div className={classnames({
            'jazz-ptag-panel': true,
            "jazz-ptag-left-fold": !this.props.showLeft,
            "jazz-ptag-left-expand": this.props.showLeft,
            "jazz-ptag-right-fold": !this.props.showRawDataList,
            "jazz-ptag-right-expand": this.props.showRawDataList

          })} style={{top:'56px',left:this.props.showLeft?'321px':'0'}}>
          <Panel onToggle={this.props.onToggle} isFolded={this.props.showLeft}>
            {this._renderHeader()}
            {this._renderContent()}
          </Panel>
        </div>
          );
  }
}
SummaryContentField.propTypes= {
  nodeData:PropTypes.object,
  showLeft:PropTypes.bool,
  onToggle:PropTypes.func,
};

SummaryContentField.defaultProps={
  showLeft:true,
  showRawDataList:false,
}