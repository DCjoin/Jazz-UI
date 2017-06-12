import React, { Component } from 'react';

import LinkButton from 'controls/LinkButton.jsx';
import FlatButton from 'controls/NewFlatButton.jsx';

import CurrentUserAction from 'actions/CurrentUserAction.jsx';
import LoginAction from 'actions/LoginActionCreator.jsx';
import LoginStore from 'stores/LoginStore.jsx';

import RoutePath from 'util/RoutePath.jsx';
import _lang from '../lang/lang.jsx';

var w = window;
var d = document;

var animationed = true;
var currentIdx = 0;
var animationTime;

const ACTIVE_CLASS_NAME = 'active';
const CHILD_ANIMATION_TIME = 1000;
const DEACTIVE_ANIMATION_DURATION = 1000;

const ANIMATION_TYPE = {
	UP: 0,
	DOWN: 1,
}

function getHeader() {
	return document.getElementById('login-header');
}
function getFooter() {
	return document.getElementById('login-footer');
}
function getNav() {
	return document.getElementById('login-nav');
}
function getContainers() {
	return Array.prototype.slice.call(document.querySelectorAll('.login-container'));
}

function getChildren(el) {
	return Array.prototype.slice.call(el.querySelectorAll('.child'));
}

function getAnimationIndex(el) {
	return el.dataset['index'] * 1;
}

function sortChildrenByIndex(el) {
	var childrenByIdx = [];
	getChildren(el).map(function (child) {
		var animationIndex = getAnimationIndex(child) - 1;
		if( !childrenByIdx[animationIndex] ) {
			childrenByIdx[animationIndex] = [];
		}
		childrenByIdx[animationIndex].push(child);
	});
	return childrenByIdx;
}

function getClassNames(el) {
	return el.className.split(' ');
}

function addClassName(el, className) {
	var newClassNames = getClassNames(el);
	if( newClassNames.indexOf(className) === -1 ) {
		newClassNames.push(className);
		el.className = newClassNames.join(' ');
	}
}

function removeClassName(el, className) {		
	var newClassNames = getClassNames(el);
	if( newClassNames.indexOf(className) > -1 ) {
		newClassNames.splice( newClassNames.indexOf(className), 1 );
		el.className = newClassNames.join(' ');
	}
}

function getComputedStyle(el) {
	return window.getComputedStyle(el);
}

function checkScrollEnable() {
	if( getComputedStyle(document.querySelector('.jazz-mobile-qr')).display !== 'none' ) {
		return false;
	}
	if( document.querySelector('.jazz-login-dialog') ) {
		return false;
	}
	return true;
}

function scrollListener(e) {
	if( checkScrollEnable() && animationed ) {	
		if( e.wheelDelta < 0 ) {
			scrollDown();
		} else {
			scrollUp();
		}
	}
}

function scrollUp() {
	var containers = getContainers();

	var footer = getFooter();
	if(footer.style.display !== 'none') {

		footer.style.transform = 'translate3d(0, 100%, 0)';
		containers[containers.length - 1].style.transform = 'translate3d(0, 0, 0)';
		setTimeout(function() {
			footer.style.display = 'none';
		}, 1000);

	} else if(currentIdx > 0) {	

		animationed = false;
		setTimeout(function() {
			animationed = true;
		}, animationTime[currentIdx]);

		toggleContainer(ANIMATION_TYPE.DOWN);

		var header = getHeader();
		if(header.style.display === 'none') {
			header.style.display = 'block';
			setTimeout(() => {
				header.style.transform = '';
			}, 1000);
		}
	}

}
function scrollDown() {
	var containers = getContainers();
	if( currentIdx < containers.length - 1) {

		animationed = false;
		setTimeout(function() {
			animationed = true;
		}, animationTime[currentIdx]);

		toggleContainer(ANIMATION_TYPE.UP);

		var header = getHeader();
		if(header.style.display !== 'none') {
			header.style.transform = 'translate3d(0, -100%, 0)';
			setTimeout(function() {
				header.style.display = 'none';
			}, 1000);
		}

	} else {	

		var footer = getFooter();
		if(footer.style.display === 'none') {
			footer.style.display = 'flex';
			footer.style.transform = 'translate3d(0, 100%, 0)';
			containers[containers.length - 1].style.transform = 'translate3d(0, -80px, 0)';
			setTimeout(() => {
				footer.style.transform = 'translate3d(0, 0, 0)';
			}, 0);
		}
	}
}

