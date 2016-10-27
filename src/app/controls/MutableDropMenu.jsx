'use strict';

var React = require('react');
import { DropDownMenu } from 'material-ui';

var MutableDropMenu = React.createClass({

 	componentWillReceiveProps:function(){
        this.setState({rendered:false},function(){
        	this.setState({rendered:true});
        });
 	},

 	getInitialState(){
		return {rendered:true};
 	},

	render: function() {
		if (this.state.rendered===false){
			return (<div></div>);
		}else{
			return (
			<DropDownMenu {...this.props}></DropDownMenu>
			);
		}
	}

});

module.exports = MutableDropMenu;
