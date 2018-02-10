// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';
import { Checkbox } from 'material-ui';
// components
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

export class CollectionDueDateContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.collection_data) {
            this.props.dispatch(Core.actions.doc(this.props.data_id));
        }
    }

    public render() {
        if (!this.props.collection_data) {
            return <div>-</div>;
        }
        return (
            <div>
                {this.props.collection_data.due_date
                    ? moment(this.props.collection_data.due_date)
                          .tz('Europe/Berlin')
                          .fromNow()
                    : '-'}
            </div>
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
)(CollectionDueDateContainer);
