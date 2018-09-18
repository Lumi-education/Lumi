import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { isEqual, pull, noop } from 'lodash';

import Markdown from './markdown';

import { Paper, TextField } from 'material-ui';
const log = debug('lumi:packages:cards:components:freetext');

declare var window;

interface IProps {
    card_id: string;
    text: string;
    answer: string;
    cb?: (value: string) => void;
    preview?: boolean;
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
    }

    public componentDidMount() {
        log('componentDidMount');
        this.setState({ value: this.props.answer });
    }

    public _onBlur() {
        log(this.state.value);
        this.props.cb ? this.props.cb(this.state.value) : noop();
    }

    public _onChange(event, value) {
        this.props.cb ? this.props.cb(value) : noop();
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({ value: nextProps.answer });
    }

    public componentDidUpdate() {
        log('componentDidUpdate');
    }

    public render() {
        return (
            <div>
                <Paper style={{ padding: '5px', margin: '5px' }}>
                    <Markdown
                        card_id={this.props.card_id}
                        markdown={this.props.text}
                    />
                </Paper>

                <Paper style={{ margin: '5px', padding: '5px' }}>
                    <h3>Preview</h3>
                    <Markdown
                        card_id={this.props.card_id}
                        markdown={this.state.value}
                    />
                </Paper>

                <Paper style={{ margin: '5px', padding: '5px' }}>
                    <TextField
                        multiLine={true}
                        fullWidth={true}
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
