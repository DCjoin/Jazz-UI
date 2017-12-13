import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';

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

const CAN_TRIAL_SP_NAME = ['dev', 'sp1', 'www','localhost:8080'];

var w = window;
var d = document;

var animationed = true;
var currentIdx = 0;
var animationTime;

const ACTIVE_CLASS_NAME = 'active';
const CHILD_ANIMATION_TIME = 600;
const DEACTIVE_ANIMATION_DURATION = 600;

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
	if( document.querySelector('.jazz-login-dialog') || document.querySelector('.dialog') ) {
		return false;
	}
	return true;
}

function go(targetIdx) {
	return () => {
		if( !animationed || targetIdx === currentIdx ) {
			return false;
		}
		var header = getHeader();
		if( targetIdx === 0 ) {
			if(header.style.display === 'none') {
				header.style.display = 'block';
				setTimeout(() => {
					header.style.transform = '';
				}, DEACTIVE_ANIMATION_DURATION);
			}
		} else {
			if(header.style.display !== 'none') {
				header.style.transform = 'translate3d(0, -100%, 0)';
				setTimeout(function() {
					header.style.display = 'none';
				}, DEACTIVE_ANIMATION_DURATION);
			}
		}
		let type = ANIMATION_TYPE.UP;
		if(targetIdx < currentIdx) {
			type = ANIMATION_TYPE.DOWN;
		}
		deactive(currentIdx, type);
		currentIdx = targetIdx;
		active(targetIdx, type);


		var footer = getFooter();
		if(footer.style.display !== 'none') {

			footer.style.transform = 'translate3d(0, 100%, 0)';
			containers[containers.length - 1].style.transform = 'translate3d(0, 0, 0)';
			setTimeout(function() {
				footer.style.display = 'none';
			}, DEACTIVE_ANIMATION_DURATION);

		}
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
		}, DEACTIVE_ANIMATION_DURATION);

	} else if(currentIdx > 0) {
		toggleContainer(ANIMATION_TYPE.DOWN);
	}
	var header = getHeader();
	if(header.style.display === 'none') {
		header.style.display = 'block';
		setTimeout(() => {
			header.style.transform = '';
		}, DEACTIVE_ANIMATION_DURATION);
	}

}
function scrollDown() {
	var containers = getContainers();
	if( currentIdx < containers.length - 1) {

		toggleContainer(ANIMATION_TYPE.UP);

		var header = getHeader();
		if(header.style.display !== 'none') {
			header.style.transform = 'translate3d(0, -100%, 0)';
			setTimeout(function() {
				header.style.display = 'none';
			}, DEACTIVE_ANIMATION_DURATION);
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

	animationed = false;
	setTimeout(function() {
		animationed = true;
	}, animationTime[currentIdx]);

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
	static contextTypes = {
    router: React.PropTypes.func
  }
	constructor(props) {
		super(props);
		this.state = this._getInitState();
		this._onChange = this._onChange.bind(this);
		this._onTrialSuccess = this._onTrialSuccess.bind(this);
		this._onLogin = this._onLogin.bind(this);
		this._onClickLogin = this._onClickLogin.bind(this);
		this._onSubmitTrial = this._onSubmitTrial.bind(this);
		this._doneForgetPSWDialog = this._doneForgetPSWDialog.bind(this);

		LoginStore.addChangeListener(this._onChange);
		LoginStore.addTrialListener(this._onTrialSuccess);

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
    LoginStore.removeTrialListener(this._onTrialSuccess);
		w.onmousewheel = d.onmousewheel = function() {};
  }
	_getInitState() {
		return {
			showLoginDialog: false,
			username: '',
			password: '',
			errorMsg: '',
			showForgetPSWDialog: false,
			showTrialDialog: false,
			trialSuccess: false,
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
  _onTrialSuccess() {
	this.setState({
		trialSuccess: true,
	});
  }
	_onClickLogin() {
		if( LoginStore.hasAuthLoginToken() ) {
			LoginAction.authLogin( LoginStore.getCurrentUserId(), LoginStore.getAuthLoginToken() );
		} else {
			location.href = RoutePath.spinitsso(this.props.params, location.href);
			// this.setState({
			// 	showLoginDialog: true
			// });
		}
	}
	_onLogin() {
		LoginAction.login({
			userName: this.state.username,
			password: this.state.password,
		})
	}
	_onSubmitTrial(data) {
		LoginAction.trialSubmit(data);
		this.setState({
		  showTrialDialog: false,
		});
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

					<header className='jazz-login-dialog-header'>{I18N.Login.Energymost}</header>
					<content className='jazz-login-dialog-content'>

						<div className='jazz-login-dialog-input-container'>
							<input value={username} type="text" placeholder={I18N.Login.UserName} onChange={(e) => {
								this.setState({
									username: e.target.value
								});
							}}/>
							<hr/>
							<input value={password} type="password" placeholder={I18N.Login.Password} onChange={(e) => {
								this.setState({
									password: e.target.value
								});
							}} onKeyPress={(e) => {
								if(e.charCode === 13) {
									this._onLogin();
								}
							}}/>
						</div>
						<div className='jazz-login-dialog-err'>{errorMsg}</div>
						<FlatButton disabled={!password || !username} onClick={this._onLogin} label={I18N.Login.Login} primary style={{width: '100%', marginTop: 25}}/>
						<LinkButton onClick={() => {
							this.setState({
								showForgetPSWDialog: true
							});
						}} labelStyle={{float: 'right', display: 'inline-block', marginTop: 3}} label={I18N.Login.forgetPSW}/>
					</content>

				</div>
			</div>
		);
	}
	render() {
		return (
			<div id='login-wrapper'>
				{this._renderLoginDialog()}

		        <Snackbar
		          open={this.state.trialSuccess}
		          message={'试用链接已发送至申请人邮箱(24h有效)，请查收！'}
		          onRequestClose={() => {
		          	this.setState({
		          		trialSuccess: false,
		          	});
		          }}
		        />
				{this.state.showTrialDialog && <TrialDialog open={this.state.showTrialDialog} onSubmit={this._onSubmitTrial} onCancel={() => {this.setState((state, props) => {return {showTrialDialog: false}});}}/>}
				<ForgetPSWDialog open={this.state.showForgetPSWDialog} onDone={this._doneForgetPSWDialog} onCancel={() => {
					this.setState({
						showForgetPSWDialog: false
					});
				}}/>
				<header id='login-header'>
					<img style={{height: 33, width: 266, marginTop: 20, marginLeft: 30}} src={require('../less/images/logo.png')} />
					<div id='login-header-actions'>
						{CAN_TRIAL_SP_NAME.indexOf(document.location.host.split('.')[0]) > -1 && <a href="javascript:void(0)" style={{marginRight: 50, color: '#fff'}} onClick={() => {
							this.setState((state, props) => {return {showTrialDialog: true}});
						}}>{'申请试用'}</a>}
						<a className='jazz-mobile-qr-link' href="javascript:void(0)">
							{I18N.Login.APP}
							<div className='jazz-mobile-qr'>
								<img src={require('../less/images/QRIcon.png')}/>
								<div>{I18N.Login.ScanDownloadAPP}</div>
							</div>
						</a>
						<button className='login-button' onClick={this._onClickLogin}>{I18N.Login.Login}</button>
					</div>
				</header>

				<Container imageUrl={require(`../less/images/step1-${'zh-cn'||this.props.params.lang}.png`)} style={{
					backgroundColor: '#fff'
				}}>
				<div style={{
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
					<div>
						<div className='child content-title' data-to='top' data-index='1' >{I18N.Login.Step1.Title}</div>
						<div className='child' data-to='top' data-index='2' >
							<div className='content-text'>{I18N.Login.Step1.Line1}</div>
							<div className='content-text'>{I18N.Login.Step1.Line2}</div>
							<div className='content-text'>{I18N.Login.Step1.Line3}</div>
						</div>
					</div>
					</div>
				</Container>

				<Container imageUrl={require(`../less/images/step2-${'zh-cn'||this.props.params.lang}.png`)} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#c11329'
					}}>
						<div style={{marginBottom: 20}} className='child content-title' data-to='top' data-index='1' >{I18N.Login.Step2.Title}</div>
						<div className='child' data-to='top' data-index='2' >
							<div className='content-text'>{I18N.Login.Step2.Line1}</div>
							<div className='content-text'>{I18N.Login.Step2.Line2}</div>
							<div className='content-text'><span style={{display: 'inline-block'}}>{I18N.Login.Step2.Line3}——<br/>{I18N.Login.Step2.Line4}</span></div>
						</div>
					</div>
				</Container>

				<Container imageUrl={require(`../less/images/step3-${'zh-cn'||this.props.params.lang}.png`)} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						right: '4%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >{I18N.Login.Step3.Title}</div>
						<div className='child' data-to='top' data-index='2' >
							<div className='content-text'>{I18N.Login.Step3.Line1}</div>
							<div className='content-text'>{I18N.Login.Step3.Line2}</div>
							<div className='content-text'>{I18N.Login.Step3.Line3}</div>
						</div>
					</div>
				</Container>

				<Container imageUrl={require(`../less/images/step4-${'zh-cn'||this.props.params.lang}.png`)} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						right: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >{I18N.Login.Step4.Title}</div>
						<div className='child' data-to='top' data-index='2' >
							<div className='content-text'>{I18N.Login.Step4.Line1}</div>
							<div className='content-text'>{I18N.Login.Step4.Line2}</div>
						</div>
					</div>
				</Container>


				<Container imageUrl={require(`../less/images/step5-${'zh-cn'||this.props.params.lang}.png`)} style={{
					backgroundColor: '#fff'
				}}>
					<div style={{
						top: '30%',
						left: '12%',
						position: 'absolute',
						color: '#fff'
					}}>
						<div className='child content-title' data-to='top' data-index='1' >{I18N.Login.Step5.Title}</div>
						<div className='child' data-to='top' data-index='2' >
							<div className='content-text'>{I18N.Login.Step5.Line1}</div>
							<div className='content-text'>{I18N.Login.Step5.Line2}</div>
						</div>
					</div>
				</Container>

				<footer className="jazz-public-footer" id='login-footer' style={{display: 'none'}}>
					<div className="jazz-public-footer-about">
				  	<a className='contact-us-link' href='javascript:void(0)' target="_blank">
				  		{I18N.Login.ContactUS}
				  		<div className='contact-us-card'>
				  			<div>186-1688-5310</div>
				  			<div>yujin.guo@schneider-electric.com</div>
				  		</div>
				  	</a>|
				    <a href={`${RoutePath.login({
				    	lang: (this.props.router.params.lang === 'en-us') ? 'zh-cn' : 'en-us'
				   })}`} target="_blank">{I18N.Platform.InEnglish}</a>
				  </div>
				  <div className="jazz-public-footer-about">
				    <div style={{ marginRight: "2em" }}>{I18N.Login.Copyright}</div>
				  	<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备05053940号-5</a>
				  </div>
				</footer>

				<nav id='login-nav'>
					<li onClick={go(0)}>{I18N.Login.Step1.Nav}</li>
					<li onClick={go(1)}>{I18N.Login.Step2.Nav}</li>
					<li onClick={go(2)}>{I18N.Login.Step3.Nav}</li>
					<li onClick={go(3)}>{I18N.Login.Step4.Nav}</li>
					<li onClick={go(4)}>{I18N.Login.Step5.Nav}</li>
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

const INLINE_BLOCK_SWITCH_STYLE = {
	style: {
		width: 'auto',
		display: 'inline-block',
		marginRight: 40,
	},
	labelStyle: {
		wordBreak: 'keep-all',
		fontSize: '16px',
		color:'#9fa0a4'
	},
	iconStyle:{
		marginRight:'12px',
		color:'#9fa0a4'
	}
};
const TEXT_FIELD_ERROR_STYLE = {
	position: 'absolute',
	bottom: -10,
};

class TrialDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Intention: [],
		};
	}
	_updateInfoByMutilSwtich(key, val, checked) {
		let newVal = this.state[key];
		if(checked) {
			newVal.push(val);
		} else {
			newVal.splice( newVal.indexOf(val), 1);
		}
		this._updateInfo(key, newVal);
	}
	_updateInfo(key, val) {
		this.setState({
			[key]: val
		});
	}
	_enabledSubmit() {
	    let {
	    	Name,
	    	Email,
		    Phone,
		    Company,
		    Industry,
		    CustomerType,
		    Intention,
		    ContactName,
		    ContactPosition,
		    ContactEmail,
		    ContactPhone,
		} = this.state;

		if( !Email || !Company || !Industry || !CustomerType ) {
			return false;
		}

		if( !/^[a-zA-Z0-9_.-]+$/.test(Email) ) {
			return false;
		}
		if( Phone && !Regex.MobilePhoneRule.test(Phone) ) {
			return false;
		}
		if( ContactEmail && !Regex.Email.test(ContactEmail) ) {
			return false;
		}
		if( ContactPhone && !Regex.MobilePhoneRule.test(ContactPhone) ) {
			return false;
		}

		return true;
	}
	render() {
	    let {
	    	Name,
	    	Email,
		    Phone,
		    Company,
		    Industry,
		    CustomerType,
		    Intention,
		    ContactName,
		    ContactPosition,
		    ContactEmail,
		    ContactPhone,
		} = this.state,
	    submitProps = {
	        inDialog: true,
	        highlight: true,
	        key: 'send_email',
	        disabled: !this._enabledSubmit(),
	        onClick: () => {
	        	this.props.onSubmit({...this.state, ...{
              Email: this.state.Email + '@schneider-electric.com'
            }});
	        },
	        label: I18N.Common.Button.Apply,
					style:{
						float:'right',
						width:'80px',
						minWidth:'80px'
					}
	      },
	      cancelProps = {
	        key: 'cancel_email',
	        onClick: this.props.onCancel,
	        label: I18N.Common.Button.Cancel2,
	        style: {
						marginLeft: 16,
						border:'1px solid #9fa0a4',
						float:'right',
						lineHeight:'35px',
						width:'80px',
						minWidth:'80px'
	        }
	      },
	      actions = [
					<FlatButton {...cancelProps} />,
	        <FlatButton primary {...submitProps} />
	        
	      ];
		return (
			<Dialog wrapperStyle={{width: 640}} open={this.props.open} actions={actions} 
							title={'申请试用'} 
							titleStyle={{height:50,lineHeight:'50px',margin:0,padding:'0 0 0 24px',fontSize:'16px',color:'#0f0f0f',fontWeight:'600',backgroundColor:'#f7f7f7'}}
							contentStyle={{overflowY: 'auto', height: 'calc(100% - 129px)', margin: '0 0 0 24px',paddingTop:'24px'}}
							actionsContainerStyle={{margin:'16px'}}>
				<div className='jazz-trial-info-block'>
					<header className='jazz-trial-info-block-title'>{'申请人信息'}</header>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={Name}
							didChanged={v => this._updateInfo('Name', v)}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							title={'姓名'}
							hintText={'请输入姓名'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={Email}
							didChanged={v => this._updateInfo('Email', v)}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							isRequired regex={/^[a-zA-Z0-9_.-]+$/} errorMessage={'支持数字、字母、下划线'}
							title={'邮箱（必填）'}
							hintText={'请输入邮箱'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width: 142}}/>
						<span style={{display: 'inline-block', width: 200, textAlign: 'right',fontSize:'16px',color:'#626469'}}>@schneider-electric.com</span>
					</div>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={Phone}
							didChanged={v => this._updateInfo('Phone', v)}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							regex={Regex.MobilePhoneRule} errorMessage={I18N.Login.WrongTelephone}
							title={'手机'}
							hintText={'请输入11位的手机号'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
				</div>
				<div className='jazz-trial-info-block'>
					<header className='jazz-trial-info-block-title' style={{marginTop:'20px'}}>{'客户信息'}</header>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							isRequired
							defaultValue={Company}
							didChanged={v => this._updateInfo('Company', v)}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							title={'公司名称（必填）'}
							hintText={'请输入公司名称'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
					<div className='jazz-trial-info-field'>
						<span className='custom-title'>{'所属行业（必填）'}</span>
						<RadioButtonGroup valueSelected={Industry} onChange={(e, v) => {
							this._updateInfo('Industry', v)
						}}>
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={1} label={'轻工'} />
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={2} label={'建筑'} />
						</RadioButtonGroup>
					</div>
					<div className='jazz-trial-info-field'>
						<span className='custom-title'>{'客户类型（必填）'}</span>
						<RadioButtonGroup valueSelected={CustomerType} onChange={(e, v) => {
							this._updateInfo('CustomerType', v)
						}}>
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={1} label={'集团客户'} />
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={2} label={'非集团客户'} />
						</RadioButtonGroup>
					</div>
					<div className='jazz-trial-info-field'>
						<span className='custom-title'>{'客户意向'}</span>
						<div>
							<Checkbox {...INLINE_BLOCK_SWITCH_STYLE} checked={Intention.indexOf(1) > -1} onCheck={(e, checked) => {this._updateInfoByMutilSwtich('Intention', 1, checked)}} label={'能源数据可视化'}/>
							<Checkbox {...INLINE_BLOCK_SWITCH_STYLE} checked={Intention.indexOf(2) > -1} onCheck={(e, checked) => {this._updateInfoByMutilSwtich('Intention', 2, checked)}} label={'能源指标管理'}/>
							<Checkbox {...INLINE_BLOCK_SWITCH_STYLE} checked={Intention.indexOf(4) > -1} onCheck={(e, checked) => {this._updateInfoByMutilSwtich('Intention', 4, checked)}} label={'节能技改'}/>
							<Checkbox {...INLINE_BLOCK_SWITCH_STYLE} checked={Intention.indexOf(8) > -1} onCheck={(e, checked) => {this._updateInfoByMutilSwtich('Intention', 8, checked)}} label={'其他'}/>
						</div>
					</div>
				</div>
				<div className='jazz-trial-info-block'>
					<header className='jazz-trial-info-block-title' style={{marginTop:'30px'}}>{'客户联系人信息'}</header>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={ContactName}
							didChanged={v => this._updateInfo('ContactName', v)}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							title={'姓名'}
							hintText={'请输入姓名'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
					<div className='jazz-trial-info-field'>
						<span className='custom-title'>{'职位'}</span>
						<RadioButtonGroup valueSelected={ContactPosition} onChange={(e, v) => {
							this._updateInfo('ContactPosition', v)
						}}>
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={1} label={'高管'} />
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={2} label={'集团能源经理'} />
						  <RadioButton {...INLINE_BLOCK_SWITCH_STYLE} value={3} label={'工厂或建筑能源经理'} />
						</RadioButtonGroup>
					</div>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={ContactEmail}
							didChanged={v => this._updateInfo('ContactEmail', v)}
							regex={Regex.Email} errorMessage={I18N.Login.WrongEmail}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							title={'邮箱'}
							hintText={'请输入邮箱'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
					<div className='jazz-trial-info-field'>
						<ViewableTextField
							defaultValue={ContactPhone}
							didChanged={v => this._updateInfo('ContactPhone', v)}
							regex={Regex.MobilePhoneRule} errorMessage={I18N.Login.WrongTelephone}
							errorStyle={TEXT_FIELD_ERROR_STYLE}
							inputStyle={{fontSize:'16px',color:'#626469'}}
							title={'手机'}
							hintText={'请输入11位的手机号'}
							floatingLabelStyle={{fontSize:'16px',color:'#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'12px'}}
							style={{width:'330px'}}/>
					</div>
				</div>
			</Dialog>
		);
	}
}


class Parallax extends Component {

	componentDidMount() {
		this._mouseMoveParallax = this._mouseMoveParallax.bind(this);
		if(d.addEventListener){
			d.addEventListener('mousemove', this._mouseMoveParallax);
		}
	}
	componentWillUnmount() {
		if(d.removeEventListener){
			d.removeEventListener('mousemove', this._mouseMoveParallax);
		}
	}
	_mouseMoveParallax(e) {
		let horizontal = (e.x / d.body.clientWidth) * 100,
		vertical = (e.y / d.body.clientHeight) * 100;

		ReactDOM.findDOMNode(this).style['perspective-origin'] = `${horizontal}% ${vertical}%`;
	}
	render() {
		return (
			<div className style={{...this.props.style, ...{perspective: 100}}}>
				{React.cloneElement(this.props.children, {
					style: {...this.props.children.props.style, ...{
						transform: 'translateZ(1px) scale(0.99)'
					}}
				})}
			</div>
		);
	}
}
