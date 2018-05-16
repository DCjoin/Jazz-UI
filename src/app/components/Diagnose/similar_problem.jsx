import React, { Component } from 'react';
import classnames from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'controls/FlatButton.jsx';

export default class SimilarProblem extends Component {
  render() {
    return (
      <div className='similar-problem'>
        <header className='similar-problem-header'>
          <span className='icon-return'/>
          {'相似方案列表'}
        </header>
        <div className='current-diagnose similar-problem-checkbox-layout'>
          <Checkbox style={{width: 'auto'}} disabled={true} checked={true}/>
          <span className='icon-diagnose'/>
          <span>{'塔1办公照明非运行时间异常'}</span>
          <span className='diagnose-tip'>{'当前问题'}</span>
        </div>
        <div className='similar-problem-checkbox-layout'>
          <Checkbox style={{width: 'auto'}}/>
          <span>{'全选'}</span>
          <span className='diagnose-tip'>{'下列问题与当前问题类型相似，您可为它们统一生成方案。'}</span>
        </div>
        <ul className='similar-problem-list'>
          <li className={classnames('similar-problem-item', {'show-detail': true})}>
            <div className='similar-problem-checkbox-layout'>
              <Checkbox style={{width: 'auto'}}/>
              <span className='icon-diagnose'/>
              <span className='detail-name'>{'塔2办公照明非运行时间异常'}</span>
              <span className='detail-action icon-arrow-up'>{'收起详情'}</span>
            </div>
            <div className='similar-problem-detail'>
              <span className='similar-problem-time'>{'时间区间：2018-04-04  00:00  至  2018-04-10  24:00'}</span>
              <img className='similar-problem-img' src='https://cdn4.buysellads.net/uu/1/3386/1525189943-38523.png'/>
            </div>
          </li>
          <li className='similar-problem-item'>
            <div className='similar-problem-checkbox-layout'>
              <Checkbox style={{width: 'auto'}}/>
              <span className='icon-diagnose'/>
              <span className='detail-name'>{'塔2办公照明非运行时间异常'}</span>
              <span className='detail-action icon-arrow-down'>{'展开详情'}</span>
            </div>
            <div className='similar-problem-detail'>
              <span>{'时间区间：2018-04-04  00:00  至  2018-04-10  24:00'}</span>
              <img src='https://cdn4.buysellads.net/uu/1/3386/1525189943-38523.png'/>
            </div>
          </li>
        </ul>
        <footer className='similar-problem-footer'>
          <FlatButton highlight label={'下一步'}/>
          <FlatButton style={{marginRight: 16}} label={'取消'}/>
        </footer>
      </div>
    );
  }
}
