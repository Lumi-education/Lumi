// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as ReactDOM from 'react-dom';
// components

import * as Cards from '..';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IH5PCard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    iFrameHeight?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class H5PCardContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            iFrameHeight: '0 px'
        };
    }

    public componentWillMount() {
        (window as any).H5PIntegration = {
            baseUrl: window.location.origin,
            url: '/api/v0/h5p/tmp', // Relative to web root
            postUserStatistics: true, // Only if user is logged in
            ajaxPath: '/path/to/h5p-ajax', // Only used by older Content Types
            ajax: {
                // Where to post user results
                setFinished:
                    '/api/v0/flow/assignment/' +
                    this.props.assignment_id +
                    '/data',
                // Words beginning with : are placeholders
                contentUserData:
                    '/api/v0/flow/assignment/' +
                    this.props.assignment_id +
                    '/state?data_type=:dataType&subContentId=:subContentId'
            },
            saveFreq: 10, // How often current content state should be saved. false to disable.
            user: {
                // Only if logged in !
                name: this.props.user_id,
                mail: this.props.user_id + '@Lumi.education'
            },
            siteUrl: window.location.origin, // Only if NOT logged in!
            l10n: {
                // Text string translations
                H5P: {
                    fullscreen: 'Fullscreen',
                    disableFullscreen: 'Disable fullscreen',
                    download: 'Download',
                    copyrights: 'Rights of use',
                    embed: 'Embed',
                    size: 'Size',
                    showAdvanced: 'Show advanced',
                    hideAdvanced: 'Hide advanced',
                    advancedHelp:
                        'Include this script on your website if you want dynamic sizing of the embedded content:',
                    copyrightInformation: 'Rights of use',
                    close: 'Close',
                    title: 'Title',
                    author: 'Author',
                    year: 'Year',
                    source: 'Source',
                    license: 'License',
                    thumbnail: 'Thumbnail',
                    noCopyrights:
                        'No copyright information available for this content.',
                    downloadDescription: 'Download this content as a H5P file.',
                    copyrightsDescription:
                        'View copyright information for this content.',
                    embedDescription: 'View the embed code for this content.',
                    h5pDescription:
                        'Visit H5P.org to check out more cool content.',
                    contentChanged:
                        'This content has changed since you last used it.',
                    startingOver: "You'll be starting over.",
                    by: 'by',
                    showMore: 'Show more',
                    showLess: 'Show less',
                    subLevel: 'Sublevel'
                }
            },
            loadedJs: [], // Only required when Embed Type = div
            loadedCss: [],
            core: {
                // Only required when Embed Type = iframe
                scripts: [],
                styles: []
            }
        };
    }

    public render() {
        return (
            <iframe
                frameBorder={0}
                allowFullScreen={true}
                height={this.state.iFrameHeight}
                src={'/api/v0/h5p/' + this.props.card.content_id}
                scrolling="no"
                onLoad={() => {
                    const obj = ReactDOM.findDOMNode(this);
                    this.setState({
                        iFrameHeight:
                            (obj as any).contentWindow.document.body
                                .scrollHeight + 'px'
                    });
                }}
            />
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        assignment_id: ownProps.assignment_id,
        card_id: ownProps.card_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IH5PCard
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(H5PCardContainer);
