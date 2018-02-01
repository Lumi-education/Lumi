// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';
import { Checkbox } from 'material-ui';
// local
import { IState } from '../types';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
// types
import * as Users from 'lib/users';
import * as Data from 'lib/data';
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';

interface IPassedProps {
    data_id: string;
}

interface IStateProps extends IPassedProps {
    collection_data: Cards.ICollectionData;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionSubmittedContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.collection_data._id) {
            // this.props.dispatch(Users.actions.get_user(this.props.user_id));
        }
    }

    public render() {
        return (
            <Checkbox
                onClick={() =>
                    this.props.dispatch(
                        Data.actions.update_data(
                            assign(this.props.collection_data, {
                                submitted: !this.props.collection_data.submitted
                            })
                        )
                    )
                }
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

function mapStateToProps(state: IState, ownProps): IStateProps {
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
