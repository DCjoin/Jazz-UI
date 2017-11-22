import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Util from '../util/Util.jsx';
import SamlActionCreator from '../actions/SamlActionCreator.jsx';
import SamlStore from '../stores/SamlStore.jsx';
import 'whatwg-fetch';
import CookieUtil from '../util/cookieUtil.jsx';
import Config from 'config';

export default class Saml extends Component {
	static propTypes = {
		query: React.PropTypes.any,
		params: React.PropTypes.any,
	}

	static contextTypes = {
		router: React.PropTypes.object,
		currentRoute: React.PropTypes.object,
  }
  
	constructor(props) {
		super(props);
    this._onChange = this._onChange.bind(this);
  }

  state = {
    acs: null
  }

  _onChange() {
    this.setState({
      acs: SamlStore.getAcs(),
    })
  }

  componentWillMount() {
    SamlActionCreator.getId(Util.getCookie("AssertId"));
  }
  
	componentDidMount() {
    SamlStore.addChangeListener(this._onChange);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.acs !== this.state.acs) {
      let url = Config.ServeAddress + Config.APIBasePath + "/AccessControl/ValidateUser";
      
      let formData = new FormData();
      formData.append('SAMLResponse', nextState.acs);
      
      fetch(url,{
        method: 'post',
        mode: "cors",
        credentials: "include",// credentials: 'same-origin',
        body: formData,
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        console.log(data.Result);     
        if(data.Result && data.Result.Id && data.Result.Token) {
          CookieUtil.set('UserId', data.Result.Id, {
            expires: 365
          });
          CookieUtil.set('AuthLoginToken', data.Result.Token, {
            expires: 365
          });
          CookieUtil.set('SkipLogin', 'true');
          window.currentUserId = data.Result.Id;
          window.currentUser = data.Result;
          location.href = "/zh-cn/"; 
        } else {
          console.log('Something wrong, please back to login again');
          location.href = "/zh-cn/login";
        }           
      }).catch(function(error) {
        console.log('request failed', error);
        location.href = "/zh-cn/login"; 
      });
    }  
  }
  
  componentWillUnmount() {
    SamlStore.removeChangeListener(this._onChange);
  }

	render() {
		return (
      <div style={{display: "flex", flex: "1", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <CircularProgress mode="indeterminate" size={90} />
      </div>
		);
	}
}

