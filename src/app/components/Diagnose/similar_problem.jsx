import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import moment from 'moment';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'controls/FlatButton.jsx';
import MuiFlatButton from 'material-ui/FlatButton';
import Dialog from 'controls/NewDialog.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';
import {dateAdd,DataConverter,DateComputer} from 'util/Util.jsx';

const BACK_DIALOG = 'BACK_DIALOG';
const CANCEL_DIALOG = 'CANCEL_DIALOG';

const SVG_WIDTH = 733;
const SVG_HEIGHT = 351;

function formatChartTime( data, tail ) {

  let j2d=DataConverter.JsonToDateTime,
      MinusStep=DateComputer.MinusStep,
      fixedTimes=DateComputer.FixedTimes;
  let timeRange=data.getIn(['EnergyViewData','TargetEnergyData',0,'Target','TimeSpan']).toJS(),
      step=data.getIn(['EnergyViewData','TargetEnergyData',0,'Target','Step']),

      timeTmp=(step===3||step===4)?j2d(timeRange[tail],false):j2d(timeRange[tail]),
      date=MinusStep(timeTmp,step,fixedTimes);

      // startTimeTmp=(step===3||step===4)?j2d(timeRange.StartTime,false):j2d(timeRange.StartTime),
      // endTimeTmp=(step===3||step===4)?j2d(timeRange.EndTime,false):j2d(timeRange.EndTime),

      // startDate=MinusStep(startTimeTmp,step,fixedTimes),
      // endDate=MinusStep(endTimeTmp,step,fixedTimes);

  let dateStr = moment(date).format('YYYY-MM-DD HH:mm')
  if( tail === 'EndTime' && ~dateStr.indexOf(' 00:00') ) {
    dateStr = moment(dateStr).subtract(1, 'day').format('YYYY-MM-DD') + ' 24:00';
  }
  return dateStr;
}

