// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Avatar, Paper, Divider, List, ListItem } from 'material-ui';

import FilterBar from 'lib/ui/components/filter-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CreateGroupDialog from './create_group_dialog';

// types
import { IState } from 'client/state';

// modules
import * as Groups from 'lib/groups';
import * as UI from 'lib/ui';

interface IStateProps {
    groups: Groups.IGroup[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_create_group_dialog?: boolean;
    search_text?: string;
    loading?: string;
    loading_step?: number;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: '',
            show_create_group_dialog: false,
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Gruppen', loading_step: 1 });
        this.props.dispatch(Groups.actions.get_groups()).then(res => {
            this.setState({ loading: 'finished', loading_step: 2 });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    max={2}
                    min={0}
                    value={this.state.loading_step}
                >
                    Lade Gruppe
                </UI.components.LoadingPage>
            );
        }

        return (
            <div>
                <Paper>
                    <FilterBar
                        filter={this.state.search_text}
                        set_filter={filter =>
                            this.setState({ search_text: filter })
                        }
                    />
                </Paper>
                <Paper>
                    <List>
                        {this.props.groups
                            .filter(group => {
                                return this.state.search_text === ''
                                    ? true
                                    : group.name
                                          .toLocaleLowerCase()
                                          .indexOf(
                                              this.state.search_text.toLocaleLowerCase()
                                          ) > -1;
                            })
                            .map(group => (
                                <div key={group._id}>
                                    <ListItem
                                        leftAvatar={
                                            <Avatar>
                                                {group.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        primaryText={group.name}
                                        onClick={() =>
                                            this.props.dispatch(
                                                UI.actions.push(
                                                    '/admin/groups/' + group._id
                                                )
                                            )
                                        }
                                    />
                                    <Divider inset={true} />
                                </div>
                            ))}
                    </List>
                </Paper>
                <FloatingActionButton
                    onClick={() =>
                        this.setState({ show_create_group_dialog: true })
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
                {this.state.show_create_group_dialog ? (
                    <CreateGroupDialog
                        create_group={(name: string) =>
                            this.props.dispatch(
                                Groups.actions.create_group(name)
                            )
                        }
                        close={() =>
                            this.setState({ show_create_group_dialog: false })
                        }
                    />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        groups: Groups.selectors.groups_list(state)
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
)(AdminGroups);
