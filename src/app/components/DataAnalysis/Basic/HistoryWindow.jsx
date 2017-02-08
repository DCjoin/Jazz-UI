'use strict';
import React, { Component }  from "react";
import {Dialog, DropDownMenu, FlatButton, IconButton} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import NewDialog from 'controls/NewDialog.jsx';
import classSet from 'classnames';
import MultipleTimespanStore from 'stores/energy/MultipleTimespanStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import MultiTimespanAction from 'actions/MultiTimespanAction.jsx';
import Immutable from 'immutable';

class TimespanItem extends Component{
  
}

export default class HistoryWindow extends Component {

  constructor(props) {
		super(props);
		this._onAction = this._onAction.bind(this);
	}

  _onAction(action) {
    let analysisPanel = this.props.analysisPanel;
    if (action === 'draw') {
      MultiTimespanAction.convert2Stable();
      analysisPanel._onSearchDataButtonClick(true);
    } else {
      MultiTimespanAction.clearMultiTimespan('temp');
    }
    this.props.onCancel()
  }

  _onrelativeListChange() {
    this.setState({
      relativeList: MultipleTimespanStore.getRelativeList()
    });
  }

  _addNewCompareItem() {
    MultiTimespanAction.addMultiTimespanData();
  }

  _removeCompareItem(compareIndex) {
    MultiTimespanAction.removeMultiTimespanData(compareIndex);
  }

  getInitialState() {
    return {
      relativeList: MultipleTimespanStore.getRelativeList()
    };
  }

  componentDidMount() {
    MultipleTimespanStore.addChangeListener(this._onrelativeListChange);
  }

  componentWillUnmount() {
    MultipleTimespanStore.removeChangeListener(this._onrelativeListChange);
  }

  render(){
    let me = this;
    let relativeList = me.state.relativeList;
    let timeSpanEls = relativeList.map((item) => {
      return <TimespanItem {...item} onCompareItemRemove={me._removeCompareItem}></TimespanItem>;
    });
    let isAddBtnDisabled = relativeList.length >= 5;
    let _buttonActions = [<FlatButton
                            label={I18N.MultipleTimespan.Button.Draw}
                            onClick={me._onAction.bind(me, 'draw')} />,
                          <FlatButton
                            label={I18N.MultipleTimespan.Button.Cancel}
                            style={{
                              marginLeft: '10px'
                              }}
                              onClick={me._onAction.bind(me, 'cancel')} />];
    let dialog = <NewDialog {...me.props} title={I18N.MultipleTimespan.Title} titleStyle={{
                    fontSize: '20px',
                    padding: '24px 0 0 50px'
                    }} actions={_buttonActions} modal={true} open={true}
                    contentClassName='jazz-add-interval-dialog' style={{
                    overflow: 'auto'
                    }}>
                      <div style={{
                              height: '418px'
                            }}>
                                              {timeSpanEls}
                                              <LinkButton  label={I18N.MultipleTimespan.Add} labelStyle={{
                              display: 'inline-block',
                              marginTop: '10px'
                            }} onClick={me._addNewCompareItem} disabled={isAddBtnDisabled}/>
                                            </div>
                                          </NewDialog>;
    return <div>
            {dialog}
          </div>;
  }
}
