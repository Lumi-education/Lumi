import * as React 		from 'react';

import { validate } 	from 'lib/utils';

import { pull } 		from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import SVGCheck from 'material-ui/svg-icons/navigation/check'; 
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGRemove from 'material-ui/svg-icons/content/remove';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import Divider from 'material-ui/Divider';
import { 
	List, 
	ListItem
} from 'material-ui/List';

import { FreeText } from 'lib/material/types';

interface IStateProps {
	material: FreeText;
}

interface IDispatchProps {
	update: (query: Object, update: Object) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
	add_answer: string;
	text: string;
	name: string;
}

export default class Component extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			add_answer: '',
			text: '',
			name: ''
		}

		this.add_answer_list = this.add_answer_list.bind(this);
		this.remove_answer_list = this.remove_answer_list.bind(this);
	}

	componentWillMount() {
		this.setState({ 
			text: this.props.material.text,
			name: this.props.material.name
		});
	}

	add_answer_list(answer: string) {
		const new_list = [ ...this.props.material.answer_list, answer];
		this.props.update({ _id: this.props.material._id }, { answer_list: new_list });
	}

	remove_answer_list(answer: string) {
		const new_list = pull(this.props.material.answer_list, answer);
		this.props.update({ _id: this.props.material._id }, { answer_list: new_list });
	}

	render() {
		const material = this.props.material;
			return (
				<div>
					<TextField 
						hintText="Name" 
						floatingLabelText="Name" 
						multiLine 
						fullWidth 
						value={this.state.name} 
						onChange={ (e, name) => { this.setState({ name })}}
						onBlur={() => this.props.update({ _id: this.props.material._id}, { name: this.state.name })}
						underlineShow={false} />
					<Divider />
					<TextField 
						hintText="Text" 
						floatingLabelText="Text" 
						multiLine 
						fullWidth 
						value={this.state.text} 
						onChange={ (e, text) => { this.setState({ text })}}
						onBlur={() => this.props.update({ _id: this.props.material._id},{ text: this.state.text })}
						underlineShow={false} />
					<Divider />
					<List>
								{material.answer_list.map(answer_option => 
									<ListItem 
									key={answer_option}
									rightIconButton={<IconButton onClick={ () => this.remove_answer_list(answer_option) }><SVGRemove /></IconButton> }
									>
									{answer_option}
									</ListItem>
								)}
								<ListItem> 
									<TextField 
										name="add_answer_option"
										value={this.state.add_answer} 
										onChange={(e,a) => this.setState({ add_answer: a })}
									/>
									<FlatButton 
										label="Hinzufügen" 
										onClick={ () => { this.add_answer_list( this.state.add_answer ) } }
									/>
								</ListItem>
							</List>
					</div>

			);
	}
};