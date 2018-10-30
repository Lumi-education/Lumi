// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { Card, CardHeader, Avatar } from 'material-ui';

import * as moment from 'moment-timezone';

// svg
import SVGAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import SVGLogin from 'material-ui/svg-icons/action/input';
import SVGDefault from 'material-ui/svg-icons/action/info';
import SVGComment from 'material-ui/svg-icons/communication/comment';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Activity from 'lib/activity';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    activities: Activity.models.Activity[];
    user: (user_id: string) => Users.IUser;
    assignment: (assignment_id: string) => Flow.models.Assignment;
    card: (card_id: string) => Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
}

export class AdminActivityIndex extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: Core.i18n.t('activities'), loading_step: 1 });
        this.props.dispatch(Activity.actions.get_activities()).then(res => {
            this.setState({ loading: Core.i18n.t('cards'), loading_step: 2 });
            this.props.dispatch(Cards.actions.get_cards()).then(cards_res => {
                this.setState({ loading: 'finished', loading_step: 3 });
            });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={3}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }
        return (
            <div style={{}}>
                {this.props.activities.map(activity => (
                    <div
                        key={activity._id}
                        onClick={() => {
                            if (
                                activity.activity_type === 'comment' ||
                                activity.activity_type ===
                                    'assignment_completed'
                            ) {
                                this.props.dispatch(
                                    Flow.actions.toggle_dialog()
                                );
                                this.props.dispatch(
                                    Flow.actions.change_assignment(
                                        this.props.assignment(
                                            activity.assignment_id
                                        )
                                    )
                                );
                            }
                        }}
                    >
                        <Card style={{ margin: '20px' }}>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        {(() => {
                                            switch (activity.activity_type) {
                                                case 'assignment_completed':
                                                    return (
                                                        <SVGAssignmentTurnedIn />
                                                    );
                                                case 'login':
                                                    return <SVGLogin />;
                                                case 'comment':
                                                    return <SVGComment />;
                                                default:
                                                    return <SVGDefault />;
                                            }
                                        })()}
                                    </Avatar>
                                }
                                title={
                                    this.props.user(activity.user_id).name +
                                    ' ' +
                                    (() => {
                                        switch (activity.activity_type) {
                                            case 'assignment_completed':
                                                let _assignment = this.props.assignment(
                                                    activity.assignment_id
                                                );
                                                return Core.i18n.t(
                                                    'activity_assignment_completed',
                                                    {
                                                        cardname: this.props.card(
                                                            _assignment.card_id
                                                        ).name,
                                                        score: _assignment.get_score()
                                                    }
                                                );
                                            case 'login':
                                                return Core.i18n.t(
                                                    'activity_login'
                                                );
                                            case 'comment':
                                                _assignment = this.props.assignment(
                                                    activity.assignment_id
                                                );
                                                return Core.i18n.t(
                                                    'activity_comment',
                                                    {
                                                        cardname: this.props.card(
                                                            _assignment.card_id
                                                        ).name
                                                    }
                                                );
                                            default:
                                                return Core.i18n.t('error');
                                        }
                                    })()
                                }
                                subtitle={moment(activity.get_date())
                                    .tz('Europe/Berlin')
                                    .calendar()}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        activities: Activity.selectors.last_30_activies(state, 30),
        user: (user_id: string) => Users.selectors.user(state, user_id),
        assignment: (assignment_id: string) =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id)
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
)(AdminActivityIndex);
