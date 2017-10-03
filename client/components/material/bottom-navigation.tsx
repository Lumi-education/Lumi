import * as React from 'react';

import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import SVGHelp from 'material-ui/svg-icons/action/help';
import SVGOverview from 'material-ui/svg-icons/av/featured-play-list';
import SVGNote from 'material-ui/svg-icons/av/note';
import SVGFlag from 'material-ui/svg-icons/content/flag';
import SVGAssist from 'material-ui/svg-icons/image/assistant';
import SVGCamera from 'material-ui/svg-icons/image/photo-camera';

import {
	BottomNavigation,
	BottomNavigationItem,
} 						from 'material-ui/BottomNavigation';
import SVGAssignment from 'material-ui/svg-icons/action/assignment';

import Menu 	from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover 	from 'material-ui/Popover';

interface StateProps {
	show_next: boolean;
	show_prev: boolean;
}

interface DispatchProps {
	next?: () => void;
	prev?: () => void;
	summary_show: () => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {
	anchorEl?;
	open?: boolean;
}

export default class Material extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			anchorEl: null,
			open: false,
		};
		this.handleTouchTap = this.handleTouchTap.bind(this);
	}

	public handleTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
		  open: true,
		  anchorEl: event.currentTarget,
		});
	  }

	public render() {
			return (
				<div>
					<Popover 
						open={this.state.open} 
						anchorEl={this.state.anchorEl} 
						anchorOrigin={{horizontal: 'middle', vertical: 'top'}} 
						targetOrigin={{horizontal: 'middle', vertical: 'bottom'}} 
						onRequestClose={() => this.setState({ open: false })} 
					>
					<Menu>
						<MenuItem 
							onClick={() => { this.props.summary_show(); this.setState({ open: false}); }} 
							leftIcon={<SVGOverview />} 
							primaryText="Übersicht" 
						/>
					</Menu>
					</Popover>

					<BottomNavigation style={{ position: 'fixed', bottom: '0px', left: '0px', right: '0px', zIndex: 501 }}>
						<BottomNavigationItem 
							style={{display: this.props.show_prev ? 'block' : 'none'}} 
							onTouchTap={this.props.prev} 
							icon={<SVGLeft />} 
						/>

						<BottomNavigationItem onTouchTap={this.handleTouchTap} icon={<SVGAssignment />} />

						<BottomNavigationItem 
							style={{display: this.props.show_next ? 'block' : 'none'}} 
							onTouchTap={this.props.next} 
							icon={<SVGRight />} 
						/>
					</BottomNavigation>
				</div>
		);
	}
}
