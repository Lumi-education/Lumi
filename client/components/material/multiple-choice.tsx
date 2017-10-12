import * as React from 'react';
import { connect } from 'react-redux';

import * as markdownit from 'markdown-it';
const md = markdownit();

import { isEqual, pull } 	from 'lodash';
import SVGHelp 	from 'material-ui/svg-icons/action/help';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import IconButton 	from 'material-ui/IconButton';
import Paper 		from 'material-ui/Paper';

import {
	MultipleChoice as IMultipleChoice,
} from '../../state/material/types';

type Markdown = string;

interface Props {
	material: IMultipleChoice;
	cb: (value: string[], score: number) => void;
	answer: string[];
	show_correct_answers: boolean;
	task: Markdown;
	hints: number;
	hint: () => void;
}

interface State {}

export default class MultipleChoiceContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	public componentWillMount() {
		if (!this.props.answer) {
			this.props.cb(null, 0);
		}
	}

	public handleClick(answer_id) {
		const newArray = [ ...this.props.answer ];
		if (this.props.answer.some((answer) => answer === answer_id)) {
			pull(newArray, answer_id);
		} else {
			newArray.push(answer_id);
		}

		const correct_answers = this.props.material.items.filter((i) => i.charAt(0) === 'x' || i.charAt(0) === 'X');

		const score = isEqual(newArray.slice(0).sort() , correct_answers.sort()) ? 1 : 0;
		this.props.cb(newArray, score);
	}

	public render() {
			return (
			<div>
				<Paper 
					style={{
						padding: '20px',
						margin: '10px',
				 	}}
				>
				<div 
				 	dangerouslySetInnerHTML={{
						__html: md.render(this.props.task),
				  	}}
				/>
				</Paper>

				 {
					 this.props.material.items.map((item) =>
					<Paper
						onClick={() => { this.handleClick(item); }}
						zDepth={this.props.answer.some((answerv) => answerv === item) ? 5 : 1}
						style={{
							backgroundColor: this.props.answer.some((answerv) => answerv === item) ? '#2980b9' : '#FFFFFF',
							padding: '2px',
							margin: '10px',
						}}
					>
					{ 
						this.props.show_correct_answers 
						? 
						 item.charAt(0) === 'x' ? <SVGCheck /> : <SVGClose />
						: 
						null 
					}
						<div 
							dangerouslySetInnerHTML={{
								__html: md.render(item.replace(/^x |^o /, '')),
				  			}}
						/>
					</Paper>,
					 )
				 }
				<Paper 
					onClick={this.props.hint} 
					style={{
						padding: '2px',
						margin: '10px',
					}}
				><IconButton><SVGHelp /></IconButton>Hilfe
				</Paper>
				{this.props.material.hints.map((hint, i) => {
					if (i < this.props.hints) { return (
					<Paper 
						style={{
							padding: '2px',
							margin: '10px',
						}}
					><IconButton><SVGHelp /></IconButton><div dangerouslySetInnerHTML={{ __html: md.render(hint)}} /> 
					</Paper>
					); }
				})}

			</div>
		);

	}
}
