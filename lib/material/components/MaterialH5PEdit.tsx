// modules
import * as React from 'react';
import * as debug from 'debug';
import Dropzone from 'react-dropzone';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

// modules
import { IMaterial } from '../types';
import { IH5P } from 'h5p-nodejs-library';
import * as Core from 'lib/core';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import H5P from '../components/H5P';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
const log_info = debug('lumi:info:pages:cards:card-page');

declare var window;
export interface IStateProps {
    _id: string;
    h5p: IH5P;
    classes?: any;
}

export interface IDispatchProps {
    upload: (material_id: string, file: FormData) => any;
}

interface IComponentState {
    request: 'init' | 'pending' | 'success' | 'error';
    tab: number;
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    upload: {
        width: '100%',
        border: '2px dotted #000000',
        margin: '10px'
    },
    text: {
        margin: '15px'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    class MaterialEdit extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {
                request: 'init',
                tab: 1
            };

            this.onDrop = this.onDrop.bind(this);
        }

        public componentWillMount() {
            if (!this.props.h5p) {
                this.setState({ tab: 0 });
            }
            window.h5peditor = undefined;
            const _url =
                '/api/v1/' + window.location.pathname.split('/')[1] + '/h5p';
            log_info('componentWillMount');
            (window as any).H5PIntegration = {
                baseUrl: window.location.origin,
                url: _url, // Relative to web root
                postUserStatistics: true, // Only if user is logged in
                ajaxPath: '/path/to/h5p-ajax', // Only used by older Content Types
                ajax: {
                    setFinished: '/api/v1/h5p/setFinished',
                    contentUserData: '/api/v1/contentUserData'
                },
                contents: {},
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
                hubIsEnabled: true,
                reportingIsEnabled: false,
                libraryConfig: null,
                crossorigin: null,
                user: {
                    name: 'jpschellenberg',
                    mail: 'jps@Lumi.education'
                },
                core: {
                    styles: [
                        '/core/styles/h5p.css?ver=1.11.3',
                        '/core/styles/h5p-confirmation-dialog.css?ver=1.11.3',
                        '/core/styles/h5p-core-button.css?ver=1.11.3'
                    ],
                    scripts: [
                        '/core/js/jquery.js?ver=1.11.3',
                        '/core/js/h5p.js?ver=1.11.3',
                        '/core/js/h5p-event-dispatcher.js?ver=1.11.3',
                        '/core/js/h5p-x-api-event.js?ver=1.11.3',
                        '/core/js/h5p-x-api.js?ver=1.11.3',
                        '/core/js/h5p-content-type.js?ver=1.11.3',
                        '/core/js/h5p-confirmation-dialog.js?ver=1.11.3',
                        '/core/js/h5p-action-bar.js?ver=1.11.3'
                    ]
                },
                loadedJs: [],
                loadedCss: [],
                editor: {
                    filesPath: _url + '/content/' + this.props._id,
                    fileIcon: {
                        path:
                            'http://lumi.education/core/editor/images/binary-file.png',
                        width: 50,
                        height: 50
                    },
                    ajaxPath: _url + '/ajax/?action=',
                    libraryUrl: _url + '/core/editor/',
                    copyrightSemantics: {
                        name: 'copyright',
                        type: 'group',
                        label: 'Copyright information',
                        fields: [
                            {
                                name: 'title',
                                type: 'text',
                                label: 'Title',
                                placeholder: 'La Gioconda',
                                optional: true
                            },
                            {
                                name: 'author',
                                type: 'text',
                                label: 'Author',
                                placeholder: 'Leonardo da Vinci',
                                optional: true
                            },
                            {
                                name: 'year',
                                type: 'text',
                                label: 'Year(s)',
                                placeholder: '1503 - 1517',
                                optional: true
                            },
                            {
                                name: 'source',
                                type: 'text',
                                label: 'Source',
                                placeholder:
                                    'http://en.wikipedia.org/wiki/Mona_Lisa',
                                optional: true,
                                regexp: {
                                    pattern: '^http[s]?://.+',
                                    modifiers: 'i'
                                }
                            },
                            {
                                name: 'license',
                                type: 'select',
                                label: 'License',
                                default: 'U',
                                options: [
                                    {
                                        value: 'U',
                                        label: 'Undisclosed'
                                    },
                                    {
                                        value: 'CC BY',
                                        label: 'Attribution',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'CC BY-SA',
                                        label: 'Attribution-ShareAlike',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'CC BY-ND',
                                        label: 'Attribution-NoDerivs',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'CC BY-NC',
                                        label: 'Attribution-NonCommercial',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'CC BY-NC-SA',
                                        label:
                                            'Attribution-NonCommercial-ShareAlike',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'CC BY-NC-ND',
                                        label:
                                            'Attribution-NonCommercial-NoDerivs',
                                        versions: [
                                            {
                                                value: '4.0',
                                                label: '4.0 International'
                                            },
                                            {
                                                value: '3.0',
                                                label: '3.0 Unported'
                                            },
                                            {
                                                value: '2.5',
                                                label: '2.5 Generic'
                                            },
                                            {
                                                value: '2.0',
                                                label: '2.0 Generic'
                                            },
                                            {
                                                value: '1.0',
                                                label: '1.0 Generic'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'GNU GPL',
                                        label: 'General Public License',
                                        versions: [
                                            {
                                                value: 'v3',
                                                label: 'Version 3'
                                            },
                                            {
                                                value: 'v2',
                                                label: 'Version 2'
                                            },
                                            {
                                                value: 'v1',
                                                label: 'Version 1'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'PD',
                                        label: 'Public Domain',
                                        versions: [
                                            {
                                                value: '-',
                                                label: '-'
                                            },
                                            {
                                                value: 'CC0 1.0',
                                                label: 'CC0 1.0 Universal'
                                            },
                                            {
                                                value: 'CC PDM',
                                                label: 'Public Domain Mark'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'C',
                                        label: 'Copyright'
                                    }
                                ]
                            },
                            {
                                name: 'version',
                                type: 'select',
                                label: 'License Version',
                                options: []
                            }
                        ]
                    },
                    metadataSemantics: [
                        {
                            name: 'title',
                            type: 'text',
                            label: 'Title',
                            placeholder: 'La Gioconda'
                        },
                        {
                            name: 'license',
                            type: 'select',
                            label: 'License',
                            default: 'U',
                            options: [
                                {
                                    value: 'U',
                                    label: 'Undisclosed'
                                },
                                {
                                    type: 'optgroup',
                                    label: 'Creative Commons',
                                    options: [
                                        {
                                            value: 'CC BY',
                                            label: 'Attribution (CC BY)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC BY-SA',
                                            label:
                                                'Attribution-ShareAlike (CC BY-SA)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC BY-ND',
                                            label:
                                                'Attribution-NoDerivs (CC BY-ND)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC BY-NC',
                                            label:
                                                'Attribution-NonCommercial (CC BY-NC)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC BY-NC-SA',
                                            label:
                                                'Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC BY-NC-ND',
                                            label:
                                                'Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)',
                                            versions: [
                                                {
                                                    value: '4.0',
                                                    label: '4.0 International'
                                                },
                                                {
                                                    value: '3.0',
                                                    label: '3.0 Unported'
                                                },
                                                {
                                                    value: '2.5',
                                                    label: '2.5 Generic'
                                                },
                                                {
                                                    value: '2.0',
                                                    label: '2.0 Generic'
                                                },
                                                {
                                                    value: '1.0',
                                                    label: '1.0 Generic'
                                                }
                                            ]
                                        },
                                        {
                                            value: 'CC0 1.0',
                                            label:
                                                'Public Domain Dedication (CC0)'
                                        },
                                        {
                                            value: 'CC PDM',
                                            label: 'Public Domain Mark (PDM)'
                                        }
                                    ]
                                },
                                {
                                    value: 'GNU GPL',
                                    label: 'General Public License v3'
                                },
                                {
                                    value: 'PD',
                                    label: 'Public Domain'
                                },
                                {
                                    value: 'ODC PDDL',
                                    label:
                                        'Public Domain Dedication and Licence'
                                },
                                { value: 'C', label: 'Copyright' }
                            ]
                        },
                        {
                            name: 'licenseVersion',
                            type: 'select',
                            label: 'License Version',
                            options: [
                                {
                                    value: '4.0',
                                    label: '4.0 International'
                                },
                                {
                                    value: '3.0',
                                    label: '3.0 Unported'
                                },
                                {
                                    value: '2.5',
                                    label: '2.5 Generic'
                                },
                                {
                                    value: '2.0',
                                    label: '2.0 Generic'
                                },
                                {
                                    value: '1.0',
                                    label: '1.0 Generic'
                                }
                            ],
                            optional: true
                        },
                        {
                            name: 'yearFrom',
                            type: 'number',
                            label: 'Years (from)',
                            placeholder: '1991',
                            min: '-9999',
                            max: '9999',
                            optional: true
                        },
                        {
                            name: 'yearTo',
                            type: 'number',
                            label: 'Years (to)',
                            placeholder: '1992',
                            min: '-9999',
                            max: '9999',
                            optional: true
                        },
                        {
                            name: 'source',
                            type: 'text',
                            label: 'Source',
                            placeholder: 'https://',
                            optional: true
                        },
                        {
                            name: 'authors',
                            type: 'list',
                            field: {
                                name: 'author',
                                type: 'group',
                                fields: [
                                    {
                                        label: "Author's name",
                                        name: 'name',
                                        optional: true,
                                        type: 'text'
                                    },
                                    {
                                        name: 'role',
                                        type: 'select',
                                        label: "Author's role",
                                        default: 'Author',
                                        options: [
                                            {
                                                value: 'Author',
                                                label: 'Author'
                                            },
                                            {
                                                value: 'Editor',
                                                label: 'Editor'
                                            },
                                            {
                                                value: 'Licensee',
                                                label: 'Licensee'
                                            },
                                            {
                                                value: 'Originator',
                                                label: 'Originator'
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            name: 'licenseExtras',
                            type: 'text',
                            widget: 'textarea',
                            label: 'License Extras',
                            optional: true,
                            description:
                                'Any additional information about the license'
                        },
                        {
                            name: 'changes',
                            type: 'list',
                            field: {
                                name: 'change',
                                type: 'group',
                                label: 'Changelog',
                                fields: [
                                    {
                                        name: 'date',
                                        type: 'text',
                                        label: 'Date',
                                        optional: true
                                    },
                                    {
                                        name: 'author',
                                        type: 'text',
                                        label: 'Changed by',
                                        optional: true
                                    },
                                    {
                                        name: 'log',
                                        type: 'text',
                                        widget: 'textarea',
                                        label: 'Description of change',
                                        placeholder:
                                            'Photo cropped, text changed, etc.',
                                        optional: true
                                    }
                                ]
                            }
                        },
                        {
                            name: 'authorComments',
                            type: 'text',
                            widget: 'textarea',
                            label: 'Author comments',
                            description:
                                'Comments for the editor of the content (This text will not be published as a part of copyright info)',
                            optional: true
                        },
                        {
                            name: 'contentType',
                            type: 'text',
                            widget: 'none'
                        }
                    ],
                    assets: {
                        css: [
                            '/core/styles/h5p.css?ver=1.11.3',
                            '/core/styles/h5p-confirmation-dialog.css?ver=1.11.3',
                            '/core/styles/h5p-core-button.css?ver=1.11.3',
                            '/core/editor/libs/darkroom.css?ver=1.11.3',
                            '/core/editor/styles/css/h5p-hub-client.css?ver=1.11.3',
                            '/core/editor/styles/css/fonts.css?ver=1.11.3',
                            '/core/editor/styles/css/application.css?ver=1.11.3',
                            '/core/editor/styles/css/libs/zebra_datepicker.min.css?ver=1.11.3'
                        ].map(css => _url + css),
                        js: [
                            '/core/js/jquery.js?ver=1.11.3',
                            '/core/js/h5p.js?ver=1.11.3',
                            '/core/js/h5p-event-dispatcher.js?ver=1.11.3',
                            '/core/js/h5p-x-api-event.js?ver=1.11.3',
                            '/core/js/h5p-x-api.js?ver=1.11.3',
                            '/core/js/h5p-content-type.js?ver=1.11.3',
                            '/core/js/h5p-confirmation-dialog.js?ver=1.11.3',
                            '/core/js/h5p-action-bar.js?ver=1.11.3',
                            '/core/editor/scripts/h5p-hub-client.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-semantic-structure.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-library-selector.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-form.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-text.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-html.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-number.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-textarea.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-file-uploader.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-file.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-image.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-image-popup.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-av.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-group.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-boolean.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-list.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-list-editor.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-library.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-library-list-cache.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-select.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-selector-hub.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-selector-legacy.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-dimensions.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-coordinates.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-none.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-metadata.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-metadata-author-widget.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-metadata-changelog-widget.js?ver=1.11.3',
                            '/core/editor/scripts/h5peditor-pre-save.js?ver=1.11.3',
                            '/core/editor/ckeditor/ckeditor.js?ver=1.11.3'
                        ].map(js => _url + js)
                    },
                    deleteMessage:
                        'Are you sure you wish to delete this content?',
                    apiVersion: {
                        majorVersion: 1,
                        minorVersion: 19
                    }
                }
            };
            const assets = [
                '/js/jquery.js',
                '/js/h5p.js',
                '/js/h5p-event-dispatcher.js?ver=1.11.3',
                '/js/h5p-x-api-event.js?ver=1.11.3',
                '/js/h5p-x-api.js?ver=1.11.3',
                '/js/h5p-content-type.js?ver=1.11.3',
                '/js/h5p-confirmation-dialog.js?ver=1.11.3',
                '/js/h5p-action-bar.js?ver=1.11.3',
                '/editor/scripts/h5p-hub-client.js',
                '/editor/scripts/h5peditor-editor.js',
                '/editor/scripts/h5peditor.js',
                '/editor/language/en.js',
                '/js/h5p-display-options.js',
                '/editor/scripts/h5peditor-semantic-structure.js',
                '/editor/scripts/h5peditor-library-selector.js',
                '/editor/scripts/h5peditor-form.js',
                '/editor/scripts/h5peditor-text.js',
                '/editor/scripts/h5peditor-html.js',
                '/editor/scripts/h5peditor-number.js',
                '/editor/scripts/h5peditor-textarea.js',
                '/editor/scripts/h5peditor-file-uploader.js',
                '/editor/scripts/h5peditor-file.js',
                '/editor/scripts/h5peditor-image.js',
                '/editor/scripts/h5peditor-image-popup.js',
                '/editor/scripts/h5peditor-av.js',
                '/editor/scripts/h5peditor-group.js',
                '/editor/scripts/h5peditor-boolean.js',
                '/editor/scripts/h5peditor-list.js',
                '/editor/scripts/h5peditor-list-editor.js',
                '/editor/scripts/h5peditor-library.js',
                '/editor/scripts/h5peditor-library-list-cache.js',
                '/editor/scripts/h5peditor-select.js',
                '/editor/scripts/h5peditor-selector-hub.js',
                '/editor/scripts/h5peditor-selector-legacy.js',
                '/editor/scripts/h5peditor-dimensions.js',
                '/editor/scripts/h5peditor-coordinates.js',
                '/editor/scripts/h5peditor-none.js',
                '/editor/scripts/h5peditor-metadata.js',
                '/editor/scripts/h5peditor-metadata-author-widget.js',
                '/editor/scripts/h5peditor-metadata-changelog-widget.js',
                '/editor/scripts/h5peditor-pre-save.js',
                '/editor/ckeditor/ckeditor.js',
                '/editor/wp/h5p-editor.js'
                // '/editor/wp/h5p-toggle.js',
                // '/editor/wp/h5p-data-views.js'
            ];
            assets.forEach(asset => {
                const script = document.createElement('script');

                script.src = '/api/v1/lumi/h5p/core' + asset;
                script.async = false;

                document.body.appendChild(script);
            });
        }

        public componentDidMount() {
            //
        }

        public onDrop(acceptedFiles, rejectedFiles) {
            log_info(acceptedFiles, rejectedFiles);
            acceptedFiles.forEach(file => {
                const data = new FormData();

                data.append('file', file);
                data.append('filename', file.name);

                this.setState({ request: 'pending' });
                this.props
                    .upload(this.props._id, data)
                    .then(res => {
                        this.setState({ request: 'success' });
                    })
                    .catch(error => {
                        this.setState({ request: 'error' });
                    });
            });
        }

        public render() {
            const { classes } = this.props;
            // if (this.props.h5p) {
            //     return <H5P content_id={this.props._id} />;
            // }

            return (
                <Grid container={true} spacing={24}>
                    <Toolbar>
                        <Tabs
                            value={this.state.tab}
                            onChange={(e, v) => {
                                this.setState({ tab: v });
                            }}
                        >
                            <Tab label={Core.i18n.t('edit')} />
                            <Tab label={Core.i18n.t('view')} />
                        </Tabs>
                    </Toolbar>
                    <Grid item={true} xs={12} sm={12}>
                        <div
                            style={{
                                display: this.state.tab === 0 ? 'block' : 'none'
                            }}
                            id="post-body-content"
                        >
                            <div className="h5p-create">
                                <div className="h5p-editor" />
                            </div>
                        </div>
                        <div
                            style={{
                                display: this.state.tab === 1 ? 'block' : 'none'
                            }}
                        >
                            <H5P
                                content_id={this.props._id}
                                integration={window.H5PIntegration}
                            />
                        </div>
                        <Grid className={classes.buttons} item={true} xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                // onClick={() =>
                                //     this.setState({
                                //         show_delete_confirmation_dialog: true
                                //     })
                                // }
                            >
                                {Core.i18n.t('delete')}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => {
                                    if (window.h5peditor !== undefined) {
                                        const params = window.h5peditor.getParams();

                                        if (params.params !== undefined) {
                                            // Validate mandatory main title. Prevent submitting if that's not set.
                                            // Deliberatly doing it after getParams(), so that any other validation
                                            // problems are also revealed
                                            // if (!h5peditor.isMainTitleSet()) {

                                            // }

                                            // Set main library
                                            // $library.val(h5peditor.getLibrary());

                                            // Set params
                                            // $params.val(JSON.stringify(params));

                                            window.H5P.jQuery.ajax({
                                                type: 'POST',
                                                url:
                                                    '/api/v1/lumi/h5p/editor?content_id=' +
                                                    this.props._id,
                                                data: JSON.stringify({
                                                    params,
                                                    library: window.h5peditor.getLibrary()
                                                }),
                                                contentType:
                                                    'application/json; charset=utf-8'
                                            });

                                            return event.preventDefault();
                                            // TODO - Calculate & set max score
                                            // $maxscore.val(h5peditor.getMaxScore(params.params));
                                        }
                                    }
                                }}
                            >
                                {Core.i18n.t('save')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
    }
);
