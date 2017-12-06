// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { assign, noop } from 'lodash';

// components
import CardListComponent from '../components/card-list';

// types
import { IState } from 'client/state';
import { ICard } from 'common/types';

// selectors
import { select_all_cards } from 'client/packages/cards/selectors';

// actions
import {
    create_data,
    update_data,
    get_data
} from 'client/packages/data/actions';
import { get_cards } from 'client/packages/cards/actions';

interface IPassedProps {
    onClick: (card_id: string) => void;
    selected_card_ids: string[];
}

interface IStateProps extends IPassedProps {
    cards: ICard[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardsListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_cards());
    }

    public render() {
        return (
            <CardListComponent {...this.props} onClick={this.props.onClick} />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        cards: select_all_cards(state),
        onClick: ownProps.onClick,
        selected_card_ids: ownProps.selected_card_ids
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
)(CardsListContainer);
