// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { push } from '../../ui/actions';
import * as debug from 'debug';
import Dropzone from 'react-dropzone';
import * as request from 'superagent';

import ColorPicker from 'material-ui-color-picker';

// components
import {
    Checkbox,
    TextField,
    SelectField,
    MenuItem,
    Paper,
    RaisedButton
} from 'material-ui';

import * as Tags from 'lib/tags';

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
                    hintText="Name"
                    floatingLabelText="Name"
                    value={tag.name || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({ name: v })
                        )
                    }
                />
                <TextField
                    hintText="Kurzname (max 3 Zeichen)"
                    floatingLabelText="Kurzname (max 3 Zeichen)"
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
                    hintText="Beschreibung"
                    floatingLabelText="Beschreibung"
                    value={tag.description || ''}
                    fullWidth={true}
                    onChange={(e, v) =>
                        this.props.dispatch(
                            Tags.actions.change_tag({ description: v })
                        )
                    }
                />
                <TextField
                    hintText="Farbe"
                    floatingLabelText="Farbe"
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
