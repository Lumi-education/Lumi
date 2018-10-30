// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { uniq } from 'lodash';

import {
    Avatar,
    Paper,
    Dialog,
    List,
    Divider,
    MenuItem,
    TextField,
    IconMenu,
    ListItem,
    FloatingActionButton,
    RaisedButton,
    IconButton
} from 'material-ui';

import SVGFolder from 'material-ui/svg-icons/file/folder';
import SVGCheckboxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import SVGCheckbox from 'material-ui/svg-icons/toggle/check-box';
import SVGContentAdd from 'material-ui/svg-icons/content/add';
import SVGBack from 'material-ui/svg-icons/navigation/arrow-back';
import SVGAssignment from 'material-ui/svg-icons/action/assignment';

import { _card_type } from 'lib/cards/components/card-type';

import CardsContainer from '../../../container/cards-container';

import AssignMaterialDialog from 'client/dialogs/cards-assign-dialog';

// state
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Folders from 'lib/folders';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import { push } from 'lib/ui/actions';

interface IStateProps {
    folder_id: string;
    current_folder: Folders.models.Folder;
    folder: (folder_id: string) => Folders.models.Folder;
    card: (card_Id: string) => Cards.ICard;
    selected_folder: string;
    selected_cards: string[];
    ui_colors: UI.IUIColors;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
    show_create_folder_dialog?: boolean;
    show_add_material_dialog?: boolean;
    folder_name?: string;
}

