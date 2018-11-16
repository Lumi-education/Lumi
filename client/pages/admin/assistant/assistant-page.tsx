// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

// components
import { CardList } from 'client/components';
import { CardsContainer } from 'client/container';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Close';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import CardsAssignDialog from 'client/dialogs/cards-assign-dialog';

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    classes: any;
    language: Core.types.Locales;
    system: Core.types.ISystemSettings;
    card: (card_id: string) => Cards.ICard;
    selected_cards: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    activeStep: number;
    group_name: string;
    user_name: string;
    users: Users.IUser[];
    next_disabled: boolean;
    group: Groups.IGroup;
}

interface IProps extends IStateProps, IDispatchProps {}

const steps = ['group', 'users', 'cards', 'next_steps'];

export class AssistantPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            activeStep: 0,
            group_name: '',
            user_name: '',
            next_disabled: true,
            users: [],
            group: null
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    public handleNext() {
        const { activeStep } = this.state;

        if (activeStep === 2) {
            this.props.dispatch(
                Flow.actions.assign(
                    this.state.users.map(user => user._id),
                    this.props.selected_cards
                )
            );
        }
        this.setState({
            activeStep: activeStep + 1,
            next_disabled: true
        });

        console.log(this.state);
    }

    public handleBack() {
        this.setState(state => ({
            activeStep: state.activeStep - 1
        }));
    }

    public handleReset() {
        this.setState({
            activeStep: 0
        });
    }

    public render() {
        const { classes } = this.props;
        const { activeStep } = this.state;
        return (
            <div className={classes.contentContainer}>
                <Paper className={classes.paper}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((step, index) => {
                            return (
                                <Step
                                    key={index}
                                    completed={index < activeStep}
                                >
                                    <StepLabel>{Core.i18n.t(step)}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Typography className={classes.instructions}>
                        {(() => {
                            switch (this.state.activeStep) {
                                case 0:
                                    return (
                                        <div>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {Core.i18n.t('group_create')}
                                            </Typography>

                                            {this.state.group ? (
                                                <div>
                                                    {Core.i18n.t(
                                                        'group_created',
                                                        {
                                                            name: this.state
                                                                .group_name
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <form
                                                        className={
                                                            classes.container
                                                        }
                                                        noValidate={true}
                                                        autoComplete="off"
                                                    >
                                                        <TextField
                                                            id="outlined-name"
                                                            label={Core.i18n.t(
                                                                'name'
                                                            )}
                                                            className={
                                                                classes.textField
                                                            }
                                                            value={
                                                                this.state
                                                                    .group_name
                                                            }
                                                            onChange={e => {
                                                                if (
                                                                    !this.state
                                                                        .group
                                                                ) {
                                                                    this.setState(
                                                                        {
                                                                            group_name:
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                        />
                                                    </form>
                                                    <UI.components.RaisedButton
                                                        action={Groups.actions.create_group(
                                                            this.state
                                                                .group_name
                                                        )}
                                                        labels={[
                                                            Core.i18n.t(
                                                                'group_create'
                                                            ),
                                                            Core.i18n.t(
                                                                'creating'
                                                            ),
                                                            Core.i18n.t(
                                                                'created'
                                                            ),
                                                            Core.i18n.t('error')
                                                        ]}
                                                        fullWidth={true}
                                                        disabled={
                                                            this.state
                                                                .group_name
                                                                .length === 0
                                                        }
                                                        onSuccess={res => {
                                                            this.setState({
                                                                group:
                                                                    res.payload,
                                                                next_disabled: false
                                                            });
                                                            this.handleNext();
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                case 1:
                                    return (
                                        <div>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {Core.i18n.t('user_create')}
                                            </Typography>
                                            <List component="nav">
                                                {this.state.users.map(user => (
                                                    <div key={user._id}>
                                                        <ListItem>
                                                            <Avatar>
                                                                {user.name.substring(
                                                                    0,
                                                                    2
                                                                )}
                                                            </Avatar>
                                                            <ListItemText
                                                                primary={
                                                                    user.name
                                                                }
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton aria-label="Delete">
                                                                    <DeleteIcon
                                                                        onClick={() => {
                                                                            this.props.dispatch(
                                                                                Users.actions.delete_user(
                                                                                    [
                                                                                        user._id
                                                                                    ]
                                                                                )
                                                                            );
                                                                            this.setState(
                                                                                {
                                                                                    users: this.state.users.filter(
                                                                                        _user =>
                                                                                            _user._id !==
                                                                                            user._id
                                                                                    )
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        <Divider />
                                                    </div>
                                                ))}
                                            </List>
                                            <form
                                                className={classes.container}
                                                noValidate={true}
                                                autoComplete="off"
                                            >
                                                <TextField
                                                    id="outlined-name"
                                                    label={Core.i18n.t('name')}
                                                    className={
                                                        classes.textField
                                                    }
                                                    value={this.state.user_name}
                                                    onChange={e => {
                                                        this.setState({
                                                            user_name:
                                                                e.target.value
                                                        });
                                                    }}
                                                    margin="normal"
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            </form>
                                            <UI.components.RaisedButton
                                                action={Users.actions.create_user(
                                                    this.state.user_name,
                                                    {
                                                        groups: [
                                                            this.state.group._id
                                                        ]
                                                    }
                                                )}
                                                labels={[
                                                    Core.i18n.t('user_create'),
                                                    Core.i18n.t('creating'),
                                                    Core.i18n.t('created'),
                                                    Core.i18n.t('error')
                                                ]}
                                                fullWidth={true}
                                                disabled={
                                                    this.state.user_name
                                                        .length === 0
                                                }
                                                onSuccess={res => {
                                                    const user = res.payload;
                                                    this.setState({
                                                        next_disabled: false,
                                                        users: [
                                                            ...this.state.users,
                                                            user
                                                        ],
                                                        user_name: ''
                                                    });
                                                }}
                                            />
                                        </div>
                                    );
                                case 2:
                                    return (
                                        <div>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {Core.i18n.t('cards')}
                                            </Typography>
                                            <List component="nav">
                                                {this.props.selected_cards.map(
                                                    card_id => {
                                                        const card = this.props.card(
                                                            card_id
                                                        );
                                                        return (
                                                            <div key={card._id}>
                                                                <ListItem>
                                                                    <Avatar>
                                                                        {card.name.substring(
                                                                            0,
                                                                            2
                                                                        )}
                                                                    </Avatar>
                                                                    <ListItemText
                                                                        primary={
                                                                            card.name
                                                                        }
                                                                    />
                                                                    <ListItemSecondaryAction>
                                                                        <IconButton aria-label="Delete">
                                                                            <DeleteIcon
                                                                                onClick={() => {
                                                                                    this.props.dispatch(
                                                                                        Cards.actions.select_card(
                                                                                            card._id
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                                <Divider />
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </List>
                                            {/* <Cards.CardEdit /> */}
                                            <Grid container={true} spacing={24}>
                                                <Button
                                                    fullWidth={true}
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            UI.actions.toggle_assign_material_dialog()
                                                        )
                                                    }
                                                    className={classes.button}
                                                >
                                                    {Core.i18n.t(
                                                        'cards_assign'
                                                    )}
                                                </Button>
                                            </Grid>
                                            {/* <UI.components.RaisedButton
                                                action={Cards.actions.create_card(
                                                    this.props.card
                                                )}
                                                labels={[
                                                    Core.i18n.t('card_create'),
                                                    Core.i18n.t('creating'),
                                                    Core.i18n.t('created'),
                                                    Core.i18n.t('error')
                                                ]}
                                                fullWidth={true}
                                                disabled={false}
                                                onSuccess={res => {
                                                    const card = res.payload;
                                                    this.setState({
                                                        next_disabled: false,
                                                        cards: [
                                                            ...this.state.cards,
                                                            card
                                                        ]
                                                    });
                                                }}
                                            /> */}
                                        </div>
                                    );
                                case 3:
                                    return (
                                        <div>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {Core.i18n.t('next_steps')}
                                            </Typography>
                                            <Grid container={true} spacing={24}>
                                                <Grid item={true} xs={6}>
                                                    <Card
                                                        className={classes.card}
                                                    >
                                                        <CardActionArea>
                                                            <CardMedia
                                                                className={
                                                                    classes.media
                                                                }
                                                                image="/static/assistant/lumi_flow.png"
                                                                title={Core.i18n.t(
                                                                    'flow'
                                                                )}
                                                            />
                                                            <CardContent>
                                                                <Typography
                                                                    gutterBottom={
                                                                        true
                                                                    }
                                                                    variant="h5"
                                                                    component="h2"
                                                                >
                                                                    {Core.i18n.t(
                                                                        'flow'
                                                                    )}
                                                                </Typography>
                                                                <Typography component="p">
                                                                    {Core.i18n.t(
                                                                        'flow_explain'
                                                                    )}
                                                                </Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                        <CardActions>
                                                            <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    this.props.dispatch(
                                                                        UI.actions.push(
                                                                            '/admin/groups/' +
                                                                                this
                                                                                    .state
                                                                                    .group
                                                                                    ._id +
                                                                                '/flow'
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                {Core.i18n.t(
                                                                    'go'
                                                                )}
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                                <Grid item={true} xs={6}>
                                                    {/* <Card
                                                        className={classes.card}
                                                    >
                                                        <CardActionArea>
                                                            <CardMedia
                                                                className={
                                                                    classes.media
                                                                }
                                                                title={Core.i18n.t(
                                                                    'get_connected'
                                                                )}
                                                            />
                                                            <CardContent>
                                                                <Typography
                                                                    gutterBottom={
                                                                        true
                                                                    }
                                                                    variant="h5"
                                                                    component="h2"
                                                                >
                                                                    {Core.i18n.t(
                                                                        'get_connected'
                                                                    )}
                                                                </Typography>
                                                                <Typography component="p">
                                                                    {Core.i18n.t(
                                                                        'tutorial_explain'
                                                                    )}
                                                                </Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                        <CardActions>
                                                            <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() =>
                                                                    this.props.dispatch(
                                                                        UI.actions.push(
                                                                            '/admin/tutorial/get-connected-mac'
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                {Core.i18n.t(
                                                                    'go'
                                                                )}
                                                            </Button>
                                                        </CardActions>
                                                    </Card> */}
                                                </Grid>
                                            </Grid>
                                        </div>
                                    );
                            }
                        })()}
                    </Typography>
                    <div className={classes.buttons}>
                        {activeStep === steps.length - 1 ? null : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleNext}
                                className={classes.button}
                                disabled={this.state.next_disabled}
                            >
                                {Core.i18n.t('next')}
                            </Button>
                        )}
                    </div>
                </Paper>
                <CardsAssignDialog
                    assign_callback={card_ids => {
                        this.props.dispatch(
                            Cards.actions.set_selected_cards(card_ids)
                        );
                        this.setState({ next_disabled: false });
                    }}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        language: state.i18n.locale,
        system: state.core.system,
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        selected_cards: state.cards.ui.selected_cards
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    root: {
        width: '90%'
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        padding: 20
    },
    contentContainer: {
        paddingTop: '40px',
        maxWidth: '680px',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
        display: 'flex',
        flexDirection: 'column'
    },
    dense: {
        marginTop: 16
    },
    menu: {
        width: 200
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(AssistantPage)
);
