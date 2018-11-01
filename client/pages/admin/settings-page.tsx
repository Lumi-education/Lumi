import * as React from 'react';
import { connect } from 'react-redux';

// svg
import { UserSettingsContainer } from 'client/container';

// types
import { IState } from 'client/state';

// modules

interface IPassedProps {}
interface IStateProps extends IPassedProps {}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserSettings extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return <UserSettingsContainer />;
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

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserSettings);
