import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

import FileListComponent from './components/file-list';
import Markdown from './components/markdown';
import reducer from './reducer';
import SystemContainer from './container/system';
import FileUploadComponent from './components/file-upload';
import i18n from './i18n';
import * as utils from './utils';
import * as config from './config';
const components = {
    Markdown,
    FileUpload: FileUploadComponent,
    FileList: FileListComponent
};

const container = {
    System: SystemContainer
};

export {
    actions,
    selectors,
    types,
    container,
    components,
    reducer,
    utils,
    config,
    i18n
};
