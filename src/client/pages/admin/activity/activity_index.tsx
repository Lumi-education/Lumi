// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

import {
    Card,
    CardHeader,
    Avatar,
    List,
    ListItem,
    FloatingActionButton,
    Paper
} from 'material-ui';

import * as moment from 'moment-timezone';

// svg
import SVGAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import SVGLogin from 'material-ui/svg-icons/action/input';
import SVGDefault from 'material-ui/svg-icons/action/info';

import TagFilterContainer from 'lib/tags/container/tag-filter';
import FilterBar from 'lib/ui/components/filter-bar';

// local
import { IState } from 'client/state';

// selectors
import * as Activity from 'lib/activity';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import assignment from '../../../../../node_modules/client/pages/user/assignment';

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
    // filter?: string[];
    // search_text?: string;
    // new_tag_name?: string;
    // new_tag_description?: string;
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
            // filter: [],
            // search_text: '',
            // new_tag_name: '',
            // new_tag_description: '',
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Aktivitäten', loading_step: 1 });
        this.props.dispatch(Activity.actions.get_activities()).then(res => {
            this.setState({ loading: 'Karten', loading_step: 2 });
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
                                            const _assignment = this.props.assignment(
                                                activity.assignment_id
                                            );
                                            return (
                                                'hat die Lernkarte ' +
                                                this.props.card(
                                                    _assignment.card_id
                                                ).name +
                                                ' mit ' +
                                                _assignment.get_score() +
                                                '%  beendet.'
                                            );
                                        case 'login':
                                            return 'hat sich angemeldet.';
                                        default:
                                            return ' ein Fehler ist aufgetreten';
                                    }
                                })()
                            }
                            subtitle={moment(activity.get_date())
                                .tz('Europe/Berlin')
                                .calendar()}
                        />
                    </Card>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        activities: Activity.selectors.last_30_activies(state, 30), // [
        //     {
        //         _id: 'test',
        //         user_id: 'adfjbuser_id',
        //         date: 'd',
        //         activity_type: 'login',
        //         type: 'activity',
        //         get_date: () => new Date()
        //     },
        //     {
        //         _id: 'test',
        //         user_id: '6926b39f6448a31a229852a5ce027be8',
        //         date: 'd',
        //         activity_type: 'assignment_completed',
        //         assignment_id: 'f477addad9c808b947ef1d968803537e',
        //         type: 'activity',
        //         get_date: () => new Date()
        //     }
        // ],
        user: (user_id: string) => Users.selectors.user(state, user_id),
        assignment: (assignment_id: string) =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id)
        //
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
