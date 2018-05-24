import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { CircularProgress} from 'material-ui';
// import nzh from 'nzh/cn';
import FlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import { ProblemMarkEnum } from 'constants/AnalysisConstants.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';
import { Gallery } from '../DataAnalysis/Basic/GenerateSolution.jsx';
import ImagGroupPanel from 'controls/ImagGroupPanel.jsx';

const SVG_WIDTH = 750;
const SVG_HEIGHT = 360;

function getROILabel( solution ) {

  let roi = MeasuresStore.getInvestmentReturnCycle(
    solution.get('InvestmentAmount'),
    solution.get('ExpectedAnnualCostSaving')
  )
  if( !roi ) {
    return '-';
  }
  if( +roi === roi ) {
    roi += I18N.EM.Year;
  }
  return roi;
}

function SessionTitle(props) {
  let {title, subtitle, style} = props;
  return (<div className='session-title' style={style}>
    {title}{subtitle && (<span className='subtitle'>{subtitle}</span>)}
  </div>)
}

class TextBox extends Component {
  render() {
    let { onChange, onBlur, value, hintText, style, errorMsg, multiLine } = this.props;
    return (<div className='solution-text-box' style={style}>
      {multiLine ? <textarea type='text' value={value} onChange={onChange} placeholder={hintText}/> : <input type='text' value={value} onBlur={onBlur} onChange={onChange} placeholder={hintText}/>}
      {errorMsg && <span className='error-msg'>{errorMsg}</span>}
    </div>);
  }
}

export class PlanTitle extends Component {
  _initTextBoxProps(key) {
    let { energySolution, errorData, onChange, onBlur } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['Problem', key]),
      value: energySolution.getIn(['Problem', key]),
      onChange: e => onChange(['Problem', key], e.target.value),
      onBlur: e => onBlur && onBlur(['Problem', key], e.target.value),
    }
  }
  render() {
    let { isRequired} = this.props;
    return (<div >
      <SessionTitle title={I18N.Setting.Diagnose.SolutionTitle} subtitle={isRequired && I18N.Setting.Diagnose.Require} style={{marginBottom: 20}}/>
      {this.props.hasSubTitle && <div className='field-title'>{I18N.Setting.Diagnose.SolutionTitle}</div>}
      <TextBox {...this._initTextBoxProps('SolutionTitle')} hintText={I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.SolutionTitle}/>

    </div>)
  }
}
PlanTitle.propTypes = {
  isRequired: PropTypes.boolean,
  errorData: PropTypes.object,
  energySolution: PropTypes.object,
  onChange: PropTypes.func,
  hasSubTitle:PropTypes.boolean,
}

PlanTitle.defaultProps = {
	hasSubTitle:true,
}


