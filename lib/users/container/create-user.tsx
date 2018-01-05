// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'lib/ui/actions';

import { FloatingActionButton } from 'material-ui';

import ContentAdd from 'material-ui/svg-icons/content/add';

// state
import { IState } from 'client/state';

// modules
import * as Users from 'lib/users';

interface IPassedProps {}
interface IStateProps extends IPassedProps {}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class CreateUserContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <FloatingActionButton
                onClick={() => {
                    this.props
                        .dispatch(Users.actions.create_user('new user'))
                        .then(res =>
                            this.props.dispatch(
                                push('/admin/users/' + res.payload._id)
                            )
                        );
                }}
            >
                <ContentAdd />
            </FloatingActionButton>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CreateUserContainer);
