// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

import {
    Avatar,
    Divider,
    List,
    ListItem,
    IconMenu,
    MenuItem,
    IconButton
} from 'material-ui';
import SVGGrade from 'material-ui/svg-icons/action/grade';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SVGPreview from 'material-ui/svg-icons/image/remove-red-eye';

// local
import { IState } from '../types';

// types
import * as Users from 'lib/users';

// actions
import { create_user, get_users, delete_user } from 'lib/users/actions';

// modules
import * as Grades from 'lib/grades';

interface IPassedProps {
    filter: (user: Users.IUser) => boolean;
}

interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public render() {
        const users = this.props.users.filter(this.props.filter);

        return (
            <List>
                {users.length === 0 ? (
                    <ListItem primaryText="No users found" />
                ) : null}
                {users.map(user => (
                    <div key={user._id}>
                        <ListItem
                            onClick={() =>
                                this.props.dispatch(
                                    Users.actions.select_user(user._id)
                                )
                            }
                            rightIconButton={
                                <IconMenu iconButtonElement={iconButtonElement}>
                                    <MenuItem
                                        leftIcon={<SVGPreview />}
                                        onClick={() =>
                                            this.props.dispatch(
                                                push('/admin/users/' + user._id)
                                            )
                                        }
                                    >
                                        View
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            this.props.dispatch(
                                                Grades.actions.show_create_grade_dialog(
                                                    user._id
                                                )
                                            )
                                        }
                                        leftIcon={<SVGGrade />}
                                    >
                                        Grade
                                    </MenuItem>
                                </IconMenu>
                            }
                            leftAvatar={
                                <Avatar
                                    style={{
                                        background:
                                            this.props.selected_users.indexOf(
                                                user._id
                                            ) > -1
                                                ? 'linear-gradient(120deg, #8e44ad, #3498db)'
                                                : 'grey'
                                    }}
                                >
                                    {user.name.substring(0, 3)}
                                </Avatar>
                            }
                            primaryText={user.name}
                            secondaryText={
                                user.last_active
                                    ? moment(user.last_active)
                                          .tz('Europe/Berlin')
                                          .fromNow()
                                    : 'never'
                            }
                        />
                        <Divider inset={true} />
                    </div>
                ))}
                <Grades.CreateGradeDialogContainer />
            </List>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        filter: ownProps.filter,
        selected_users: state.users.ui.selected_users
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
)(UserListContainer);

const iconButtonElement = (
    <IconButton touch={true}>
        <MoreVertIcon />
    </IconButton>
);
