declare var process;

import * as raven from 'raven-js';

raven
    .config(
        process.env.NODE_ENV === 'production'
            ? 'https://52d9ddab963746b6bb4a35653d4c44a1@sentry.io/277415'
            : undefined,
        {
            release: process.env.VERSION,
            environment: process.env.NODE_ENV,
            tags: {
                component: 'client'
            },
            autoBreadcrumbs: true
        }
    )
    .install();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import Router from './router';
import store from 'client/store';

import theme from './style/theme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ReactChartkick from 'react-chartkick';
import * as Chart from 'chart.js';

ReactChartkick.addAdapter(Chart);

import * as moment from 'moment';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

if (localStorage.getItem('lumi_version') !== process.env.VERSION) {
    localStorage.clear();
}

localStorage.setItem('lumi_version', process.env.VERSION);

moment.locale('de');

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
            <Router history={history} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('lumi')
);
