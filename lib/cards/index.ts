export { default as CardViewContainer } from './container/card-view';
import { default as CardTypeComponent } from './components/card-type';
import { default as CardScoreComponent } from './components/card-score';
import { default as Multiplechoice } from './components/multiplechoice';
import { default as CardComponent } from './components/card';
import MarkdownComponent from './components/markdown';
export { default as CardEdit } from './container/card-edit';
export {
    IState,
    ICardUI,
    ICard,
    ICardData,
    IFreetextCard,
    IFreetextCardData,
    IMultiplechoiceCard,
    IMultiplechoiceCardData,
    ITextCard,
    ITextCardData,
    IUploadCard,
    IUploadCardData,
    IVideoCard,
    IVideoCardData,
    IH5PCard
} from './types';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as utils from './utils';

const components = {
    Multiplechoice,
    Markdown: MarkdownComponent,
    CardType: CardTypeComponent,
    CardScore: CardScoreComponent,
    Card: CardComponent
};

export { actions, reducer, selectors, components, utils };
