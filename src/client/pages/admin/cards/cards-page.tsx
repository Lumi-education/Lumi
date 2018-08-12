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
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';

// components
import LoadingPage from 'lib/ui/components/loading-page';
import CreateCardDialog from '../dialogs/create-card';

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
    loading?: string;
    loading_step?: number;
}

export class AdminCards extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            new_tag_name: '',
            new_tag_description: '',
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Karten', loading_step: 1 });
        this.props.dispatch(Cards.actions.get_cards()).then(res => {
            this.setState({ loading: 'finished', loading_step: 2 });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={2}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(90deg, #8e44ad, #3498db)'
                }}
            >
                {/* <TagFilterContainer /> */}
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

                <FloatingActionButton
                    onClick={() => {
                        this.props.dispatch(
                            UI.actions.toggle_create_card_dialog()
                        );
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
                <CreateCardDialog />
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
