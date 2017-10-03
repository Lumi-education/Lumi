import * as React from 'react';
import { connect } from 'react-redux';

import Paper 		from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import * as markdownit from 'markdown-it';
const md = markdownit();

type Markdown = string;

interface Props {
	cb: (text: string, score: number) => void;
	answer_options: string[];
	user_answer: string;
	task: Markdown;
}

interface State {}

export default class Freetext extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.handle_input = this.handle_input.bind(this);
		this.evaluate = this.evaluate.bind(this);
	}

	public handle_input(event, text) {
		this.props.cb(text, this.evaluate(text));
	}

	public evaluate(answer: string): number {
		return (this.props.answer_options.indexOf(answer) > -1 ? 1 : 0);
	}

	public render() {
		return (
			<div>
				<Paper>
					<div dangerouslySetInnerHTML={{
					__html: md.render(this.props.task),
				  }}></div>
				</Paper>

				 <Paper>
					<TextField
					multiLine
					fullWidth
					onChange={this.handle_input}
					value={this.props.user_answer}
					hintText="Antwort"
					 />
				 </Paper>

			</div>
		);
	}
}
