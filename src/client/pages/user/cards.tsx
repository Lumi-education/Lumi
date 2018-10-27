import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import {
    Paper,
    BottomNavigation,
    BottomNavigationItem,
    IconButton,
    IconMenu,
    MenuItem,
    Badge
} from 'material-ui';

// types
import { IState } from 'client/state';
import * as Cards from 'lib/cards';

interface IStateProps {
    user_id: string;
    card_id: string;
    card: Cards.ICard;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCards extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards([this.props.card_id]));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.card_id !== nextProps.card_id) {
            this.props.dispatch(Cards.actions.get_cards([nextProps.card_id]));
        }
    }

    public render() {
        const card = this.props.card;
        return (
            <div>
                {(() => {
                    switch (card.card_type) {
                        case 'multiplechoice':
                            return (
                                <Cards.components.Multiplechoice
                                    card_id={card._id}
                                    text={card.text}
                                    items={card.items}
                                    show_correct_values={false}
                                    selected_items={[]}
                                />
                            );
                        default:
                            return <div>moo</div>;
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const card_id = ownProps.match.params.card_id;
    return {
        card_id,
        card: Cards.selectors.select_card(state, card_id),
        user_id: state.users.me._id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserCards);
