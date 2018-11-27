import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import * as classnames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import CardsPreviewComponent from 'lib/cards/components/card-preview';
import * as Tags from 'lib/tags';
import * as Core from 'lib/core';
import * as Cards from 'lib/cards';
import { Divider } from 'material-ui';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    h5p_main_library: string;

    classes: any;
}

interface IComponentState {}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    class CardComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { h5p_main_library } = this.props;

            let source = '/static/h5p/images/';

            switch (h5p_main_library) {
                case 'H5P.Flashcards':
                    source += 'flashcards-png-icon.png';
                    break;

                case 'H5P.Accordion':
                    source += 'accordion-icon.png';
                    break;

                case 'H5P.Agamotto':
                    source += 'icon_agamotto.png';
                    break;

                case 'H5P.ArithmeticQuiz':
                    source += 'basic-arithmetic-quiz-icon-color.png';
                    break;

                case 'H5P.AudioRecorder':
                    source += 'audio-recorder-icon_0.png';
                    break;

                case 'H5P.Chart':
                    source += 'chart-icon-color.png';
                    break;

                case 'H5P.Collage':
                    source += 'collage-icon.png';
                    break;

                case 'H5P.Column':
                    source += 'column-icon.png';
                    break;

                case 'H5P.CoursePresentation':
                    source += 'course_presentation_icon-colors_0.png';
                    break;

                case 'H5P.Dialogcards':
                    source += 'dialog_cards_icon-color.png';
                    break;

                case 'H5P.DocumentationTool':
                    source += 'documentation-tool-icon_0.png';
                    break;

                case 'H5P.DragQuestion':
                    source += 'drag-and-drop-icon.png';
                    break;

                case 'H5P.DragText':
                    source += 'drag-the-words-icon.png';
                    break;

                case 'H5P.Essay':
                    source += 'essay.png';
                    break;

                case 'H5P.Blanks':
                    source += 'fill-in-the-blanks-icon_0.png';
                    break;

                case 'H5P.ImageMultipleHotspotQuestion':
                    source += 'find-multiple-hotspots.png';
                    break;

                case 'H5P.ImageHotspotQuestion':
                    source += 'image_hotspot-question-icon_0.png';
                    break;

                case 'H5P.GuessTheAnswer':
                    source += 'guess-the-answer-icon.png';
                    break;

                case 'H5P.ImageHotspots':
                    source += 'image-hotspots-icon-color.png';
                    break;

                case 'H5P.ImageJuxtaposition':
                    source += 'before-after-image.png';
                    break;

                case 'H5P.ImagePair':
                    source += 'image-pairing.png';
                    break;

                case 'H5P.ImageSequencing':
                    source += 'image-sequnce.png';
                    break;

                case 'H5P.ImageSlider':
                    source += 'pictusel-h5p-org.png';
                    break;

                case 'H5P.ImpressPresentation':
                    source += 'impressive-presentation-iconr.png';
                    break;

                case 'H5P.InteractiveVideo':
                    source += 'interactive_video_icon-colors_0.png';
                    break;

                case 'H5P.MarkTheWords':
                    source += 'mark-the-words-icon_0.png';
                    break;

                case 'H5P.MemoryGame':
                    source += 'memory-game-icon.png';
                    break;

                case 'H5P.MultiChoice':
                    source += 'multichoice-icon_0.png';
                    break;

                case 'H5P.PersonalityQuiz':
                    source += 'personality-quiz-icon.png';
                    break;

                case 'H5P.Questionnaire':
                    source += 'survey-icon-h5p-org.png';
                    break;

                case 'H5P.QuestionSet':
                    source += 'question-set-icon.png';
                    break;

                case 'H5P.SingleChoiceSet':
                    source += 'single-choice-set-icon_0.png';
                    break;

                case 'H5P.SpeakTheWords':
                    source += 'speak-the-words.png';
                    break;

                case 'H5P.SpeakTheWordsSet':
                    source += 'speak-the-words-set.png';
                    break;

                case 'H5P.Summary':
                    source += 'summary_icon.png';
                    break;

                case 'H5P.Timeline':
                    source += 'timeline_icon-color.png';
                    break;

                case 'H5P.TrueFalse':
                    source += 'true-false.png';
                    break;

                default:
                    source += 'h5p.png';
            }
            return <Avatar src={source} />;
        }
    }
);
