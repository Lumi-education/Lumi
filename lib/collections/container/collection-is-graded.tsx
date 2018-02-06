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
import * as Cards from 'lib/cards';
import * as Data from 'lib/data';

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

export class CollectionIsGradedContainer extends React.Component<IProps, {}> {
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
                onClick={e => {
                    e.stopPropagation();
                    this.props.dispatch(
                        Data.actions.update_data(
                            assign(this.props.collection_data, {
                                is_graded: !this.props.collection_data.is_graded
                            })
                        )
                    );
                }}
                style={{ display: 'inline-block' }}
                checked={this.props.collection_data.is_graded}
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
)(CollectionIsGradedContainer);
