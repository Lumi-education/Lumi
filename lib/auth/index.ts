export { IState } from './types';
import LoginContainer from './container/login';
import PasswordContainer from './container/password';
import CaptiveContainer from './container/captive';

export { default as auth_reducer } from './reducer';
import * as actions from './actions';

const container = {
    Login: LoginContainer,
    Password: PasswordContainer,
    Captive: CaptiveContainer
};

export { actions, container };
