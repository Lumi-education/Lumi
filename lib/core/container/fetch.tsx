import * as React from 'react';
import {connect} from 'react-redux';

import * as Core from '..';

interface IPassedProps {
    query;
}

interface IStateProps {}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IPassedProps, IDispatchProps, IStateProps {}

interface IComponentState {
    loading: boolean;
}

export class FetchContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    public componentWillMount() {
        this.setState({loading: true});
        this.props.dispatch(Core.actions.find(this.props.query)).then(res => {
            this.setState({loading: false});
        });
    }

    public render() {
        return (
            <div>{this.state.loading ? 'loading' : this.props.children}</div>
        );
    }
}

function mapStateToProps(state: Core.IState, ownProps) {
    return {
        query: ownProps.query
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(FetchContainer);
