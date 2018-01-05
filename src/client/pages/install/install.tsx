import * as React from 'react';

import { InstallContainer } from 'lib/install';

export default class InstallPage extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return <InstallContainer />;
    }
}
