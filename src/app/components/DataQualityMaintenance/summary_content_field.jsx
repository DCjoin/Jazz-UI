'use strict';

import React, { Component}  from "react";
import Panel from 'controls/toggle_icon_panel.jsx';
import classnames from 'classnames';
import AbnormalMonitor from './abnomal_monitor.jsx';
import PropTypes from 'prop-types';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import TagStore from 'stores/customerSetting/TagStore.jsx';
import TagAction from 'actions/customerSetting/TagAction.jsx';
import { Drawer} from 'material-ui';
import moment from 'moment';

export default class SummaryContentField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDrawer: false,
      listData: []
    };
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
      <div className="pop-manage-detail-header" style={{paddingTop:'10px',paddingLeft:'20px',paddingBottom:'8px', position:'relative'}}>
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
          <ViewableTextField  {...tagNameProps} />
          {
            (nodeType == 5 || nodeType == 6)
            ? <span className="offlineBtn" onClick={this._onLineAndOffline}>{I18N.VEE.offlineTab}</span>
            : null
          }
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
    componentDidMount () {
      TagStore.addListDataListener(this._onChanged);
    }
    componentWillUnmount() {
      TagStore.removeListDataListener(this._onChanged);
    }
  // 在线离线操作
  _onLineAndOffline = () => {
    this.setState({openDrawer: true});
    let NodeType = this.props.nodeData.get("NodeType"),
        tagId =  this.props.nodeData.get("Id"),
        startTime = moment(this.props.startTime).format('YYYY-MM-DDTHH:mm:ss'),
        endTime = moment(this.props.endTime).format('YYYY-MM-DDTHH:mm:ss');
    TagAction.getLineData(tagId, NodeType, startTime, endTime)
  }
  _onChanged = (listData) => {
    this.setState({listData: listData})
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
          <Drawer width={283}
                  open={this.state.openDrawer}
                  openSecondary={true}
                  docked={false}
                  overlayStyle={{backgroundColor: 'none'}}
                  onRequestChange={() => this.setState({openDrawer: false})}
            >
		        <div>
            <ul className="line-drawer-ul">
              <li style={{color: '#333', fontSize: '16px', backgroundColor: '#f4f5f8'}}>{I18N.VEE.TransLineInfo}</li>
                {
                  this.state.listData.length
                  ? this.state.listData.map((v, i) => {
                    return (
                      <li>
                        <span className="drawer-time">{v.OccurTime}</span>
                        {
                          v.PhysicalStatus
                          ? <span style={{color: '#32ad3c'}}>{I18N.VEE.onlineText}</span>
                          : <span style={{color: '#dc0a0a'}}>{I18N.VEE.offlineText}</span>
                        }
                      </li>
                    )
                  })
                  : null
                }
            </ul>
	          </div>
	        </Drawer>
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