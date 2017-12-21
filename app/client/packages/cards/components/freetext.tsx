import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { isEqual, pull, noop } from 'lodash';

import * as markdownit from 'markdown-it';
const md = markdownit();

import { Paper, TextField } from 'material-ui';
const log = debug('lumi:packages:cards:components:freetext');
type Markdown = string;

declare var window;

interface IProps {
    text: Markdown;
    answer: string;
    cb?: (value: string) => void;
}

interface IState {
    value: string;
}

export default class FreetextComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleInput = this.handleInput.bind(this);
    }

    public componentDidMount() {
        window.MathJax.Hub.Typeset();
    }

    public handleInput() {
        log(this.state.value);
        this.props.cb ? this.props.cb(this.state.value) : noop();
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({ value: nextProps.answer });
    }

    public render() {
        return (
            <div>
                <Paper style={{ padding: '5px', margin: '5px' }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(
                                this.props.text || '# No markdown'
                            )
                        }}
                    />
                </Paper>

                <Paper style={{ margin: '5px', padding: '5px' }}>
                    <TextField
                        multiLine={true}
                        fullWidth={true}
                        onChange={(e, text) => this.setState({ value: text })}
                        onBlur={this.handleInput}
                        value={this.state.value || ''}
                        hintText="Antwort"
                    />
                </Paper>
            </div>
        );
    }
}