export class FoldersIndex extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: Core.i18n.t('folders'), loading_step: 1 });
        this.props
            .dispatch(Folders.actions.get_folders())
            .then(folders_response => {
                this.setState({ loading: 'finished', loading_step: 2 });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={2}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        const all_selected: boolean =
            uniq(
                this.props.current_folder.content.filter(c => c.type === 'card')
            ).length === this.props.selected_cards.length;

        return (
            <div id="folders_index">
                <Paper
                    zDepth={5}
                    style={{ maxWidth: '820px', margin: '20px auto' }}
                >
                    <List>
                        <ListItem
                            primaryText={
                                <h1>{this.props.current_folder.name}</h1>
                            }
                            onClick={() =>
                                this.props.current_folder._id !== 'root_folder'
                                    ? this.props.dispatch(UI.actions.goBack())
                                    : null
                            }
                            leftAvatar={
                                this.props.current_folder._id !==
                                'root_folder' ? (
                                    <Avatar>
                                        <SVGBack />
                                    </Avatar>
                                ) : null
                            }
                            rightIconButton={
                                <IconButton
                                    onClick={() => {
                                        all_selected
                                            ? this.props.dispatch(
                                                  Cards.actions.reset_card_selection()
                                              )
                                            : this.props.dispatch(
                                                  Cards.actions.set_selected_cards(
                                                      this.props.current_folder.content
                                                          .filter(
                                                              c =>
                                                                  c.type ===
                                                                  'card'
                                                          )
                                                          .map(c => c._id)
                                                  )
                                              );
                                    }}
                                >
                                    {all_selected ? (
                                        <SVGCheckbox />
                                    ) : (
                                        <SVGCheckboxOutline />
                                    )}
                                </IconButton>
                            }
                        />
                    </List>
                    <Divider />
                    <List>
                        {' '}
                        {this.props.current_folder.content.map(c => {
                            switch (c.type) {
                                case 'card':
                                    const card = this.props.card(c._id);
                                    return (
                                        <ListItem
                                            leftAvatar={
                                                <Avatar>
                                                    {_card_type(card.card_type)}
                                                </Avatar>
                                            }
                                            onClick={() =>
                                                this.props.dispatch(
                                                    push(
                                                        '/admin/cards/' +
                                                            card._id
                                                    )
                                                )
                                            }
                                            rightIconButton={
                                                <IconButton
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Cards.actions.select_card(
                                                                card._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    {this.props.selected_cards.indexOf(
                                                        card._id
                                                    ) > -1 ? (
                                                        <SVGCheckbox />
                                                    ) : (
                                                        <SVGCheckboxOutline />
                                                    )}
                                                </IconButton>
                                            }
                                            primaryText={card.name}
                                        />
                                    );

                                case 'folder':
                                    const folder = this.props.folder(c._id);
                                    return (
                                        <ListItem
                                            primaryText={folder.name}
                                            leftIcon={<SVGFolder />}
                                            onClick={() => {
                                                this.props.dispatch(
                                                    UI.actions.push(
                                                        '/admin/folders/' +
                                                            c._id
                                                    )
                                                );
                                                this.props.dispatch(
                                                    Cards.actions.reset_card_selection()
                                                );
                                            }}
                                        />
                                    );
                            }
                        })}
                    </List>
                </Paper>

                <UI.components.ActionBar>
                    {this.props.selected_cards.length > 0 ? (
                        <FloatingActionButton
                            onClick={() => {
                                this.props.dispatch(
                                    UI.actions.toggle_assign_material_dialog()
                                );
                            }}
                        >
                            <SVGAssignment />
                        </FloatingActionButton>
                    ) : null}
                    <IconMenu
                        iconButtonElement={
                            <FloatingActionButton>
                                <SVGContentAdd />
                            </FloatingActionButton>
                        }
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom'
                        }}
                        targetOrigin={{
                            horizontal: 'left',
                            vertical: 'top'
                        }}
                    >
                        <MenuItem
                            primaryText={Core.i18n.t('folder_create')}
                            onClick={() => {
                                this.setState({
                                    show_create_folder_dialog: true
                                });
                            }}
                        />
                        <MenuItem
                            primaryText={Core.i18n.t('card_add')}
                            onClick={() => {
                                this.setState({
                                    show_add_material_dialog: true
                                });
                            }}
                        />
                    </IconMenu>
                </UI.components.ActionBar>
                <Dialog
                    open={this.state.show_add_material_dialog}
                    title={Core.i18n.t('card_add')}
                    autoScrollBodyContent={true}
                    contentStyle={{
                        width: '100%',
                        maxWidth: 'none'
                    }}
                    onRequestClose={() =>
                        this.setState({ show_add_material_dialog: false })
                    }
                    actions={[
                        <RaisedButton
                            label={Core.i18n.t('cancel')}
                            onClick={() =>
                                this.setState({
                                    show_add_material_dialog: false
                                })
                            }
                            secondary={true}
                        />,
                        <RaisedButton
                            label={Core.i18n.t('add')}
                            onClick={() => {
                                this.props.dispatch(
                                    Folders.actions.add_material(
                                        this.props.folder_id,
                                        this.props.selected_cards
                                    )
                                );
                                this.setState({
                                    show_add_material_dialog: false
                                });
                                this.props.dispatch(
                                    Cards.actions.reset_card_selection()
                                );
                            }}
                            secondary={true}
                        />
                    ]}
                >
                    <CardsContainer />
                </Dialog>
                <Dialog
                    open={this.state.show_create_folder_dialog}
                    title={Core.i18n.t('folder_create')}
                    actions={[
                        <RaisedButton
                            label={Core.i18n.t('cancel')}
                            onClick={() =>
                                this.setState({
                                    show_create_folder_dialog: false
                                })
                            }
                            secondary={true}
                        />,
                        <RaisedButton
                            label={Core.i18n.t('create')}
                            onClick={() => {
                                this.props.dispatch(
                                    Folders.actions.create_folder(
                                        this.state.folder_name,
                                        this.props.current_folder._id
                                    )
                                );
                                this.setState({
                                    show_create_folder_dialog: false
                                });
                            }}
                            primary={true}
                        />
                    ]}
                >
                    <TextField
                        fullWidth={true}
                        hintText={Core.i18n.t('name')}
                        value={this.state.folder_name}
                        onChange={(e, v) => this.setState({ folder_name: v })}
                        floatingLabelText={Core.i18n.t('name')}
                    />
                </Dialog>
                <AssignMaterialDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const folder_id = ownProps.match.params.folder_id;

    return {
        folder_id,
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        current_folder: Folders.selectors.id(state, folder_id),
        folder: (_folder_id: string) => Folders.selectors.id(state, _folder_id),
        selected_folder: state.folders.ui.selected_folder,
        ui_colors: state.ui.colors,
        selected_cards: state.cards.ui.selected_cards
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(FoldersIndex);
