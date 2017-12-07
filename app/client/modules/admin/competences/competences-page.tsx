// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { IState } from 'client/state';

import { CompetenceListContainer } from 'lumi/competences';
import { create_competence } from 'lumi/competences/actions';

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {
    new_competence_name?: string;
    new_competence_description?: string;
}

export class AdminCompetencesPage extends React.Component<
    IDispatchProps,
    IComponentState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            new_competence_name: '',
            new_competence_description: ''
        };

        this.create_competence = this.create_competence.bind(this);
    }

    public create_competence() {
        if (this.state.new_competence_name !== '') {
            this.props.dispatch(
                create_competence(
                    this.state.new_competence_name,
                    this.state.new_competence_description
                )
            );
            this.setState({
                new_competence_name: '',
                new_competence_description: ''
            });
        }
    }

    public render() {
        return (
            <div>
                <Paper>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextField
                            style={{ flex: 4 }}
                            hintText="Competence"
                            value={this.state.new_competence_name}
                            onChange={(e, v) =>
                                this.setState({ new_competence_name: v })
                            }
                        />
                        <TextField
                            style={{ flex: 7 }}
                            hintText="Description"
                            value={this.state.new_competence_description}
                            onChange={(e, v) =>
                                this.setState({ new_competence_description: v })
                            }
                        />
                        <RaisedButton
                            style={{ flex: 1 }}
                            label="Add"
                            onClick={this.create_competence}
                        />
                    </div>
                </Paper>
                <CompetenceListContainer />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): {} {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCompetencesPage
);
