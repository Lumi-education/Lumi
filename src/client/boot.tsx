declare var process;

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { history, default as store } from 'client/store';
// import createHashHistory from 'history/createHashHistory';
import { ConnectedRouter } from 'connected-react-router';
import theme_v0 from './style/theme';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { default as V0MuiThemeProvider } from 'material-ui/styles/MuiThemeProvider';

import ReactChartkick from 'react-chartkick';
import * as Chart from 'chart.js';

ReactChartkick.addAdapter(Chart);

import * as moment from 'moment';

import Landing from './pages/landing';
import Auth from './pages/auth';

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941

if (localStorage.getItem('lumi_version') !== process.env.VERSION) {
    localStorage.clear();
}

localStorage.setItem('lumi_version', process.env.VERSION);

const theme_v1 = createMuiTheme({
    /* theme for v1.x */
});

moment.locale('de');

// const history = syncHistoryWithStore(browserHistory, store);
// const history = createHashHistory();

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme_v1}>
                <V0MuiThemeProvider muiTheme={getMuiTheme(theme_v0)}>
                    <Switch>
                        <Route path="/" component={Auth} />
                    </Switch>
                </V0MuiThemeProvider>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('lumi')
);
