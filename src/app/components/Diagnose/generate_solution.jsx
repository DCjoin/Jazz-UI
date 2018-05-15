import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import nzh from 'nzh/cn';
import FlatButton from 'controls/FlatButton.jsx';
import { Gallery } from '../DataAnalysis/Basic/GenerateSolution.jsx';

function SessionTitle(props) {
  let {title, subtitle, style} = props;
  return (<div className='session-title' style={style}>
    {title}{subtitle && (<span className='subtitle'>{subtitle}</span>)}
  </div>)
}

class TextBox extends Component {
  render() {
    let { onChange, value, hintText, style, errorMsg } = this.props;
    return (<div className='solution-text-box' style={style}>
      <input type='text' value={value} onChange={onChange} placeholder={hintText}/>
      {errorMsg && <span className='error-msg'>{errorMsg}</span>}
    </div>);
  }
}

export class PlanTitle extends Component {
  _initTextBoxProps(key) {
    let { energySolution, errorData, onChange } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['EnergyProblem', key]),
      value: energySolution.getIn(['EnergyProblem', key]),
      onChange: e => onChange(['EnergyProblem', key], e.target.value),
    }
  }
  render() {
    let { isRequired } = this.props;
    return (<div >
      <SessionTitle title={'方案标题'} subtitle={isRequired && '(必填)'} style={{marginBottom: 20}}/>
      <div className='field-title'>{'方案标题'}</div>
      <TextBox {...this._initTextBoxProps('SolutionTitle')} hintText={'请输入方案标题'}/>
    </div>)
  }
}
PlanTitle.propTypes = {
  isRequired: PropTypes.boolean,
  errorData: PropTypes.object,
  energySolution: PropTypes.object,
  onChange: PropTypes.func,
}

