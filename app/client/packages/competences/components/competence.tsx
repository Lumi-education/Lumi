// modules
import * as React from 'react';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import { ICompetence } from '../types';

interface IStateProps {
    competences: Map<string, ICompetence>;
    competence_id: string;
}

interface IDispatchProps {
    delete?: (event) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class Competence extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const competence = this.props.competences.get(
            this.props.competence_id,
            {
                _id: undefined,
                name: 'competence not found',
                type: 'competence',
                short_name: 'err',
                description: 'this competence was not found',
                color: 'red',
                created_at: new Date()
            }
        );

        return (
            <Chip
                backgroundColor={competence.color}
                onRequestDelete={this.props.delete}
            >
                <Avatar size={32}>
                    {competence.short_name || competence.name.substring(0, 3)}
                </Avatar>
                {competence.name}
            </Chip>
        );
    }
}
