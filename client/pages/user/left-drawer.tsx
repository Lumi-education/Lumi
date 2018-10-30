import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import {
    Avatar,
    AppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    Subheader,
    Divider
} from 'material-ui';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGAssignments from 'material-ui/svg-icons/action/assignment';
import SVGCheckbox from 'material-ui/svg-icons/navigation/check';
import SVGCheckboxIndeterminate from 'material-ui/svg-icons/toggle/radio-button-unchecked';

// actions
import { push, left_drawer_close } from 'lib/ui/actions';
import { logout } from 'lib/auth/actions';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
    user_id: string;
    user: Users.IUser;
    username: string;
    assignment: (assignment_id: string) => Flow.models.Assignment;
    flow: string[];
    card: (card_id: string) => Cards.ICard;
    group: (group_id: string) => Groups.IGroup;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserLeftDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.props.left_drawer_show}
                    swipeAreaWidth={150}
                    onRequestChange={() =>
                        this.props.dispatch(left_drawer_close())
                    }
                    containerStyle={{ backgroundColor: '#FFFFFF' }}
                >
                    <AppBar
                        title={this.props.username}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonClick={() =>
                            this.props.dispatch(left_drawer_close())
                        }
                    />

                    <List>
                        <ListItem
                            primaryText={Core.i18n.t('assignments')}
                            leftIcon={<SVGAssignments />}
                            initiallyOpen={true}
                            nestedItems={this.props.flow.map(
                                (assignment_id: string) => {
                                    const assignment = this.props.assignment(
                                        assignment_id
                                    );
                                    if (assignment.completed) {
                                        return null;
                                    }
                                    const card = this.props.card(
                                        assignment.card_id
                                    );

                                    return (
                                        <ListItem
                                            leftAvatar={
                                                <Avatar>
                                                    <Cards.components.CardType
                                                        card_type={
                                                            card.card_type
                                                        }
                                                    />
                                                </Avatar>
                                            }
                                            rightIcon={(() => {
                                                if (
                                                    assignment.state !== null &&
                                                    assignment.get_score() !==
                                                        null
                                                ) {
                                                    return <SVGCheckbox />;
                                                }

                                                if (
                                                    assignment.state !== null &&
                                                    assignment.get_score() ===
                                                        null
                                                ) {
                                                    return (
                                                        <SVGCheckboxIndeterminate />
                                                    );
                                                }
                                            })()}
                                            key={assignment._id}
                                            primaryText={card.name}
                                            secondaryText={card.description}
                                            onClick={() =>
                                                this.props.dispatch(
                                                    push(
                                                        '/user/assignment/' +
                                                            assignment_id
                                                    )
                                                )
                                            }
                                        />
                                    );
                                }
                            )}
                            onClick={() =>
                                this.props.dispatch(push('/user/flow'))
                            }
                        />
                        <ListItem
                            primaryText={Core.i18n.t('logout')}
                            leftIcon={<SVGPower />}
                            onClick={() => {
                                this.props.dispatch(push('/'));
                                this.props.dispatch(logout());
                            }}
                        />
                        <Divider />
                        <Subheader>{process.env.VERSION}</Subheader>
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        left_drawer_show: state.ui.left_drawer_show,
        user: state.users.me,
        user_id: state.auth.user_id,
        username: state.auth.username,
        flow: state.users.me.flow || [],
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),

        group: group_id => Groups.selectors.select_group(state, group_id)
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
)(UserLeftDrawer);
