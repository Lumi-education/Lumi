// modules
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import StarBorder from '@material-ui/icons/StarBorder';

import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
    subject: Cards.types.Subjects;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    open: boolean;
}

export class CardsSearchMenuContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            open: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <List>
                    <ListItem
                        button={true}
                        onClick={() =>
                            this.setState({ open: !this.state.open })
                        }
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText
                            inset={true}
                            primary={Core.i18n.t(
                                this.props.subject || 'subject'
                            )}
                        />
                        {this.state.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={this.state.open}
                        timeout="auto"
                        unmountOnExit={true}
                    >
                        <List component="div" disablePadding={true}>
                            <ListItem
                                button={true}
                                className={classes.nested}
                                onClick={() => {
                                    this.props.dispatch(
                                        Cards.actions.change_subject('physics')
                                    );
                                    this.setState({ open: false });
                                }}
                            >
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText
                                    inset={true}
                                    primary={Core.i18n.t('physics')}
                                />
                            </ListItem>
                            <ListItem
                                button={true}
                                className={classes.nested}
                                onClick={() => {
                                    this.props.dispatch(
                                        Cards.actions.change_subject(
                                            'chemistry'
                                        )
                                    );
                                    this.setState({ open: false });
                                }}
                            >
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText
                                    inset={true}
                                    primary={Core.i18n.t('chemistry')}
                                />
                            </ListItem>
                        </List>
                    </Collapse>
                    {this.props.subject ? (
                        <div>
                            <ListItem
                                button={true}
                                onClick={() =>
                                    this.setState({ open: !this.state.open })
                                }
                            >
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText
                                    inset={true}
                                    primary={Core.i18n.t('topic')}
                                />
                                {this.state.open ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItem>
                            <ListItem
                                button={true}
                                onClick={() =>
                                    this.setState({ open: !this.state.open })
                                }
                            >
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText
                                    inset={true}
                                    primary={Core.i18n.t('competencies')}
                                />
                                {this.state.open ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItem>
                        </div>
                    ) : null}
                </List>
            </Paper>
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        subject: state.cards.card_search_menu.subject
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    root: {
        margin: '10px',
        height: '90vh',
        width: '240px',
        position: 'fixed'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(CardsSearchMenuContainer)
);
