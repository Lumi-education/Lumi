// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

import { FloatingActionButton, Paper } from 'material-ui';

// svg
import ContentAdd from 'material-ui/svg-icons/content/add';

import TagFilterContainer from 'lib/tags/container/tag-filter';
import FilterBar from 'lib/ui/components/filter-bar';

// local
import { IState } from 'client/state';

// selectors
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';

// components
import LoadingPage from 'lib/ui/components/loading-page';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    cards: Cards.ICard[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    filter?: string[];
    search_text?: string;
    new_tag_name?: string;
    new_tag_description?: string;
    loading?: boolean;
}

export class AdminCards extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            new_tag_name: '',
            new_tag_description: '',
            loading: true
        };
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
        this.props.dispatch(Tags.actions.get_tags()).then(res => {
            this.setState({ loading: false });
        });
    }

    public render() {
        if (this.state.loading) {
            return <LoadingPage />;
        }
        return (
            <div>
                <Paper>
                    <TagFilterContainer />
                    <FilterBar
                        filter={this.state.search_text}
                        set_filter={filter =>
                            this.setState({ search_text: filter })
                        }
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}
                    >
                        {this.props.cards.map(card => (
                            <Cards.components.Card card={card} />
                        ))}
                    </div>
                </Paper>

                <FloatingActionButton
                    onClick={() => {
                        this.props
                            .dispatch(Cards.actions.create_card())
                            .then(res => {
                                log('create_card promise resolved');
                                this.props.dispatch(
                                    push('/admin/cards/' + res.payload._id)
                                );
                            });
                    }}
                    style={{
                        margin: '20px',
                        bottom: '0px',
                        right: '20px',
                        position: 'fixed'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        cards:
            state.tags.ui.selected_tags.length !== 0
                ? Cards.selectors.select_cards_by_ids(
                      state,
                      Tags.selectors.select_doc_ids_for_tags(
                          state,
                          state.tags.ui.selected_tags
                      )
                  )
                : Cards.selectors.select_all_cards(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCards);
