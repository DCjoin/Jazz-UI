'use strict';

import React from 'react';
import { FontIcon, Mixins, Paper } from 'material-ui';
import MailStore from '../../stores/MailStore.jsx';
import MailAction from '../../actions/MailAction.jsx';
let TemplateItem = React.createClass({
  propTypes: {
    value: React.PropTypes.object,
  },
  _onCleanButtonClick: function(e) {
    e.stopPropagation();
    this.props.onItemClick();
    MailAction.setDialog('0', this.props.value);
  },
  _onItemClick: function() {
    this.props.onItemClick();
    MailAction.setTemplate(this.props.value);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return nextProps.value.get('templateId') !== this.props.value.get('templateId');
  // },
  render: function() {
    var cleanIconStyle = {
      marginLeft: '10px',
      marginRight: '7.5px',
      fontSize: '16px',
    };
    if (this.props.value.templateNewFlag === 0) {
      return (
        <div className='jazz-templateitem' onClick={this._onItemClick} title={this.props.value.templateName}>
            <div style={{
          marginLeft: '7.5px'
        }}>
              {this.props.value.templateName}
            </div>

          </div>

        )
    } else {
      return (
        <div className='jazz-templateitem' onClick={this._onItemClick} title={this.props.value.templateName}>
            <div style={{
          marginLeft: '7.5px',
          maxWidth: '282px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
              {this.props.value.templateName}
            </div>
            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
          </div>

        )
    }

  }
});
let TemplateList = React.createClass({
  //mixins: [Mixins.ClickAwayable],
  _onTemplateListChanged: function() {
    this.setState({
      list: MailStore.getTemplateList()
    })
  },
  getInitialState: function() {
    return {
      list: MailStore.getTemplateList()
    };
  },
  componentDidMount: function() {
    MailStore.addTemplateListListener(this._onTemplateListChanged);
    if (MailStore.getTemplateList().length === 0) {
      MailAction.getAllNotificationTemplate();
    }
  },
  componentWillUnmount: function() {
    MailStore.removeTemplateListListener(this._onTemplateListChanged);
  },
  componentClickAway: function() {
    if (this.props.handleClickAway) {
      this.props.handleClickAway();

    }

  },
  render: function() {
    var menuItems = [];
    this.state.list.forEach(list => {
      menuItems.push(<TemplateItem value={list} onItemClick={this.props.onItemClick}/>)
    });
    var paperStyle = {
      backgroundColor: '#ffffff',
      zIndex: '100',
      maxWidth: '360px',
      maxHeight: '192px',
      position: 'absolute',
      border: '1px solid #c9c8c8',
      overflowY: 'auto',
      overflowX: 'hidden'
    };
    return (
      <Paper style={paperStyle}>
          {menuItems}
        </Paper>


      )
  }
});
let MailTemplateField = React.createClass({

  _onClick: function() {
    this.setState({
      paperShow: !this.state.paperShow
    });

  // MailAction.setDialog(1, {
  //   templateName: 'test'
  // })
  },
  _onItemClick: function() {
    this.setState({
      paperShow: false
    });
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return (nextProps.template !== this.props.template || nextState.paperShow !== this.state.paperShow);
  // },
  _handleClickAway: function() {
    if (this.state.paperShow) {
      this.setState({
        paperShow: false
      })
    }
  },
  getInitialState: function() {
    return {
      paperShow: false
    };
  },
  render: function() {
    var iconStyle = {
      fontSize: '14px',
      margin: '0 10px'
    };
    var list = (this.state.paperShow) ? <TemplateList onItemClick={this._onItemClick} handleClickAway={this._handleClickAway}/> : null;
    var name = (!!this.props.template) ? this.props.template.templateName : null;
    return (
      <div className='jazz-templatefield'>
        <div className='title' onClick={this._onClick}>
          <div className='content'>
            {name}
          </div>
          <FontIcon className="icon-arrow-down" style={iconStyle}/>
        </div>
        {list}
        </div>
      );
  },
});
module.exports = MailTemplateField;
