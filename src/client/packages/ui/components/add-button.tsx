// modules
import * as React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

// types
import { ICollection } from 'client/packages/collections/types';

interface IProps {
    action: () => void;
}

export default class AddButtonComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <FloatingActionButton
                onClick={this.props.action}
                style={{
                    margin: '20px',
                    bottom: '0px',
                    right: '20px',
                    position: 'fixed'
                }}
            >
                <ContentAdd />
            </FloatingActionButton>
        );
    }
}
