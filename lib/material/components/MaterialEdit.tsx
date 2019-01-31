// modules
import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// modules
import * as Core from 'lib/core';
import { IMaterial, IH5PMaterial } from '../types';

import MaterialH5PEdit from './MaterialH5PEdit';

const log_info = debug('lumi:info:pages:cards:card-page');

export interface IStateProps {
    material: IMaterial;
    classes?: any;
}

export interface IDispatchProps {
    change: (payload: any) => void;
    upload: (material_id: string, file: FormData) => void;
    destroy: (material_id: string) => any;
    update: (material: IMaterial) => void;
}

interface IComponentState {
    show_delete_confirmation_dialog: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    class MaterialEdit extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {
                show_delete_confirmation_dialog: false
            };

            this.destroy = this.destroy.bind(this);
            this.update = this.update.bind(this);
        }

        public componentWillMount() {
            log_info('componentWillMount');
        }

        public destroy() {
            log_info('destroy');
            this.props.destroy(this.props.material._id);
        }

        public update() {
            log_info('update', this.props.material);
            this.props.update(this.props.material);
        }

        public render() {
            const { classes, material, change } = this.props;
            return (
                <div>
                    <Grid container={true} spacing={24}>
                        <Grid item={true} xs={12} sm={12}>
                            <TextField
                                required={true}
                                id="name"
                                name="name"
                                label={Core.i18n.t('name')}
                                value={material.name}
                                onChange={e =>
                                    change({
                                        name: e.target.value
                                    })
                                }
                                fullWidth={true}
                                autoComplete="fname"
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <FormControl
                                fullWidth={true}
                                className={classes.formControl}
                            >
                                <InputLabel htmlFor="material_type">
                                    {Core.i18n.t('type')}
                                </InputLabel>
                                <Select
                                    value={material.material_type}
                                    onChange={e =>
                                        change({
                                            material_type: e.target.value
                                        })
                                    }
                                    inputProps={{
                                        name: 'material_type',
                                        id: 'material_type'
                                    }}
                                >
                                    <MenuItem value={'h5p'}>H5P</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item={true} xs={12}>
                            {(() => {
                                switch (material.material_type) {
                                    case 'h5p':
                                        return (
                                            <MaterialH5PEdit
                                                upload={this.props.upload}
                                                h5p={
                                                    (material as IH5PMaterial)
                                                        .h5p
                                                }
                                                _id={material._id}
                                            />
                                        );
                                }
                            })()}
                        </Grid>
                        {/* <Grid className={classes.buttons} item={true} xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={() =>
                                    this.setState({
                                        show_delete_confirmation_dialog: true
                                    })
                                }
                            >
                                {Core.i18n.t('delete')}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.update}
                            >
                                {Core.i18n.t('save')}
                            </Button>
                        </Grid> */}
                    </Grid>
                    <Dialog
                        onClose={() =>
                            this.setState({
                                show_delete_confirmation_dialog: false
                            })
                        }
                        open={this.state.show_delete_confirmation_dialog}
                        aria-labelledby="simple-dialog-title"
                    >
                        <DialogTitle id="simple-dialog-title">
                            {Core.i18n.t('material.delete_material_title')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {Core.i18n.t(
                                    'material.delete_material_confirmation'
                                )}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() =>
                                    this.setState({
                                        show_delete_confirmation_dialog: false
                                    })
                                }
                                color="primary"
                            >
                                {Core.i18n.t('cancel')}
                            </Button>
                            <Button onClick={this.destroy} color="primary">
                                {Core.i18n.t('ok')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
);
