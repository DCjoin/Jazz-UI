import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
import MultipleTimespanStore from '../../../stores/energy/MultipleTimespanStore.jsx';
import DateTimeSelector from '../../../controls/DateTimeSelector.jsx';
import LinkButton from '../../../controls/LinkButton.jsx';
import MultiTimespanAction from '../../../actions/MultiTimespanAction.jsx';
import Immutable from 'immutable';

let {Dialog, DropDownMenu, FlatButton, IconButton} = mui;

let TimespanItem = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    isOriginalDate: React.PropTypes.bool,
    relativeType: React.PropTypes.oneOf(MultipleTimespanStore.getRelativeTypes()),
    relativeValue: React.PropTypes.number,
    compareIndex: React.PropTypes.number, //对比时间编号，原始时间没有此参数
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    dateDescription: React.PropTypes.string //对比时间段的文字时间
  },
  getDefaultProps() {
    return {
      isOriginalDate: false
    };
  },
  _onCompareItemRemove() {
    this.props.onCompareItemRemove(this.props.compareIndex);
  },
  wrapDropdownMenu(menuProps, containerWidth) {
    return <div className='jazz-energy-container-has-absolute-container' style={{
        width: containerWidth
      }}>
            <div className='jazz-full-border-dropdownmenu-container'>
              <DropDownMenu {...menuProps} />
            </div>
          </div>;
  },
  getCompareDatePart() {
    let me = this,
      relativeType = this.props.relativeType;
    if (relativeType === MultipleTimespanStore.getCustomerizeType()) {
      let {startDate, endDate} = this.props;
      return <DateTimeSelector ref='dateTimeSelector' startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/>;
    } else {
      let availableRelativeValues = MultipleTimespanStore.getAvailableRelativeValues(relativeType);
      let uom = MultipleTimespanStore.getRelativeUOM(relativeType);
      let menuItems = availableRelativeValues.map((value) => {
        return {
          value: value,
          text: value
        };
      });

      return <div style={{
          display: 'flex'
        }}>
                <div style={{
          margin: 'auto 10px auto 6px'
        }}>之前第</div>
                {me.wrapDropdownMenu({
          menuItems: menuItems,
          style: {
            width: '60px'
          },
          selectedIndex: Immutable.List(menuItems).findIndex((item) => {
            return item.value === me.props.relativeValue;
          }),
          onChange: me._onRelativeValueChange
        }, '62px')}
                <div style={{
          margin: 'auto 10px'
        }}>{uom}</div>
                <div style={{
          margin: 'auto'
        }}>{this.props.dateDescription}</div>
              </div>;
    }
  },
  render() {
    let me = this,
      dateEl = null,
      store = MultipleTimespanStore;
    let menuItems;
    let {startDate, endDate} = this.props;
    let deleteBtn = null;

    if (this.props.isOriginalDate) {
      menuItems = store.getRelativeItems();
    } else {
      menuItems = store.getCompareMenuItems();
    }

    if (this.props.isOriginalDate) {
      dateEl = <DateTimeSelector ref='dateTimeSelector' startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
    } else {
      dateEl = me.getCompareDatePart();
      deleteBtn = <IconButton iconClassName='icon-delete' iconStyle={{
        fontSize: '16px'
      }} onClick = {me._onCompareItemRemove}
      style={{
        'marginLeft': '10px',
        padding: '0px',
        height: '28px',
        width: '28px',
        lineHeight: '38px'
      }} />;
    }
    let relativeTypeEl = me.wrapDropdownMenu({
      menuItems: menuItems,
      style: {
        width: '92px'
      },
      selectedIndex: Immutable.List(menuItems).findIndex((item) => {
        return item.value === me.props.relativeType;
      }),
      onChange: me._onRelativeTypeChange
    }, '100px');
    return <div style={{
        marginTop: '10px',
        height: '67px'
      }}>
              <div>{this.props.title}</div>
              <div style={{
        display: 'flex',
        marginTop: '10px',
        position: 'absolute'
      }}>
                {relativeTypeEl}
                <div> {dateEl} </div>
                {deleteBtn}
              </div>
            </div>;
  },
  _onRelativeTypeChange(e, selectedIndex, menuItem) {
    let props = this.props;
    MultiTimespanAction.handleRelativeTypeChange(props.isOriginalDate, menuItem.value, props.compareIndex);
  },
  _onRelativeValueChange(e, selectedIndex, menuItem) {
    let me = this;
    MultiTimespanAction.handleRelativeValueChange(menuItem.value, me.props.compareIndex);
  },
  _onDateSelectorChanged() {
    let me = this;
    let {isOriginalDate, compareIndex} = this.props;
    let dateSelector = this.refs.dateTimeSelector,
      dateRange = dateSelector.getDateTime(),
      startDate = dateRange.start,
      endDate = dateRange.end;
    MultiTimespanAction.handleDateTimeSelectorChange(isOriginalDate, compareIndex, startDate, endDate);
  },
});

let AddIntervalWindow = React.createClass({
  _onAction(action) {
    let analysisPanel = this.props.analysisPanel;
    if (action === 'draw') {
      MultiTimespanAction.convert2Stable();
      analysisPanel.state.chartStrategy.onSearchDataButtonClickFn(analysisPanel);
    } else {
      MultiTimespanAction.clearMultiTimespan('temp');
    }
    analysisPanel.setState({
      showAddIntervalDialog: false
    });
  },
  _onrelativeListChange() {
    this.setState({
      relativeList: MultipleTimespanStore.getRelativeList()
    });
  },
  _addNewCompareItem() {
    MultiTimespanAction.addMultiTimespanData();
  },
  _removeCompareItem(compareIndex) {
    MultiTimespanAction.removeMultiTimespanData(compareIndex);
  },
  getInitialState() {
    return {
      relativeList: MultipleTimespanStore.getRelativeList()
    };
  },
  componentDidMount() {
    MultipleTimespanStore.addChangeListener(this._onrelativeListChange);
  },
  componentWillUnmount() {
    MultipleTimespanStore.removeChangeListener(this._onrelativeListChange);
  },
  render() {
    let me = this;
    let relativeList = me.state.relativeList;
    let timeSpanEls = relativeList.map((item) => {
      return <TimespanItem {...item} onCompareItemRemove={me._removeCompareItem}></TimespanItem>;
    });

    let _buttonActions = [<FlatButton
    label="绘制"
    onClick={me._onAction.bind(me, 'draw')} />,
      <FlatButton
      label="放弃"
      style={{
        marginLeft: '10px'
      }}
      onClick={me._onAction.bind(me, 'cancel')} />];

    let titleEl = <div style={{
      fontSize: '20px',
      padding: '24px 0 0 50px'
    }}>{'历史对比'}</div>;
    let dialog = <Dialog {...me.props} title={titleEl} actions={_buttonActions} modal={true}
    contentClassName='jazz-add-interval-dialog'>
                    <div style={{
      height: '418px'
    }}>
                      {timeSpanEls}
                      <LinkButton  label='添加时间段' labelStyle={{
      display: 'inline-block',
      marginTop: '10px'
    }} onClick={me._addNewCompareItem}/>
                    </div>
                  </Dialog>;

    return <div>
             {dialog}
           </div>;
  }
});
module.exports = AddIntervalWindow;
