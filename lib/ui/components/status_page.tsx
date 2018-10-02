import * as React from 'react';

import { LinearProgress } from 'material-ui';

import * as UI from '..';

interface IStateProps {
    min?: number;
    max?: number;
    value?: number;
    determinate?: boolean;
    text?: string;
}

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
                    height: '100vh',
                    display: 'fixed',
                    background: UI.config.gradient_bg,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <div>
                    <div
                        style={{
                            margin: 'auto',
                            padding: '2px 5px 2px 5px',
                            maxWidth: '400px',
                            borderRadius: '6px'
                        }}
                    >
                        <LinearProgress
                            color="white"
                            mode={
                                this.props.determinate
                                    ? 'determinate'
                                    : 'indeterminate'
                            }
                            value={this.props.value}
                            min={this.props.min}
                            max={this.props.max}
                        />
                        <div
                            style={{
                                color: 'white',
                                fontFamily: 'Open Sans',
                                fontWeight: 500,
                                fontSize: 50
                            }}
                        >
                            {this.props.text}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
