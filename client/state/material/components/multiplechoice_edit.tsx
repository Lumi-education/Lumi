import * as React 		from 'react';

import { validate } 	from 'lib/utils';

import { pull } 		from 'lodash';
import {
	Card, 
	CardActions, 
	CardHeader, 
	CardText,
	CardMedia
}						 from 'material-ui/Card';
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

import Avatar 		from 'material-ui/Avatar';

import { MultipleChoice } from 'lib/material/types';

interface IStateProps {
	material: MultipleChoice;
}

interface IDispatchProps {
	update: (query: Object, update: Object) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
	add_answer_option: string;
	text: string;
	name: string;
}

export default class Component extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			add_answer_option: '',
			text: '',
			name: ''
		}

		this.add_answer_option = this.add_answer_option.bind(this);
		this.remove_answer_option = this.remove_answer_option.bind(this);
		this.add_answer_list = this.add_answer_list.bind(this);
	}

	componentWillMount() {
		this.setState({ 
			text: this.props.material.text,
			name: this.props.material.name
		});
	}

	add_answer_option() {
		const new_options = [ ...this.props.material.answer_options, this.state.add_answer_option ];
		this.props.update({ _id: this.props.material._id }, { answer_options: new_options })
		this.setState({ add_answer_option: '' });
	}

	remove_answer_option(answer: string) {
		const new_options = this.props.material.answer_options.filter(option => option !== answer);
		if (this.props.material.answer_list.indexOf(answer) > -1) { 
			this.remove_answer_list( answer );
		}
		this.props.update({ _id: this.props.material._id }, { answer_options: new_options })
	}

	add_answer_list(answer: string) {
		const new_list = [ ...this.props.material.answer_list, answer];
		this.props.update({ _id: this.props.material._id} , { answer_list: new_list });
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
						onBlur={() => this.props.update({ _id: this.props.material._id }, { text: this.state.text })}
						underlineShow={false} />
					<Divider />
					<List>
								{material.answer_options.map(answer_option => 
									<ListItem 
									style={{ 
										backgroundColor: validate(material.answer_list, answer_option) ? '#27ae60' : '#FFFFFF'
									}} 
									key={answer_option}
									leftIcon={<IconButton onClick={validate(material.answer_list, answer_option) ? () => this.remove_answer_list(answer_option) : () => this.add_answer_list( answer_option )} > {validate(material.answer_list, answer_option) ? <SVGCheck /> : <SVGClose /> } </IconButton>}
									rightIconButton={<IconButton onClick={ () => this.remove_answer_option(answer_option) }><SVGRemove /></IconButton> }
									>
									{answer_option}
									</ListItem>
								)}
								<ListItem> 
									<TextField 
										name="add_answer_option"
										value={this.state.add_answer_option} 
										onChange={(e,a) => this.setState({ add_answer_option: a })}
									/>
									<FlatButton 
										label="Hinzufügen" 
										onClick={ () => this.add_answer_option() }
									/>
								</ListItem>
							</List>
					</div>

			);
	}
};

				/*<Card style={{ margin: '10px'}}>
						<CardHeader
						avatar={<Avatar>M</Avatar>}
						title={material.name}
						subtitle={material.description}
						/>
						{material.image ? <CardMedia><span style={{ width: '200px'}}><img style={{ width: '200px'}} src={material.image} /></span></CardMedia> : null}
						<CardText>
							<TextField 
							name={this.props.material._id}
							multiLine={true}
							value={this.state.text}
							onChange={ (e, text) => { this.setState({ text })}}
							onBlur={() => this.props.update_text( this.state.text )}
							fullWidth
							/>
							
							<List>
								{material.answer_options.map(answer_option => 
									<ListItem 
									style={{ 
										backgroundColor: validate(material.answer_list, answer_option) ? '#27ae60' : '#FFFFFF'
									}} 
									key={answer_option}
									leftIcon={<IconButton onClick={validate(material.answer_list, answer_option) ? () => this.remove_answer_list(answer_option) : () => this.add_answer_list( answer_option )} > {validate(material.answer_list, answer_option) ? <SVGCheck /> : <SVGClose /> } </IconButton>}
									rightIconButton={<IconButton onClick={ () => this.remove_answer_option(answer_option) }><SVGRemove /></IconButton> }
									>
									{answer_option}
									</ListItem>
								)}
								<ListItem> 
									<TextField 
										name="add_answer_option"
										value={this.state.add_answer_option} 
										onChange={(e,a) => this.setState({ add_answer_option: a })}
									/>
									<FlatButton 
										label="Hinzufügen" 
										onClick={ () => this.add_answer_option() }
									/>
								</ListItem>
							</List>
						</CardText>
					</Card>*/