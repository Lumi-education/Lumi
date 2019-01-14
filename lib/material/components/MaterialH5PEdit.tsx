// modules
import * as React from 'react';
import * as debug from 'debug';
import Dropzone from 'react-dropzone';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

// modules
import { IMaterial } from '../types';
import { IH5P } from 'h5p-nodejs-library';
import * as Core from 'lib/core';

import H5P from '../components/H5P';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const log_info = debug('lumi:info:pages:cards:card-page');

export interface IStateProps {
    _id: string;
    h5p: IH5P;
    classes?: any;
}

export interface IDispatchProps {
    upload: (material_id: string, file: FormData) => any;
}

interface IComponentState {
    request: 'init' | 'pending' | 'success' | 'error';
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    upload: {
        width: '100%',
        border: '2px dotted #000000',
        margin: '10px'
    },
    text: {
        margin: '15px'
    }
});

export default withStyles(styles)(
    class MaterialEdit extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {
                request: 'init'
            };

            this.onDrop = this.onDrop.bind(this);
        }

        public componentWillMount() {
            log_info('componentWillMount');
        }

        public onDrop(acceptedFiles, rejectedFiles) {
            log_info(acceptedFiles, rejectedFiles);
            acceptedFiles.forEach(file => {
                const data = new FormData();

                data.append('file', file);
                data.append('filename', file.name);

                this.setState({ request: 'pending' });
                this.props
                    .upload(this.props._id, data)
                    .then(res => {
                        this.setState({ request: 'success' });
                    })
                    .catch(error => {
                        this.setState({ request: 'error' });
                    });
            });
        }

        public render() {
            const { classes } = this.props;
            if (this.props.h5p) {
                return <H5P content_id={this.props._id} />;
            }
            return (
                <Grid container={true} spacing={24}>
                    <Grid item={true} xs={12} sm={12}>
                        <Dropzone
                            className={classes.upload}
                            onDrop={this.onDrop}
                        >
                            {({
                                getRootProps,
                                getInputProps,
                                isDragActive
                            }) => {
                                return (
                                    <Typography
                                        className={classes.text}
                                        variant="h4"
                                        component="h4"
                                        align="center"
                                    >
                                        {this.state.request === 'pending' ? (
                                            <LinearProgress />
                                        ) : (
                                            Core.i18n.t('material.h5p_upload')
                                        )}
                                    </Typography>
                                );
                            }}
                        </Dropzone>
                    </Grid>
                </Grid>
            );
        }
    }
);
