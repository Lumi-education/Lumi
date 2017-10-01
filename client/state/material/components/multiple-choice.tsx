import * as React from "react";
import { connect } from "react-redux";

import * as markdownit from "markdown-it";
const md = markdownit();

import { isEqual, pull } 	from "lodash";

import Paper 		from "material-ui/Paper";

import {
	MultipleChoice as IMultipleChoice,
} from "lib/material/types";

import { Markdown } from "lib/types";

interface IProps {
	material: IMultipleChoice;
	cb: (value: string[], score: number) => void;
	answer: string[];
	show_correct_answers: boolean;
	task: Markdown;
}

interface IState {}

export default class MultipleChoiceContainer extends React.Component<IProps, IState> {
	constructor(props: IProps) {
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
		if (this.props.answer.some((answer) => answer == answer_id)) {
			pull(newArray, answer_id);
		} else {
			newArray.push(answer_id);
		}

		const correct_answers = this.props.material.items.filter((i) => i.charAt(0) == "x" || i.charAt(0) == "X");

		const score = isEqual(newArray.slice(0).sort() , correct_answers.sort()) ? 1 : 0;
		this.props.cb(newArray, score);
	}

	public render() {

		if (!this.props.show_correct_answers) {
			return (
			<div>
				<Paper style={{
					padding: "20px",
					margin: "10px",
				 }}>
				 <div dangerouslySetInnerHTML={{
					__html: md.render(this.props.task),
				  }}></div>
				</Paper>

				 {
					 this.props.material.items.map((item) =>
					 <Paper
					 onClick={
						 () => { this.handleClick(item); }}
					 zDepth={this.props.answer.some((answerv) => answerv == item) ? 5 : 1}
					 style={{
							backgroundColor: this.props.answer.some((answerv) => answerv == item) ? "#2980b9" : "#FFFFFF",
							padding: "2px",
							margin: "10px",
				 		}}>
						 <div dangerouslySetInnerHTML={{
							__html: md.render(item.replace(/^x |^o /, "")),
				  			}}>
						</div>
						 </Paper>,
					 )
				 }

			</div>
		);
		} else {
			return (
			<div>
				<Paper style={{
					padding: "20px",
					margin: "10px",
				 }}>{this.props.material.task}</Paper>

				 {
					 this.props.material.items.map((item) =>
					 <Paper
					 zDepth={this.props.answer.some((answerv) => answerv == item) ? 5 : 1}
					 style={{
							backgroundColor: this.props.material.solution.some((answerv) => answerv == item) ? "#27ae60" : "#c0392b",
							padding: "20px",
							margin: "10px",
				 		}}>{item}</Paper>,
					 )
				 }

			</div>
		);
		}

	}
}
