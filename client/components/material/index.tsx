import * as React from 'react';

// types
import {
	FreeText,
	FreeTextMeta,
	Markdown,
	Material,
	MaterialMeta,
	MultipleChoice,
	MultipleChoiceMeta,
	Sort,
	SortMeta,
	TaskMeta,
 } 	from '../../state/material/types';

 // components
import FreeTextComponent 		from './freetext';
import MarkdownComponent 		from './markdown';
import MultipleChoiceComponent 	from './multiple-choice';
import SortComponent 			from './sort';

interface StateProps {
	material: Material;
	meta: MaterialMeta;
	show_answer: boolean;
}

interface DispatchProps {
	material_meta_update: (material_meta_id: string, update: Object) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export default class MaterialSwitch extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		switch (this.props.material.material_type) {
			case 'multiplechoice':
					const multiplechoice: MultipleChoice = this.props.material as MultipleChoice;
				 return (
						<MultipleChoiceComponent
							task={multiplechoice.task}
							show_correct_answers={this.props.show_answer}
							material={multiplechoice}
							cb={(value: string[], score: number) => { 
								this.props.show_answer ? null : this.props.material_meta_update(this.props.meta._id, { value, score });  
							}}
							answer={(this.props.meta as MultipleChoiceMeta).value as string[] || []}
						/>
					);

			case 'sort':
					const sort: Sort = this.props.material as Sort;
				 return (
						<SortComponent
							task={sort.task}
							cb={(value: string[], score: number) => this.props.material_meta_update(this.props.meta._id, { value, score })}
							material_items={sort.items}
							user_items={(this.props.meta as SortMeta).value as string[]}
						/>
				);

			case 'markdown':
			const markdown: Markdown  = this.props.material as Markdown;
			return (
						<MarkdownComponent markdown={markdown.text} />
				);

			case 'freetext':
			const freetext: FreeText = this.props.material as FreeText;
			return (
				<FreeTextComponent
					task={freetext.task}
					cb={(value: string, score: number) => this.props.material_meta_update(this.props.meta._id, { value, score })}
					answer_options={freetext.items}
					user_answer={(this.props.meta as FreeTextMeta).value}
				/>);

			default:
				return (<div>Material-type not found: {this.props.material.material_type} </div>);
		}
	}
}
