import * as React 			from 'react';
import { connect } 			from 'react-redux';

// material-ui
import AppBar 				from 'material-ui/AppBar';
import Drawer 				from 'material-ui/Drawer';
import IconButton 			from 'material-ui/IconButton';
import { List, ListItem } 	from 'material-ui/List';

// material-ui -> icons
import SVGClose 			from 'material-ui/svg-icons/navigation/close';

// actions
import { push } 			from 'client/state/ui/actions';
import {
	left_drawer_close,
	left_drawer_open,
} from 'client/state/ui/actions';

// selector
import {
	select_collections_as_array
}							from 'client/state/collections/selectors';

// types
import { ICollection } 		from 'lib/types';
import { IState }  			from 'client/state';

interface IStateProps {
	left_drawer_show: boolean;
	collections: Array<ICollection>;
}

interface IDispatchProps {
	push: (url: string) => void;
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UserLeftDrawer extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render() {
			return (
				<div>

				<Drawer
					docked={false}
					open={this.props.left_drawer_show}
					onRequestChange={() => this.props.dispatch( left_drawer_close() )}
					containerStyle={{ backgroundColor: '#FFFFFF' }}
				>
					<AppBar
						showMenuIconButton={true}
						iconElementLeft={<IconButton><SVGClose /></IconButton>}
						onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_close() )}
					/>

					<List>
						{
							this.props.collections.map(c => 
							<ListItem 
								primaryText={c.name} 
								onClick={() => this.props.dispatch( push('/user/collections/' + c._id + '/cards') )}
							/>
							)
						}
					</List>
				</Drawer>
				</div>
			);

	}
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
	return {
		left_drawer_show: state.ui.left_drawer_show,
		collections: select_collections_as_array(state)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: (action) => dispatch(action)
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(UserLeftDrawer);
