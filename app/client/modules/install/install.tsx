import * as React from 'react';

import { InstallContainer } from 'client/packages/install';

export default class InstallPage extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return <InstallContainer />;
    }
}
