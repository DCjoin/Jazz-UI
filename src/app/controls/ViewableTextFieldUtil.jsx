import React from 'react';
import _forEach from 'lodash-es/forEach';
import PropTypes from 'prop-types';
var _ = {forEach:_forEach};
var ViewableTextFieldUtil = {

	childContextTypes: {
         generatorBatchViewbaleTextFiled: PropTypes.func
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
