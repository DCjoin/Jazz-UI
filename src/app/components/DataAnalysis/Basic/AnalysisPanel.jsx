'use strict';
import React, { Component }  from "react";
import assign from "object-assign";
import FlatButton from 'controls/FlatButton.jsx';
import TagDrawer from './TagDrawer.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import Dialog from 'controls/OperationTemplate/BlankDialog.jsx';
import MultipleTimespanStore from 'stores/energy/MultipleTimespanStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import _ from 'lodash';
import EnergyStore from 'stores/energy/EnergyStore.jsx';
import CommonFuns from 'util/Util.jsx';
import ChartStatusStore from 'stores/energy/ChartStatusStore.jsx';
import FolderAction from 'actions/FolderAction.jsx';
import ExportChartAction from 'actions/ExportChartAction.jsx';
import ConstStore from 'stores/ConstStore.jsx';
import TagStore from 'stores/TagStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import GlobalErrorMessageAction from 'actions/GlobalErrorMessageAction.jsx';

const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  ERROR_NOTICE: 'errornotice'
};

export default class AnalysisPanel extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onRelativeDateChange = this._onRelativeDateChange.bind(this);
    this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
  }

  searchDate=MultipleTimespanStore.getRelativeItems();

  state={
      tagShow:false,
      dialogType:'',
      isLoading: false,
      energyData: null,
      energyRawData: null,
      submitParams: null,
      selectedChartType: 'line',
      remarkText: '',
      remarkDisplay: false,
      relativeDate:'Last7Day',
      operationMenuOpen:false
  }

  _onDialogChanged() {
    this.setState({
      dialogType: FolderStore.getDisplayDialog().type
    });
  }

  _onLoadingStatusChange() {
    let isLoading = EnergyStore.getLoadingStatus(),
      paramsObj = EnergyStore.getParamsObj(),
      // tagOption = EnergyStore.getTagOpions()[0],
      obj = assign({}, paramsObj);

      obj.isLoading = isLoading;
      // obj.tagName = tagOption.tagName;
      // obj.dashboardOpenImmediately = false;
      // obj.tagOption = tagOption;
      obj.energyData = null;

      this.setState(obj);
  }

  _onEnergyDataChange(isError, errorObj, args) {
    let isLoading = EnergyStore.getLoadingStatus(),
        energyData = EnergyStore.getEnergyData(),
        energyRawData = EnergyStore.getEnergyRawData(),
        paramsObj = assign({}, EnergyStore.getParamsObj()),
    state = {
      isLoading: isLoading,
      energyData: energyData,
      energyRawData: energyRawData,
      paramsObj: paramsObj,
      isCalendarInited: false
    };
  if (isError === true) {
    state.step = null;
    state.errorObj = errorObj;
    if (!!args && args.length && args[0] === '') {

    }
  }
    this.setState(state);
  }

  _onGetEnergyDataError() {
    let errorObj = this.errorProcess(EnergyStore);
    this._onEnergyDataChange(true, errorObj);
  }

  _onGetEnergyDataErrors() {
    let errorObj = this.errorsProcess(EnergyStore);
    this._onEnergyDataChange(false, errorObj);
  }

  errorProcess(EnergyStore) {
    let code = EnergyStore.getErrorCode(),
        messages = EnergyStore.getErrorMessage();

        if (!code) {
          return;
        } else if (code === '02004'.toString()) {
          let errorObj = this.showStepError(messages[0], EnergyStore);
          return errorObj;
        } else {
          let errorMsg = CommonFuns.getErrorMessage(code);
          setTimeout(() => {
            GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code);
          }, 0);
          return null;
        }
      }

  errorsProcess(EnergyStore) {
    let codes = EnergyStore.getErrorCodes();
    var errorMsg,
        textArray = [];
        if (!!codes && codes.length) {
          for (var i = 0; i < codes.length; i++) {
            errorMsg = CommonFuns.getErrorMessage(codes[i]);
            textArray.push(errorMsg);
          }
          setTimeout(() => {
            GlobalErrorMessageAction.fireGlobalErrorMessage(textArray.join('\n'));
          }, 0);
        }
        return null;
      }
      
  _handleSave(isSave=true){
    let chartType = this.state.selectedChartType;
    let tagOptions = EnergyStore.getTagOpions();
    let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
    let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, TagStore.getCurrentDimInfo());
    let widgetDto = _.cloneDeep(this.props.widgetDto);
    let submitParams1 = EnergyStore.getSubmitParams();
    let paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges,
      step = paramsObj.step,
      widgetTimeRanges;

    //submitParams part
    let submitParams = {
        options: nodeNameAssociation,
        tagIds: tagIds
      };

    //time range part
    if (timeRanges.length === 1) {
      let relativeDate = EnergyStore.getRelativeDate();
      if (relativeDate !== 'Customerize') {
        widgetTimeRanges = [{
        relativeDate: relativeDate
      }];
    } else {
      widgetTimeRanges = timeRanges;
    }
    } else {
      widgetTimeRanges = MultipleTimespanStore.getSave2DashboardTimespans();
    }

    // viewOption part
      let viewOption = {
        TimeRanges: widgetTimeRanges,
        Step: step
      };

      let includeNavigatorData = !(chartType === 'pie' || chartType === 'rawdata');
      viewOption.IncludeNavigatorData = includeNavigatorData;

      if (submitParams1 && submitParams1.viewOption) {
        let vo = submitParams1.viewOption;
        if (vo.IncludeTempValue)
          viewOption.IncludeTempValue = vo.IncludeTempValue;
        if (vo.IncludeHumidityValue)
          viewOption.IncludeHumidityValue = vo.IncludeHumidityValue;
      }

      viewOption.DataUsageType=1; // Energy

      if (chartType === 'rawdata') {
        let dataOption = {
          OriginalValue: true,
          WithoutAdditionalValue: true
        };
        viewOption.DataOption = dataOption;

        let pagingObj = this.refs.ChartComponent.getPageObj();
        let pagingOrder = {
          PageSize: 20,
          PageIdx: pagingObj.pageIdx,
          Order: {
            Column: 1,
            Type: 0
          },
          PreviousEndTime: null,
          Operation: 1
        };
        viewOption.PagingOrder = pagingOrder;
        chartType = 'original';
      } else {
        widgetDto.WidgetSeriesArray = ChartStatusStore.getWidgetSaveStatus();
      }

      submitParams.viewOption = viewOption;

      //storeType part
      let storeType;
      if (chartType === 'pie') {
        storeType = 'energy.Distribution';
      } else {
        storeType = 'energy.Energy';
      }

      let config = {
        type: chartType,
        storeType: storeType
      };

      let params = {
        submitParams: submitParams,
        config: config,
        calendar: this.state.calendarType
      };
      if (this.state.yaxisConfig !== null) {
        params.yaxisConfig = this.state.yaxisConfig;
      }
      let contentSyntax = {
        params: params
      };
      widgetDto.ContentSyntax = JSON.stringify(contentSyntax);
      widgetDto.Comment = this.state.remarkText;

      if (!isSave) {
          return widgetDto;
        } else {
          FolderAction.updateWidgetDtos(widgetDto);
        }

  }

  exportChart() {
    if (!this.state.energyData) {
      return;
    }
    let path;
  let chartType = this.state.selectedChartType;
  let tagOptions = EnergyStore.getTagOpions();
  let tagIds = CommonFuns.getTagIdsFromTagOptions(tagOptions);
  let viewOption = EnergyStore.getSubmitParams().viewOption;
  let title = this.props.chartTitle || I18N.Folder.NewWidget.Menu1;

  let params = {
    title: title,
    tagIds: tagIds,
    viewOption: viewOption
  };

  path = '/Energy/GetTagsData4Export';
  let nodeNameAssociation = CommonFuns.getNodeNameAssociationByTagOptions(tagOptions, {
    dimName: null,
    dimId: null
  });
  params.nodeNameAssociation = nodeNameAssociation;

  let charTypes = [];
  if (chartType !== 'rawdata') {
    let seriesNumber = EnergyStore.getEnergyData().toJS().Data.length;
    let seriesStatusArray = ChartStatusStore.getSeriesStatus();
    let sslength = seriesStatusArray.length;
    for (let i = 0; i < seriesNumber; i++) {
      let curChartType;
      if (i < sslength) {
        let serie = seriesStatusArray[i];
        if (serie) {
          if (serie.IsDisplay) {
            curChartType = ChartStatusStore.getChartTypeByNum(serie.ChartType);
          } else {
            curChartType = 'null';
          }
        } else {
          curChartType = chartType;
        }
      } else {
        curChartType = chartType;
      }
      charTypes.push(curChartType);
    }
  }
  params.charTypes = charTypes;
  ExportChartAction.getTagsData4Export(params, path);
  }

  _getErrorNoticeDialog() {
    var that = this;
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      })
    };
    var props = {
      title: I18N.Platform.ServiceProvider.ErrorNotice,
      firstActionLabel: I18N.Mail.Send.Ok,
      content: FolderStore.getDisplayDialog().contentInfo,
      onFirstActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Dialog {...props}/>
    )
  }

  _renderDialog(){
    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.SWITCH_WIDGET:
        dialog = this._getSwitchWidgetDialog();
        break;
      case DIALOG_TYPE.ERROR_NOTICE:
        dialog = this._getErrorNoticeDialog();
        break;
    }
    return dialog
  }

  _renderMoreOperation(){
    var styles={
      label:{
        fontSize:'14px'
      }
    };

    let selectedWidget = FolderStore.getSelectedNode();
    let buttonDisabled = (!this.state.energyData || !selectedWidget.get('ChartType'));

    var   handleTouchTap = (event) => {
    // This prevents ghost click.
      event.preventDefault();

      this.setState({
        operationMenuOpen: true,
        anchorEl: event.currentTarget,
      });
    };

    var handleRequestClose = () => {
      this.setState({
        operationMenuOpen: false,
      });
    };

    var handleMenuItemClick= (event, menuItem,index)=>{

      switch (index){
        case 0:
              //另存为
              let widgetDto=this._handleSave(false);
              this.props.onOperationSelect(index, widgetDto);
              break;
        case 1:
              //导出
              this.exportChart();
              break;
        case 2:
              //分享
              this._handleSave(true);
        case 3:
              this.props.onOperationSelect(index);
            }

    };

    return(
      <div>
        <FlatButton label={I18N.Common.Button.More} labelStyle={styles.label} icon={<FontIcon className="icon-marker" style={styles.label}/>} onClick={handleTouchTap}/>
        <Popover
          open={this.state.operationMenuOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={handleRequestClose}
        >
      <Menu onItemTouchTap={handleMenuItemClick}>
        <MenuItem primaryText={I18N.Folder.Detail.WidgetMenu.Menu1} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem primaryText={I18N.Folder.Detail.WidgetMenu.Menu4} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem primaryText={I18N.Folder.Detail.WidgetMenu.Menu6} style={styles.label} disabled={buttonDisabled}/>
        <MenuItem primaryText={I18N.Folder.Detail.WidgetMenu.Menu5} style={styles.label} disabled={buttonDisabled}/>
      </Menu>
    </Popover>
  </div>
    )
  }

  _renderHeader(){
    var styles={
      button:{
        marginRight:'10px'
      },
      label:{
        fontSize:'14px'
      }
    }
    return(
      <div className="head">
        <div style={{display:'flex',alignItems:'center'}}>
          <div className="title">{this.props.chartTitle}</div>
          <div className="description">{`(${I18N.format(I18N.Folder.Detail.SubTitile,this.props.sourceUserName)})`}</div>
        </div>
        <div className="operation">
          <FlatButton label={I18N.Common.Button.Save} disabled={!this.state.energyData} labelstyle={styles.label} icon={<FontIcon className="icon-save" style={styles.label}/>} style={styles.button}/>
          <FlatButton label={I18N.Setting.DataAnalysis.Scheme} labelstyle={styles.label} icon={<FontIcon className="icon-save" style={styles.label}/>} style={styles.button}/>
          {this._renderMoreOperation()}
      </div>
      </div>
    )
  }

  _onRelativeDateChange(e, selectedIndex, value) {
    let dateSelector = this.refs.dateTimeSelector;

    if (this.state.selectedChartType === 'rawdata' && value !== 'Customerize' && value !== 'Last7Day' && value !== 'Today' && value !== 'Yesterday' && value !== 'ThisWeek' && value !== 'LastWeek') {
    FolderAction.setDisplayDialog('errornotice', null, I18N.EM.RawData.ErrorForEnergy);
  } else {
    if (value && value !== 'Customerize' && dateSelector) {
      var timeregion = CommonFuns.GetDateRegion(value.toLowerCase());
      dateSelector.setDateField(timeregion.start, timeregion.end);
    }
  }
    this.setState({
      relativeDate:value
    })
  }

  _onDateSelectorChanged() {
    this.setState({
      relativeDate: 'Customerize'
    });
  }

  _renderSearchBar(){
    var relativeDate=this.state.relativeDate;
    var styles={
      button:{
        border:'1px solid #efefef',
        marginRight:'15px'
      },
      label:{
        fontSize:'14px'
      }
    }
    return(
      <div className={'jazz-alarm-chart-toolbar'} style={{
          marginTop: '30px'
        }}>
       <div className={'jazz-full-border-dropdownmenu-container'} style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          height: '38px',
          marginTop: '-4px'
        }}>
         <FlatButton label={I18N.Setting.Tag.Tag} labelstyle={styles.label}
                     icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                     onClick={()=>{
                       this.setState({
                         tagShow:true
                       })
                     }}/>
         <DropDownMenu ref="relativeDate" style={{
          width: '90px',
        }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={relativeDate} onChange={this._onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>
       </div>
       <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={this._onDateSelectorChanged} showTime={true}/>

     </div>
    )
  }

  getInitParam(analysisPanel) {
    let date = new Date();
    date.setHours(0, 0, 0);
    let last7Days = CommonFuns.dateAdd(date, -6, 'days');
    let endDate = CommonFuns.dateAdd(date, 1, 'days');
    this.refs.relativeDate.setState({
      selectedIndex: 1
    });
    this.refs.dateTimeSelector.setDateField(last7Days, endDate);
  }
  componentDidMount(){
    this.getInitParam();
    FolderStore.addDialogListener(this._onDialogChanged);
    EnergyStore.addEnergyDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.addEnergyDataLoadedListener(this._onEnergyDataChange);
    EnergyStore.addEnergyDataLoadErrorListener(this._onGetEnergyDataError);
    EnergyStore.addEnergyDataLoadErrorsListener(this._onGetEnergyDataErrors);
  }

  componentWillUnmount(){
    FolderStore.removeDialogListener(this._onDialogChanged);
    EnergyStore.removeEnergyDataLoadingListener(this._onLoadingStatusChange);
    EnergyStore.removeEnergyDataLoadedListener(this._onEnergyDataChange);
    EnergyStore.removeEnergyDataLoadErrorListener(this._onGetEnergyDataError);
    EnergyStore.removeEnergyDataLoadErrorsListener(this._onGetEnergyDataErrors);
  }

  render(){
    return(
      <div className="jazz-analysis-panel">
        {this._renderHeader()}
        <div className="content">
          {this._renderSearchBar()}
        </div>
        {this.state.tagShow?<TagDrawer {...this.props} customerId={this.context.router.params.customerId}/>:null}
        {this._renderDialog()}
      </div>
    )
  }
}

AnalysisPanel.propTypes = {
	hierarchyId:React.PropTypes.number,
  isBuilding:React.PropTypes.bool,
  chartTitle:React.PropTypes.string,
  sourceUserName:React.PropTypes.string,
  widgetDto:React.PropTypes.object,
  onOperationSelect:React.PropTypes.func,
  isNew:React.PropTypes.bool,
};

AnalysisPanel.defaultProps={
  hierarchyId:100016,
  isBuilding:true,
  chartTitle:'冷机COP',
  sourceUserName:'Uxteam',
  isNew:true
}
