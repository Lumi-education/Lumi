import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';

import MaterialAvatar from './MaterialAvatar';

import * as Core from 'lib/core';
import { IMaterial, IH5PMaterial } from '../types';

const log = debug('lumi:packages:materials:components:uploadmaterial');

interface IProps {
    material: IMaterial;
    view: () => void;
    classes: any;
}

interface IComponentState {}

const styles: StyleRulesCallback = theme => ({
    material: {
        margin: '10px',
        minWidth: 300,
        maxWidth: 300,
        maxHeight: 400,
        overflow: 'hidden',
        flex: 1
    },
    actions: {
        display: 'flex'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    content: {
        maxHeight: 200,
        overflow: 'scroll',
        margin: 0,
        padding: 0,
        minWidth: 300,
        minHeight: 200
    },
    media: {
        minWidth: 300,
        minHeight: 200
    }
});

export default withStyles(styles)(
    class MaterialCard extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { material, classes } = this.props;
            return (
                <Card className={classes.material}>
                    <CardHeader
                        avatar={<MaterialAvatar material={material} />}
                        title={material.name}
                    />
                    <Divider />
                    <CardMedia
                        className={classes.media}
                        image={
                            '/api/v1/' +
                            window.location.pathname.split('/')[1] +
                            '/material/' +
                            material._id +
                            '/attachment/preview.png'
                        }
                        title={material.name}
                    />

                    <Divider />
                    <CardActions
                        className={classes.actions}
                        disableActionSpacing={true}
                    >
                        <Button onClick={this.props.view} size="small">
                            {Core.i18n.t('view')}
                        </Button>
                    </CardActions>
                </Card>
            );
        }
    }
);
