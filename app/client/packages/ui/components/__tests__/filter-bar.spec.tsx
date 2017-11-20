import * as React from 'react';
import FilterBar from '../filter-bar.tsx';

test('Filter bar', () => {
    const component = mountWithTheme(<FilterBar filter="search" />);
    expect(component).toMatchSnapshot();
});
