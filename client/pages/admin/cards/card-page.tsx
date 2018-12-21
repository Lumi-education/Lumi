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
import styles from 'client/style/style';
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

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(CardPage)
);
