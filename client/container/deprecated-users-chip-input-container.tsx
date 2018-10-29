// modules
import * as React from 'react';
import { connect } from 'react-redux';

import * as Autosuggest from 'react-autosuggest';
import * as match from 'autosuggest-highlight/match';
import * as parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';

import * as Users from 'lib/users';

interface IPassedProps {
    user_ids: string[];
    onAddUser: (user_id: string) => void;
    onDeleteUser: (user_id: string) => void;
}

interface IStateProps extends IPassedProps {
    classes: any;

    user: (user_id: string) => Users.IUser;
    users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    textFieldInput: string;
}

export class UsersChipInputContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            textFieldInput: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
    }

    public handleSuggestionsFetchRequested = ({ value }) => {
        //
    };

    public handleSuggestionsClearRequested = () => {
        //
    };

    public handletextFieldInputChange = (event, { newValue }) => {
        this.setState({
            textFieldInput: newValue
        });
    };

    public handleAddChip(user: Users.IUser) {
        this.props.onAddUser(user._id);
    }
    public handleDeleteChip(user_id: string, index) {
        this.props.onDeleteUser(user_id);
    }

    public render() {
        const { classes, ...rest } = this.props;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
                }}
                renderInputComponent={renderInput}
                suggestions={this.props.users}
                onSuggestionsFetchRequested={
                    this.handleSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                    this.handleSuggestionsClearRequested
                }
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                onSuggestionSelected={(e, { suggestion }) => {
                    this.handleAddChip(suggestion);
                    e.preventDefault();
                }}
                focusInputOnSuggestionClick={false}
                inputProps={{
                    classes,
                    chips: this.props.user_ids.map(user_id =>
                        this.props.user(user_id)
                    ),
                    onChange: this.handletextFieldInputChange,
                    value: this.state.textFieldInput,
                    onAdd: chip => this.handleAddChip(chip),
                    onDelete: (chip, index) =>
                        this.handleDeleteChip(chip, index),
                    ...rest
                }}
            />
        );
    }
}

function mapStateToProps(state: Users.IState, ownProps): IStateProps {
    return {
        user: (user_id: string) => Users.selectors.user(state, user_id),
        user_ids: ownProps.user_ids,
        classes: ownProps.classes,
        onAddUser: ownProps.onAddUser,
        onDeleteUser: ownProps.onDeleteUser,
        users: state.users.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0
    },
    suggestion: {
        display: 'block'
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    },
    textField: {
        width: '100%'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UsersChipInputContainer)
);

function renderInput(inputProps) {
    const {
        classes,
        autoFocus,
        value,
        onChange,
        onAdd,
        onDelete,
        chips,
        ref,
        ...other
    } = inputProps;

    return (
        <ChipInput
            floatingLabelText="Users"
            fullWidth={true}
            clearInputValueOnChange={true}
            allowDuplicates={false}
            onUpdateInput={onChange}
            onAdd={onAdd}
            dataSourceConfig={{
                text: 'name',
                value: '_id'
            }}
            dataSource={other.users}
            onDelete={onDelete}
            value={chips}
            inputRef={ref}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
        <MenuItem
            selected={isHighlighted}
            component="div"
            onMouseDown={e => e.preventDefault()} // prevent the click causing the input to be blurred
        >
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
}
function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square={true}>
            {children}
        </Paper>
    );
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}
