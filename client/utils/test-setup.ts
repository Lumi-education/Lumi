import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-15.4';
import * as Enzyme from 'enzyme';

import theme from '../style/theme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

declare var global: any;

const muiTheme = getMuiTheme(theme);

Enzyme.configure({ adapter: new Adapter() });

function mountWithTheme(component) {
    return Enzyme.mount(component, {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    });
}

global.mount = Enzyme.mount;
global.mountWithTheme = mountWithTheme;
