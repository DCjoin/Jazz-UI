import React, { Component } from 'react';


import Regex from 'constants/Regex.jsx';
import RoutePath from 'util/RoutePath.jsx';
import _lang from '../lang/lang.jsx';

import Dialog from 'controls/NewDialog.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import FlatButton from 'controls/NewFlatButton.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';

import CurrentUserAction from 'actions/CurrentUserAction.jsx';
import LoginAction from 'actions/LoginActionCreator.jsx';
import LoginStore from 'stores/LoginStore.jsx';
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
	if( getComputedStyle(document.querySelector('.contact-us-card')).display !== 'none' ) {
		return false;
	}
	if( document.querySelector('.jazz-login-dialog') ) {
		return false;
	}
	return true;
}

function go(targetIdx) {
	return () => {		
		let type = ANIMATION_TYPE.UP;
		if(targetIdx < currentIdx) {
			type = ANIMATION_TYPE.DOWN;
		}
		deactive(currentIdx, type);
		currentIdx = targetIdx;
		active(targetIdx, type);
	}
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

	deactive(currentIdx, type);

	if( type === ANIMATION_TYPE.UP) {
		active(++currentIdx, type);	
	} else {
		active(--currentIdx, type);	
	}
}

function deactive(currentIdx, type) {
	let el = getContainers()[currentIdx];
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
function active(currentIdx, type) {		

	let el = getContainers()[currentIdx];
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
	containers.map(el => {
		el.style.transform = 'translate3d(0, 100%, 0)';
	});
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
		this._doneForgetPSWDialog = this._doneForgetPSWDialog.bind(this);

    LoginStore.addChangeListener(this._onChange);

		if(d.addEventListener){
			d.addEventListener('DOMMouseScroll', scrollListener, false);
		}
		w.onmousewheel = d.onmousewheel = scrollListener;
	}
	componentDidMount() {		
		init();
		active(currentIdx, ANIMATION_TYPE.UP);
	}
  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onChange);
		w.onmousewheel = d.onmousewheel = function() {};
  }
	_getInitState() {
		return {
			showLoginDialog: false,
			username: '',
			password: '',
			errorMsg: '',
			showForgetPSWDialog: false,
			resetEmail: '',
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
      	showLoginDialog: true,
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
  _doneForgetPSWDialog(resetEmail) {
    this.setState({
      showForgetPSWDialog: false,
      resetEmail: resetEmail,
    });
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
						<LinkButton onClick={() => {
							this.setState({
								showForgetPSWDialog: true
							});
						}} labelStyle={{float: 'right', display: 'inline-block', marginTop: 3}} label={'忘记密码'}/>
					</content>

				</div>
			</div>
		);
	}
	render() {
		return (
			<div id='login-wrapper'>
				{this._renderLoginDialog()}
				<ForgetPSWDialog open={this.state.showForgetPSWDialog} onDone={this._doneForgetPSWDialog} onCancel={() => {
					this.setState({
						showForgetPSWDialog: false
					});
				}}/>
				<header id='login-header'>
					<img style={{height: 33, width: 266, marginTop: 25, marginLeft: 30}} src={require('../less/images/logo.png')} />
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
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >无需手动分析，节能方案即可无忧直达</div>
						<div className='child content-text' data-to='top' data-index='2' >人工智能诊断模块，覆盖数百种能效问题</div>
						<div className='child content-text' data-to='top' data-index='3' >专家顾问分析，解决方案直接推送</div>
						<div className='child content-text' data-to='top' data-index='4' >投资回报率，节能量，投资金额，节约成本一目了然</div>
					</div>					
				</Container>

				<Container imageUrl={require('../less/images/step2.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#000'
					}}>
						<div style={{marginBottom: 20}} className='child content-title' data-to='top' data-index='1' >线上线下互动，方案全程追踪</div>
						<div style={{marginBottom: 6}} className='child content-text' data-to='top' data-index='2' >Web端与App协同工作</div>
						<div style={{marginBottom: 6}} className='child content-text' data-to='top' data-index='3' >方案分配到人，让执行更高效</div>
						<div className='child content-text' data-to='top' data-index='4' ><span style={{display: 'inline-block'}}>节能方案全生命周期管理——<br/>从推送方案到方案执行到成本降低全程掌握</span></div>
					</div>
				</Container>

				<Container imageUrl={require('../less/images/step3.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						right: '4%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >ISO50001能源管理方法，助力节能达成</div>
						<div style={{marginBottom: 6}} className='child content-text' data-to='top' data-index='2' >自上而下分解集团目标至建筑目标，同尺度排名让目标管理清晰统一</div>
						<div style={{marginBottom: 6}} className='child content-text' data-to='top' data-index='3' >智能预测全年目标达成情况，实时掌握能源使用状态</div>
						<div className='child content-text' data-to='top' data-index='4' >智能细分建筑月度目标，助力目标达成</div>
					</div>					
				</Container>

				<Container imageUrl={require('../less/images/step4.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						right: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >无需手动对比，节能效果轻松呈现</div>
						<div className='child content-text' data-to='top' data-index='2' >智能计算已实施节能方案节能量，让数据更加精确</div>
						<div className='child content-text' data-to='top' data-index='3' >动态呈现所有方案节能效果，让成本降低实时可见</div>
					</div>					
				</Container>


				<Container imageUrl={require('../less/images/step5.png')} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >展示集团最佳方案，让节能可复制可粘贴</div>
						<div className='child content-text' data-to='top' data-index='2' >智能筛选所有建筑节能方案，让投入少，回报高的方案脱颖而出</div>
						<div className='child content-text' data-to='top' data-index='3' >最佳方案直接推送，让决策更轻松更高效</div>
					</div>					
				</Container>

				<footer className="jazz-public-footer" id='login-footer' style={{display: 'none'}}>									  <div className="jazz-public-footer-about">
				  	<a className='contact-us-link' href='javascript:void(0)' target="_blank">
				  		{I18N.Login.ContactUS}
				  		<div className='contact-us-card'>
				  			<div>186-1688-5310</div>
				  			<div>yujin.guo@schneider-electric.com</div>
				  		</div>
				  	</a>|
				    <a href={`#${RoutePath.login({
				    	lang: (this.props.router.params.lang === 'en-us') ? 'zh-cn' : 'en-us'
				   })}`} target="_blank">{I18N.Platform.InEnglish}</a>
				  </div>
				  <div className="jazz-public-footer-about">
				    <div style={{ marginRight: "2em" }}>{I18N.Login.Copyright}</div>
				  	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
				  </div>
				</footer>

				<nav id='login-nav'>
					<li onClick={go(0)}>{'智能方案'}</li>
					<li onClick={go(1)}>{'方案追踪'}</li>
					<li onClick={go(2)}>{'集团指标'}</li>
					<li onClick={go(3)}>{'节能效果'}</li>
					<li onClick={go(4)}>{'最佳方案'}</li>
				</nav>

			</div>
		);
	}
}

var ForgetPSWDialog = React.createClass({
  getInitialState() {
    return {
      username: "",
      email: "",
      reqResetPSWStatus: null,
    };
  },
  _sendApply: function() {
    LoginAction.reqPwdReset(this.state.username, this.state.email);
    this.setState({
      state: this.getInitialState()
    });
    if (this.props.onDone) {
      this.props.onDone(this.state.email);
    }
  },
  _cancelApply: function() {
    this.setState({
      state: this.getInitialState()
    });
    this.props.onCancel();
  },
  render: function() {
    let email = this.state.email,
      username = this.state.username,
      sendProps = {
        inDialog: true,
        highlight: true,
        key: 'send_email',
        disabled: !email || !Regex.Email.test(email) || email.length > 254 || !username || username.length > 254,
        onClick: this._sendApply,
        label: I18N.Common.Button.GoOn
      },
      cancelProps = {
        key: 'cancel_email',
        onClick: this._cancelApply,
        label: I18N.Common.Button.Cancel,
        style: {
        	marginLeft: 20
        }
      },
      goonProps = {
        onClick: this._cancelApply,
        label: I18N.Common.Button.GoOn
      },
      usernameProps = {
        autoFocus: true,
        isViewStatus: false,
        title: I18N.Login.UserName,
        defaultValue: this.state.username,
        isRequired: true,
        maxLen: 254,
        didChanged: value => {
          this.setState({
            username: value
          })
        }
      },
      emailProps = {
        autoFocus: false,
        isViewStatus: false,
        title: I18N.Login.Email,
        defaultValue: this.state.email,
        isRequired: true,
        regex: Regex.Email,
        errorMessage: I18N.Login.WrongEmail,
        maxLen: 254,
        didChanged: value => {
          this.setState({
            email: value
          })
        }
      },
      actions = [
        <FlatButton primary {...sendProps} />,
        <FlatButton {...cancelProps} />
      ];

    return (
      <Dialog title={I18N.Login.ForgerPSW} actions={actions} modal={true} open={this.props.open} contentStyle={{
        width: '590px'
      }}>
            <div style={{fontSize:'14px'}}>{I18N.Login.ForgerPSWTips}</div>
            <br></br>
            <ViewableTextField {...usernameProps}/>
            <ViewableTextField {...emailProps}/>
            <div style={{fontSize:'14px'}}>{I18N.Login.ForgeremailTips}</div>
        </Dialog>
      );
  }
});