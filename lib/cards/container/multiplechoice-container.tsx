// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import * as raven from 'raven-js';
import { convert_attachment_url } from '../utils';

// components
import MultiplechoiceComponent from 'lib/cards/components/multiplechoice';

// modules
import * as Cards from '../';
import * as Flow from 'lib/flow';
import { IState } from 'client/state';
import { RaisedButton } from 'material-ui';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    assignment_id: string;
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IMultiplechoiceCard;
    assignment: Flow.IAssignment;
    score: number;
    opened: number;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}
interface IProps extends IStateProps, IDispatchProps {}

export class MultiplechoiceCardViewContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.log = this.log.bind(this);

        this.state = {};
    }

    public log(msg: string) {
        log(msg);
    }

    public componentWillMount() {
        if (!this.props.opened) {
            this.props.dispatch(
                Flow.actions.change_assignment({ opened: new Date().getTime() })
            );
        }
    }

    public render() {
        const { card, assignment } = this.props;

        return (
            <div>
                <MultiplechoiceComponent
                    _id={card._id}
                    text={card.text}
                    items={card.items}
                    selected_items={assignment.state || []}
                    show_correct_values={assignment.score !== null}
                    cb={(items, score) => {
                        this.props.dispatch(
                            Flow.actions.change_assignment({ score })
                        );
                        assignment.score !== null
                            ? noop()
                            : this.props.dispatch(
                                  Flow.actions.update_assignments(
                                      [assignment._id],
                                      { state: items }
                                  )
                              );
                    }}
                />

                {assignment.score !== null ? null : (
                    <RaisedButton
                        label="Check"
                        primary={true}
                        fullWidth={true}
                        onClick={() =>
                            this.props.dispatch(
                                Flow.actions.update_assignments(
                                    [assignment._id],
                                    {
                                        score: this.props.score * 100,
                                        data: [
                                            {
                                                score: this.props.score,
                                                maxScore: 1,
                                                opened: this.props.opened,
                                                finished: new Date().getTime()
                                            }
                                        ]
                                    }
                                )
                            )
                        }
                    />
                )}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const assignment = Flow.selectors.assignment_by_id(
        state,
        ownProps.assignment_id
    );
    return {
        assignment,
        score: state.flow.ui.assignment.score,
        opened: state.flow.ui.assignment.opened,
        card_id: ownProps.card_id,
        assignment_id: ownProps.assignment_id,
        card: Cards.selectors.select_card(
            state,
            assignment.card_id
        ) as Cards.IMultiplechoiceCard
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
)(MultiplechoiceCardViewContainer);
