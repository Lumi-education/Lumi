// import { assign, isEqual } from 'lodash';
// import FlatButton from 'material-ui/FlatButton';
// import * as qs from 'query-string';
// import * as React from 'react';
// import { connect } from 'react-redux';
// import * as id from 'shortid';

// import {
// 	FreeText,
// 	Markdown,
// 	Material,
// 	MaterialMeta,
// 	MultipleChoice,
// 	MultipleChoiceMeta,
// 	Sort,
// 	SortMeta,
// 	TaskMeta,
// } from '../../state/material/types';

// import Paper from 'material-ui/Paper';
// import AppBar from 'material-ui/AppBar';
// import Dialog from 'material-ui/Dialog';
// import { List, ListItem } from 'material-ui/List';

// import SVGCheck from 'material-ui/svg-icons/navigation/check';
// import SVGClose from 'material-ui/svg-icons/navigation/close';

// import { collection_create_meta } from '../../state/collection/actions';
// import { Collection, CollectionMeta } from '../../state/collection/types';

// import {
// 	create_material_meta,
// 	material_meta_update,
// } from '../../state/material/actions';

// import { left_drawer_open } from '../../state/ui/actions';

// interface StateProps {
// 	collection: Collection;
// 	show: boolean;

// 	tasks: Material[];
// }

// interface DispatchProps {
// 	push: (url: string) => void;
// 	submit: () => void;

// 	dialog_close: () => void;
// }

// interface Props extends StateProps, DispatchProps { }

// interface State { }

// export default class Summary extends React.Component<Props, State> {
// 	constructor(props: Props) {
// 		super(props);
// 	}

// 	public render() {
// 		try {
// 			return (
// 				<div id="worksheet-summary">
// 				<Dialog
// 					contentStyle={{ width: '100%', maxWidth: 'none' }}
// 					title={this.props.collection.name}
// 					actions={[
// 						<FlatButton label="Close" primary={true} onClick={this.props.dialog_close} />,
// 						<FlatButton label="Submit" primary={true} keyboardFocused={true} onClick={this.props.submit} />
// 					]}
// 					autoScrollBodyContent={true}
// 					modal={false}
// 					open={this.props.show}
// 					onRequestClose={this.props.dialog_close}
			
// 				>
// 					<List>
// 						<ListItem
// 							primaryText="Aufgaben"
// 							nestedItems={this.props.tasks.map((t, i) =>
// 								<ListItem
// 									primaryText={(i + 1) + '. '}
// 									onClick={() => {
// 										this.props.push(
// 											'/material?material=' + t._id + '&collection=' + this.props.collection._id + '&type=worksheet'
// 										);
// 										this.props.dialog_close();
// 									}}
// 									rightIcon={t.value ? <SVGCheck /> : null}
// 								/>)}
// 						/>
// 					</List>
// 					<List>
// 						<ListItem 
// 							primaryText={this.props.tasks.filter((t) => t.score !== undefined).length + 
// 							' von ' + this.props.tasks.length + ' bearbeitet.'} 
// 						/>
// 					</List>
// 				</Dialog>
			
// 			</div>
// 			);
// 		} catch (err) { return <div>{err}</div>; }

// 	}
// }
