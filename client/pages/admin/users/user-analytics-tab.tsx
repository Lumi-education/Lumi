// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { groupBy } from 'lodash';
import * as moment from 'moment';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// types
import { IState } from 'client/state';
import { TagsChipInputContainer } from 'client/container';

import { LineChart, ColumnChart } from 'react-chartkick';

import { SelectField, MenuItem, Paper, DatePicker } from 'material-ui';

import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';

const log = debug('lumi:admin:users:user-analytics-tab');

interface IPassedProps {
    user_id: string;
}
interface IStateProps extends IPassedProps {
    classes: any;
    assignments: Flow.models.Assignment[];
    assignment: (assignment_id: string) => Flow.models.Assignment;
    assignments_for_cards: (card_id: string[]) => Flow.models.Assignment[];
    card_name: (card_id: string) => string;
    user: Users.models.User;
    card: (card_id: string) => Cards.ICard;
    selected_tags: string[];
    tag: (tag_id: string) => Tags.models.Tag;
    cards_with_tag: (tag_id: string) => Cards.ICard[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
    loading_step?: number;
    group_by?: 'minute' | 'hour' | 'day' | 'month';
    from_date?: moment.Moment;
    to_date?: moment.Moment;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserAnalyticsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init',
            loading_step: 0,
            group_by: 'day',
            from_date: moment(new Date()).subtract(3, 'months'),
            to_date: moment(new Date())
        };

        this.group_by = this.group_by.bind(this);
    }

    public group_by(): string {
        switch (this.state.group_by) {
            case 'minute':
                return 'YYYY MM DD HH:mm';
            case 'hour':
                return 'YYYY MM DD HH:[00]';
            case 'day':
                return 'YYYY MM DD';
            case 'month':
                return 'YYYY MM';
        }
    }

    public render() {
        const { classes } = this.props;
        let num_assignments = 0;

        const line_data = this.props.selected_tags.map(tag_id => {
            const tag = this.props.tag(tag_id);
            const cards = this.props
                .cards_with_tag(tag_id)
                .filter(
                    card =>
                        card.card_type !== 'text' && card.card_type !== 'video'
                );
            const assignments = this.props
                .assignments_for_cards(cards.map(card => card._id))
                .filter(assignment => assignment.get_finished() !== null)
                .filter(
                    assignment =>
                        moment(assignment.get_finished()) >=
                            this.state.from_date &&
                        moment(assignment.get_finished()) <= this.state.to_date
                )
                .filter(assignment => assignment.user_id === this.props.user_id)
                .map((assignment, index) => [
                    assignment.get_finished(),
                    assignment.get_score()
                ]);

            num_assignments += assignments.length;

            const grouped_data = groupBy(assignments, v =>
                moment(v[0]).format(this.group_by())
            );

            const data = [];

            for (const date in grouped_data) {
                data.push([
                    date,
                    grouped_data[date]
                        .map(e => e[1])
                        .reduce(Core.utils.sum, 0) / grouped_data[date].length
                ]);
            }

            return { data, name: tag.name, color: tag.color };
        });

        const column_data = this.props.selected_tags.map(tag_id => {
            const tag = this.props.tag(tag_id);
            const cards = this.props
                .cards_with_tag(tag_id)
                .filter(
                    card =>
                        card.card_type !== 'text' && card.card_type !== 'video'
                );
            const assignments = this.props
                .assignments_for_cards(cards.map(card => card._id))
                .filter(assignment => assignment.get_finished() !== null)

                .filter(
                    assignment => assignment.user_id === this.props.user_id
                );
            const data =
                assignments
                    .map((assignment, index) => assignment.get_score())
                    .reduce(Core.utils.sum, 0) / assignments.length;

            const o = {};
            o[tag.name] = data;
            return { name: tag.name, color: tag.color, data: o };
        });

        return (
            <div id="user-analytics-tab" className={classes.contentContainer}>
                <Paper>
                    <TagsChipInputContainer
                        tag_ids={this.props.selected_tags}
                        onChange={tag_ids =>
                            this.props.dispatch(
                                Tags.actions.set_selected_tags(tag_ids)
                            )
                        }
                    />
                </Paper>

                <Paper style={{ display: 'flex' }}>
                    <DatePicker
                        style={{ flex: 1 }}
                        hintText={Core.i18n.t('from')}
                        floatingLabelText={Core.i18n.t('from')}
                        value={this.state.from_date.toDate()}
                        onChange={(n, date) =>
                            this.setState({ from_date: moment(date) })
                        }
                        mode="landscape"
                    />
                    <DatePicker
                        style={{ flex: 1 }}
                        hintText={Core.i18n.t('from')}
                        floatingLabelText={Core.i18n.t('to')}
                        value={this.state.to_date.toDate()}
                        onChange={(n, date) =>
                            this.setState({ to_date: moment(date) })
                        }
                        mode="landscape"
                    />
                    <SelectField
                        style={{ flex: 1 }}
                        floatingLabelText={Core.i18n.t('to_group')}
                        value={this.state.group_by}
                        onChange={(e, v, i) => this.setState({ group_by: i })}
                    >
                        <MenuItem
                            value={'minute'}
                            primaryText={Core.i18n.t('minute')}
                        />
                        <MenuItem
                            value={'hour'}
                            primaryText={Core.i18n.t('hour')}
                        />
                        <MenuItem
                            value={'day'}
                            primaryText={Core.i18n.t('day')}
                        />
                        <MenuItem
                            value={'month'}
                            primaryText={Core.i18n.t('month')}
                        />
                    </SelectField>
                </Paper>

                <Paper>
                    <h1>
                        {Core.i18n.t('data_packages', { num: num_assignments })}
                    </h1>
                </Paper>

                <Paper>
                    <h1>{Core.i18n.t('development_over_time')}</h1>
                    <LineChart
                        xTitle={Core.i18n.t('time')}
                        yTitle={Core.i18n.t('percent')}
                        curve={false}
                        min={0}
                        max={100}
                        data={line_data}
                    />
                </Paper>
                <Paper style={{ marginTop: '20px' }}>
                    <h1>{Core.i18n.t('average')}</h1>
                    <ColumnChart min={0} max={100} data={column_data} />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        user_id: ownProps.user_id,
        user: Users.selectors.user(state, ownProps.user_id),
        assignments: Flow.selectors.assignment_for_user(
            state,
            ownProps.user_id
        ),
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        card_name: (card_id: string) => Cards.selectors.name(state, card_id),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        cards_with_tag: tag_id => Cards.selectors.with_tags(state, [tag_id]),
        assignments_for_cards: (card_ids: string[]) =>
            Flow.selectors.assignments_for_cards(state, card_ids),
        tag: (tag_id: string) => Tags.selectors.tag(state, tag_id),
        selected_tags: state.tags.ui.selected_tags
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    contentContainer: {
        maxWidth: '680px',
        margin: 'auto'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserAnalyticsTab)
);
