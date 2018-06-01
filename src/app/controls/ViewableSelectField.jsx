'use strict';

import React from 'react';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');
import _assign from "lodash-es/assign";
import _get from 'lodash-es/get';
import _find from 'lodash-es/find';

var _ = {get:_get,find:_find,assign:_assign};

var ViewableSelectField = createReactClass({
    propTypes: {
        isViewStatus: PropTypes.bool,
        selectedIndex:PropTypes.number,
        textField:PropTypes.string,
        didChanged:PropTypes.func,
        maxHeight:PropTypes.number,
        dataItems: PropTypes.array.isRequired
    },

    getInitialState: function() {

        return {
            errorText: "",
            selectedIndex: this.props.selectedIndex
        };
    },

    _handleChange: function(e, selectedIndex, menuItem){
        this.setState({selectedIndex: selectedIndex});
        this.props.didChanged(e);
    },


    componentWillReceiveProps: function(nextProps) {
        this.setState({selectedIndex:nextProps.selectedIndex});
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.isViewStatus == nextProps.isViewStatus &&
            this.props.dataItems == nextProps.dataItems &&
            this.props.selectedIndex == this.state.selectedIndex) return false;

        return true;
    },
    getCurrentValue:function(){
      return{selectedIndex:this.state.selectedIndex};
    },
    render: function(){
        var selectedField ;

        var text = this.props.textField;


        var menuItems = this.props.dataItems.map((item,idx)=>{
            return {payload:idx,text:item[text], value: item};
        });
        if(!this.props.isViewStatus){
            var idx = 0;
            if(this.state.selectedIndex>=0){
                idx = this.state.selectedIndex;
            }
            var item = _.find( menuItems, (item, index) => {
                return index === idx;
            } );
            var inputPorps = {
                errorText: this.state.errorText,
                onChange: this._handleChange,
                menuItems: menuItems,
                className:'pop-viewableSelectField-ddm',
                selectedIndex: idx,
                floatingLabelText: this.props.title,
                value: _.get( item, text)
            };
            var props = _.assign( {}, this.props, inputPorps );
            if( this.props.needChange ) {
                delete props.value;
            }
            selectedField = (
                <SelectField {...props}/>
            );
        }
        else{
            var afterValue=null;
            if(this.props.afterValue){
                afterValue = this.props.afterValue;
            }
            var value = '';
            if(this.state.selectedIndex>=0){
                value = this.props.dataItems[this.state.selectedIndex][text];
            }


            selectedField = (
                <div>
                    <div className="pop-viewable-title">{this.props.title}</div>
                    <div className="pop-viewable-value">{value}{afterValue}</div>
                </div>
            );
        }
        return (
            <div className="pop-viewableSelectField">
                {selectedField}
            </div>
        );
    }
});

module.exports = ViewableSelectField;
