'use strict';

import React from "react";
import { Transition } from 'react-transition-group';

var createReactClass = require('create-react-class');
var NetworkChecker = createReactClass({

    statics:{
        twinkle(){
            var eles = document.getElementsByClassName('networkchecker');
            if(eles.length>=1){
                var ele = eles[0];
                ele.className+=' networkchecker-twinkle';
                setTimeout(function (argument) {
                    ele.className = ele.className.replace(' networkchecker-twinkle','');
                },1000);
            }
        }
    },

    getInitialState: function() {
        return {
            status:''
        };
    },

    componentDidMount: function() {
        var that = this;
        window.addEventListener("online", function(e) {
            that.setState({status:'online'});
			}, true);

		window.addEventListener("offline", function(e) {
		    that.setState({status:'offline'});
		}, true);
        // var eles = document.getElementsByClassName('networkchecker');
        // if(eles.length>=1){
        //     var ele = eles[0];
        //     ele.addEventListener('transitionEnd',function(argument) {
        //         ele.className = ele.className.replace(' networkchecker-twinkle','');
        //
        //     });
        // }


    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.state.status == 'online'){
            var that = this;
            setTimeout(function(){

                that.setState({status:''});


            },2000);
        }
    },
    render(){
        var content = null;
        if(this.state.status == 'offline'){
            content = (<div className="networkchecker networkoffline"  key="networkchecker">
                <h5>{I18N.NetworkChecker.Msg1}</h5><span>{I18N.NetworkChecker.Msg2}</span></div>);
        }
        else if(this.state.status == 'online'){
            content = (<div className="networkchecker networkonline"  key="networkchecker">网络连接已恢复</div>);
        }
        else{
            content = (<div className="networkchecker"  key="networkchecker"></div>);
        }



        return (<Transition timeout={300}>
            {content}
        </Transition>);

    }
});


module.exports = NetworkChecker;
