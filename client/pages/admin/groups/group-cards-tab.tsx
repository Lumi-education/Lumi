// modules
import * as React from 'react';
import * as debug from 'debug';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Dialog, RaisedButton, FloatingActionButton } from 'material-ui';
import SVGContentAdd from 'material-ui/svg-icons/content/add';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';

const log_info = debug('lumi:info:pages:admin:groups:group-cards-tab');

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    group: Groups.IGroup;
    cards: Cards.ICard[];
    selected_cards: string[];

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_add_material_dialog?: boolean;
    loading?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupCardsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            show_add_material_dialog: false
        };
    }

    public componentWillMount() {
        log_info('componentWillMount');
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage>
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        const { classes, cards } = this.props;

        return (
            <div className={classes.contentContainer}>
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('cards')}
                </Typography>
                <Paper className={classes.paper}>
                    {/* <CardList
                        cards={cards}
                        onListItemClick={card_id => console.log(card_id)}
                    /> */}
                    {/* <div className={classes.buttons}>
                        <UI.components.RaisedButton
                            action={Groups.actions.update_group(
                                this.props.group_id,
                                this.props.group
                            )}
                            labels={[
                                Core.i18n.t('save'),
                                Core.i18n.t('saving'),
                                Core.i18n.t('saved'),
                                Core.i18n.t('error')
                            ]}
                            fullWidth={false}
                            disabled={false}
                        />
                    </div> */}
                </Paper>
                <UI.components.ActionBar>
                    <FloatingActionButton
                        onClick={() => {
                            this.setState({ show_add_material_dialog: true });
                        }}
                    >
                        <SVGContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>

                <Dialog
                    open={this.state.show_add_material_dialog}
                    title={Core.i18n.t('card_add')}
                    autoScrollBodyContent={true}
                    contentStyle={{
                        width: '100%',
                        maxWidth: 'none'
                    }}
                    onRequestClose={() =>
                        this.setState({ show_add_material_dialog: false })
                    }
                    actions={[
                        <RaisedButton
                            label={Core.i18n.t('cancel')}
                            onClick={() =>
                                this.setState({
                                    show_add_material_dialog: false
                                })
                            }
                            secondary={true}
                        />,
                        <RaisedButton
                            label={Core.i18n.t('add')}
                            onClick={() => {
                                this.props.dispatch(
                                    Groups.actions.add_cards(
                                        this.props.group_id,
                                        this.props.selected_cards
                                    )
                                );
                                this.setState({
                                    show_add_material_dialog: false
                                });
                                this.props.dispatch(
                                    Cards.actions.reset_card_selection()
                                );
                            }}
                            secondary={true}
                        />
                    ]}
                >
                    {/* <CardsContainer /> */}
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        group: state.groups.ui.group,
        cards: Cards.selectors.select_cards_by_ids(
            state,
            state.groups.ui.group.cards
        ),
        selected_cards: state.cards.ui.selected_cards,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
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
    )(GroupCardsTab)
);
