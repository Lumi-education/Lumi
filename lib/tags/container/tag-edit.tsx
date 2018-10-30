// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { TextField, Paper } from 'material-ui';

import * as Core from 'lib/core';
import * as Tags from '..';

const log = debug('lumi:container:cards:card-edit');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    tag: Tags.ITag;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class TagEditContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const tag = this.props.tag;

        return (
            <Paper style={{ margin: '15px', padding: '20px' }}>
                <TextField
                    hintText={Core.i18n.t('name')}
                    floatingLabelText={Core.i18n.t('name')}
                    value={tag.name || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({ name: v })
                        )
                    }
                />
                <TextField
                    hintText={Core.i18n.t('short_name')}
                    floatingLabelText={Core.i18n.t('short_name')}
                    value={tag.short_name || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({
                                short_name: v.substring(0, 3)
                            })
                        )
                    }
                />
                <TextField
                    hintText={Core.i18n.t('description')}
                    floatingLabelText={Core.i18n.t('description')}
                    value={tag.description || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({ description: v })
                        )
                    }
                />
                <TextField
                    hintText={Core.i18n.t('color')}
                    floatingLabelText={Core.i18n.t('color')}
                    value={tag.color || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({ color: v })
                        )
                    }
                />
            </Paper>
        );
    }
}

function mapStateToProps(state: Tags.IState, ownProps): IStateProps {
    return {
        tag: state.tags.ui.tag
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
)(TagEditContainer);
