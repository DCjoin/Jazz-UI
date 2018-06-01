'use strict';

import React, { Component} from 'react';
import Link from 'react-router/lib/Link';
import classnames from "classnames";
import PropTypes from 'prop-types';

export default class ColumnMenu extends Component {

  static contextTypes = {
        router: PropTypes.object,
		    currentRoute: PropTypes.object
	};

  _checkItemIsActive(item){
    var title;
    this.props.items.forEach(menu=>{
      if (this.context.router.isActive(menu.getPath(this.context.currentRoute.params))) {
          title = menu.title;
        }
    })
    return item.title===title
  }

  _renderMenu(){
    var params = this.context.currentRoute.params;
    return this.props.items.map(item=>(
      <Link className={classnames({
                                    active:this._checkItemIsActive(item)
                                  })} 
            key={item.title} to={item.getPath(params)}>{item.title}</Link>
    ))
  }

  render(){
    return(
      <div className="jazz-column-menu">
        <div className="title">{this.props.title}</div>
        <div className="list">
          {this._renderMenu()}
        </div>
      </div>
    )
  }
}

ColumnMenu.propTypes= {
  items:PropTypes.array,
  title:PropTypes.string,
};