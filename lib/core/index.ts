import * as constants from './constants';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export {IState} from './types';
import WebsocketContainer from './container/websocket';
import reducer from './reducer';
import AttachmentComponent from './components/attachment';
import FetchContainer from './container/fetch';
import SystemContainer from './container/system';

const components = {
    attachment: AttachmentComponent
};

const container = {
    websocket: WebsocketContainer,
    Fetch: FetchContainer,
    System: SystemContainer
};

export {actions, selectors, constants, types, container, components, reducer};
