// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { Map } 				from 'immutable';

import Paper from 'material-ui/Paper';
import { List, ListItem } 	from 'material-ui/List';
import IconButton 			from 'material-ui/IconButton';
import SVGClose 			from 'material-ui/svg-icons/navigation/close';
import FilterBar 			from 'client/components/filter-bar';

// selectors
import { groups_list } 		from 'client/state/groups/selectors';

// types
import { IState }  			from 'client/state';
import { IGroup } 			from 'lib/types';

// actions
import { 
	get_groups,
	delete_group 
}							from 'client/state/groups/actions';

interface IStateProps {
	groups: Array<IGroup>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	filter: Array<string>;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			filter: []
		};
	}

	componentWillMount() {
		this.props.dispatch( get_groups() );
	}

	public render() {
		return (
			<div>
				<FilterBar filter={this.state.filter} set_filter={(filter) => this.setState({ filter })} />
				<Paper style={{ margin: '20px', padding: '20px'}}>
					<List>
						{
							this.props.groups
							.filter(group => this.state.filter.length > 0 ? this.state.filter.indexOf(group.name) > -1 : true)
							.map(group => 
								<ListItem 
									primaryText={group.name} 
									rightIconButton={
										<IconButton onClick={() => this.props.dispatch( delete_group( group._id) )}>
												<SVGClose />
										</IconButton>
									}
								/>
							)
						}
					</List>
				</Paper>
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
	return {
		groups: groups_list(state)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: (action) => dispatch( action )
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(AdminGroups);
