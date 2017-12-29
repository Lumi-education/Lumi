import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import { Avatar, List, ListItem, Subheader, Divider, Paper } from 'material-ui';

// material-ui -> icons

// actions
import { push } from 'client/packages/ui/actions';

// selector
import {
    select_collections_for_user,
    IUserCollection
} from 'client/packages/collections/selectors';

// types
import { IState } from 'client/state';

interface IStateProps {
    collections: IUserCollection[];
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserAssignments extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Paper>
                <List>
                    <Subheader>Aufgaben</Subheader>
                    {this.props.collections
                        .filter(c => !c.submitted)
                        .map(c => (
                            <ListItem
                                key={c._id}
                                primaryText={c.name}
                                secondaryText={c.description}
                                onClick={() =>
                                    this.props.dispatch(
                                        push('/user/collections/' + c._id)
                                    )
                                }
                            />
                        ))}
                </List>
            </Paper>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        collections: select_collections_for_user(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserAssignments
);
