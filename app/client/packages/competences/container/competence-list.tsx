// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SVGContentCreate from 'material-ui/svg-icons/content/create';
import {
    grey400,
    darkBlack,
    lightBlack,
    pinkA200,
    transparent
} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import FilterBar from 'client/packages/ui/components/filter-bar';
import CompetenceListComponent from '../components/competence-list';
// local

// types
import { ICompetence, IState } from '../types';

// selectors
import { select_all_competences } from '../selectors';

// actions
import {
    get_competences,
    create_competence,
    delete_competence
} from '../actions';

interface IStateProps {
    competences: ICompetence[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    filter?: string;
}

export class CompetenceListContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_competences());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.filter}
                    set_filter={filter => this.setState({ filter })}
                />
                <Paper>
                    <CompetenceListComponent
                        competences={this.props.competences.filter(
                            competence => {
                                return this.state.filter === ''
                                    ? true
                                    : (competence.name + competence.description)
                                          .toLocaleLowerCase()
                                          .indexOf(
                                              this.state.filter.toLocaleLowerCase()
                                          ) > -1;
                            }
                        )}
                    />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        competences: select_all_competences(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    CompetenceListContainer
);

const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400} />
    </IconButton>
);

function rightIconMenu(menuItems) {
    return (
        <IconMenu iconButtonElement={iconButtonElement}>{menuItems}</IconMenu>
    );
}
