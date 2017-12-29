// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import { pinkA200, transparent } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';

import CreateUserDialog from './create_user_dialog';

import FilterBar from 'client/packages/ui/components/filter-bar';

// local
import { IState } from 'client/state';

// types
import { IGroup } from 'common/types';
import { IUser, UserListContainer } from 'client/packages/users';

// actions
import {
    create_user,
    get_users,
    delete_user
} from 'client/packages/users/actions';

interface IStateProps {
    users: IUser[];
    groups: Map<string, IGroup>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    filter?: string[];
    search_text?: string;
    show_create_user_dialog?: boolean;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            show_create_user_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <UserListContainer />
                <FloatingActionButton
                    onClick={() =>
                        this.setState({ show_create_user_dialog: true })
                    }
                    style={{
                        margin: '20px',
                        bottom: '0px',
                        right: '20px',
                        position: 'fixed'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>

                {this.state.show_create_user_dialog ? (
                    <CreateUserDialog
                        create_user={(name: string) =>
                            this.props.dispatch(create_user(name))
                        }
                        close={() =>
                            this.setState({ show_create_user_dialog: false })
                        }
                    />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        users: state.users.list,
        groups: state.groups.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminUsers
);
