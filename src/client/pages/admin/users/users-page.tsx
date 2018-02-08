// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';
import FilterBar from 'lib/ui/components/filter-bar';
import ActionBar from 'lib/ui/components/action-bar';

import UserList from 'client/composites/user-list';
// state
import { IState } from 'client/state';

// modules
import * as User from 'lib/users';

interface IStateProps {}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(User.actions.get_users());
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
                <Paper>
                    <UserList
                        filter={user => {
                            return this.state.search_text === ''
                                ? true
                                : user.name
                                      .toLocaleLowerCase()
                                      .indexOf(
                                          this.state.search_text.toLocaleLowerCase()
                                      ) > -1;
                        }}
                    />
                </Paper>
                <ActionBar>
                    <User.CreateUserContainer />
                </ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminUsers);
