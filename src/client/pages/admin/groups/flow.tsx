// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {uniq} from 'lodash';
// types
import {ActionBar} from 'lib/ui';
import {IState} from 'client/state';

import {
    Avatar,
    Paper,
    LinearProgress,
    Card,
    CardActions,
    CardHeader,
    CardText,
    FloatingActionButton,
    FlatButton
} from 'material-ui';

import AssignMaterialDialog from '../dialogs/assign_material';

import {Pie} from 'react-chartjs-2';

import * as core from 'lib/core';
import * as flow from 'lib/flow';
import * as cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
// actions
interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    // assignment : (_id : string) => flow.IAssignment;
    card_name: (_id: string) => string;
    user_count: (_id: string) => number;
    group: Groups.IGroup;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroupFlow extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: true
        };
    }

    public componentWillMount() {
        this.props
            .dispatch(
                core.actions.find(
                    {
                        type: 'assignment',
                        assignment_id: {
                            $in: this.props.group.flow_order
                        }
                    },
                    {limit: 900}
                )
            )
            .then(res => {
                const card_ids: string[] = uniq(
                    res.payload.map(c => c.card_id)
                ) as string[];
                this.props
                    .dispatch(cards.actions.get_cards(card_ids))
                    .then(r => {
                        this.setState({loading: false});
                    });
            });

        // this.props.dispatch(
        //     Users.actions.set_selected_users(this.props.user_ids)
        // );
    }

    public render() {
        if (this.state.loading) {
            return <div>loading</div>;
        }

        return (
            <div>
                <ActionBar>
                    <AssignMaterialDialog group_id={this.props.group_id} />
                </ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        // assignment: (assignment_id : string) => flow     .selectors
        // .assignment_by_assignment_id(state, assignment_id),
        user_count: (_id: string) => 5,
        // flow     .selectors     .user_count_for_assignment(state, _id),
        group_id: ownProps.group_id,
        card_name: (_id: string) => cards.selectors.name(state, _id),
        group: Groups.selectors.select_group(state, ownProps.group_id)
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
)(AdminGroupFlow);
