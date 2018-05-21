import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import moment from 'moment';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';

const BACK_DIALOG = 'BACK_DIALOG';
const CANCEL_DIALOG = 'CANCEL_DIALOG';

const SVG_WIDTH = 733;
const SVG_HEIGHT = 351;

function formatChartTime( data, tail ) {
  let dateStr = moment(data.getIn(['EnergyViewData', 'TargetEnergyData', 0, 'Target', 'TimeSpan'].concat(tail))).subtract(16, 'hour').format('YYYY-MM-DD HH:mm')
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
          }}>{showDetail ? '收起详情' : '展开详情'}</span>
        </div>
        <div className='similar-problem-detail'>
          <span className='similar-problem-time'>{chartData && '时间区间：' + formatChartTime(chartData, 'StartTime') + '  至  ' + formatChartTime(chartData, 'EndTime')}</span>
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
          <span className='icon-close' onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
          <span className='icon-return' onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {'相似方案列表'}
        </header>
        <div className='current-diagnose similar-problem-checkbox-layout'>
          <Checkbox style={{width: 'auto'}} disabled={true} checked={true}/>
          <span className='icon-diagnose'/>
          <span>{currentProblem && currentProblem.get('Name')}</span>
          <span className='diagnose-tip'>{'当前问题'}</span>
        </div>
        <div className='similar-problem-checkbox-layout'>
          <Checkbox checked={ checkedProblems && (checkedProblems.length === problems.size - 1) } onCheck={(e, checked) => {
            if( checked ) {
              this.props.onChange( problems.filter( problem => problem.get('Id') !== currentProblemId ).toJS() );
            } else {
              this.props.onChange( [] );
            }
          }} style={{width: 'auto'}}/>
          <span>{'全选'}</span>
          <span className='diagnose-tip'>{'下列问题与当前问题类型相似，您可为它们统一生成方案。'}</span>
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
          <FlatButton highlight label={'下一步'} onClick={onNext}/>
          <FlatButton style={{marginRight: 16}} label={'取消'} onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </footer>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={'返回上一页'} onClick={this.props.onBack}/>,
          <FlatButton label={'取消'} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{'当前页面所有操作将不会保存，确定返回上一页吗？'}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={'离开页面'} onClick={this.props.onCancel}/>,
          <FlatButton label={'取消'} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{'当前页面所有操作将不会保存，确定离开当前页面吗？'}</Dialog>
      </div>
    );
  }
}
