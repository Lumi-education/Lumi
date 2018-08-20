// modules
import * as React from 'react';
import { connect } from 'react-redux';

// components
import H5PCardContainer from './h5p';

import MultiplechoiceContainer from './multiplechoice-container';
import UploadCardContainer from './upload-card';
import FreetextContainer from './freetext-container';
import VideoCardContainer from './video-card';

import * as Cards from '..';

interface IPassedProps {
    card_id: string;
    assignment_id: string;
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
        const card = this.props.card;
        const assignment_id = this.props.assignment_id;

        if (card) {
            switch (card.card_type) {
                case 'multiplechoice':
                    return (
                        <MultiplechoiceContainer
                            key={assignment_id}
                            card_id={this.props.card_id}
                            assignment_id={this.props.assignment_id}
                        />
                    );
                case 'freetext':
                    return (
                        <FreetextContainer
                            key={assignment_id}
                            card_id={this.props.card_id}
                            assignment_id={this.props.assignment_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'video':
                    return (
                        <VideoCardContainer
                            key={assignment_id}
                            card_id={this.props.card_id}
                            assignment_id={this.props.assignment_id}
                            user_id={this.props.user_id}
                        />
                    );
                case 'upload':
                    return (
                        <UploadCardContainer
                            key={assignment_id}
                            card_id={this.props.card_id}
                            assignment_id={this.props.assignment_id}
                            user_id={this.props.user_id}
                        />
                    );
                // case 'text':
                //     return (
                //         <TextCardContainer
                //             key={assignment_id}
                //             card_id={this.props.card_id}
                //             assignment_id={this.props.assignment_id}
                //             user_id={this.props.user_id}
                //         />
                //     );
                case 'h5p':
                    return (
                        <H5PCardContainer
                            key={assignment_id}
                            assignment_id={this.props.assignment_id}
                            card_id={this.props.card_id}
                            user_id={this.props.user_id}
                        />
                    );
            }
        }

        return <div>card_type {this.props.card.card_type} not found</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        assignment_id: ownProps.assignment_id,
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
