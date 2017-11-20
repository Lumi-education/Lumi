// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import FilterBar from 'client/packages/ui/components/filter-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';

import CreateGroupDialog from './create_group_dialog';

// selectors
import { groups_list } from 'client/packages/groups/selectors';

// types
import { IState } from 'client/state';
import { IGroup } from 'common/types';

// actions
import {
    get_groups,
    delete_group,
    create_group
} from 'client/packages/groups/actions';

interface IStateProps {
    groups: IGroup[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_create_group_dialog?: boolean;
    search_text?: string;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: '',
            show_create_group_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_groups());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })}
                />
                <List>
                    {this.props.groups
                        .filter(user => {
                            return this.state.search_text === ''
                                ? true
                                : user.name
                                      .toLocaleLowerCase()
                                      .indexOf(
                                          this.state.search_text.toLocaleLowerCase()
                                      ) > -1;
                        })
                        .map(group => (
                            <div>
                                <ListItem
                                    leftAvatar={
                                        <Avatar>
                                            {group.name.substring(0, 3)}
                                        </Avatar>
                                    }
                                    primaryText={group.name}
                                    onClick={() =>
                                        this.props.dispatch(
                                            push('/admin/groups/' + group._id)
                                        )}
                                />
                                <Divider inset={true} />
                            </div>
                        ))}
                </List>
                <FloatingActionButton
                    onClick={() =>
                        this.setState({ show_create_group_dialog: true })}
                    style={{
                        margin: '20px',
                        bottom: '0px',
                        right: '20px',
                        position: 'fixed'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
                {this.state.show_create_group_dialog ? (
                    <CreateGroupDialog
                        create_group={(name: string) =>
                            this.props.dispatch(create_group(name))}
                        close={() =>
                            this.setState({ show_create_group_dialog: false })}
                    />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        groups: groups_list(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminGroups
);
