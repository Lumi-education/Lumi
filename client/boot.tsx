import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { history, default as store } from 'client/store';
import { ConnectedRouter } from 'connected-react-router';
import { setLocale } from 'react-redux-i18n';

import ReactChartkick from 'react-chartkick';
import * as Chart from 'chart.js';

declare var process;

ReactChartkick.addAdapter(Chart);

import * as moment from 'moment';
import Root from './pages/root';

if (localStorage.getItem('lumi_version') !== process.env.VERSION) {
    localStorage.clear();
}

localStorage.setItem('lumi_version', process.env.VERSION);

// language
declare var navigator: any;
const userLang = navigator.language || navigator.userLanguage;
let locale = userLang.substring(0, 2);

if ((locale !== 'en' && locale !== 'de') || !locale) {
    locale = 'en';
} // default to en

moment.locale(locale);
store.dispatch(setLocale(locale));

import db from 'lib/core/db';

db.allDocs({ include_docs: true }).then(docs => {
    const _docs = docs.rows.map(row => row.doc).filter(doc => doc.type);
    store.dispatch({
        type: 'DB_CHANGE',
        payload: _docs
    });

    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <MuiThemeProvider theme={theme_v1}>
                    <V0MuiThemeProvider muiTheme={getMuiTheme(theme_v0)}>
                        {/* deprecate issue #238 */}
                        <Switch>
                            <Route path="/" component={Root} />
                        </Switch>
                    </V0MuiThemeProvider>
                </MuiThemeProvider>
            </ConnectedRouter>
        </Provider>,
        document.getElementById('lumi')
    );
});

// themes
import 'typeface-roboto';

import { MuiThemeProvider } from '@material-ui/core/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme'; // deprecate issue #238
import { default as V0MuiThemeProvider } from 'material-ui/styles/MuiThemeProvider'; // deprecate issue #238

import theme_v1 from './style/theme_v1';
import theme_v0 from './style/theme'; // deprecate issue #238