class ProblemItem extends Component {
  constructor(props) {
    super(props);

    let { problem, chartDatas, checked } = props;
    let chartData = chartDatas[problem.get('Id')];
    if( !chartData ) {
      DiagnoseAction.getSimilarProblemChart(problem.get('Id'));
    }
  }
  state = {
    showDetail: false,
    svgString: false,
  };
  _renderHighChart() {
    let { problem, chartDatas } = this.props;
    let problemId = problem.get('Id');
    let chartData = chartDatas[problemId];
    if( !chartData || this.state.svgString) {
      return null;
    }
    return (<div style={{position: 'relative', overflowX: 'hidden'}} className='similar-problem-img'>
            <div id={'chart_basic_component_' + problemId} style={{
                flex: 1,
                position: 'absolute',
                width: SVG_WIDTH,
                height: SVG_HEIGHT,
                display: 'flex',
                opacity: 0,
                flexDirection: 'column',
                marginBottom: '0px',
                marginLeft: '9px'
              }}>
                <DiagnoseChart afterChartCreated={() => this._afterChartCreated()} data={chartData}/>
          </div>
        </div>);
  }
  _afterChartCreated() {
    let { problem, chartDatas } = this.props;
    let problemId = problem.get('Id');
    let svgString,
    parent = ReactDOM.findDOMNode(this).querySelector('#chart_basic_component_' + problemId);
    if(parent && parent.querySelector('svg')) {
      svgString = new XMLSerializer().serializeToString(parent.querySelector('svg'));
    }
    if( svgString ) {
      this.setState({
        svgString: svgString,
      });
    }
  }
  _renderChart() {
    let svgString = this.state.svgString;
    if( svgString ) {
      return (<div className='similar-problem-img' dangerouslySetInnerHTML={{__html: svgString}} />);
    }
    return (<div className='similar-problem-img flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>);
  }
  render() {
    let { problem, chartDatas, checked } = this.props;
    let { showDetail } = this.state;
    let chartData = chartDatas[problem.get('Id')];
    return (
      <li className={classnames('similar-problem-item', {'show-detail': showDetail})}>
        <div className='similar-problem-checkbox-layout'>
          <Checkbox checked={checked} style={{width: 'auto'}} onCheck={this.props.onCheck}/>
          <span className='icon-diagnose'/>
          <span className='detail-name'>{problem.get('Name')}</span>
          <span className={'detail-action ' + (showDetail ? 'icon-arrow-up': 'icon-arrow-down')} onClick={() => {
            this.setState({
              showDetail: !this.state.showDetail
            })
          }}>{showDetail ? I18N.Setting.Diagnose.SimilarProblemHideDetail : I18N.Setting.Diagnose.SimilarProblemShowDetail}</span>
        </div>
        <div className='similar-problem-detail'>
          <span className='similar-problem-time'>{chartData && (I18N.Setting.Diagnose.TimeRange + '：' + formatChartTime(chartData, 'StartTime') + '  ' + I18N.EM.To2 + '  ' + formatChartTime(chartData, 'EndTime'))}</span>
          {this._renderChart(chartData)}
          {/*<img className='similar-problem-img' src='https://cdn4.buysellads.net/uu/1/3386/1525189943-38523.png'/>*/}
        </div>
        {this._renderHighChart(chartData)}
      </li>
    )
  }
}

export default class SimilarProblem extends Component {
  state = {
    dialogKey: null,
  };
  render() {
    let { currentProblemId, problems, chartDatas, checkedProblems, onNext } = this.props;
    let currentProblem = problems.find( problem => problem.get('Id') === currentProblemId );
    return (
      <div className='similar-problem'>
        <header className='similar-problem-header'>
          <span className='icon-return' onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {I18N.Setting.Diagnose.SimilarProblemList}
        </header>
        <div className='current-diagnose similar-problem-checkbox-layout'>
          <Checkbox style={{width: 'auto'}} disabled={true} checked={true}/>
          <span className='icon-diagnose'/>
          <span>{currentProblem && currentProblem.get('Name')}</span>
          <span className='diagnose-tip'>{I18N.Setting.Diagnose.CurrentProblem}</span>
        </div>
        <div className='similar-problem-checkbox-layout'>
          <Checkbox checked={ checkedProblems && (checkedProblems.length === problems.size - 1) } onCheck={(e, checked) => {
            if( checked ) {
              this.props.onChange( problems.filter( problem => problem.get('Id') !== currentProblemId ).toJS() );
            } else {
              this.props.onChange( [] );
            }
          }} style={{width: 'auto'}}/>
          <span>{I18N.Tag.SelectAll}</span>
          <span className='diagnose-tip'>{I18N.Setting.Diagnose.SimilarProblemTip}</span>
        </div>
        <ul className='similar-problem-list'>
          {problems.filter( problem => problem.get('Id') !== currentProblemId ).map( problem => (
          <ProblemItem checked={ ~checkedProblems.map( problem => problem.Id ).indexOf(problem.get('Id')) } key={problem.get('Id')} chartDatas={chartDatas} problem={problem} onCheck={(e, checked) => {
            let currentId = problem.get('Id');
            if( checked ) {
              this.props.onChange( checkedProblems.concat( problem.toJS() ) )
            } else {
              this.props.onChange( checkedProblems.filter( problem => problem.Id !== currentId ) )
            }
          }}/>
          ) )}
        </ul>
        <footer className='similar-problem-footer'>
          <MuiFlatButton style={{
            borderRadius: 2,
            border: 'solid 1px #32ad3c',
            backgroundColor: '#32ad3c',
            color: '#ffffff',
            marginRight: 16,
          }} label={I18N.Paging.Button.NextStep} onClick={onNext}/>
          <MuiFlatButton style={{
            borderRadius: 2,
            border: 'solid 1px #e6e6e6',
            color: '#666666',
            marginRight: 16,
          }} label={I18N.Common.Button.Cancel2} onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </footer>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.ReturnPage} onClick={this.props.onBack}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.ReturnPageTip}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={this.props.onCancel}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.LeavePageTip}</Dialog>
      </div>
    );
  }
}
