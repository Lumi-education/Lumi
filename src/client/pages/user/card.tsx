import * as React from 'react';
import {connect} from 'react-redux';

// material-ui
import {
    Avatar,
    List,
    ListItem,
    Subheader,
    Divider,
    Paper,
    BottomNavigation,
    BottomNavigationItem
} from 'material-ui';

import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGAssignment from 'material-ui/svg-icons/action/assignment';

// material-ui -> icons
import * as moment from 'moment-timezone';
// actions
import {push} from 'lib/ui/actions';

// types
import {IState} from 'client/state';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import {assign} from 'lib/flow/actions';

interface IStateProps {
    course_id: string;
    assignment_id: string;
    assignment: Flow.IAssignment;
    flow: string[];
    card: (card_id: string) => Cards.ICard;
    user_id: string;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlow extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};

        this.init = this.init.bind(this);
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.assignment_id !== this.props.assignment_id) {
            this.init(nextProps.assignment_id);
        }
    }

    public componentWillMount() {
        this.init(this.props.assignment_id);
    }

    public init(assignment_id: string) {
        this.props
            .dispatch(Core.actions.get(assignment_id))
            .then(assignment_response => {
                const assignment = assignment_response.payload[0];
                this.props
                    .dispatch(Cards.actions.get_card(assignment.card_id))
                    .then(card_response => {
                        this.props.dispatch(
                            UI.actions.set_appbar_title(
                                card_response.payload[0].name
                            )
                        );
                    });
            });
    }

    public render() {
        return (
            <div>
                <Paper>
                    <Cards.CardViewContainer
                        user_id={this.props.user_id}
                        card_id={this.props.assignment.card_id}
                        collection_id={this.props.assignment_id}
                    />
                </Paper>
                <BottomNavigation
                    style={{
                        position: 'fixed',
                        bottom: '0px',
                        left: '0px',
                        right: '0px',
                        zIndex: 501
                    }}
                >
                    <BottomNavigationItem
                        onClick={() =>
                            this.props.dispatch(
                                push(
                                    '/user/course/' +
                                        this.props.course_id +
                                        '/flow/' +
                                        this.props.flow[
                                            this.props.flow.indexOf(
                                                this.props.assignment_id
                                            ) - 1
                                        ]
                                )
                            )
                        }
                        style={{
                            display:
                                this.props.flow[0] === this.props.assignment_id
                                    ? 'none'
                                    : 'block'
                        }}
                        icon={<SVGLeft />}
                    />

                    {/* <BottomNavigationItem
                        icon={<SVGAssignment />}
                        label={'test'}
                    /> */}

                    <BottomNavigationItem
                        onClick={() =>
                            this.props.dispatch(
                                push(
                                    '/user/course/' +
                                        this.props.course_id +
                                        '/flow/' +
                                        this.props.flow[
                                            this.props.flow.indexOf(
                                                this.props.assignment_id
                                            ) + 1
                                        ]
                                )
                            )
                        }
                        style={{
                            display:
                                this.props.flow[this.props.flow.length - 1] ===
                                this.props.assignment_id
                                    ? 'none'
                                    : 'block'
                        }}
                        icon={<SVGRight />}
                    />
                </BottomNavigation>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const course_id = ownProps.params.course_id;
    return {
        course_id,
        assignment: Flow.selectors.assignment_by_id(
            state,
            ownProps.params.assignment_id
        ),
        assignment_id: ownProps.params.assignment_id,
        flow: state.users.me.flow[course_id] || [],
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        user_id: state.users.me._id
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
)(UserFlow);
