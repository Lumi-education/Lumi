// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Tabs, Tab } from 'material-ui';

import System_environment_tab from './system-environment-tab';
import System_update_tab from './system-update-tab';

// state
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';

interface IStateProps {
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class SystemIndex extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label={Core.i18n.t('environment')}
                        value="environment"
                        onActive={() =>
                            this.props.dispatch(
                                push('/admin/system/environment')
                            )
                        }
                    />
                    <Tab
                        label={Core.i18n.t('update')}
                        value="update"
                        onActive={() =>
                            this.props.dispatch(push('/admin/system/update'))
                        }
                    />
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'environment':
                            return <System_environment_tab />;
                        case 'update':
                        default:
                            return <System_update_tab />;
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tab: ownProps.match.params.tab
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(SystemIndex);
