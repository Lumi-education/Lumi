// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { assign, noop } from 'lodash';

// components
import FreetextContainer from './freetext-container';
import VideoCardContainer from './video-card';
import MultiplechoiceContainer from './multiplechoice-container';
import UploadCardContainer from './upload-card';
import TextCardContainer from './text-card-container';

// types
import { ICard, IState } from '../types';

// selectors
import { select_card } from 'lib/cards/selectors';

// actions
import { get_card } from 'lib/cards/actions';

interface IPassedProps {
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: ICard;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardViewContainer extends React.Component<IProps, {}> {
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
                case 'multiplechoice':
                    return (
                        <MultiplechoiceContainer
                            key={this.props.card_id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
                case 'freetext':
                    return (
                        <FreetextContainer
                            key={this.props.card_id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
                case 'video':
                    return (
                        <VideoCardContainer
                            key={this.props.card_id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
                case 'upload':
                    return (
                        <UploadCardContainer
                            key={this.props.card_id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
                case 'text':
                    return (
                        <TextCardContainer
                            key={this.props.card_id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
            }
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
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
)(CardViewContainer);
