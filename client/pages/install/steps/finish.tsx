// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import { IState } from 'client/state';

import * as Core from 'lib/core';
import * as Auth from 'lib/auth';
import * as UI from 'lib/ui';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
    username: string;
    password: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({});

export class InstallFinishComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props
            .dispatch(
                Core.actions.init_db({
                    user: {
                        name: this.props.username,
                        password: this.props.password
                    }
                })
            )
            .then(init_db_res => {
                this.props.dispatch(
                    Auth.actions.login(this.props.username, this.props.password)
                );
            })
            .then(login_res => {
                this.props.dispatch(UI.actions.push('/admin'));
            });
    }

    public render() {
        const { classes } = this.props;
        return (
            <div>
                <LinearProgress />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        username: state.auth.username,
        password: state.auth.password
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(InstallFinishComponent)
);
