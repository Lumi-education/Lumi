// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

// components
import { CompetenceInputComponent } from '../';

// types
import { IState, ICompetence } from '../types';

// selectors
import {
    select_competence_ids_for_doc,
    select_competences_as_map
} from '../selectors';

// actions
import {
    create_competence_and_add_to_doc,
    get_competences,
    delete_competence,
    add_competence_to_doc,
    rem_competence_from_doc
} from '../actions';

interface IPassedProps {
    doc_id: string;
}

interface IStateProps extends IPassedProps {
    competences: Map<string, ICompetence>;
    competence_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CompetenceInputContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_competences());
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.doc_id !== this.props.doc_id) {
            this.props.dispatch(get_competences(nextProps.doc_id));
        }
    }

    public render() {
        const competences = this.props.competences;
        return (
            <CompetenceInputComponent
                competences={this.props.competences}
                competence_ids={this.props.competence_ids || []}
                add={competence => {
                    this.props.competences.get(competence._id)
                        ? this.props.dispatch(
                              add_competence_to_doc(
                                  this.props.doc_id,
                                  competence._id
                              )
                          )
                        : this.props.dispatch(
                              create_competence_and_add_to_doc(
                                  this.props.doc_id,
                                  competence.name
                              )
                          );
                }}
                delete={(competence_id: string) =>
                    this.props.dispatch(
                        rem_competence_from_doc(
                            this.props.doc_id,
                            competence_id
                        )
                    )
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        competences: select_competences_as_map(state),
        competence_ids: select_competence_ids_for_doc(state, ownProps.doc_id),
        doc_id: ownProps.doc_id
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
)(CompetenceInputContainer);
