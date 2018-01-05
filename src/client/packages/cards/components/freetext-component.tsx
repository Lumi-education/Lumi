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
    preview?: boolean;
    error_text: string;
    error_style;
}

interface IState {
    value?: string;
}

export default class FreetextComponent extends React.Component<IProps, IState> {
    private _typeset_locked: boolean;

    constructor(props: IProps) {
        super(props);

        this.state = {
            value: ''
        };

        this._onBlur = this._onBlur.bind(this);
        this._onChange = this._onChange.bind(this);
        this.typeset = this.typeset.bind(this);
        this._typeset_locked = false;
    }

    public componentDidMount() {
        log('componentDidMount');
    }

    public typeset() {
        log('typeset');
        if (!this._typeset_locked) {
            window.MathJax.Hub.Typeset(() => {
                log('typed!');
                this._typeset_locked = false;
            });
        }

        this._typeset_locked = true;
    }

    public _onBlur() {
        log(this.state.value);
        this.props.cb ? this.props.cb(this.state.value) : noop();
    }

    public _onChange(event, value) {
        this.setState({ value });
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({ value: nextProps.answer });
    }

    public componentDidUpdate() {
        log('componentDidUpdate');
        this.typeset();
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

                {this.props.preview ? (
                    <Paper style={{ margin: '5px', padding: '5px' }}>
                        <h3>Preview</h3>
                        <div
                            id="preview"
                            dangerouslySetInnerHTML={{
                                __html: md.render(
                                    this.state.value || '# No markdown'
                                )
                            }}
                        />
                    </Paper>
                ) : null}

                <Paper style={{ margin: '5px', padding: '5px' }}>
                    <TextField
                        multiLine={true}
                        fullWidth={true}
                        errorText={
                            this.state.value !== this.props.answer
                                ? 'state unsaved'
                                : this.props.error_text
                        }
                        errorStyle={this.props.error_style}
                        onChange={this._onChange}
                        onBlur={this._onBlur}
                        value={this.state.value || ''}
                        hintText="Antwort"
                    />
                </Paper>
            </div>
        );
    }
}
