import * as React from 'react';
import * as debug from 'debug';
import { connect } from 'react-redux';

import { PieChart } from 'react-chartkick';

import * as moment from 'moment-timezone';

import {
    Card,
    CardHeader,
    CardText,
    CardActions,
    Badge,
    Table,
    RaisedButton,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
    Paper,
    DatePicker,
    FloatingActionButton
} from 'material-ui';
const log = debug('lumi:packages:cards:components:uploadcard');

import { IState } from 'client/state';

import * as Tags from 'lib/tags';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    cards: Cards.ICard[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class LessonContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div id="lesson">
                <Paper style={{ display: 'flex' }}>
                    <Groups.GroupsInput />
                </Paper>

                {this.props.cards.map(card => (
                    <Card style={{ margin: '20px' }}>
                        <CardHeader
                            title={card.name}
                            subtitle="24 zugewiesen"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1 }}>
                                    {' '}
                                    render card here{' '}
                                </div>
                                <div style={{ flex: 1 }}>
                                    {' '}
                                    <PieChart
                                        data={[
                                            ['Richtig', 50],
                                            ['Falsch', 30],
                                            ['Nicht beantwortet', 20]
                                        ]}
                                    />{' '}
                                </div>
                            </div>
                        </CardText>
                        <CardActions>
                            <RaisedButton primary={true} label="Anzeigen" />
                        </CardActions>
                    </Card>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        cards: [
            {
                _id: 'test',
                name: '1. Karte',
                type: 'card',
                card_type: 'multiplechoice',
                items: [],
                text: 'bla',
                tags: [],
                description: '',
                created_at: new Date(),
                _rev: '1',
                files: []
            },
            {
                _id: 'test',
                name: '2. Karte',
                type: 'card',
                card_type: 'multiplechoice',
                items: [],
                text: 'bla',
                tags: [],
                description: '',
                created_at: new Date(),
                _rev: '1',
                files: []
            }
        ]
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
)(LessonContainer);
