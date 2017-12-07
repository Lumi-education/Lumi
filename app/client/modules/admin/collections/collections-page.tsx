// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import * as debug from 'debug';

import { Map } from 'immutable';

import { FilterBarComponent, AddButtonComponent } from 'client/packages/ui';
import { CollectionListComponent } from 'client/packages/collections';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';

// actions
import {
    get_collections,
    create_collection
} from 'client/packages/collections/actions';

const log_action = debug('lumi:actions');

interface IStateProps {
    collections: ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class CollectionsPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_collections());
    }

    public render() {
        return (
            <div>
                <FilterBarComponent
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <CollectionListComponent
                    collections={this.props.collections.filter(collection => {
                        return this.state.search_text === ''
                            ? true
                            : collection.name
                                  .toLocaleLowerCase()
                                  .indexOf(
                                      this.state.search_text.toLocaleLowerCase()
                                  ) > -1;
                    })}
                    onClick={(id: string) =>
                        this.props.dispatch(push('/admin/collections/' + id))
                    }
                />
                <AddButtonComponent
                    action={() => {
                        this.props.dispatch(create_collection()).then(res => {
                            log_action(
                                'create_collection -> promise resolved',
                                res
                            );
                            this.props.dispatch(
                                push('/admin/collections/' + res.payload._id)
                            );
                        });
                    }}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        collections: state.collections.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    CollectionsPage
);
