// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux'; 
import { push } 			from 'react-router-redux';

// material-ui
import Drawer 				from 'material-ui/Drawer';
import AppBar 				from 'material-ui/AppBar';
import IconButton 			from 'material-ui/IconButton';
import { List, ListItem } 	from 'material-ui/List';
import Subheader 			from 'material-ui/Subheader';
import Divider 				from 'material-ui/Divider';
import Toggle 				from 'material-ui/Toggle';

// material-ui -> icons
import SVGClose 			from 'material-ui/svg-icons/navigation/close';
import SVGAdmin 			from 'material-ui/svg-icons/image/details';
import SVGWorksheet 		from 'material-ui/svg-icons/action/book';
import SVGMaterial 			from 'material-ui/svg-icons/action/work';
import SVGGroup 			from 'material-ui/svg-icons/social/group';
import SVGLabel 			from 'material-ui/svg-icons/action/label';
import SVGPerson 			from 'material-ui/svg-icons/social/person';
import SVGProgress 			from 'material-ui/svg-icons/action/trending-up';
import SVGPower 			from 'material-ui/svg-icons/action/power-settings-new';
import SVGExit 				from 'material-ui/svg-icons/action/exit-to-app';

// actions

import { 
	left_drawer_open,
	left_drawer_close
} 							from 'client/state/ui/actions';

// local
import { IState }  			from 'client/state';

interface IStateProps {
	left_drawer_show: boolean;
	// left_drawer_show_names: boolean;
}

interface IDispatchProps {
	left_drawer_open: () => void;
	left_drawer_close: () => void;
	push: (url: string) => void;
	// logout: () => void;
	// shutdown: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class LeftDrawer extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.handleClose = this.handleClose.bind(this);

		this.state = {};
	}

	handleClose() {
		this.props.left_drawer_close();
	}

	render() {
			return (
				<div>
	
				<Drawer
					docked={false}
					open={this.props.left_drawer_show}
					onRequestChange={() => { 
						this.props.left_drawer_show 
						? 
						this.props.left_drawer_close() 
						: 
						this.props.left_drawer_open(); 
					}} 
				>	
					<AppBar 
						showMenuIconButton={true}
						iconElementLeft={<IconButton><SVGClose /></IconButton>}
						onLeftIconButtonTouchTap={() => this.props.left_drawer_close()}
					/>

					<List style={{backgroundColor: '#FFFFFF'}}>
						<Subheader>Users</Subheader>
						<ListItem 
							primaryText="Users"
							leftIcon={<SVGPerson />}
							onTouchTap={() => { this.props.push('/admin/users'); }}
						/>
						<ListItem 
							primaryText="Groups"
							leftIcon={<SVGGroup />}
							onTouchTap={() => { this.props.push('/admin/groups'); }}
						/>
						<Subheader>Material</Subheader>
						<ListItem 
							primaryText="Cards"
							leftIcon={<SVGMaterial />}
							onTouchTap={() => { this.props.push('/admin/cards'); }}
						/>
						<ListItem 
							primaryText="Collections"
							leftIcon={<SVGWorksheet />}
							onTouchTap={() => { this.props.push('/admin/collections'); }}
						/>
						<ListItem 
							primaryText="Tags"
							leftIcon={<SVGLabel />}
							onTouchTap={() => { this.props.push('/admin/tags'); }}
						/>
						<Divider />
						<Subheader>Views</Subheader>
						<ListItem 
							primaryText="Peer instruction"
							leftIcon={<SVGMaterial />}
							onTouchTap={() => { this.props.push('/peer'); }}
						/>
						<ListItem 
							primaryText="Worksheet"
							leftIcon={<SVGWorksheet />}
							onTouchTap={() => { this.props.push('/worksheet'); }}
						/>
						<Divider />
						<Subheader>System</Subheader>
						<ListItem 
							onTouchTap={() => { /* this.props.shutdown() */}}
							primaryText="Shutdown"
							leftIcon={<SVGPower />} 
						/>
					</List>

				</Drawer>
				</div>
			);
		
	}
}

function mapStateToProps(state: IState): IStateProps {   
	return {        
		left_drawer_show: state.ui.left_drawer_show
	};
}

function mapDispatchToProps(dispatch) {
	return {
		left_drawer_open: () => dispatch( left_drawer_open() ),
		left_drawer_close: () => dispatch( left_drawer_close() ),
		push: (url: string) => { 
			dispatch( left_drawer_close() );
			dispatch( push( url ) ); 
		}
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps
)(LeftDrawer);