function toggleContainer(type) {
	var containers = getContainers();

	deactive(containers[currentIdx], type);

	if( type === ANIMATION_TYPE.UP) {
		active(containers[++currentIdx], type);	
	} else {
		active(containers[--currentIdx], type);	
	}
}

function deactive(el, type) {

	removeClassName(getNav().children[currentIdx], 'selected');
	removeClassName(el, ACTIVE_CLASS_NAME);
	el.style.zIndex = 1;
	el.style.opacity = 0;
	if( type === ANIMATION_TYPE.UP ) {
		el.style.transformOrigin = 'top';
		el.style.transform = 'perspective(1000px) rotateX(-90deg) scale3d(0.8, 0.8, 1)';
	} else {
		el.style.transformOrigin = 'bottom';
		el.style.transform = 'perspective(1000px) rotateX(90deg) scale3d(0.8, 0.8, 1)';
	}

	setTimeout(function() {
		el.style.zIndex = 2;
		el.style.opacity = 1;
		el.style.transition = 'none';
		el.style.transformOrigin = 'center';
		if( type === ANIMATION_TYPE.UP ) {
			el.style.transform = 'translate3d(0, -100%, 0)';
		} else {
			el.style.transform = 'translate3d(0, 100%, 0)';
		}

		getChildren(el).map(function(child) {
			if( child.dataset.to ) {
				addClassName(child, 'to-' + child.dataset.to);
			}
		});

	}, DEACTIVE_ANIMATION_DURATION)
}
function active(el, type) {		

	addClassName(getNav().children[currentIdx], 'selected');

	el.style.zIndex = 2;
	el.style.transition = 'all ' + (DEACTIVE_ANIMATION_DURATION / 1000) + 's';
	el.style.transform = 'translate3d(0, 0, 0)';
	addClassName(el, ACTIVE_CLASS_NAME);

	var childrenByIndex = sortChildrenByIndex(el);

	setTimeout(function() {
		el.style.zIndex = 1;

		childrenByIndex.map( function(children, idx) {
			setTimeout(function() {
				children.map(function(child) {
					if( child.dataset.to ) {
						removeClassName(child, 'to-' + child.dataset.to);
					}
				});
			}, idx * CHILD_ANIMATION_TIME * 0.8 );
		} );

	}, DEACTIVE_ANIMATION_DURATION);
}

function init() {
	var containers = getContainers();
	containers.map(initTransition);
	animationTime = containers.map(calcAnimationTime);
}

function initTransition(el) {
	if( el.dataset.to ) {
		addClassName(el, 'to-' + el.dataset.to);
	}
	el.style.transition = 'all ' + (DEACTIVE_ANIMATION_DURATION / 1000) + 's';
	getChildren(el).map(initTransition);
}

function calcAnimationTime(container) {
	return Math.max.apply(Math, getChildren(container).map(getAnimationIndex) ) * CHILD_ANIMATION_TIME * 0.8 + DEACTIVE_ANIMATION_DURATION;
}


function Container(props) {
	return (
		<div className='login-container' style={props.style}>
			<img className='background-image' src={props.imageUrl}/>
			{props.children}
		</div>
	)
}

