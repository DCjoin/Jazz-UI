import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import assign from 'object-assign';

import ClickAwayListener from './ClickAwayListener.jsx';

function getMixClassName(staticClass) {
	return (dynamicClass) => {
		return classnames(staticClass, {
			[dynamicClass]: dynamicClass
		});
	};
}

let getContainerActionsClassName = getMixClassName('dialog-actions');
let getClassName = getMixClassName('dialog');
let getContentClassName = getMixClassName('dialog-content');
let getTitleClassName = getMixClassName('dialog-title');
let getOverlayClassName = getMixClassName('dialog-overlay');

const animatinsTime = 450;

class DialogInline extends Component {
	onClickAway() {
		this.props.onRequestClose();
	}
	render() {
		let {
			dialogProps,
			titleProps,
			title,
			contentProps,
			children,
			actionsContainerProps,
			actions,
			modal,
		} = this.props,

		close = modal ? null : <div className="dialog-close icon-close" onClick={::this.onClickAway}></div>;


		return (
			<div {...dialogProps}>
				{ (title || close) && <div {...titleProps}><div className='dialog-title-text'>{title}</div>{close}</div> }
				<div {...contentProps}>{children}</div>
				<div {...actionsContainerProps}>{actions}</div>
			</div>
		);
	}
}

class NewDialog extends Component {
	render() {
		let {
			actions,
			actionsContainerClassName,
			actionsContainerStyle,
			children,
			className,
			contentClassName,
			contentStyle,
			open,
			modal,
			onRequestClose,
			overlayClassName,
			overlayStyle,
			style,
			title,
			titleClassName,
			titleStyle,
			wrapperStyle,
		} = this.props,

		dialogWrapperProps = {
			style: wrapperStyle,
		},

		actionsContainerProps = {
			className: getContainerActionsClassName(actionsContainerClassName),
			style: actionsContainerStyle,
		},
		dialogProps = {
			className: getClassName(className),
			style,
		},

		contentProps = {
			className: getContentClassName(contentClassName),
			style: assign({}, contentStyle, {
				maxHeight: 'calc(100% - ' + ( (title || !modal ? 32 + 24 + 20 : 24) + (actions && actions.length > 0 ? 36 + 8 * 2 : 0) + 1 ) + 'px)'
			}),
		},
		titleProps = {
			className: getTitleClassName(titleClassName),
			style: titleStyle,
		},
		overlayProps = {
			className: getOverlayClassName(overlayClassName),
			style: overlayStyle,
		},
		dialogInlineProps = { dialogProps, contentProps, titleProps, actionsContainerProps, title, actions, modal, onRequestClose };

		let HighOrderDialogInline = DialogInline;
		if( !modal ) {
			HighOrderDialogInline = ClickAwayListener(HighOrderDialogInline);
		}

		return (
		<ReactCSSTransitionGroup transitionName="dialog-transition-group" transitionEnterTimeout={animatinsTime} transitionLeaveTimeout={animatinsTime}>
			{open && <div {...overlayProps}>
						<div className="dialog-wrapper" {...dialogWrapperProps}>
							<HighOrderDialogInline {...dialogInlineProps}>{children}</HighOrderDialogInline>
						</div>
					</div>}
		</ReactCSSTransitionGroup>
		);
	}
}

NewDialog.propTypes = {
	actions: PropTypes.node,
	actionsContainerClassName: PropTypes.string,
	actionsContainerStyle: PropTypes.object,
	// autoDetectWindowHeight: PropTypes.bool,
	// autoScrollBodyContent: PropTypes.bool,
	// bodyClassName: PropTypes.string,
	// bodyStyle: PropTypes.object,
	children: PropTypes.node,
	className: PropTypes.string,
	contentClassName: PropTypes.string,
	contentStyle: PropTypes.object,
	modal: PropTypes.bool,
	onRequestClose: PropTypes.func,
	open: PropTypes.bool.isRequired,
	overlayClassName: PropTypes.string,
	overlayStyle: PropTypes.object,
	// repositionOnUpdate: PropTypes.bool,
	style: PropTypes.object,
	title: PropTypes.node,
	titleClassName: PropTypes.string,
	titleStyle: PropTypes.object
};
NewDialog.defaultProps = {
	modal: true,
};

export default NewDialog;
