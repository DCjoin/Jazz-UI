'use strict';

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppTheme from '../AppTheme.jsx';

import getLessVar from 'util/GetLessVar.jsx';

const muiTheme = getMuiTheme({...AppTheme, ...{
  palette: {
    primary1Color: getLessVar('medium-green'),
    accent1Color: getLessVar('medium-green'),
  },
}});

export default function NewAppTheme(Base) {
  class ContainerClass extends Base {
    constructor(props, context) {
      super(props, context);
    };
    render() {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <Base {...this.props}/>
        </MuiThemeProvider>
      );
    }
  }
  return ContainerClass;
}

/*
module.exports = {
  fontFamily: 'Lantinghei sc,Microsoft YaHei Light,Microsoft YaHei',
  palette: {
    primary1Color: Colors.cyan500,
    primary2Color: Colors.cyan700,
    primary3Color: Colors.lightBlack,
    accent1Color: '#1ca8dd',
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: getLessVar('schneiderNormal'),
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: fade(Colors.darkBlack, 0.3),
  },
};*/
