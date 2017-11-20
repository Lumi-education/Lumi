// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Map } from 'immutable';

import FilterBar from 'client/packages/ui/components/filter-bar';
import { CollectionListComponent } from 'client/packages/collections';

// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';

// actions
import { get_collections } from 'client/packages/collections/actions';

interface IStateProps {
    collections: ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => void;
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
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })}
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
                        this.props.dispatch(push('/admin/collections/' + id))}
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
