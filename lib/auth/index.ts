export { IState } from './types';
import LoginContainer from './container/login';
import PasswordContainer from './container/password';

export { default as auth_reducer } from './reducer';
import * as actions from './actions';

const container = {
    Login: LoginContainer,
    Password: PasswordContainer
};

export { actions, container };
