import * as React from 'react';
import * as UI from 'lib/ui';

interface IStateProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

export default class ErrorPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    background: UI.config.error_bg,
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
                        <div
                            style={{
                                color: 'white',
                                fontFamily: 'Open Sans',
                                fontWeight: 500,
                                fontSize: 50
                            }}
                        >
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
