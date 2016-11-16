'use strict';

import {fade} from 'material-ui/utils/colorManipulator';
import {colors as Colors, typography as Typography} from 'material-ui/styles';
Typography.fontWeightNormal = 'normal';
Typography.fontWeightMedium = 'normal';
import getLessVar from './util/GetLessVar.jsx';
// var {ColorManipulator} = Utils;

// Typography.fontWeightNormal = 'normal';
// Typography.fontWeightMedium = 'normal';

module.exports = {
  // spacing: {
  //   iconSize: 24,

  //   desktopGutter: 24,
  //   desktopGutterMore: 32,
  //   desktopGutterLess: 16,
  //   desktopGutterMini: 8,
  //   desktopKeylineIncrement: 64,
  //   desktopDropDownMenuItemHeight: 32,
  //   desktopDropDownMenuFontSize: 15,
  //   desktopLeftNavMenuItemHeight: 48,
  //   desktopSubheaderHeight: 48,
  //   desktopToolbarHeight: 56,
  // },
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
};
//
// var AppTheme = {
//   spacing: Spacing,
//   contentFontFamily: 'Lantinghei sc,Microsoft YaHei Light,Microsoft YaHei',
//   getPalette: function() {
//     return {
//       primary1Color: Colors.cyan500,
//       primary2Color: Colors.cyan700,
//       primary3Color: Colors.cyan100,
//       accent1Color: '#1ca8dd',
//       accent2Color: Colors.pinkA400,
//       accent3Color: Colors.pinkA100,
//       textColor: Colors.darkBlack,
//       canvasColor: Colors.white,
//       borderColor: Colors.grey300,
//       disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)
//     };
//   },
//   getComponentThemes: function(palette) {
//     var obj = {
//       appBar: {
//         color: palette.primary1Color,
//         textColor: Colors.darkWhite,
//         height: Spacing.desktopKeylineIncrement
//       },
//       button: {
//         height: 36,
//         minWidth: 88,
//         backgroundColor:'transparent',
//         iconButtonSize: Spacing.iconSize * 2
//       },
//       checkbox: {
//         boxColor: palette.textColor,
//         labelColor:'#767a7a',
//         labelDisabledColor:'#abafae',
//         checkedColor: palette.primary1Color,
//         requiredColor: palette.primary1Color,
//         disabledColor: palette.disabledColor
//       },
//       datePicker: {
//         color: palette.primary1Color,
//         textColor: Colors.white,
//         calendarTextColor: palette.textColor,
//         selectColor: palette.primary2Color,
//         selectTextColor: Colors.white
//       },
//       dropDownMenu: {
//         accentColor: palette.borderColor
//       },
//       flatButton: {
//         color: palette.canvasColor,
//         disabledTextColor:'#c2c5c4',
//         textColor: "#1ca8dd",
//         backgroundColor:'transparent',
//         primaryTextColor:"#ff4081",
//         secondaryTextColor: "#1ca8dd"
//       },
//       floatingActionButton: {
//         buttonSize: 56,
//         miniSize: 40,
//         color: palette.accent1Color,
//         iconColor: Colors.white,
//         secondaryColor: palette.primary1Color,
//         secondaryIconColor: Colors.white
//       },
//       leftNav: {
//         width: Spacing.desktopKeylineIncrement * 4,
//         color: Colors.white
//       },
//       menu: {
//         backgroundColor: Colors.white,
//         containerBackgroundColor: Colors.white
//       },
//       menuItem: {
//         dataHeight: 32,
//         height: 48,
//         hoverColor: 'rgba(0, 0, 0, .035)',
//         padding: Spacing.desktopGutter,
//         selectedTextColor: palette.accent1Color
//       },
//       menuSubheader: {
//         padding: Spacing.desktopGutter,
//         borderColor: palette.borderColor,
//         textColor: palette.primary1Color
//       },
//       paper: {
//         backgroundColor: Colors.white
//       },
//       radioButton: {
//         borderColor:  palette.textColor,
//         backgroundColor: Colors.white,
//         checkedColor: palette.primary1Color,
//         requiredColor: palette.primary1Color,
//         disabledColor: palette.disabledColor,
//         size: 24
//       },
//       raisedButton: {
//         color: Colors.white,
//         textColor: palette.textColor,
//         primaryColor: palette.accent1Color,
//         primaryTextColor: Colors.white,
//         secondaryColor: palette.primary1Color,
//         secondaryTextColor: Colors.white
//       },
//       slider: {
//         trackSize: 2,
//         trackColor: Colors.minBlack,
//         trackColorSelected: Colors.grey500,
//         handleSize: 12,
//         handleSizeDisabled: 8,
//         handleColorZero: Colors.grey400,
//         handleFillColor: Colors.white,
//         selectionColor: palette.primary3Color,
//         rippleColor: palette.primary1Color
//       },
//       snackbar: {
//         textColor: Colors.white,
//         backgroundColor: '#323232',
//         actionColor: palette.accent1Color
//       },
//       timePicker: {
//         color: Colors.white,
//         textColor: Colors.grey600,
//         accentColor: palette.primary1Color,
//         clockColor: Colors.black,
//         selectColor: palette.primary2Color,
//         selectTextColor: Colors.white
//       },
//       toggle: {
//         thumbOnColor: palette.primary1Color,
//         thumbOffColor: Colors.grey50,
//         thumbDisabledColor: Colors.grey400,
//         thumbRequiredColor: palette.primary1Color,
//         trackOnColor: ColorManipulator.fade(palette.primary1Color, 0.5),
//         trackOffColor: Colors.minBlack,
//         trackDisabledColor: Colors.faintBlack
//       },
//       toolbar: {
//         backgroundColor: ColorManipulator.darken('#eeeeee', 0.05),
//         height: 56,
//         titleFontSize: 20,
//         iconColor: 'rgba(0, 0, 0, .40)',
//         separatorColor: 'rgba(0, 0, 0, .175)',
//         menuHoverColor: 'rgba(0, 0, 0, .10)'
//       },
//       tabs: {
//         backgroundColor: palette.primary1Color
//         }
//
//     };
//
//     // Properties based on previous properties
//
//
//
//     obj.slider.handleSizeActive = obj.slider.handleSize * 2;
//     obj.toggle.trackRequiredColor = ColorManipulator.fade(obj.toggle.thumbRequiredColor, 0.5);
//
//     return obj;
//   }
// };
//
// module.exports = AppTheme;
