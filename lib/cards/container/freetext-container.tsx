// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import FreetextComponent from '../components/freetext';

import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Cards from '../';
import * as Flow from 'lib/flow';
import * as UI from 'lib/ui';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    user_id?: string;
    card_id: string;
    assignment_id: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IFreetextCard;
    assignment: Flow.models.Assignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
    answer?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class FreetextCardContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            status: 'init',
            answer: ''
        };

        this.log = this.log.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    public log(msg: string) {
        log(msg);
        this.setState({ status: msg });
    }

    public componentWillMount() {
        this.setState({ answer: this.props.assignment.state });
    }

    public handleInput(answer: string) {
        this.setState({ answer });
    }

    public render() {
        const { card } = this.props;

        if (card) {
            return (
                <div>
                    <FreetextComponent
                        card_id={card._id}
                        text={card.text}
                        answer={this.state.answer}
                        cb={this.handleInput}
                        preview={card.preview}
                    />
                    {this.state.answer ===
                    this.props.assignment.state ? null : (
                        <UI.components.RaisedButton
                            action={Flow.actions.save_state(
                                this.props.assignment_id,
                                this.state.answer
                            )}
                            labels={[
                                Core.i18n.t('save'),
                                Core.i18n.t('saving'),
                                Core.i18n.t('saved'),
                                Core.i18n.t('error')
                            ]}
                            disabled={false}
                            fullWidth={true}
                        />
                    )}
                </div>
            );
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;
    const assignment_id = ownProps.assignment_id;

    return {
        user_id,
        assignment_id,
        card_id: ownProps.card_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IFreetextCard,
        assignment: Flow.selectors.assignment_by_id(state, assignment_id)
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
)(FreetextCardContainer);
