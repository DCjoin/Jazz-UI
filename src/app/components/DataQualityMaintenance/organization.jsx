'use strict';

import React, { Component}  from "react";
import Panel from 'controls/toggle_icon_panel.jsx';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import Basic from './basic_property.jsx'

export default class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabNo:1
    };
  }
  _onSwitchTab = (event) => {
    this.setState({
      tabNo:event.target.getAttribute("data-tab-index")*1
    })
  }
  _renderHeader() {
    var tagNameProps = {
      ref: 'name',
      isViewStatus: true,
      title: I18N.VEE.SummaryNode,
      defaultValue: this.props.nodeData.get('Name') || '',
      isRequired: true,
    };
    let nodeType = this.props.nodeData.get("NodeType");
    return (
      <div className="pop-manage-detail-header" style={{paddingTop:'10px',paddingLeft:'20px',paddingBottom:'6px', position:'relative'}}>
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...tagNameProps} />
          <div className={classnames("pop-user-detail-tabs","data-quality-tabs")}>
            <span className={classnames({
                "pop-user-detail-tabs-tab": true,
                "selected": this.state.tabNo===1
              })} data-tab-index="1" onClick={this._onSwitchTab}>
              {I18N.VEE.Basic}
            </span>
          </div>
        </div>
      </div>
      );
    }
    componentDidMount () {
    }
    componentWillUnmount() {
    }

  _renderContent() {
      var content = null;
      var style = {
        display: 'flex',
        paddingTop:'24px',
        paddingLeft:'20px',
        paddingRight:'10px'
      };
      switch(this.state.tabNo){
        case 1:
              content=<Basic nodeData={this.props.nodeData}/>;
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
          <Panel onToggle={this.props.onToggle} isFolded={this.props.showLeft}>
            {this._renderHeader()}
            {this._renderContent()}
          </Panel>
        </div>
          );
  }
}
Organization.propTypes= {
  nodeData:PropTypes.object,
};