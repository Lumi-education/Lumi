// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Map } from 'immutable';
import { assign, noop, last, first } from 'lodash';

import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGAssignment from 'material-ui/svg-icons/action/assignment';

import {
    BottomNavigation,
    BottomNavigationItem
} from 'material-ui/BottomNavigation';

// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';
import { ICard } from 'client/packages/cards/types';

// selectors
import { select_card } from 'client/packages/cards/selectors';
import { select_collection_by_id } from 'client/packages/collections/selectors';

// actions
import { push } from 'client/packages/ui/actions';

interface IPassedProps {
    card_id: string;
    collection_id: string;
    onOverviewClick: () => void;
}

interface IStateProps extends IPassedProps {
    collection: ICollection;
    card: ICard;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserBottomNavigation extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <BottomNavigation
                style={{
                    position: 'fixed',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    zIndex: 501
                }}
            >
                <BottomNavigationItem
                    style={{
                        display:
                            first(this.props.collection.cards) !==
                            this.props.card._id
                                ? 'block'
                                : 'none'
                    }}
                    onClick={() =>
                        this.props.dispatch(
                            push(
                                '/user/collections/' +
                                    this.props.collection._id +
                                    '/cards/' +
                                    prev(
                                        this.props.collection.cards,
                                        this.props.card._id
                                    )
                            )
                        )
                    }
                    icon={<SVGLeft />}
                />

                <BottomNavigationItem
                    icon={<SVGAssignment />}
                    label={
                        this.props.collection.cards.indexOf(
                            this.props.card_id
                        ) +
                        1 +
                        '/' +
                        this.props.collection.cards.length
                    }
                    onClick={this.props.onOverviewClick}
                />

                <BottomNavigationItem
                    style={{
                        display:
                            last(this.props.collection.cards) !==
                            this.props.card._id
                                ? 'block'
                                : 'none'
                    }}
                    onClick={() =>
                        this.props.dispatch(
                            push(
                                '/user/collections/' +
                                    this.props.collection._id +
                                    '/cards/' +
                                    next(
                                        this.props.collection.cards,
                                        this.props.card._id
                                    )
                            )
                        )
                    }
                    icon={<SVGRight />}
                />
            </BottomNavigation>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection: select_collection_by_id(state, ownProps.collection_id),
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id),
        card_id: ownProps.card_id,
        onOverviewClick: ownProps.onOverviewClick
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
)(UserBottomNavigation);

function next(array: string[], id: string): string {
    let index = array.indexOf(id);
    index = index + 1;
    return array[index];
}

function prev(array: string[], id: string): string {
    let index = array.indexOf(id);
    index = index - 1;
    return array[index];
}
