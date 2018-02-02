// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import * as debug from 'debug';
import { AutoComplete } from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// local
import { IState } from '../../../src/client/state';

// modules
import * as Collections from '../';

const log = debug('lumi:lib:collections:container:collections-chip-input');

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    collection_ids: string[];
    collections: Collections.ICollection[];
    all_collections: Collections.ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionsChipInputContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Collections.actions.get_collections());
    }

    public render() {
        return (
            <ChipInput
                hintText="Collections"
                floatingLabelText="Collections"
                className="filter-bar"
                fullWidth={true}
                value={this.props.collections}
                allowDuplicates={false}
                dataSource={this.props.all_collections}
                dataSourceConfig={{
                    text: 'name',
                    value: '_id'
                }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={collection => {
                    if (
                        this.props.all_collections
                            .map(u => u._id)
                            .indexOf(collection._id) > -1
                    ) {
                        this.props.dispatch(
                            Collections.actions.select_collection(
                                collection._id
                            )
                        );
                    }
                }}
                onRequestDelete={collection_id =>
                    this.props.dispatch(
                        Collections.actions.select_collection(collection_id)
                    )
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const collection_ids = state.collections.ui.selected_collections || [];

    return {
        collection_ids,
        all_collections: state.collections.list,
        collections: Collections.selectors.select_collections_by_ids(
            state,
            collection_ids
        )
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CollectionsChipInputContainer);
