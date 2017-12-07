// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { Map } from 'immutable';

// components
import { CompetenceInputComponent } from '../';

// types
import { IState, ICompetence } from '../types';

// selectors
import { select_competence_by_doc_id } from '../selectors';

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
    competence: ICompetence;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {
    requested: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CompetenceContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            requested: false
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!nextProps.competence._id && !this.state.requested) {
            this.props.dispatch(get_competences(nextProps.doc_id));
            this.setState({ requested: true });
        }
    }

    public render() {
        return (
            <div
                style={{
                    overflow: 'hidden',
                    margin: '4px 0px 0px',
                    color: this.props.competence._id
                        ? 'rgba(0, 0, 0, 0.541176)'
                        : 'red',
                    lineHeight: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    height: '16px'
                }}
            >
                {this.props.competence.name}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        competence: select_competence_by_doc_id(state, ownProps.doc_id),
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
)(CompetenceContainer);
