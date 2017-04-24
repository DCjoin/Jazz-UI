import React from 'react';
import _forEach from 'lodash/forEach';

var _ = {forEach:_forEach};
var ViewableTextFieldUtil = {

	childContextTypes: {
         generatorBatchViewbaleTextFiled: React.PropTypes.func
    },

    getChildContext: function() {
         return { generatorBatchViewbaleTextFiled: this._generatorBatchViewbaleTextFiled };
    },

	_generatorBatchViewbaleTextFiled: function( viewableTextField ) {
		this._viewbaleTextFileds.push( viewableTextField );
	},

	initBatchViewbaleTextFiled: function() {
		this._viewbaleTextFileds = [];
	},

	clearErrorTextBatchViewbaleTextFiled: function() {
		_.forEach( this._viewbaleTextFileds, viewableTextField => {
			viewableTextField.clearErrorText();
		} );
	}

};

module.exports = ViewableTextFieldUtil;
