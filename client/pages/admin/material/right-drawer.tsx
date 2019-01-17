// modules
import * as React from 'react';
import * as debug from 'debug';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

import styles from './styles';
import * as Core from 'lib/core';
import * as Material from 'lib/material';
import * as Flow from 'lib/flow';

const log = debug('lumi:pages:material:right-drawer');

interface IStateProps {
    material: Material.models.Material[];
    open: boolean;
    classes?: any;
    theme?: any;
    close: () => void;
    open_assign_dialog: () => void;
    view_material: (material_id: string) => void;
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export default withStyles(styles, { withTheme: true })(
    class CardsPageRightDrawer extends React.Component<
        IProps,
        IComponentState
    > {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { classes, theme, open } = this.props;

            return (
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.props.close}>
                            {theme.direction === 'rtl' ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.props.open_assign_dialog}
                        >
                            <RecentActorsIcon className={classes.leftIcon} />
                            {Core.i18n.t('assign.material')}
                        </Button>
                    </div>
                    <Divider />
                    <Droppable droppableId="material_selection">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                    height: '100vh'
                                }}
                            >
                                {this.props.material.map((material, index) => (
                                    <Draggable
                                        key={material._id}
                                        draggableId={material._id}
                                        index={index}
                                    >
                                        {(_provided, _snapshot) => (
                                            <div
                                                ref={_provided.innerRef}
                                                {..._provided.draggableProps}
                                                {..._provided.dragHandleProps}
                                                style={
                                                    _provided.draggableProps
                                                        .style
                                                }
                                            >
                                                <Material.components.MaterialCard
                                                    key={material._id}
                                                    material={material}
                                                    view={() =>
                                                        this.props.view_material(
                                                            material._id
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Drawer>
            );
        }
    }
);
