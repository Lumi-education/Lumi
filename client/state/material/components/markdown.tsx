import Paper 		from "lib/components/Paper";
import * as React from "react";

import * as markdownit from "markdown-it";
const md = markdownit();

import { Markdown } 	from "lib/types";

interface IProps {
	markdown: Markdown;
}

interface IState {}

export default class Material_markdown extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	public render() {
		return (
			<div>
				<Paper>
					<div dangerouslySetInnerHTML={{
					__html: md.render(this.props.markdown),
				  }}></div>
				</Paper>
			</div>
		);

	}
}
