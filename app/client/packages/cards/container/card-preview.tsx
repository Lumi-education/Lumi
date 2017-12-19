// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { assign, noop } from 'lodash';

// components
import MultiplechoiceCardComponent from 'client/packages/cards/components/multiplechoice';
import FreetextComponent from '../components/freetext';

// types
import { IState } from 'client/state';
import { ICard } from '../types';

// selectors
import { select_card } from 'client/packages/cards/selectors';

// actions

import { get_card } from 'client/packages/cards/actions';

interface IPassedProps {
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card: ICard;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardPreviewContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.card._id) {
            this.props.dispatch(get_card(this.props.card_id));
        }
    }

    public render() {
        const card = this.props.card;
        if (card) {
            switch (card.card_type) {
                // case 'multiplechoice':
                //     return (
                //         <MultiplechoiceCardComponent
                //             text={card.text}
                //             items={card.items}
                //         />
                //     );
                case 'freetext':
                    return <FreetextComponent text={card.text} answer={''} />;
            }
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        card: select_card(state, ownProps.card_id)
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
)(CardPreviewContainer);
