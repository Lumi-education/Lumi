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
import { push } 			from '../state/ui/actions';
import {
	left_drawer_close,
	left_drawer_open,
} from '../state/ui/actions';

// selector
import { get_collection_list } 		from '../state/collection/selector';

// types
import { State as Root_State }  			from '../state';
import { Collection } 		from '../state/collection/selector';

interface StateProps {
	left_drawer_show: boolean;
	collections: Array<Collection>;
}

interface DispatchProps {
	push: (url: string) => void;
	dispatch: (action) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class LeftDrawer extends React.Component<Props, State> {
	constructor(props: Props) {
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
						style={{ backgroundColor: '#FFFFFF'}}
						showMenuIconButton={true}
						iconElementLeft={<IconButton><SVGClose /></IconButton>}
						onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_close() )}
					/>

					<List>
						{this.props.collections.map(c => 
							<ListItem 
								primaryText={c.name} 
								onClick={() => 
									this.props.dispatch( push('/worksheet/' + c._id + '/material/' + c.material[0]) )
								}
							/>
							)
						}
					</List>
				</Drawer>
				</div>
			);

	}
}

function mapStateToProps(state: Root_State, ownProps: {}): StateProps {
    return {
		left_drawer_show: state.ui.left_drawer_show,
		collections: get_collection_list(state)
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
)(LeftDrawer);
