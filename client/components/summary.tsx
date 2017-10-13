import * as React 				from 'react';
import * as id 					from 'shortid';
import { isEqual, assign } 		from 'lodash';
import FlatButton 				from 'material-ui/FlatButton';

import Dialog 					from 'material-ui/Dialog';
import { List, ListItem } 		from 'material-ui/List';

import SVGClose 				from 'material-ui/svg-icons/navigation/close';
import SVGCheck 				from 'material-ui/svg-icons/navigation/check';

import { Collection } 			from '../state/collection/selector';

interface StateProps {
	collection: Collection;
	show: boolean;
}

interface DispatchProps {
	push: (url: string) => void;
	submit: () => void;
	reset: () => void;

	dialog_close: () => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export default class Summary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		try {
			return (
				<div id="worksheet-summary">
					<Dialog
						contentStyle={{width: '100%', maxWidth: 'none'}}
						title={this.props.collection.name}
						actions={[
							<FlatButton label="Close" primary={true} onClick={this.props.dialog_close} />,
							<FlatButton label="Zurücksetzen" primary={true} onClick={this.props.reset} />,
							<FlatButton label="Abgeben" primary={true} onClick={this.props.submit} />
						]}
						autoScrollBodyContent={true}
						modal={false}
						open={this.props.show}
						onRequestClose={this.props.dialog_close}
					>
						<List>
							<ListItem 
								primaryText="Aufgaben" 
								nestedItems={
										this.props.collection.material_list.map((m, i) => 
											<ListItem 
												primaryText={(i + 1) + '. ' + m.name} 
												onClick={() => {
													this.props.push('/worksheet/' + this.props.collection._id + '/material/' + m._id);
													this.props.dialog_close();
												}}
												rightIcon={m.meta.score > 0 ? <SVGCheck /> : <SVGClose />} 
											/>
								)}
							/>
						</List>
						{
							this.props.collection.meta.submitted 
							?
							<List>
								<ListItem 
									primaryText={
										this.props.collection.material_list
										.map(m => m.meta)
										.filter(m => m.score !== undefined && m.score > 0)
										.length 
										+ ' von ' + 
										this.props.collection.material_list
										.map(m => m.meta)
										.filter(m => m.score !== undefined).length 
										+ ' richtig'  
									} 
								/>
							</List>
							:
							null 
						}
					</Dialog>
				</div>);	
		} catch (err) { return <div>{err}</div>; }
			
	}
}