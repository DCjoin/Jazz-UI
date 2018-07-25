'use strict';

import React, { Component}  from "react";
import Panel from 'controls/toggle_icon_panel.jsx';
import classnames from 'classnames';
import AbnormalMonitor from './abnomal_monitor.jsx';
import PropTypes from 'prop-types';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import Rule from './monitor_rule.jsx';
import Basic from './basic_property.jsx'

export default class TagContentField extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabNo:1
    };
    this._onSwitchTab = this._onSwitchTab.bind(this);
  }

  _onSwitchTab(event) {
    this.setState({
      tabNo:event.target.getAttribute("data-tab-index")*1
    })
  }

    _renderHeader() {
    var tagNameProps = {
      ref: 'tagName',
      isViewStatus: true,
      title: I18N.Setting.Tag.TagName,
      defaultValue: this.props.nodeData.get('Name') || '',
      isRequired: true,
    };
    return (
      <div className="pop-manage-detail-header" style={{paddingTop:'10px',paddingLeft:'20px',paddingBottom:'6px'}}>
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")} style={{position: 'relative'}}>
          <ViewableTextField  {...tagNameProps} />
        <div className={classnames("pop-user-detail-tabs","data-quality-tabs")}>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": this.state.tabNo===1
        })} data-tab-index="1" onClick={this._onSwitchTab}>{I18N.VEE.Monitor}</span>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": this.state.tabNo===2
        })} data-tab-index="2" onClick={this._onSwitchTab}>{I18N.VEE.Basic}</span>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": this.state.tabNo===3
        })} data-tab-index="3" onClick={this._onSwitchTab}>{I18N.VEE.MonitorRule}</span>
                </div>

        </div>
      </div>
      );
    }

      _renderContent() {
          var content = null;
          var style = {
            display: 'flex',
            padding:'24px 10px 0px 20px',
            paddingBottom:this.state.tabNo===1?'22px':'0px'
          };

          switch(this.state.tabNo){
            case 1:
                  content=<AbnormalMonitor
                            nodeData={this.props.nodeData}
                            showLeft={this.props.showLeft}
                            anomalyType={this.props.anomalyType}/>;
                  break;
            case 2: content=<Basic nodeData={this.props.nodeData}/>;
                  break;
            case 3:
                  content=<Rule selectTag={this.props.nodeData}/>;
                  break;

          }

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
          <Panel onToggle={this.props.onToggle} isFolded={this.props.showLeft} toggleEnabled={false}>
            {this._renderHeader()}
            {this._renderContent()}
          </Panel>
        </div>
          );
  }
}
TagContentField.propTypes= {
  nodeData:PropTypes.object,
  showLeft:PropTypes.bool,
  onToggle:PropTypes.func,
};

TagContentField.defaultProps={
  showLeft:true,
  showRawDataList:false,
}