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
import * as Core from 'lib/core';

interface IPassedProps {
    collection_id: string;
    user_id: string;
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card_data: Cards.ICardData;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardEvaluationContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.card_data._id) {
            this.props.dispatch(
                Core.actions.find({
                    type: 'data',
                    user_id: this.props.user_id,
                    collection_id: this.props.collection_id,
                    card_id: this.props.card_id
                })
            );
        }
    }

    public render() {
        return (
            <Checkbox
                onClick={e => {
                    // e.stopPropagation();
                    // this.props.dispatch(
                    //     Data.actions.update_data(
                    //         assign(this.props.collection_data, {
                    //             submitted: !this.props.collection_data.submitted
                    //         })
                    //     )
                    // );
                }}
                style={{ display: 'inline-block' }}
                checkedIcon={<SVGCheck />}
                uncheckedIcon={<SVGClose />}
                checked={this.props.card_data.score === 1}
                iconStyle={{
                    fill:
                        this.props.card_data.score === 1 ? '#2ecc71' : '#e74c3c'
                }}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
        collection_id: ownProps.collection_id,
        card_id: ownProps.card_id,
        card_data: Data.selectors.select_data(
            state,
            ownProps.user_id,
            ownProps.collection_id,
            ownProps.card_id
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
)(CardEvaluationContainer);
