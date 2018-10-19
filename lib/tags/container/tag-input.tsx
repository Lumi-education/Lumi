// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { ITag, IState } from '../types';

import * as Tags from '..';
import * as Cards from 'lib/cards';

interface IPassedProps {
    doc_id: string;
    tag_ids: string[];
}

interface IStateProps extends IPassedProps {
    tags: ITag[];
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
        this.props.dispatch(Tags.actions.get_tags());
    }

    public render() {
        const tags = this.props.tags;
        return (
            <Tags.TagInputComponent
                tags={this.props.tags}
                tag_ids={this.props.tag_ids || []}
                add={tag => {
                    this.props.tags.filter(_tag => _tag._id === tag._id)[0]
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
        tags: state.tags.list,
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
