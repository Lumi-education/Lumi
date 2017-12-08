// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

// local
import { IState } from '../state';

interface IStateProps {
    userlevel: number;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class Landing extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(
            this.props.userlevel > 1 ? push('/admin') : push('/user')
        );
    }

    public render() {
        return <div />;
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        userlevel: state.auth.userlevel
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    Landing
);
