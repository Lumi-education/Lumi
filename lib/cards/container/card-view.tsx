// modules
import * as React from 'react';
import {connect} from 'react-redux';

import {assign, noop} from 'lodash';

// components
import FreetextContainer from './freetext-container';
import VideoCardContainer from './video-card';
import MultiplechoiceContainer from './multiplechoice-container';
import UploadCardContainer from './upload-card';
import TextCardContainer from './text-card-container';
import H5PCardContainer from './h5p';

import * as Cards from '../';

interface IPassedProps {
    card_id: string;
    collection_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardViewContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const id =
            this.props.user_id +
            '-' +
            this.props.collection_id +
            '-' +
            this.props.card_id;
        const card = this.props.card;

        if (card) {
            switch (card.card_type) {
                case 'multiplechoice':
                    return (
                        <MultiplechoiceContainer
                            key={id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'freetext':
                    return (
                        <FreetextContainer
                            key={id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'video':
                    return (
                        <VideoCardContainer
                            key={id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'upload':
                    return (
                        <UploadCardContainer
                            key={id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'text':
                    return (
                        <TextCardContainer
                            key={id}
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'h5p':
                    return (
                        <H5PCardContainer
                            key={id}
                            assignment_id={this.props.collection_id}
                            card_id={this.props.card_id}
                            user_id={this.props.user_id}
                        />
                    );
            }
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: Cards.selectors.select_card(state, ownProps.card_id),
        user_id: ownProps.user_id || (state as any).auth.user_id
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
