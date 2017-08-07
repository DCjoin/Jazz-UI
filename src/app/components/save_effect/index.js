import React, { Component } from 'react';
import List from './list/List.jsx';

export default class SaveEffect extends Component {
	render() {
		return (
			<div style={{display:'flex',flex:'1'}}>
				<List/>
			</div>
		);
	}
}
