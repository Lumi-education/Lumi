// modules
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as Core from 'lib/core';
import * as Users from 'lib/users';

interface IPassedProps {
    user_ids: string[];
    onChange: (new_user_ids: string[]) => void;
}

interface IStateProps extends IPassedProps {
    classes: any;

    user: (user_id: string) => Users.IUser;
    users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UsersChipInputContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
    }

    public render() {
        const { classes } = this.props;

        return (
            <Select
                value={this.props.user_ids.map(user_id => {
                    const user = this.props.user(user_id);
                    return { value: user._id, label: user.name };
                })}
                isMulti={true}
                name={Core.i18n.t('user')}
                onChange={e => this.props.onChange(e.map(v => v.value))}
                options={this.props.users.map(user => {
                    return { value: user._id, label: user.name };
                })}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        );
    }
}

function mapStateToProps(state: Users.IState, ownProps): IStateProps {
    return {
        user: (user_id: string) => Users.selectors.user(state, user_id),
        user_ids: ownProps.user_ids,
        classes: ownProps.classes,
        onChange: ownProps.onChange,
        users: state.users.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UsersChipInputContainer)
);
