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
  if( +roi === roi ) {
    roi += '年';
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
      onBlur: e => onBlur(['Problem', key], e.target.value),
    }
  }
  render() {
    let { isRequired} = this.props;
    return (<div >
      <SessionTitle title={'方案标题'} subtitle={isRequired && '(必填)'} style={{marginBottom: 20}}/>
      {this.props.hasSubTitle && <div className='field-title'>{'方案标题'}</div>}
      <TextBox {...this._initTextBoxProps('SolutionTitle')} hintText={'请输入方案标题'}/>
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
      onBlur: e => onBlur(['Problem', key], e.target.value),
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
      <SessionTitle title={'问题详情'} style={{marginBottom: 20}}/>
      <div className='field-wrapper flex-bar'>
        <div>
          <div className='field-title'>{'问题名称'}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{energySolution.getIn(['Problem', 'Name'])}</div>
        </div>
      </div>
      <div className='field-wrapper'>
        <div className='field-title'>{'问题描述'}</div>
         <div className="field-text" style={{marginTop:'16px'}}>{energySolution.getIn(['Problem', 'Description'])}</div>
      </div>
      <div className='field-wrapper' style={{width: 770}}>
        <div className='field-title'>{'问题图表'}</div>
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
    let { isRequired, errorMsg, energySolution, onChange, onBlur, isView,hasEnergySys, currentProblemId, checkedProblems, chartDatas} = this.props;
    let { selectedIdx, anchorEl } = this.state;

    if(isView) return this._renderViewStatus()

    return (<div >
      <SessionTitle title={'问题详情'} subtitle={isRequired && '(必填)'} style={{marginBottom: 20}}/>
      <div className='field-wrapper flex-bar'>
        <div>
          <div className='field-title'>{'问题名称'}{!isRequired && <span className='subtitle'>{'(必填)'}</span>}</div>
          <TextBox {...this._initTextBoxProps('Name')} hintText={'请输入问题名称'}/>
        </div>
        {hasEnergySys && <div style={{marginLeft: 20}}>
          <div className='field-title'>{'能源系统标识'}{!isRequired && <span className='subtitle'>{'(必填)'}</span>}</div>
          <div className='select-field-overlay' onClick={(e) => {
            this.setState({
              anchorEl: e.target
            })
          }}>
            <TextBox {...this._initTextBoxProps('EnergySys')} onBlur={() => {}}
              value={I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[energySolution.getIn(['Problem', 'EnergySys'])]}
              style={{width: 346}} hintText={'请选择'}/>
            <span className='icon-arrow-unfold'/>
          </div>
          <Popover onRequestClose={() => {
            onBlur(['Problem', 'EnergySys'], '');
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
              onBlur(['Problem', 'EnergySys'], value);
            }} primaryText={I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[ProblemMarkEnum[key]]} value={ProblemMarkEnum[key]}/>
            ))}
          </Popover>
        </div>}
      </div>
      <div className='field-wrapper'>
        <div className='field-title'>{'问题描述'}</div>
        <div className='contenteditable-desc' contentEditable placeholder={'请输入问题描述'} onBlur={(e) => {
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
        }}>
          {energySolution.getIn(['Problem', 'Description'])}
        </div>
        {/*<TextBox multiLine {...this._initTextBoxProps('Description')} style={{width: 770}} hintText={'请输入问题描述'}/>*/}
      </div>
      <div className='field-wrapper' style={{width: 770}}>
        <div className='field-title'>{'问题图表'}</div>
        {energySolution.getIn(['Problem', 'EnergyProblemImages']).map( (image) => {
          return this._renderHighChart(chartDatas[image.get('Id')], image.get('Id'));
        } )}
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
        onBlur( ['Solutions'].concat(paths), e.target.value );
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
              <div className='num-title'>{'预计年节能量'}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'ExpectedAnnualEnergySaving'])}</span>
            </div>
            <span className='num-text'>{Solutions.getIn([idx, 'EnergySavingUnit'])}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'预计年节约成本'}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'ExpectedAnnualCostSaving'])}</span>
            </div>
            <span className='num-text'>{'元'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-investment-amount'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'投资金额'}</div>
              <span className='num-text'>{Solutions.getIn([idx, 'InvestmentAmount'])}</span>
            </div>
            <span className='num-text'>{'元'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-pay-back-period'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'投资回报期'}</div>
              <span className='num-text' style={{alignSelf: 'flex-start' }}>{ getROILabel(Solutions.get(idx)) }</span>
            </div>
          </div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案名称'}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{Solutions.getIn([idx, 'Name'])}</div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案描述'}</div>
          <div className="field-text" style={{marginTop:'8px'}}>{Solutions.getIn([idx, 'SolutionDescription'])}</div>
        </div>
        <div className='field-wrapper'>
          {this.props.hasPicTitle && <div className='field-title'>{'方案图片'}</div>}
          {/*<TextBox style={{width: 770}} value={value} hintText={'请输入问题描述'} onChange={this.onChange}/>*/}
          <ImagGroupPanel diagrams={Solutions.getIn([idx,"SolutionImages"])} width={145} height={100} editable={false}/>
        </div>
      </div>) )}
    </div>)
  }
  render() {
    let { Solutions, errorData, onChange,isRequired,isView} = this.props;
    if(isView) return this._renderViewStatus()
    return (<div className='plan-detail'>
        <Dialog open={this.state.dialogKey === DELETE_DIALOG} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
          <FlatButton primary inDialog label={'确认删除'} onClick={() => {
            this._onDelete(_idx);
            _idx = null;
            this.setState({
              dialogKey: null
            });
          }}/>,
          <FlatButton label={'取消'} onClick={() => { this.setState({dialogKey: null}) }}/>
        ]}>{'确认删除该方案吗？'}</Dialog>
      <SessionTitle title={'方案详情'} subtitle={isRequired?'(必填)':'(选填)'} style={{marginBottom: 30}}/>
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
              <div className='num-title'>{'预计年节能量'}</div>
              <TextBox {...this._initTextBoxProps(idx, 'ExpectedAnnualEnergySaving')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={'数值'}/>
            </div>
            <TextBox {...this._initTextBoxProps(idx, 'EnergySavingUnit')} style={{borderRadius: 4, height: 26, width: 62}} hintText={'单位'}/>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-energy_saving'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'预计年节约成本'}</div>
              <TextBox {...this._initTextBoxProps(idx, 'ExpectedAnnualCostSaving')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={'数值'}/>
            </div>
            <span className='num-text'>{'元'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-investment-amount'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'投资金额'}</div>
              <TextBox {...this._initTextBoxProps(idx, 'InvestmentAmount')} style={{marginRight: 8, borderRadius: 4, height: 26, width: 102}} hintText={'数值'}/>
            </div>
            <span className='num-text'>{'元'}</span>
          </div>
          <div className='plan-detail-num-panel'>
            <span className='num-icon icon-pay-back-period'/>
            <div className='plan-detail-num-title-panel'>
              <div className='num-title'>{'投资回报期'}</div>
              <span className='num-text' style={{alignSelf: 'flex-start' }}>{ getROILabel(Solutions.get(idx)) }</span>
            </div>
          </div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案名称'}</div>
          <TextBox  {...this._initTextBoxProps(idx, 'Name')} style={{width: 404}} hintText={'请输入方案名称'}/>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案描述'}</div>
          <div className='contenteditable-desc' contentEditable placeholder={'请输入方案描述'} onBlur={(e) => {
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
          }}>
            {Solutions.getIn([idx, 'SolutionDescription'])}
          </div>
          {/*<TextBox {...this._initTextBoxProps(idx, 'SolutionDescription')} style={{width: 770}} hintText={'请输入方案描述'}/>*/}
        </div>
        <div className='field-wrapper'>
          {this.props.hasPicTitle && <div className='field-title'>{'方案图片'}</div>}
          {/*<TextBox style={{width: 770}} value={value} hintText={'请输入问题描述'} onChange={this.onChange}/>*/}
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
      energySolution: props.energySolution || testData,
      errorData: Immutable.fromJS({}),
    }
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
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
        problemNameError = '请输入问题名称';
      }
      errorData = errorData.setIn(paths, problemNameError);
    }

    if( paths.join('') === 'ProblemEnergySys' ) {
      let problemEnergyError = '';
      if( !value /*!this.state.energySolution.getIn(paths)*/ ) {
        problemEnergyError = '请选择能源系统标识';
      }
      errorData = errorData.setIn(paths, problemEnergyError);
    }

    this.setState({
      errorData
    });
  }
  render() {
    let { energySolution, errorData } = this.state;
    let { onCancel, onBack, chartDatas, onCreate } = this.props;
    return (
      <div className='generate-solution'>
        <header className='generate-solution-header'>
          <span className='icon-return'  onClick={() => this.setState({dialogKey: BACK_DIALOG})}/>
          {'节能方案'}
        </header>
        <session className='session-container'>
          <PlanTitle errorData={errorData} energySolution={energySolution} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <session className='session-container'>
          <ProblemDetail errorData={errorData} chartDatas={chartDatas} energySolution={energySolution} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <session className='session-container'>
          <PlanDetail errorData={errorData} Solutions={energySolution.get('Solutions')} onChange={this._onChange} onBlur={this._onBlur}/>
        </session>
        <footer className='generate-solution-footer'>
          <FlatButton label={'生成方案'} onClick={() => {
            if( !energySolution.getIn(['Problem', 'Name']) ) {
              errorData = errorData.setIn(['Problem', 'Name'], '请输入问题名称');
            }
            if(　!energySolution.getIn(['Problem', 'EnergySys'])　) {
              errorData = errorData.setIn(['Problem', 'EnergySys'], '请选择能源系统标识');
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
          <FlatButton style={{marginLeft: 16}} label={'取消'} onClick={() => this.setState({dialogKey: CANCEL_DIALOG})}/>
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
