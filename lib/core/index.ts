import * as constants from './constants';
import * as types from './types';
import WebsocketContainer from './container/websocket';

const container = {
    websocket: WebsocketContainer
};

export { constants, types, container };
