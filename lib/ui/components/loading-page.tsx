import * as React from 'react';

import { Paper } from 'material-ui';

interface IStateProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

export default class LoadingPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                className="loading"
            />
        );
    }
}
