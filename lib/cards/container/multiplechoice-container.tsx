// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { RaisedButton } from 'material-ui';
import MultiplechoiceComponent from '../components/multiplechoice';

// modules
import * as Cards from '../';
import * as Flow from 'lib/flow';
import { IState } from 'client/state';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    assignment_id: string;
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IMultiplechoiceCard;
    assignment: Flow.models.Assignment;
    score: number;
    opened: number;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    items?: string[];
    score?: number;
    opened?: number;
}
interface IProps extends IStateProps, IDispatchProps {}

export class MultiplechoiceCardViewContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.log = this.log.bind(this);

        this.state = {
            items: [],
            score: 0,
            opened: new Date().getTime()
        };
    }

    public log(msg: string) {
        log(msg);
    }

    public componentWillMount() {
        if (!this.props.opened) {
            this.setState({ opened: new Date().getTime() });
        }
    }

    public render() {
        const { card, assignment } = this.props;

        return (
            <div>
                <MultiplechoiceComponent
                    card_id={this.props.card_id}
                    text={card.text}
                    items={card.items}
                    selected_items={assignment.state || this.state.items || []}
                    show_correct_values={assignment.get_score() !== null}
                    cb={(items, score) => {
                        this.setState({ items, score });
                    }}
                />

                {assignment.get_score() !== null ? null : (
                    <RaisedButton
                        label="Check"
                        primary={true}
                        fullWidth={true}
                        onClick={() => {
                            this.props.dispatch(
                                Flow.actions.save_data(assignment._id, {
                                    score: this.state.score,
                                    maxScore: 1,
                                    opened: this.state.opened,
                                    finished: new Date().getTime(),
                                    state: this.state.items
                                })
                            );
                        }}
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