export class ProblemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: 0,
      anchorEl: null,
    }
    this._renderChart = this._renderChart.bind(this);
  }
  _initTextBoxProps(key) {
    let { energySolution, errorData, onChange, onBlur } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['Problem', key]),
      value: energySolution.getIn(['Problem', key]),
      onChange: e => onChange(['Problem', key], e.target.value),
      onBlur: e => onBlur && onBlur(['Problem', key], e.target.value),
    }
  }

  _afterChartCreated(id) {
    let svgString,
    parent = ReactDOM.findDOMNode(this).querySelector('#chart_basic_component_' + id);
    if(parent && parent.querySelector('svg')) {
      svgString = new XMLSerializer().serializeToString(parent.querySelector('svg'));
    }
    if( svgString ) {
      setTimeout(() => {
        this.props.onChange([
          'Problem',
          'EnergyProblemImages',
          this.props.energySolution.getIn(['Problem', 'EnergyProblemImages']).findIndex( img => img.get('Id') === id ),
          'Content',
        ], svgString);
      })
    }
  }

  _renderHighChart(chartData, id) {
    let currentImg = this.props.energySolution.getIn(['Problem', 'EnergyProblemImages', this.state.selectedIdx]);
    if( !currentImg ) {
      return null;
    }
    if(!chartData || currentImg.get('Content') ) {
      return null;
    }
    return (<div style={{position: 'relative', overflowX: 'hidden', height: SVG_HEIGHT, width: SVG_WIDTH}}>
            <div id={'chart_basic_component_' + id} style={{
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
              <DiagnoseChart afterChartCreated={() => this._afterChartCreated(id)} data={chartData}/>
          </div>
        </div>);
  }
  _renderChart() {
    let currentImg = this.props.energySolution.getIn(['Problem', 'EnergyProblemImages', this.state.selectedIdx]);
    if( !currentImg ) {
      return null;
    }
    let src = currentImg.get('ImageUrl');
    if( src ) {
      return (<img src={src} width="100%" height="332px"/>);
    } else {
      let content = currentImg.get('Content');
      if( content ) {
        return (<div style={{height: SVG_HEIGHT, width: SVG_WIDTH}} dangerouslySetInnerHTML={{__html: content}} />);
      }
      return (<div style={{height: SVG_HEIGHT, width: SVG_WIDTH}} className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>);
    }
  }

  _renderViewStatus(){
    var {energySolution}=this.props;
    let { selectedIdx } = this.state;
    return (<div >
      <SessionTitle title={I18N.Setting.Diagnose.ProblemDetail} style={{marginBottom: 20}}/>
      <div className='field-wrapper flex-bar'>
        <div>
          <div className='field-title'>{I18N.Setting.Diagnose.ProblemName}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{energySolution.getIn(['Problem', 'Name'])}</div>
        </div>
      </div>
      <div className='field-wrapper'>
        <div className='field-title'>{I18N.Setting.Diagnose.ProblemDescription}</div>
         <div className="field-text" style={{marginTop:'16px'}}>{energySolution.getIn(['Problem', 'Description'])}</div>
      </div>
      <div className='field-wrapper' style={{width: 770}}>
        <div className='field-title'>{I18N.Setting.Diagnose.ProblemImage}</div>
        <Gallery
          names={energySolution.getIn(['Problem', 'EnergyProblemImages']).map( img => img.get('Name') ).toJS()}
          selectedIdx={selectedIdx}
          onLeft={() => {
            this.setState({
              selectedIdx: --selectedIdx
            });
          }}
          onRight={() => {
            this.setState({
              selectedIdx: ++selectedIdx
            });
          }}
          onDelete={() => {
            onChange(['Problem', 'EnergyProblemImages'], energySolution.getIn(['Problem', 'EnergyProblemImages']).delete(selectedIdx));
            if( selectedIdx === energySolution.getIn(['Problem', 'EnergyProblemImages']).length - 1 ) {
              this.setState({
                selectedIdx: energySolution.getIn(['Problem', 'EnergyProblemImages']).size - 2
              })
            }
          }}
          renderContent={this._renderChart}/>
      </div>
    </div>)
  }

  render() {
    let { isRequired, errorMsg, errorData, energySolution, onChange, onBlur, isView,hasEnergySys, currentProblemId, checkedProblems, chartDatas, renderChart} = this.props;
    let { selectedIdx, anchorEl } = this.state;

    if(isView) return this._renderViewStatus()

    return (<div >
      <SessionTitle title={I18N.Setting.Diagnose.ProblemDetail} subtitle={isRequired && I18N.Setting.Diagnose.Require} style={{marginBottom: 20}}/>
      <div className='field-wrapper flex-bar'>
        <div>
          <div className='field-title'>{I18N.Setting.Diagnose.ProblemName}{!isRequired && <span className='subtitle'>{I18N.Setting.Diagnose.Require}</span>}</div>
          <TextBox {...this._initTextBoxProps('Name')} hintText={I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.PleaseInput}/>
        </div>
        {hasEnergySys && <div style={{marginLeft: 20}}>
          <div className='field-title'>{I18N.Setting.Diagnose.EnergySys}{!isRequired && <span className='subtitle'>{I18N.Setting.Diagnose.Require}</span>}</div>
          <div className='select-field-overlay' onClick={(e) => {
            this.setState({
              anchorEl: e.target
            })
          }}>
            <TextBox {...this._initTextBoxProps('EnergySys')} onBlur={() => {}}
              value={I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[energySolution.getIn(['Problem', 'EnergySys'])]}
              style={{width: 346}} hintText={I18N.Setting.Diagnose.PleaseSelect}/>
            <span className='icon-arrow-unfold'/>
          </div>
          <Popover onRequestClose={() => {
            onBlur && onBlur(['Problem', 'EnergySys'], '');
            this.setState({
              anchorEl: null
            })
          }} open={!!anchorEl} anchorEl={anchorEl}>
            {Object.keys(ProblemMarkEnum).map(key => (
            <MenuItem onClick={() => {
              this.setState({
                anchorEl: null
              });
              let value = parseInt(ProblemMarkEnum[key]);
              onChange(['Problem', 'EnergySys'], value);
              onBlur && onBlur(['Problem', 'EnergySys'], value);
            }} primaryText={I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[ProblemMarkEnum[key]]} value={ProblemMarkEnum[key]}/>
            ))}
          </Popover>
        </div>}
      </div>
      <div className='field-wrapper'>
        <div className='field-title'>{I18N.Setting.Diagnose.ProblemDescription}</div>
        <div className='contenteditable-desc' contentEditable placeholder={I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.ProblemDescription} onBlur={(e) => {
          let str = Array.from(e.target.childNodes).map( child => {
            if( child.nodeType === 3 ) {
              return child.nodeValue;
            }
            if( child.nodeType === 1 ) {
              if( child.childNodes && child.childNodes[0] && child.childNodes[0].nodeType === 3 ) {
                return child.childNodes[0].nodeValue;
              }
            }
            return '';
          } ).join('\r\n');
          onChange(['Problem', 'Description'], str);
          onBlur && onBlur(['Problem', 'Description'], str)
        }}>
          {energySolution.getIn(['Problem', 'Description'])}
        </div>
         {errorData && errorData.getIn(['Problem', 'Description']) && <span style={{color:'#dc0a0a',fontSize:'12px'}}>{errorData.getIn(['Problem', 'Description'])}</span>}
      </div>
      <div className='field-wrapper' style={{width: 770}}>
        <div className='field-title'>{I18N.Setting.Diagnose.ProblemImage}</div>
        {!renderChart && energySolution.getIn(['Problem', 'EnergyProblemImages']).map( (image) => chartDatas && chartDatas[image.get('Id')] && this._renderHighChart(chartDatas[image.get('Id')], image.get('Id')) )}
        {renderChart && renderChart()}
        <Gallery
          names={energySolution.getIn(['Problem', 'EnergyProblemImages']).map( img => img.get('Name') ).toJS()}
          selectedIdx={selectedIdx}
          onLeft={() => {
            this.setState({
              selectedIdx: --selectedIdx
            });
          }}
          onRight={() => {
            this.setState({
              selectedIdx: ++selectedIdx
            });
          }}
          onDelete={() => {
            onChange(['Problem', 'EnergyProblemImages'], energySolution.getIn(['Problem', 'EnergyProblemImages']).delete(selectedIdx));
            if( selectedIdx === energySolution.getIn(['Problem', 'EnergyProblemImages']).length - 1 ) {
              this.setState({
                selectedIdx: energySolution.getIn(['Problem', 'EnergyProblemImages']).size - 2
              })
            }
            this.setState({
              dialogKey: DELETE_DIALOG
            })
          }}
          renderContent={this._renderChart}/>
      </div>
    </div>)
  }
}
ProblemDetail.propTypes = {
  isRequired: PropTypes.boolean,
  errorData: PropTypes.object,
  energySolution: PropTypes.object,
  onChange: PropTypes.func,
  isView:PropTypes.boolean,
  hasEnergySys:PropTypes.boolean,
}
ProblemDetail.defaultProps = {
	isView:false,
  hasEnergySys:true
}

const SOLUTION_NAMES=[I18N.Setting.ECM.SolutionName.First,I18N.Setting.ECM.SolutionName.Second,I18N.Setting.ECM.SolutionName.Third,
                      I18N.Setting.ECM.SolutionName.Fourth,I18N.Setting.ECM.SolutionName.Fifth,I18N.Setting.ECM.SolutionName.Sixth,
                      I18N.Setting.ECM.SolutionName.Seventh,I18N.Setting.ECM.SolutionName.Eighth,I18N.Setting.ECM.SolutionName.Ninth,
                      I18N.Setting.ECM.SolutionName.Tenth]

let _idx = null
export class PlanDetail extends Component {
  state = {
    dialogKey: null
  }
  _bindChange( paths ) {
    return e => {
      this.props.onChange( ['Solutions'].concat(paths), e.target.value );
    }
  }
  _initTextBoxProps(idx, key) {
    let { Solutions, errorData, onChange, onBlur } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['Solutions', idx, key]),
      value: Solutions.getIn([idx, key]),
      onChange: this._bindChange([idx, key]),
      onBlur: (e) => {
        onBlur && onBlur( ['Solutions'].concat([idx, key]), e.target.value );
      },
    }
  }
  _onDelete(idx) {
    let { Solutions, errorData, onChange } = this.props;
    onChange( ['Solutions'], Solutions.delete(idx) );
  }
  _renderViewStatus(){
    let { Solutions, errorData, onChange,isRequired,solutionTitle} = this.props;
        return (
        <div className='plan-detail'>
      <SessionTitle title={solutionTitle} style={{marginBottom: 30}}/>
      {Solutions && Solutions.map( (EnergySolution, idx) => (<div>
        {Solutions.size > 1 && <header style={{marginTop: idx && 32}} className='plan-detail-header'>
          <span>{SOLUTION_NAMES[idx]}</span>
        </header>}
        <div className='field-wrapper flex-bar'>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ExpectedAnnualEnergySaving}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'ExpectedAnnualEnergySaving'])}</span>
            </div>
            <span className='num-text'>{Solutions.getIn([idx, 'EnergySavingUnit'])}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ExpectedAnnualCostSaving}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'ExpectedAnnualCostSaving'])}</span>
            </div>
            <span className='num-text'>{'RMB'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-investment-amount'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.InvestmentAmount}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'InvestmentAmount'])}</span>
            </div>
            <span className='num-text'>{'RMB'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-pay-back-period'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ROI}</div>
              <span className='num-text' style={{alignSelf: 'flex-start' }}>{ getROILabel(Solutions.get(idx)) }</span>
            </div>
          </div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{I18N.Setting.Diagnose.SolutionName}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{Solutions.getIn([idx, 'Name'])}</div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{I18N.Setting.Diagnose.SolutionDescription}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{Solutions.getIn([idx, 'SolutionDescription'])}</div>
        </div>
        <div className='field-wrapper'>
          {this.props.hasPicTitle && <div className='field-title'>{I18N.Setting.Diagnose.SolutionImage}</div>}

          <ImagGroupPanel diagrams={Solutions.getIn([idx,"SolutionImages"])} width={145} height={100} editable={false}/>
        </div>
      </div>) )}
    </div>)
  }
  render() {
    let { Solutions, onBlur,errorData, onChange,isRequired,isView} = this.props;
    if(isView) return this._renderViewStatus()
    return (<div className='plan-detail'>
        <Dialog open={this.state.dialogKey === DELETE_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.ECM.Delete} onClick={() => {
            this._onDelete(_idx);
            _idx = null;
            this.setState({
              dialogKey: null
            });
          }}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.DeleteSolutionTip}</Dialog>
      <SessionTitle title={I18N.Setting.Diagnose.SolutionDetail} subtitle={isRequired?I18N.Setting.Diagnose.Require:I18N.Setting.Diagnose.Option} style={{marginBottom: 30}}/>
      {Solutions && Solutions.map( (EnergySolution, idx) => (<div>

        {Solutions.size > 1 && <header style={{marginTop: idx && 32}} className='plan-detail-header'>
          <span>{SOLUTION_NAMES[idx]}</span>
          <span className='split-line'/>
          <span className='icon-delete' onClick={() => {
            _idx = idx;
            this.setState({dialogKey: DELETE_DIALOG})
          }}/>
        </header>}
        <div className='field-wrapper flex-bar'>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ExpectedAnnualEnergySaving}</div>
              <TextBox {...this._initTextBoxProps(idx, 'ExpectedAnnualEnergySaving')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={I18N.Setting.Diagnose.Number}/>
            </div>
            <TextBox {...this._initTextBoxProps(idx, 'EnergySavingUnit')} style={{borderRadius: 4, height: 26, width: 62}} hintText={'单位'}/>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ExpectedAnnualCostSaving}</div>
              <TextBox {...this._initTextBoxProps(idx, 'ExpectedAnnualCostSaving')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={I18N.Setting.Diagnose.Number}/>
            </div>
            <span className='num-text'>{'RMB'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-investment-amount'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.InvestmentAmount}</div>
              <TextBox {...this._initTextBoxProps(idx, 'InvestmentAmount')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={I18N.Setting.Diagnose.Number}/>
            </div>
            <span className='num-text'>{'RMB'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-pay-back-period'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{I18N.Setting.Diagnose.ROI}</div>
              <span className='num-text' style={{alignSelf: 'flex-start' }}>{ getROILabel(Solutions.get(idx)) }</span>
            </div>
          </div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{I18N.Setting.Diagnose.SolutionName}</div>
          <TextBox  {...this._initTextBoxProps(idx, 'Name')} style={{width: 404}} hintText={I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.SolutionName}/>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{I18N.Setting.Diagnose.SolutionDescription}</div>
          <div className='contenteditable-desc' contentEditable placeholder={I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.SolutionDescription} onBlur={(e) => {
            let str = Array.from(e.target.childNodes).map( child => {
              if( child.nodeType === 3 ) {
                return child.nodeValue;
              }
              if( child.nodeType === 1 ) {
                if( child.childNodes && child.childNodes[0] && child.childNodes[0].nodeType === 3 ) {
                  return child.childNodes[0].nodeValue;
                }
              }
              return '';
            } ).join('\r\n');
            onChange(['Solutions', idx, 'SolutionDescription'], str);
            onBlur && onBlur(['Solutions', idx, 'SolutionDescription'], str)
          }}>
            {Solutions.getIn([idx, 'SolutionDescription'])}
          </div>
           {errorData && errorData.getIn(['Solutions', idx, 'SolutionDescription']) && <span style={{color:'#dc0a0a',fontSize:'12px'}}>{errorData.getIn(['Solutions', idx, 'SolutionDescription'])}</span>}
        </div>
        <div className='field-wrapper'>
          {this.props.hasPicTitle && <div className='field-title'>{I18N.Setting.Diagnose.SolutionImage}</div>}

           <ImagGroupPanel diagrams={Solutions.getIn([idx,"SolutionImages"])} width={145} height={100} editable={false}/>
        </div>
      </div>) )}
    </div>)
  }
}
PlanDetail.propTypes = {
  errorData: PropTypes.object,
  energySolution: PropTypes.object,
  onChange: PropTypes.func,
  isView: PropTypes.boolean,
  hasPicTitle: PropTypes.boolean,
}
PlanDetail.defaultProps = {
	isView:false,
  hasPicTitle:true
}

const BACK_DIALOG = 'BACK_DIALOG';
const CANCEL_DIALOG = 'CANCEL_DIALOG';
const DELETE_DIALOG = 'DELETE_DIALOG';
export default class GenerateSolution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      energySolution: props.energySolution,
      errorData: Immutable.fromJS({}),
    }
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if( this.props.renderChart ) {
      this.setState({
        energySolution: nextProps.energySolution
      })
    }
  }
  _onChange( paths, value ) {
    let errorData = this.state.errorData;

    this.setState({
      energySolution: this.state.energySolution.setIn(paths, value),
      // errorData,
    });
  }
  _onBlur( paths, value ) {
    let errorData = this.state.errorData;
    if( paths.join('') === 'ProblemName' ) {
      let problemNameError = '';
      if( !value ) {
        problemNameError = I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.ProblemName;
      }
      errorData = errorData.setIn(paths, problemNameError);
    }

    if( paths.join('') === 'ProblemEnergySys' ) {
      let problemEnergyError = '';
      if( !value && !this.state.energySolution.getIn(paths) ) {
        problemEnergyError = I18N.Setting.Diagnose.PleaseSelect + I18N.Setting.Diagnose.EnergySys;
      }
      errorData = errorData.setIn(paths, problemEnergyError);
    }

    this.setState({
      errorData
    });
  }
  render() {
    let { energySolution, errorData } = this.state;
    let { onCancel, onBack, chartDatas, onCreate, renderChart } = this.props;
    return (
      <div className='generate-solution'>
        <header className='generate-solution-header'>
          <span className='icon-return'  onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {I18N.Setting.ECM.Solution}
        </header>
        <session className='session-container'>
          <PlanTitle errorData={errorData} energySolution={energySolution} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <session className='session-container'>
          <ProblemDetail renderChart={renderChart} errorData={errorData} chartDatas={chartDatas} energySolution={energySolution} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <session className='session-container'>
          <PlanDetail errorData={errorData} Solutions={energySolution.get('Solutions')} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <footer className='generate-solution-footer'>
          <FlatButton label={I18N.Setting.DataAnalysis.Scheme} onClick={() => {
            if( !energySolution.getIn(['Problem', 'Name']) ) {
              errorData = errorData.setIn(['Problem', 'Name'], I18N.Setting.Diagnose.PleaseInput + I18N.Setting.Diagnose.PleaseInput);
            }
            if(　!energySolution.getIn(['Problem', 'EnergySys'])　) {
              errorData = errorData.setIn(['Problem', 'EnergySys'], I18N.Setting.Diagnose.PleaseSelect + I18N.Setting.Diagnose.EnergySys);
            }
            if( errorData === this.state.errorData ) {
              onCreate(
                energySolution.set(
                  'Solutions',
                  energySolution
                    .get('Solutions')
                    .map( solution =>
                      solution.set(
                        'ROI',
                        MeasuresStore.getInvestmentReturnCycle(
                          solution.get('InvestmentAmount'),
                          solution.get('ExpectedAnnualCostSaving')
                        )
                      )
                    )
                )
                .toJS()
              );
            } else {
              this.setState({errorData});
            }
          }}/>
          <FlatButton style={{marginLeft: 16}} label={I18N.Common.Button.Cancel2} onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
        </footer>
        <Dialog open={this.state.dialogKey === BACK_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.ReturnPage} onClick={onBack}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.ReturnPageTip}</Dialog>
        <Dialog open={this.state.dialogKey === CANCEL_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={onCancel}/>,
          <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{I18N.Setting.Diagnose.LeavePageTip}</Dialog>
      </div>
    );
  }
}
