import * as React from 'react';
import * as debug from 'debug';
import { connect } from 'react-redux';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import * as classNames from 'classnames';
import { PieChart } from 'react-chartkick';

import {
    Card,
    CardHeader,
    CardText,
    CardActions,
    RaisedButton,
    Paper
} from 'material-ui';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const log = debug('lumi:packages:cards:components:uploadcard');

import { IState } from 'client/state';

import * as Tags from 'lib/tags';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';

const styles: StyleRulesCallback = theme => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15)
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20
    },
    details: {
        alignItems: 'center'
    },
    column: {
        flexBasis: '33.33%'
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
});

interface IPassedProps {
    classes: any;
}

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
        const { classes } = this.props;

        return (
            <div id="lesson">
                <Paper style={{ display: 'flex' }}>
                    <Groups.GroupsInput />
                </Paper>

                {this.props.cards.map(card => (
                    <Card key={card._id} style={{ margin: '20px' }}>
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

                <div className={classes.root}>
                    <ExpansionPanel defaultExpanded={true}>
                        <ExpansionPanelSummary>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>
                                    Einstieg
                                </Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography
                                    className={classes.secondaryHeading}
                                >
                                    5 Minuten
                                </Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <div className={classes.column} />
                            <div className={classes.column}>
                                <Chip
                                    label="Barbados"
                                    className={classes.chip}
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.column,
                                    classes.helper
                                )}
                            >
                                <Typography variant="caption">
                                    Select your destination of choice
                                    <br />
                                    <a
                                        href="#sub-labels-and-columns"
                                        className={classes.link}
                                    >
                                        Learn more
                                    </a>
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />
                        <ExpansionPanelActions>
                            <Button size="small" color="primary">
                                Portal
                            </Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
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
                _id: 'test2',
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

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(LessonContainer)
);
