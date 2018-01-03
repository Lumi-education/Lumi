// modules
import * as React from 'react';

export default class ActionBarComponent extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    margin: '0px',
                    padding: '10px',
                    bottom: '0px',
                    right: '0px',
                    position: 'fixed'
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
