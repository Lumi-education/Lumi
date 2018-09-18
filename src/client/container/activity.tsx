import * as React from 'react';
import * as debug from 'debug';
import { connect } from 'react-redux';

import * as moment from 'moment-timezone';

import { Card, CardHeader } from 'material-ui';

const log = debug('lumi:packages:cards:components:uploadcard');

import { IState } from 'client/state';
import * as Activity from 'lib/activity';

interface IPassedProps {
    activity_id: Activity.types.Activity_id;
}

interface IStateProps extends IPassedProps {
    activity: Activity.models.Activity;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class ActivityContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Card style={{ margin: '20px' }}>
                <CardHeader
                    title={this.props.activity.user_id}
                    subtitle={moment(this.props.activity.get_date())}
                />
            </Card>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        activity_id: ownProps.activity_id,
        activity: Activity.selectors.by_id(state, ownProps.activity_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(ActivityContainer);
