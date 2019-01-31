import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// material-ui
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

// svg
import * as Material from 'lib/material';
import SVGCheckbox from 'material-ui/svg-icons/navigation/check';
import SVGCheckboxIndeterminate from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import SVGComment from 'material-ui/svg-icons/communication/comment';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as UI from 'lib/ui';
import * as Comments from 'lib/comments';

const log_info = debug('lumi:pages:user:flow');

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    assignments: Flow.models.Assignment[];
    material: (material_id: string) => Material.models.Material;
    // assignment: (assignment_id: string) => Flow.models.Assignment;
    // flow: string[];
    // card: (card_id: string) => Cards.ICard;
    // unread_comments: (assignment_id: string) => Comments.models.Comment[];
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlow extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        log_info('componentWillMount');
    }

    public render() {
        return (
            <Paper>
                <List component="nav">
                    {this.props.assignments.map(a => {
                        const material = this.props.material(a.material_id);
                        return (
                            <ListItem
                                key={a._id}
                                onClick={() =>
                                    this.props.dispatch(
                                        UI.actions.push(
                                            '/user/assignment/' + a._id
                                        )
                                    )
                                }
                            >
                                <Material.components.Avatar
                                    material={material}
                                />
                                <ListItemText primary={material.name} />
                                <ListItemSecondaryAction>
                                    <Checkbox checked={a.completed} />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        assignments: Flow.selectors.assignment_by_ids(
            state,
            state.users.me.flow
        ),
        material: (material_id: string) =>
            Material.selectors.material(state, material_id)
        // assignment: assignment_id =>
        //     Flow.selectors.assignment_by_id(state, assignment_id),
        // flow: state.users.me.flow || [],
        // card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        // unread_comments: (assignment_id: string) =>
        //     Comments.selectors.unread(state, assignment_id, state.users.me._id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserFlow);
