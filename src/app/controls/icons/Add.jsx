import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';

var Add = React.createClass({
    render: function() {
        return (
            <SvgIcon {...this.props}>
                <path d="M19 13h-6v6h-2v-6h-6v-2h6v-6h2v6h6v2z"/>
            </SvgIcon>
        );
    }
});

module.exports = Add;
