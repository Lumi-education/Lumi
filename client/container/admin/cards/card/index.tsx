// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ChipInput from 'material-ui-chip-input';
import AutoComplete from 'material-ui/AutoComplete';
import TagInput from 'client/components/tag-input';

// local
import { IState } from 'client/state';

// types
import { ICard, ITag } from 'lib/types';

// selectors
import { select_card } from 'client/state/cards/selectors';

import { select_tags_as_map } from 'client/state/tags/selectors';

// actions
import { snackbar_open } from 'client/state/ui/actions';
import { create_tag_and_add_to_card } from 'client/state/tags/actions';

import { add_tag_to_card, rem_tag_from_card } from 'client/state/cards/actions';

interface IStateProps {
    card: ICard;
    tags: Map<string, ITag>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminCard extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    componentWillMount() {}

    public render() {
        if (this.props.card) {
            return (
                <div>
                    <Paper>
                        <TextField
                            hintText="Name"
                            floatingLabelText="Name"
                            value={this.props.card.name}
                            fullWidth={true}
                        />
                        <TagInput
                            tags={this.props.tags}
                            tag_ids={this.props.card.tags}
                            add={tag => {
                                this.props.tags.get(tag._id)
                                    ? this.props.dispatch(
                                          add_tag_to_card(
                                              this.props.card._id,
                                              tag._id
                                          )
                                      )
                                    : this.props.dispatch(
                                          create_tag_and_add_to_card(
                                              this.props.card._id,
                                              tag.name
                                          )
                                      );
                            }}
                            delete={(tag_id: string) =>
                                this.props.dispatch(
                                    rem_tag_from_card(
                                        this.props.card._id,
                                        tag_id
                                    )
                                )}
                        />
                    </Paper>
                </div>
            );
        } else {
            return <div>loading</div>;
        }
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: select_tags_as_map(state),
        card: select_card(state, ownProps.params.card_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCard
);
