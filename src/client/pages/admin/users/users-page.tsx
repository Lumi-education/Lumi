// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';
import FilterBar from 'lib/ui/components/filter-bar';
import ActionBar from 'lib/ui/components/action-bar';

// state
import { IState } from 'client/state';

// modules
import * as Users from 'lib/users';

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
        this.props.dispatch(Users.actions.get_users());
    }

    public componentWillUnmount() {
        this.props.dispatch(Users.actions.selection_reset());
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
                <Paper>Add userlist</Paper>
                <ActionBar>
                    <Users.CreateUserContainer />
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
