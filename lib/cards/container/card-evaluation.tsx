// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';

// components
import { Badge, Checkbox, Dialog, RaisedButton } from 'material-ui';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGLoading from 'material-ui/svg-icons/action/cached';
import SVGMultiplechoice from 'material-ui/svg-icons/action/view-agenda';
import SVGText from 'material-ui/svg-icons/action/view-headline';
import SVGVideo from 'material-ui/svg-icons/notification/ondemand-video';
import SVGFreetext from 'material-ui/svg-icons/content/text-format';
// modules
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';
import * as UI from 'lib/ui';

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

interface IComponentState {
    show_card: boolean;
}

export class CardEvaluationContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_card: false
        };
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
            <div>
                <Checkbox
                    onClick={e => {
                        e.stopPropagation();
                        this.setState({ show_card: true });
                    }}
                    style={{
                        display: 'inline-block',
                        backgroundColor:
                            !this.props.card_data.graded &&
                            this.props.card_data.processed
                                ? 'yellow'
                                : undefined,
                        zIndex: 1000
                    }}
                    disabled={
                        !this.props.card_data.processed ||
                        this.props.card.card_type === 'video' ||
                        this.props.card.card_type === 'text'
                    }
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
                        fill: UI.utils.get_grade_color(
                            this.props.card_data.score * 100
                        )
                    }}
                />
                <Dialog
                    title={this.props.card.name}
                    open={this.state.show_card}
                    onRequestClose={() => this.setState({ show_card: false })}
                    autoScrollBodyContent={true}
                    contentStyle={{ width: '100%' }}
                    actions={[
                        <RaisedButton
                            label="Close"
                            onClick={() => this.setState({ show_card: false })}
                        />
                    ]}
                >
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <Cards.CardViewContainer
                                card_id={this.props.card_id}
                                collection_id={this.props.collection_id}
                                user_id={this.props.user_id}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Cards.CardDataSettingsContainer
                                user_id={this.props.user_id}
                                collection_id={this.props.collection_id}
                                card_id={this.props.card_id}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
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
        case 'freetext':
            return <SVGFreetext />;
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
