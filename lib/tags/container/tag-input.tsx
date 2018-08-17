// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

// components
import { TagInputComponent } from '..';

// types
import { ITag, IState } from '../types';

// selectors
import { select_tags_as_map } from '../selectors';

// actions
import { get_tags, add_tag_to_doc, rem_tag_from_doc } from '../actions';

import * as Tags from '../';
import * as Cards from 'lib/cards';

interface IPassedProps {
    doc_id: string;
    tag_ids: string[];
}

interface IStateProps extends IPassedProps {
    tags: Map<string, ITag>;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TagInputContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_tags());
    }

    public render() {
        const tags = this.props.tags;
        return (
            <TagInputComponent
                tags={this.props.tags}
                tag_ids={this.props.tag_ids || []}
                add={tag => {
                    this.props.tags.get(tag._id)
                        ? this.props.dispatch(
                              Cards.actions.change_card({
                                  tags: this.props.tag_ids
                                      ? [...this.props.tag_ids, tag._id]
                                      : [tag._id]
                              })
                          )
                        : this.props
                              .dispatch(Tags.actions.create_tag(tag.name))
                              .then(res => {
                                  this.props.dispatch(
                                      Cards.actions.change_card({
                                          tags: this.props.tag_ids
                                              ? [
                                                    ...this.props.tag_ids,
                                                    res.payload._id
                                                ]
                                              : [res.payload._id]
                                      })
                                  );
                              });
                }}
                delete={tag_id =>
                    this.props.dispatch(
                        Cards.actions.change_card({
                            tags: this.props.tag_ids.filter(
                                _tag_id => _tag_id !== tag_id
                            )
                        })
                    )
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: select_tags_as_map(state),
        tag_ids: ownProps.tag_ids,
        doc_id: ownProps.doc_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(TagInputContainer);