export default class NewLogin extends Component {
	constructor(props) {
		super(props);
		this.state = this._getInitState();
		this._onChange = this._onChange.bind(this);
		this._onLogin = this._onLogin.bind(this);
		this._onClickLogin = this._onClickLogin.bind(this);

    LoginStore.addChangeListener(this._onChange);

		if(d.addEventListener){
			d.addEventListener('DOMMouseScroll', scrollListener, false);
		}
		w.onmousewheel = d.onmousewheel = scrollListener;
	}
	componentDidMount() {		
		init();
		active(getContainers()[currentIdx], ANIMATION_TYPE.UP);
	}
  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onChange);
  }
	_getInitState() {
		return {
			showLoginDialog: false,
			username: '',
			password: '',
			errorMsg: '',
		};
	}
  _onChange() {
    if (LoginStore.hasLoggedin()) {
      CurrentUserAction.getInitData(LoginStore.getCurrentUserId());
      this.props.router.replace(
      	RoutePath.main(this.props.params)
      );
    } else {
    	let error = LoginStore.getLastError(),
    	errorMsg = '';
    	if (error) {
    	  if (error.error) {
    	    var errorCode = error.error.Code.substr(error.error.Code.length - 5, 5);
    	    errorMsg = _lang.getMessage(errorCode);
    	  }
    	  errorMsg = errorMsg || error;
    	}
      this.setState({
        errorMsg: errorMsg
      });
    }
  }
	_onClickLogin() {
		if( LoginStore.hasAuthLoginToken() ) {
			LoginAction.authLogin( LoginStore.getCurrentUserId(), LoginStore.getAuthLoginToken() );
		} else {
			this.setState({
				showLoginDialog: true
			});
		}
	}
	_onLogin() {
		LoginAction.login({
			userName: this.state.username,
			password: this.state.password,
		})
	}
	_renderLoginDialog() {
		let {password, username, showLoginDialog, errorMsg} = this.state;
		return showLoginDialog && (
			<div className='jazz-login-dialog-wrapper'>
				<div className='jazz-login-dialog'>
					
					<em className='icon-close' onClick={() => {
						this.setState(this._getInitState);
					}}/>

					<header className='jazz-login-dialog-header'>{'云能效'}</header>
					<content className='jazz-login-dialog-content'>

						<div className='jazz-login-dialog-input-container'>
							<input value={username} type="text" placeholder={'用户名'} onChange={(e) => {
								this.setState({
									username: e.target.value
								});
							}}/>
							<hr/>
							<input value={password} type="password" placeholder={'密码'} onChange={(e) => {
								this.setState({
									password: e.target.value
								});
							}}/>
						</div>
						<div className='jazz-login-dialog-err'>{errorMsg}</div>
						<FlatButton disabled={!password || !username} onClick={this._onLogin} label={'登录'} primary style={{width: '100%', marginTop: 25}}/>
						<LinkButton labelStyle={{float: 'right', display: 'inline-block', marginTop: 3}} label={'忘记密码'}/>
					</content>

				</div>
			</div>
		);
	}
	render() {
		return (
			<div id='login-wrapper'>
				{this._renderLoginDialog()}
				<header id='login-header'>
					<em className='icon-schneider-en'/>
					<div id='login-header-actions'>
						<a className='jazz-mobile-qr-link' href="javascript:void(0)">
						云能效客户端
							<div className='jazz-mobile-qr'>
								<img src={require('../less/images/QRIcon.png')}/>
								<div>扫描下载云能效客户端</div>
							</div>
						</a>
						<button className='login-button' onClick={this._onClickLogin}>登录</button>
					</div>
				</header>

				<Container imageUrl={require('../less/images/step1.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '38%',
						left: 206,
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child' data-to='top' data-index='1' >无需手动分析，节能方案即可无忧直达</div>
						<h1 className='child' data-to='top' data-index='2' style={{
							marginTop: 12
						}}>人工智能诊断模块，覆盖数百种能效问题</h1>
						<h1 className='child' data-to='top' data-index='3' style={{
							marginTop: 12
						}}>专家顾问分析，解决方案直接推送</h1>
						<h1 className='child' data-to='top' data-index='4' style={{
							marginTop: 12
						}}>投资回报率，节能量，投资金额，节约成本一目了然</h1>
					</div>					
				</Container>

				<Container imageUrl={require('../less/images/step2.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '38%',
						left: 206,
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child' data-to='top' data-index='1' >线上线下互动，方案全程追踪</div>
						<h1 className='child' data-to='top' data-index='2' style={{
							marginTop: 12
						}}>web端与app协同工作</h1>
						<h1 className='child' data-to='top' data-index='3' style={{
							marginTop: 12
						}}>方案分配到人，让执行更高效</h1>
						<h1 className='child' data-to='top' data-index='4' style={{
							marginTop: 12
						}}>节能方案全生命周期管理-从推送方案到方案执行到成本降低全程掌握</h1>
					</div>
				</Container>

				<Container imageUrl={require('../less/images/step3.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '38%',
						left: 206,
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child' data-to='top' data-index='1' >ISO50001能源管理方法，助力节能达成</div>
						<h1 className='child' data-to='top' data-index='2' style={{
							marginTop: 12
						}}>自上而下分解集团目标至建筑目标，同尺度排名让目标管理清晰统一</h1>
						<h1 className='child' data-to='top' data-index='3' style={{
							marginTop: 12
						}}>智能预测全年目标达成情况，实时掌握能源使用状态</h1>
						<h1 className='child' data-to='top' data-index='4' style={{
							marginTop: 12
						}}>智能细分建筑月度目标，助力目标达成</h1>
					</div>					
				</Container>

				<Container imageUrl={require('../less/images/step4.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '38%',
						left: 206,
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child' data-to='top' data-index='1' >无需手动对比，节能效果轻松呈现</div>
						<h1 className='child' data-to='top' data-index='2' style={{
							marginTop: 12
						}}>智能计算已实施节能方案节能量，让数据更加精确</h1>
						<h1 className='child' data-to='top' data-index='3' style={{
							marginTop: 12
						}}>动态呈现所有方案节能效果，让成本降低实时可见</h1>
					</div>					
				</Container>


				<Container imageUrl={require('../less/images/step5.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '38%',
						left: 206,
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child' data-to='top' data-index='1' >展示集团最佳方案，让节能可复制可粘贴</div>
						<h1 className='child' data-to='top' data-index='2' style={{
							marginTop: 12
						}}>智能筛选所有建筑节能方案，让投入少，回报高的方案脱颖而出</h1>
						<h1 className='child' data-to='top' data-index='3' style={{
							marginTop: 12
						}}>最佳方案直接推送，让决策更轻松更高效</h1>
					</div>					
				</Container>

				<footer className="jazz-public-footer" id='login-footer' style={{display: 'none'}}>									  <div className="jazz-public-footer-about">
				    <a href="http://www.schneider-electric.com/" target="_blank">{I18N.Login.AboutUS}</a>|
				  	<a href="http://e.weibo.com/schneidercn" target="_blank">{I18N.Login.Weibo}</a>|
				    <div style={{
				cursor: 'pointer' }}>{I18N.Login.iPad}</div>|
				  	<a target="_blank">{I18N.Login.ContactUS}</a>|
				    <a target="_blank">{I18N.Platform.InEnglish}</a>
				  </div>
				  <div className="jazz-public-footer-about">
				    <div style={{ marginRight: "2em" }}>{I18N.Login.Copyright}</div>
				  	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
				  </div>
				</footer>

				<nav id='login-nav'>
					<li>{'智能方案'}</li>
					<li>{'方案追踪'}</li>
					<li>{'集团指标'}</li>
					<li>{'节能效果'}</li>
					<li>{'最佳方案'}</li>
				</nav>

			</div>
		);
	}
}
