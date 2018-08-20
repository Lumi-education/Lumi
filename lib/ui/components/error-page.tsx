import * as React from 'react';

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
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'linear-gradient(90deg, #c0392b, #f39c12)'
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
