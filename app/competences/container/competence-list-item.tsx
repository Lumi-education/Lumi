// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

// components
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

// types
import { ICompetence, IState } from '../types';

// selectors
import { select_competence } from '../selectors';

// actions
import {
    create_competence_and_add_to_doc,
    get_competences,
    delete_competence
} from '../actions';

interface IPassedProps {
    competence_id: string;
}

interface IStateProps extends IPassedProps {
    competence: ICompetence;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CompetenceListItemContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const competence = this.props.competence;
        return (
            <div>
                <ListItem
                    leftAvatar={
                        <Avatar
                            style={{
                                background:
                                    competence.color ||
                                    'linear-gradient(120deg, #8e44ad, #3498db)'
                            }}
                        >
                            {competence.short_name ||
                                competence.name.substring(0, 3)}
                        </Avatar>
                    }
                    primaryText={competence.name}
                    secondaryText={
                        competence.description ||
                        'this competence has no description'
                    }
                    rightIconButton={rightIconMenu([
                        <MenuItem
                            onClick={() =>
                                this.props.dispatch(
                                    delete_competence(competence._id)
                                )
                            }
                        >
                            Delete
                        </MenuItem>
                    ])}
                />
                <Divider inset={true} />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        competence: select_competence(state, ownProps.competence_id),
        competence_id: ownProps.competence_id
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
)(CompetenceListItemContainer);

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