export class ProblemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: 0
    }
    this._renderChart = this._renderChart.bind(this);
  }
  _initTextBoxProps(key) {
    let { energySolution, errorData, onChange } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['EnergyProblem', key]),
      value: energySolution.getIn(['EnergyProblem', key]),
      onChange: e => onChange(['EnergyProblem', key], e.target.value),
    }
  }
  _renderChart() {
    let src = this.props.energySolution.getIn(['EnergyProblem', 'EnergyProblemImages', this.state.selectedIdx, 'ImageUrl']);
    return (<img src={src} width="100%" height="332px"/>);
  }
  render() {
    let { isRequired, errorMsg, energySolution, onChange } = this.props;
    let { selectedIdx } = this.state;
    return (<div >
      <SessionTitle title={'问题详情'} subtitle={isRequired && '(必填)'} style={{marginBottom: 20}}/>
      <div className='field-wrapper flex-bar'>
        <div>
          <div className='field-title'>{'问题名称'}{!isRequired && <span className='subtitle'>{'(必填)'}</span>}</div>
          <TextBox {...this._initTextBoxProps('Name')} hintText={'请输入问题名称'}/>
        </div>
        <div style={{marginLeft: 20}}>
          <div className='field-title'>{'能源系统标识'}{!isRequired && <span className='subtitle'>{'(必填)'}</span>}</div>
          <TextBox {...this._initTextBoxProps('EnergySys')} style={{width: 346}} hintText={'请选择'}/>
        </div>
      </div>
      <div className='field-wrapper'>
        <div className='field-title'>{'问题描述'}</div>
        <TextBox {...this._initTextBoxProps('Description')} style={{width: 770}} hintText={'请输入问题描述'}/>
      </div>
      <div className='field-wrapper' style={{width: 770}}>
        <div className='field-title'>{'问题图表'}</div>
        <Gallery
          names={energySolution.getIn(['EnergyProblem', 'EnergyProblemImages']).map( img => img.get('Name') ).toJS()}
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
            onChange(['EnergyProblem', 'EnergyProblemImages'], energySolution.getIn(['EnergyProblem', 'EnergyProblemImages']).delete(selectedIdx));
            if( selectedIdx === energySolution.getIn(['EnergyProblem', 'EnergyProblemImages']).length - 1 ) {
              this.setState({
                selectedIdx: energySolution.getIn(['EnergyProblem', 'EnergyProblemImages']).size - 2
              })
            }
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
}

export class PlanDetail extends Component {
  _bindChange( paths ) {
    return e => {
      this.props.onChange( ['EnergySolutions'].concat(paths), e.target.value );
    }
  }
  _initTextBoxProps(idx, key) {
    let { EnergySolutions, errorData, onChange } = this.props;
    return {
      errorMsg: errorData && errorData.getIn(['EnergySolutions', idx, key]),
      value: EnergySolutions.getIn([idx, key]),
      onChange: this._bindChange([idx, key]),
    }
  }
  _bindDelete(idx) {
    let { EnergySolutions, errorData, onChange } = this.props;
    return () => {
      onChange( ['EnergySolutions'], EnergySolutions.delete(idx) );
    }
  }
  render() {
    let { EnergySolutions, errorData, onChange } = this.props;
    return (<div className='plan-detail'>
      <SessionTitle title={'方案详情'} subtitle={'(选填)'} style={{marginBottom: 30}}/>
      {EnergySolutions && EnergySolutions.map( (EnergySolution, idx) => (<div>
        {EnergySolutions.size > 1 && <header style={{marginTop: idx && 32}} className='plan-detail-header'>
          <span>{'方案' + nzh.encodeS(idx + 1)}</span>
          <span className='split-line'/>
          <span className='icon-delete' onClick={this._bindDelete(idx)}/>
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
              <span className='num-text' style={{alignSelf: 'flex-start' }}>{EnergySolutions.get('ROI') || 0 + '年'}</span>
            </div>
          </div>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案名称'}</div>
          <TextBox  {...this._initTextBoxProps(idx, 'Name')} style={{width: 404}} hintText={'请输入方案名称'}/>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案描述'}</div>
          <TextBox {...this._initTextBoxProps(idx, 'SolutionDescription')} style={{width: 770}} hintText={'请输入方案描述'}/>
        </div>
        <div className='field-wrapper'>
          <div className='field-title'>{'方案图片'}</div>
          {/*<TextBox style={{width: 770}} value={value} hintText={'请输入问题描述'} onChange={this.onChange}/>*/}
        </div>
      </div>) )}
    </div>)
  }
}
PlanDetail.propTypes = {
  errorData: PropTypes.object,
  energySolution: PropTypes.object,
  onChange: PropTypes.func,
}

const testData = Immutable.fromJS({
  "EnergyProblem": {
    "Id": 0,
    "TagIds": [
      0
    ],
    "HierarchyId": 0,
    "Name": "string",
    "EnergySys": 1,
    "Description": "string",
    "Status": 0,
    "IsRead": true,
    "CreateUserId": 0,
    "CreateUserName": "string",
    "IsConsultant": true,
    "CreateTime": "2018-05-15T06:23:36.928Z",
    "ThumbnailUrl": "string",
    "EnergyProblemImages": [
      {
        "Id": 0,
        "EnergyProblemId": 0,
        "Name": "string",
        "ImageUrl": 'http://energymost-upload.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_35_0?x-oss-process=image/resize,w_600,h_400/format,png',
        "Content": "string",
        "OssKey": "string"
      },
      {
        "Id": 1,
        "EnergyProblemId": 0,
        "Name": "string",
        "ImageUrl": 'http://energymost-upload.oss-cn-hangzhou.aliyuncs.com/EnergyWidgetGraph_35_0?x-oss-process=image/resize,w_600,h_400/format,png',
        "Content": "string",
        "OssKey": "string"
      }
    ],
    "Supervisor": {
      "Id": 0,
      "HierarchyId": 0,
      "Name": "string",
      "PhoneNumber": "string",
      "EnergySys": 1,
      "CreateTime": "2018-05-15T06:23:36.928Z"
    },
    "ProblemTypeId": 0,
    "SolutionTitle": "string"
  },
  "EnergySolutions": [{
    "Id": 0,
    "Name": "string",
    "ExpectedAnnualEnergySaving": 0,
    "EnergySavingUnit": "string",
    "ExpectedAnnualCostSaving": 0,
    "InvestmentAmount": 0,
    "ROI": 0,
    "SolutionDescription": "string",
    "ProblemTypeName": "string",
    "EnergeyLabel": "string",
    "IndustryDesc": "string",
    "CreatorUserId": 0,
    "CreatorUserName": "string",
    "SolutionImages": [
      {
        "Id": 0,
        "EnergySolutionId": 0,
        "Name": "string",
        "ImageUrl": "string",
        "Content": "string",
        "OssKey": "string"
      }
    ]
  }, {
    "Id": 0,
    "Name": "string",
    "ExpectedAnnualEnergySaving": 0,
    "EnergySavingUnit": "string",
    "ExpectedAnnualCostSaving": 0,
    "InvestmentAmount": 0,
    "ROI": 0,
    "SolutionDescription": "string",
    "ProblemTypeName": "string",
    "EnergeyLabel": "string",
    "IndustryDesc": "string",
    "CreatorUserId": 0,
    "CreatorUserName": "string",
    "SolutionImages": [
      {
        "Id": 0,
        "EnergySolutionId": 0,
        "Name": "string",
        "ImageUrl": "string",
        "Content": "string",
        "OssKey": "string"
      }
    ]
  }],
  "Remarks": [
    {
      "Id": 0,
      "EnergyProblemId": 0,
      "Remark": "string",
      "CreateUserId": 0,
      "CreateUserName": "string",
      "CreateTime": "2018-05-15T06:23:36.928Z"
    }
  ],
  "EnergyEffectStatus": true
});

export default class GenerateSolution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      energySolution: testData,
      errorData: Immutable.fromJS({}),
    }
    this._onChange = this._onChange.bind(this);
  }
  _onChange( paths, value ) {
    this.setState({
      energySolution: this.state.energySolution.setIn(paths, value)
    });
  }
  render() {
    let { energySolution } = this.state;
    return (
      <div className='generate-solution'>
        <header className='generate-solution-header'>
          <span className='icon-return'/>
          {'节能方案'}
        </header>
        <session className='session-container'>
          <PlanTitle isRequired={true} energySolution={energySolution} onChange={this._onChange}/>
        </session>
        <session className='session-container'>
          <ProblemDetail isRequired={true} energySolution={energySolution} onChange={this._onChange}/>
        </session>
        <session className='session-container'>
          <PlanDetail EnergySolutions={energySolution.get('EnergySolutions')} onChange={this._onChange}/>
        </session>
        <footer className='generate-solution-footer'>
          <FlatButton label={'生成方案'}/>
          <FlatButton style={{marginLeft: 16}} label={'取消'}/>
        </footer>
      </div>
    );
  }
}
