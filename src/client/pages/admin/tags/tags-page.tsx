// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';

import FilterBar from 'lib/ui/components/filter-bar';
import TagListComponent from 'lib/tags/components/tag-list';

// state
import { IState } from 'client/state';

// modules
import * as Tags from 'lib/tags';

interface IStateProps {
    tags: Tags.ITag[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class AdminTagsPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Tags.actions.get_tags());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <Paper>
                    <Tags.TagListComponent
                        tags={this.props.tags.filter(tag => {
                            return this.state.search_text === ''
                                ? true
                                : (tag.name + tag.description)
                                      .toLocaleLowerCase()
                                      .indexOf(
                                          this.state.search_text.toLocaleLowerCase()
                                      ) > -1;
                        })}
                    />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        tags: Tags.selectors.select_all_tags(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminTagsPage
);
