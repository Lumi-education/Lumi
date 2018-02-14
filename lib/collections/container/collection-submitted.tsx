// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

// components
import { Checkbox } from 'material-ui';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';

// modules
import * as Collections from 'lib/collections';
import * as Core from 'lib/core';

interface IPassedProps {
    data_id: string;
}

interface IStateProps extends IPassedProps {
    collection_data: Collections.ICollectionData;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionSubmittedContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (!this.props.collection_data) {
            return <div>loading</div>;
        }
        return (
            <Checkbox
                onClick={e => {
                    e.stopPropagation();
                    this.props.dispatch(
                        this.props.collection_data.submitted
                            ? Core.actions.action(
                                  'UNSUBMIT_COLLECTION',
                                  [this.props.collection_data._id],
                                  { submitted: false }
                              )
                            : Core.actions.action(
                                  'SUBMIT_COLLECTION',
                                  [this.props.collection_data._id],
                                  { submitted: true }
                              )
                    );
                }}
                style={{ display: 'inline-block' }}
                checkedIcon={<SVGCheck />}
                uncheckedIcon={<SVGClose />}
                checked={this.props.collection_data.submitted}
                iconStyle={{
                    fill: this.props.collection_data.submitted
                        ? '#2ecc71'
                        : '#e74c3c'
                }}
            />
        );
    }
}

function mapStateToProps(state: Collections.IState, ownProps): IStateProps {
    return {
        data_id: ownProps.data_id,
        collection_data: Collections.selectors.data_by_id(
            state,
            ownProps.data_id
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
)(CollectionSubmittedContainer);
