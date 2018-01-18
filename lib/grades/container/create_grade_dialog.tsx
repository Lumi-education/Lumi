import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import * as moment from 'moment';

// types
import { IState } from '../types';

// components

import {
    Dialog,
    TextField,
    FloatingActionButton,
    SelectField,
    MenuItem,
    Slider,
    RaisedButton
} from 'material-ui';

import SVGGrade from 'material-ui/svg-icons/action/grade';

// modules
import * as Grades from '../';
import { get_grade_color, get_grade_string } from 'lib/ui/utils';

const log = debug('lumi:lib:grades:container:creategradedialog');

interface IPassedProps {
    ref_id?: string;
}

interface IStateProps extends IPassedProps {
    open: boolean;
    user_id: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    grade_type?: number;
    note?: string;
    score?: number;
}

export class CreateGradeDialogContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            grade_type: 0,
            note: '',
            score: 0.5
        };

        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        log('componentWillMount');
    }

    public close() {
        this.props.dispatch(Grades.actions.hide_create_grade_dialog());
    }

    public render() {
        const grade = parseInt((this.state.score * 100).toFixed(0), 10);

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.close}
                actions={[
                    <RaisedButton label="Cancel" onClick={this.close} />,
                    <RaisedButton
                        label="OK"
                        primary={true}
                        onClick={() => {
                            this.props
                                .dispatch(
                                    Grades.actions.create_grade(
                                        this.props.user_id,
                                        Grade_types[this.state.grade_type],
                                        this.state.score,
                                        this.state.note,
                                        this.props.ref_id
                                    )
                                )
                                .then(res => this.close());
                        }}
                    />
                ]}
            >
                <SelectField
                    fullWidth={true}
                    floatingLabelText="Grade Type"
                    value={this.state.grade_type}
                    onChange={(e, v) => this.setState({ grade_type: v })}
                >
                    <MenuItem value={0} primaryText="Mitarbeit" />
                    <MenuItem value={1} primaryText="Test" />
                    <MenuItem value={2} primaryText="Worksheet" />
                </SelectField>
                <TextField
                    value={this.state.note}
                    onChange={(e, v) => this.setState({ note: v })}
                    floatingLabelText="Note"
                    fullWidth={true}
                    rows={2}
                />
                <Slider
                    value={this.state.score}
                    step={0.05}
                    onChange={(e, v) => this.setState({ score: v })}
                />
                <RaisedButton
                    fullWidth={true}
                    label={get_grade_string(grade) + ' (' + grade + '%)'}
                    backgroundColor={get_grade_color(grade)}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: state.grades.ui.user_id,
        ref_id: ownProps.ref_id,
        open: state.grades.ui.show_create_grades_dialog
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
)(CreateGradeDialogContainer);

enum Grade_types {
    'Mitarbeit',
    'Test',
    'Worksheet'
}
