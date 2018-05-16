import React, { Component } from 'react';
import classnames from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'controls/FlatButton.jsx';

export default class SolutionSuggest extends Component {
  render() {
    return (
      <div className='solution-suggest'>
        <header className='solution-suggest-header'>
          <span className='icon-return'/>
          {'解决方案推荐'}
          <span classNames='icon-close'/>
        </header>
        <div className='solution-suggest-tip'>{'您可以勾选一个或多个方案来生成解决方案。'}</div>
        <div className='solution-suggest-item'>
          <Checkbox inputStyle={{width: 42, height: 76}} iconStyle={{padding: '67px 33px'}}/>
          <div className='solution-suggest-item-content'>
            <div className='solution-suggest-name'>{'推荐方案-名称-调整入炉风量，合理配比风速风风炉风，名称的最多显示一行，超出推荐方案-名称-调整入炉风量，合理配比风速风风炉风，名称的最多显示一行，超出'}</div>
            <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'问题名称：'}</span>{'1.泛光照明在进入夏季后仍按照冬季日落时间运行泛光照明，泛光照明在进入夏季后仍按运行泛光照明'}</div>
            <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'问题描述：'}</span>{'放光照明非必要开启'}</div>
            <div className='solution-suggest-desc'><span className='solution-suggest-desc-title'>{'方案描述：'}</span>{'多是上级对下级或涉及面比较大的工作，一般都用带“文件头”形的工作，一般都。'}</div>
          </div>
        </div>
        <footer className='solution-suggest-footer'>
          <FlatButton primary label={'使用推荐方案'}/>
          <FlatButton style={{marginRight: 16}} label={'自定义方案 >'}/>
          <span className='icon-no_ecm'>{'若以上方案都不符合，您可自定义方案。'}</span>
        </footer>
      </div>
    );
  }
}
