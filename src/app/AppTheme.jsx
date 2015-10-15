'use strict';

import { Styles, Utils } from 'material-ui';

var {Spacing, Colors, Typography} = Styles;
var {ColorManipulator} = Utils;

Typography.fontWeightNormal = 'normal';
Typography.fontWeightMedium = 'normal';

var AppTheme = {
  rawTheme: {
    spacing: Spacing,
    fontFamily: 'Lantinghei sc,Microsoft YaHei Light,Microsoft YaHei',
    palette: {
      primary1Color: Colors.cyan500,
      primary2Color: Colors.cyan700,
      primary3Color: Colors.cyan100,
      accent1Color: '#1ca8dd',
      accent2Color: Colors.pinkA400,
      accent3Color: Colors.pinkA100,
      textColor: Colors.darkBlack,
      alternateTextColor: Colors.white,
      canvasColor: Colors.white,
      borderColor: Colors.grey300,
      disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)
    },
  },
  setComponentThemes: function(muiTheme) {
    var palette = muiTheme.rawTheme.palette;
    var obj = {
      appBar: {
        color: palette.primary1Color,
        textColor: Colors.darkWhite,
        height: Spacing.desktopKeylineIncrement
      },
      avatar: {
        borderColor: 'rgba(0, 0, 0, 0.08)'
      },
      button: {
        height: 36,
        minWidth: 88,
        backgroundColor: 'transparent',
        iconButtonSize: Spacing.iconSize * 2
      },
      checkbox: {
        boxColor: palette.textColor,
        labelColor: '#767a7a',
        labelDisabledColor: '#abafae',
        checkedColor: palette.primary1Color,
        requiredColor: palette.primary1Color,
        disabledColor: palette.disabledColor
      },
      datePicker: {
        color: palette.primary1Color,
        textColor: Colors.white,
        calendarTextColor: palette.textColor,
        selectColor: palette.primary2Color,
        selectTextColor: Colors.white
      },
      dropDownMenu: {
        accentColor: palette.borderColor
      },
      flatButton: {
        color: palette.canvasColor,
        disabledTextColor: '#c2c5c4',
        textColor: "#1ca8dd",
        backgroundColor: 'transparent',
        primaryTextColor: "#ff4081",
        secondaryTextColor: "#1ca8dd"
      },
      floatingActionButton: {
        buttonSize: 56,
        miniSize: 40,
        color: palette.accent1Color,
        iconColor: Colors.white,
        secondaryColor: palette.primary1Color,
        secondaryIconColor: Colors.white,
        disabledTextColor: palette.disabledColor
      },
      gridTile: {
        textColor: Colors.white
      },
      inkBar: {
        backgroundColor: palette.accent1Color
      },
      leftNav: {
        width: Spacing.desktopKeylineIncrement * 4,
        color: Colors.white
      },
      listItem: {
        nestedLevelDepth: 18
      },
      menu: {
        backgroundColor: Colors.white,
        containerBackgroundColor: Colors.white
      },
      menuItem: {
        dataHeight: 32,
        height: 48,
        hoverColor: 'rgba(0, 0, 0, .035)',
        padding: Spacing.desktopGutter,
        selectedTextColor: palette.accent1Color
      },
      menuSubheader: {
        padding: Spacing.desktopGutter,
        borderColor: palette.borderColor,
        textColor: palette.primary1Color
      },
      paper: {
        backgroundColor: Colors.white
      },
      radioButton: {
        borderColor: palette.textColor,
        backgroundColor: Colors.white,
        checkedColor: palette.primary1Color,
        requiredColor: palette.primary1Color,
        disabledColor: palette.disabledColor,
        size: 24,
        labelColor: palette.textColor,
        labelDisabledColor: palette.disabledColor
      },
      raisedButton: {
        color: Colors.white,
        textColor: palette.textColor,
        primaryColor: palette.accent1Color,
        primaryTextColor: Colors.white,
        secondaryColor: palette.primary1Color,
        secondaryTextColor: Colors.white
      },
      slider: {
        trackSize: 2,
        trackColor: Colors.minBlack,
        trackColorSelected: Colors.grey500,
        handleSize: 12,
        handleSizeDisabled: 8,
        handleSizeActive: 18,
        handleColorZero: Colors.grey400,
        handleFillColor: Colors.white,
        selectionColor: palette.primary3Color,
        rippleColor: palette.primary1Color
      },
      snackbar: {
        textColor: Colors.white,
        backgroundColor: '#323232',
        actionColor: palette.accent1Color
      },
      table: {
        backgroundColor: palette.canvasColor
      },
      tableHeader: {
        borderColor: palette.borderColor
      },
      tableHeaderColumn: {
        textColor: palette.primary3Color,
        height: 56,
        spacing: 24
      },
      tableFooter: {
        borderColor: palette.borderColor,
        textColor: palette.primary3Color
      },
      tableRow: {
        hoverColor: palette.accent2Color,
        stripeColor: ColorManipulator.lighten(palette.primary1Color, 0.55),
        selectedColor: palette.borderColor,
        textColor: palette.textColor,
        borderColor: palette.borderColor
      },
      tableRowColumn: {
        height: 48,
        spacing: 24
      },
      timePicker: {
        color: Colors.white,
        textColor: Colors.grey600,
        accentColor: palette.primary1Color,
        clockColor: Colors.black,
        selectColor: palette.primary2Color,
        selectTextColor: Colors.white
      },
      toggle: {
        thumbOnColor: palette.primary1Color,
        thumbOffColor: Colors.grey50,
        thumbDisabledColor: Colors.grey400,
        thumbRequiredColor: palette.primary1Color,
        trackOnColor: ColorManipulator.fade(palette.primary1Color, 0.5),
        trackOffColor: Colors.minBlack,
        trackDisabledColor: Colors.faintBlack
      },
      toolbar: {
        backgroundColor: ColorManipulator.darken('#eeeeee', 0.05),
        height: 56,
        titleFontSize: 20,
        iconColor: 'rgba(0, 0, 0, .40)',
        separatorColor: 'rgba(0, 0, 0, .175)',
        menuHoverColor: 'rgba(0, 0, 0, .10)'
      },
      tabs: {
        backgroundColor: palette.primary1Color
      },
      textField: {
        textColor: palette.textColor,
        hintColor: palette.disabledColor,
        floatingLabelColor: palette.textColor,
        disabledTextColor: palette.disabledColor,
        errorColor: Colors.red500,
        focusColor: palette.primary1Color,
        backgroundColor: 'transparent',
        borderColor: palette.borderColor
      }

    };

    // Properties based on previous properties
    //add properties to objects inside 'returnObj' that depend on existing properties
    obj.flatButton.disabledTextColor = ColorManipulator.fade(obj.flatButton.textColor, 0.3);
    obj.raisedButton.disabledColor = ColorManipulator.darken(obj.raisedButton.color, 0.1);
    obj.raisedButton.disabledTextColor = ColorManipulator.fade(obj.raisedButton.textColor, 0.3);

    //append the raw theme object to 'returnObj'
    obj.rawTheme = muiTheme.rawTheme;

    //set 'static' key as true (by default) on return object. This is to support the ContextPure mixin.
    obj['static'] = true;


    obj.slider.handleSizeActive = obj.slider.handleSize * 2;
    obj.toggle.trackRequiredColor = ColorManipulator.fade(obj.toggle.thumbRequiredColor, 0.5);

    return obj;
  }
};

module.exports = AppTheme;
