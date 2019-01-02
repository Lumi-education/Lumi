// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Buttom from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// container
import { TagsChipInputContainer } from 'client/container';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Tags from 'lib/tags';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';

const log_info = debug('lumi:info:pages:cards:card-page');

interface IStateProps {
    card_id: string;
    card: Cards.ICard;
    card_in_state: Cards.ICard;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}
interface IProps extends IStateProps, IDispatchProps {}

export class CardPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        log_info('componentWillMount');
        this.props.dispatch(
            Cards.actions.change_card(this.props.card_in_state)
        );
    }

    public render() {
        const { classes, card } = this.props;
        return (
            <div id="card-page" className={classes.contentContainer}>
                <Paper className={classes.paper}>
                    <div className={classes.paperHeader}>
                        <Typography
                            variant="h6"
                            gutterBottom={true}
                            align="center"
                            color="textPrimary"
                        >
                            <span style={{ color: 'white' }}>{card.name}</span>
                        </Typography>
                    </div>
                    <div className={classes.paperContent}>
                        <Grid container={true} spacing={24}>
                            <Grid item={true} xs={12} sm={12}>
                                <TextField
                                    required={true}
                                    id="name"
                                    name="name"
                                    label={Core.i18n.t('name')}
                                    value={card.name}
                                    onChange={e =>
                                        this.props.dispatch(
                                            Cards.actions.change_card({
                                                name: e.target.value
                                            })
                                        )
                                    }
                                    fullWidth={true}
                                    autoComplete="fname"
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <FormControl
                                    fullWidth={true}
                                    className={classes.formControl}
                                >
                                    <InputLabel htmlFor="card_type">
                                        {Core.i18n.t('type')}
                                    </InputLabel>
                                    <Select
                                        value={card.card_type}
                                        onChange={e =>
                                            this.props.dispatch(
                                                Cards.actions.change_card({
                                                    card_type: e.target.value
                                                })
                                            )
                                        }
                                        inputProps={{
                                            name: 'card_type',
                                            id: 'card_type'
                                        }}
                                    >
                                        <MenuItem value={'h5p'}>H5P</MenuItem>
                                        <MenuItem value={'markdown'}>
                                            Markdown
                                        </MenuItem>
                                        <MenuItem value={'upload'}>
                                            Upload
                                        </MenuItem>
                                        <MenuItem value={'video'}>
                                            Video
                                        </MenuItem>
                                        <MenuItem value={'pdf'}>PDF</MenuItem>
                                        <MenuItem value={'docx'}>DOCX</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <div className={classes.buttons}>
                            {/* <RaisedButton
                                label={Core.i18n.t('save')}
                                onClick={() =>
                                    this.props.dispatch(
                                        Core.actions.update<Groups.IGroup>(
                                            this.props.group
                                        )
                                    )
                                }
                            /> */}
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const card_id = ownProps.match.params.card_id;
    return {
        card_id,
        card: state.cards.ui.card,
        card_in_state: Cards.selectors.select_card(state, card_id),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    dialog: {
        minWidth: '500px'
    },
    dialogContent: {
        minWidth: '500px',
        minHeight: '350px'
    },
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },

    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: 'none'
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        margin: 'auto'
    },
    contentContainer: {
        paddingTop: '40px',
        maxWidth: '680px',
        margin: 'auto'
    },
    paperContent: {
        padding: '20px'
    },
    contentList: {
        maxWidth: 680,
        margin: 'auto',
        marginTop: 40
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: 0
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    media: {
        minWidth: 300,
        minHeight: 200
    },
    inputRoot: {
        color: 'inherit',
        width: '100%'
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200
        }
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(CardPage)
);
