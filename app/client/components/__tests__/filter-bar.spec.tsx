import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-15.4';
import * as Enzyme from 'enzyme';

import theme from '../../style/theme.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FilterBar from '../filter-bar.tsx';

Enzyme.configure({ adapter: new Adapter() });

test('Filter bar', () => {
    const muiTheme = getMuiTheme(theme);

    const component = Enzyme.mount(<FilterBar filter="search" />, {
        context: { muiTheme },
        childContextTypes: { muiTheme: React.PropTypes.object }
    });

    expect(component).toMatchSnapshot();
});
