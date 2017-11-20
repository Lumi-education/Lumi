// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// components
import { Tabs, Tab } from 'material-ui/Tabs';

import {
    CollectionCardsAdminContainer,
    CollectionSettingsContainer
} from 'client/packages/collections';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';

// selectors
import { select_collection_by_id } from 'client/packages/collections/selectors';
// actions
import { get_collection } from 'client/packages/collections/actions';
import { Dialog } from 'material-ui';

interface IStateProps {
    collection_id: string;
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminCollectionPage extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (this.props.collection_id !== 'new') {
            this.props.dispatch(get_collection(this.props.collection_id));
        }
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        position: 'fixed',
                        backgroundColor: '#FFFFFF',
                        top: '64px',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label="Settings"
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/collections/' +
                                        this.props.collection_id +
                                        '/settings'
                                )
                            )}
                    />
                    <Tab
                        label="Cards"
                        value="cards"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/collections/' +
                                        this.props.collection_id +
                                        '/cards'
                                )
                            )}
                    />
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'settings':
                        default:
                            return (
                                <CollectionSettingsContainer
                                    collection_id={this.props.collection_id}
                                />
                            );
                        case 'cards':
                            return (
                                <CollectionCardsAdminContainer
                                    collection_id={this.props.collection_id}
                                />
                            );
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id,
        tab: ownProps.params.tab
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<{}, {}, { collection_id: string }>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCollectionPage);
