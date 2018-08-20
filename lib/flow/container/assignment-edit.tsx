// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { push } from '../../ui/actions';
import * as debug from 'debug';
import Dropzone from 'react-dropzone';
import * as request from 'superagent';

// components
import {
    Checkbox,
    TextField,
    SelectField,
    MenuItem,
    Paper,
    Slider
} from 'material-ui';
import ActionBar from '../../ui/components/action-bar';

import * as Cards from '..';
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';

const log = debug('lumi:container:cards:card-edit');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    assignment: Flow.models.Assignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AssignmentEditContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        // this.props.dispatch(Cards.actions.get_card(this.props.card_id));
    }

    public render() {
        return (
            <div>
                <Paper
                    style={{
                        backgroundColor: Core.utils.get_grade_color(
                            this.props.assignment.score
                        ),
                        margin: '15px',
                        padding: '20px'
                    }}
                >
                    <Slider
                        name="Bewertung"
                        value={this.props.assignment.score}
                        max={100}
                        min={0}
                        step={1}
                        onChange={(e, v) =>
                            this.props.dispatch(
                                Flow.actions.change_assignment({
                                    score: v,
                                    finished:
                                        this.props.assignment.finished ||
                                        new Date().getTime()
                                })
                            )
                        }
                    />
                    {this.props.assignment.score} %
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: Flow.IState, ownProps): IStateProps {
    return {
        assignment: new Flow.models.Assignment(state.flow.ui.assignment)
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
)(AssignmentEditContainer);
