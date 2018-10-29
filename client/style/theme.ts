// deprecate issue #238

import * as Colors from 'material-ui/styles/colors';
import * as ColorManipulator from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';

export default {
    spacing: Spacing,
    fontFamily: 'Open Sans, sans-serif',
    palette: {
        primary1Color: '#3498db',
        primary2Color: Colors.cyan700,
        primary3Color: Colors.grey400,
        accent1Color: '#8e44ad',
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        pickerHeaderColor: Colors.cyan500,
        clockCircleColor: ColorManipulator.fade(Colors.darkBlack, 0.07),
        shadowColor: Colors.fullBlack
    }
};
