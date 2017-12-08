import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// container
import CompetenceListItemContainer from '../container/competence-list-item';
// types
import { ICompetence } from '../types';

interface IProps {
    competences: ICompetence[];
}

export default class CompetenceListComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <List>
                {this.props.competences.map(competence => (
                    <CompetenceListItemContainer
                        competence_id={competence._id}
                    />
                ))}
            </List>
        );
    }
}
