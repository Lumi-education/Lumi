// modules
import * as React from 'react';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import AutoComplete from 'material-ui/AutoComplete';
import ChipInput from 'material-ui-chip-input';

import Competence from './competence';

import { ICompetence } from '../types';

interface IStateProps {
    competences: Map<string, ICompetence>;
    competence_ids: string[];
}

interface IDispatchProps {
    add: (competence: ICompetence) => void;
    delete: (competence_id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class CompetenceInput extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <ChipInput
                hintText="Competences"
                floatingLabelText="Competences"
                fullWidth={true}
                value={this.props.competence_ids.map(competence_id =>
                    this.props.competences.get(competence_id, {
                        _id: undefined,
                        name: 'competence not found',
                        type: 'competence',
                        short_name: 'err',
                        description: 'this competence was not found',
                        color: 'red',
                        created_at: new Date()
                    })
                )}
                chipRenderer={(
                    {
                        value,
                        isFocused,
                        isDisabled,
                        handleClick,
                        handleRequestDelete,
                        defaultStyle
                    },
                    key
                ) => (
                    <Competence
                        key={key}
                        competences={this.props.competences}
                        competence_id={value}
                        delete={handleRequestDelete}
                    />
                )}
                allowDuplicates={false}
                dataSource={this.props.competences.toArray()}
                dataSourceConfig={{ text: 'name', value: '_id' }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={this.props.add}
                onRequestDelete={this.props.delete}
            />
        );
    }
}
