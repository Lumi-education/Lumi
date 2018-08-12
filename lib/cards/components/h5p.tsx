import * as React from 'react';
import * as debug from 'debug';
import * as ReactDOM from 'react-dom';
import { assign } from 'lodash';
import { Paper } from 'material-ui';

import * as markdownit from 'markdown-it';
const md = markdownit();

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    content_id: string;
    integration?: any;
}

interface IComponentState {
    iFrameHeight: string;
}

export default class H5PComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            iFrameHeight: '0 px'
        };
    }

    public componentWillMount() {
        (window as any).H5PIntegration = assign(
            {
                baseUrl: window.location.origin,
                url: '/api/v0/h5p/tmp', // Relative to web root
                postUserStatistics: true, // Only if user is logged in
                ajaxPath: '/path/to/h5p-ajax', // Only used by older Content Types
                saveFreq: false, // How often current content state should be saved. false to disable.
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
                        downloadDescription:
                            'Download this content as a H5P file.',
                        copyrightsDescription:
                            'View copyright information for this content.',
                        embedDescription:
                            'View the embed code for this content.',
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
            },
            this.props.integration
        );
    }

    public render() {
        return (
            <iframe
                frameBorder={0}
                allowFullScreen={true}
                height={this.state.iFrameHeight}
                src={'/api/v0/h5p/' + this.props.content_id}
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
