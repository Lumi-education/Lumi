// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

// components
import { FloatingActionButton } from 'material-ui';
import SVGDone from 'material-ui/svg-icons/navigation/check';

// modules
import * as Collections from 'lib/collections';
import * as Core from 'lib/core';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    selected_collection_data: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionSubmitSelectedButtonContainer extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <FloatingActionButton
                disabled={this.props.selected_collection_data.length === 0}
                onClick={() => {
                    this.props.dispatch(
                        Core.actions.action(
                            'SUBMIT_COLLECTION',
                            this.props.selected_collection_data,
                            { submitted: true }
                        )
                    );
                }}
            >
                <SVGDone />
            </FloatingActionButton>
        );
    }
}

function mapStateToProps(state: Collections.IState, ownProps): IStateProps {
    return {
        selected_collection_data: state.collections.ui.selected_collection_data
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
)(CollectionSubmitSelectedButtonContainer);
