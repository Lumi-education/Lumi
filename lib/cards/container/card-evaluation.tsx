// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';

// components
import { Checkbox } from 'material-ui';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGLoading from 'material-ui/svg-icons/action/cached';
import SVGMultiplechoice from 'material-ui/svg-icons/action/view-agenda';
import SVGText from 'material-ui/svg-icons/action/view-headline';
import SVGVideo from 'material-ui/svg-icons/notification/ondemand-video';

// modules
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';

interface IPassedProps {
    collection_id: string;
    user_id: string;
    card_id: string;
    active: boolean;
}

interface IStateProps extends IPassedProps {
    card_data: Cards.ICardData;
    card: Cards.ICard;
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
        if (!this.props.card._id) {
            this.props.dispatch(Cards.actions.get_card(this.props.card_id));
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
                disabled={!this.props.card_data._id}
                checkedIcon={
                    this.props.active ? (
                        <SVGClose />
                    ) : (
                        card_type_icon(this.props.card.card_type)
                    )
                }
                uncheckedIcon={
                    this.props.active ? (
                        <SVGClose />
                    ) : (
                        card_type_icon(this.props.card.card_type)
                    )
                }
                checked={this.props.card_data.score === 1}
                iconStyle={{
                    fill:
                        this.props.card_data.score === 1 ? '#2ecc71' : '#e74c3c'
                }}
            />
        );
    }
}

function card_type_icon(type: string) {
    switch (type) {
        case 'multiplechoice':
            return <SVGMultiplechoice />;
        case 'text':
            return <SVGText />;
        case 'video':
            return <SVGVideo />;
        default:
            return <SVGCheck />;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
        collection_id: ownProps.collection_id,
        card_id: ownProps.card_id,
        card_data: Cards.selectors.select_data(
            state,
            ownProps.user_id,
            ownProps.collection_id,
            ownProps.card_id
        ),
        card: Cards.selectors.select_card(state, ownProps.card_id),
        active: ownProps.active
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
