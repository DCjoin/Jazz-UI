'use strict';
import React, {Component,PropTypes} from 'react';
import classNames from 'classnames';
import assign from 'object-assign';

const Style={
  group:{
    marginTop:'30px'
  },
  title:{
    fontSize:'14px'
  },
  content:{
    marginTop:'30px',
    marginLeft:'50px'
  }
};

export default class TitleComponent extends Component {

    render() {
      let {
        title,
      	titleClassName,
      	titleStyle,
      	contentClassName,
      	contentStyle,
        style,
        className,
      } = this.props,
      groupProps={
        style: assign({},Style.group,style),
        className:className
      },
     titleProps = {
        style: assign({},Style.title,titleStyle),
        className:titleClassName
            },

      contentProps = {
        className: contentClassName,
        style: assign({},Style.content,contentStyle),
      };
      return(
        <div {...groupProps}>
          <div {...titleProps}>{title}</div>
          <div {...contentProps}>{this.props.children}</div>
        </div>
      )

}
};

TitleComponent.propTypes = {
	title: PropTypes.node,
	titleClassName: PropTypes.string,
	titleStyle: PropTypes.object,
	contentClassName: PropTypes.object,
	contentStyle: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.object,
};
