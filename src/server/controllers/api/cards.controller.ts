import * as express from 'express';
import { IRequest } from '../../middleware/auth';
import { assign } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as unzip from 'unzip';
import * as recursive from 'recursive-readdir';
import proxy from '../../core/proxy';

import db from '../../db';

import { ICard } from 'lib/cards/types';

class CardController {
    public create(req: IRequest, res: express.Response) {
        const new_card: ICard = {
            card_type: 'text',
            _id: undefined,
            type: 'card',
            name: 'no name',
            text: 'missing text',
            description: '',
            created_at: new Date(),
            _attachments: {},
            files: [],
            tags: [],
            _rev: undefined
        };

        assign(new_card, req.body);

        db.insert(new_card, (create_card_error, created_card) => {
            res.status(200).json(created_card);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, card: ICard) => {
            res.status(200).json([card]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, err => {
            res.status(200).end();
        });
    }

    public list(req: IRequest, res: express.Response) {
        const query = req.query._ids
            ? { type: 'card', _id: { $in: JSON.parse(req.query._ids) } }
            : { type: 'card' };

        db.find(query, { limit: 200 }, (find_cards_error, cards) => {
            if (find_cards_error) {
                res.status(find_cards_error.status).json(find_cards_error);
            }
            res.status(200).json(cards);
        });
        // db.view(
        //     'card',
        //     'list',
        //     req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
        //     (error, cards) => res.status(200).json(cards)
        // );
    }

    public h5p_proxy(req: express.Request, res: express.Response) {
        req.url = req.url.replace('/h5p', '');
        proxy.web(req, res, {
            target: 'http://localhost:3001'
        });
    }

    public h5p(req: express.Request, res: express.Response) {
        if (path.extname(req.params.content_id) === '.h5p') {
            // fs
            //     .createReadStream(process.env.H5P_FOLDER + req.path)
            //     .pipe(
            //         unzip.Extract({
            //             path: 'tmp' + req.path
            //         }).on('finish', (err) => {
            recursive(
                path.resolve('build/h5p') + '/' + req.params.content_id,
                (err, _files) => {
                    // `files` is an arra§y of file paths
                    if (err) {
                        return res.end('not found');
                    }
                    const files = _files.map(file =>
                        file.replace(
                            path.resolve('build/h5p'),
                            '/api/v0/h5plib'
                        )
                    );

                    // ensure correct dependency order // if it looks stupid but it works - it's not stupid
                    let jsFiles = files.filter(
                        file => path.extname(file) === '.js'
                    );

                    jsFiles = [
                        ...jsFiles.filter(f => f.indexOf('Tether') > -1),
                        ...jsFiles.filter(f => f.indexOf('swfobject-') > -1),
                        ...jsFiles.filter(f => f.indexOf('blob') > -1),
                        ...jsFiles.filter(f => f.indexOf('Shepherd-') > -1),
                        ...jsFiles.filter(f => f.indexOf('downloadify') > -1),
                        ...jsFiles.filter(f => f.indexOf('filesaver') > -1),
                        ...jsFiles.filter(f => f.indexOf('flowplayer') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.TextUtilities-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('H5P.CKEditor-') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.ContinuousText-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.GuidedTour-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('H5P.AppearIn-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Video-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Table-') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.TwitterUserFeed-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('H5P.Text-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Link-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.SoundJS-') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.OpenEndedQuestion') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.SimpleMultiChoice-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.AdvancedText-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.ExportableTextArea-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('Transition') > -1),
                        ...jsFiles.filter(f => f.indexOf('jQuery') > -1),
                        ...jsFiles.filter(f => f.indexOf('Embedded') > -1),
                        ...jsFiles.filter(f => f.indexOf('FontAwesome') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Audio-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Image-') > -1),
                        ...jsFiles.filter(f => f.indexOf('Drop') > -1),
                        ...jsFiles.filter(f => f.indexOf('FontIcons') > -1),
                        ...jsFiles.filter(f => f.indexOf('JoubelUI') > -1),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.Question') > -1)
                            .filter(f => f.indexOf('question.js') > -1),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.Question') > -1)
                            .filter(f => f.indexOf('question.js') === -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Blanks-') > -1),
                        ...jsFiles.filter(f => f.indexOf('H5P.Summary') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.SingleChoiceSet-') > -1
                        ),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.MarkTheWords') > -1)
                            .filter(f => f.indexOf('word.js') > -1),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.MarkTheWords') > -1)
                            .filter(f => f.indexOf('word.js') === -1),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.TrueFalse-') > -1)
                            .filter(f => f.indexOf('false.js') > -1),
                        ...jsFiles
                            .filter(f => f.indexOf('H5P.TrueFalse-') > -1)
                            .filter(f => f.indexOf('false.js') === -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.IVHotSpot-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.FreeTextQuestion-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.GoToQuestion-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.Questionnaire-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.CoursePresentation-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.Dialogcards-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.DragNDrop-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.DragNResize-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('H5P.DragNBar-') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.InteractiveVideo-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.DragQuestion-') > -1
                        ),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.ImageHotspotQuestion-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('MultiChoice') > -1),
                        ...jsFiles.filter(
                            f => f.indexOf('H5P.DragQuestion-') > -1
                        ),
                        ...jsFiles.filter(f => f.indexOf('H5P.DragText') > -1)
                    ];

                    const styleFiles = files.filter(
                        file => path.extname(file) === '.css'
                    );
                    const jsonContent = JSON.parse(
                        fs.readFileSync(
                            _files.filter(
                                file => path.basename(file) === 'content.json'
                            )[0],
                            'utf8'
                        )
                    );
                    const h5p = JSON.parse(
                        fs.readFileSync(
                            _files.filter(
                                file => path.basename(file) === 'h5p.json'
                            )[0],
                            'utf8'
                        )
                    );

                    res.render('h5p', {
                        scripts: jsFiles,
                        styles: styleFiles,
                        integration: {
                            baseUrl: 'http://localhost:3000', // No trailing slash
                            url: '/tmp', // Relative to web root
                            postUserStatistics: true, // Only if user is logged in
                            ajaxPath: '/path/to/h5p-ajax', // Only used by older Content Types
                            ajax: {
                                // Where to post user results
                                setFinished:
                                    '/interactive-contents/123/results/new',
                                // Words beginning with : are placeholders
                                contentUserData:
                                    '/interactive-contents/:contentId/user-data?data_type=:dataType&subContentId=:subContentId'
                            },
                            saveFreq: 30, // How often current content state should be saved. false to disable.
                            user: {
                                // Only if logged in !
                                name: 'User Name',
                                mail: 'user@mysite.com'
                            },
                            siteUrl: 'http://localhost:3000', // Only if NOT logged in!
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
                            loadedJs: jsFiles, // Only required when Embed Type = div
                            loadedCss: styleFiles,
                            core: {
                                // Only required when Embed Type = iframe
                                scripts: jsFiles,
                                styles: styleFiles
                            }
                        },
                        content: {
                            library:
                                h5p.mainLibrary +
                                ' ' +
                                h5p.preloadedDependencies.filter(
                                    dep => dep.machineName === h5p.mainLibrary
                                )[0].majorVersion +
                                '.' +
                                h5p.preloadedDependencies.filter(
                                    dep => dep.machineName === h5p.mainLibrary
                                )[0].minorVersion, // + "H5P.MultiChoice 1.5", // Library name + major version.minor version
                            jsonContent: assign(
                                JSON.stringify(jsonContent).replace(
                                    /#tmp/g,
                                    ''
                                ),
                                {
                                    behaviour: {
                                        // overwrite behaviour with default
                                        enableRetry: false,
                                        enableCheckButton: true,
                                        showSolutionsRequiresInput: true,
                                        singlePoint: false,
                                        applyPenalties: true,
                                        enableScoreExplanation: true,
                                        autoAlignSpacing: 2,
                                        enableFullScreen: true,
                                        showScorePoints: true
                                    }
                                }
                            ),
                            fullScreen: false, // No fullscreen support
                            // "exportUrl": "/path/to/download.h5p",
                            // "embedCode": "<iframe src=\"https://mysite.com/h5p/1234/embed\" width=\":w\" height=\":h\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>",
                            displayOptions: {
                                frame: false, // Show frame and buttons below H5P
                                export: false, // Display download button
                                embed: false, // Display embed button
                                copyright: true, // Display copyright button
                                icon: false // Display H5P icon
                            },
                            styles: styleFiles,
                            scripts: jsFiles
                        },
                        content_id: path.basename(req.path)
                    });
                }
            );
            //     })

            // );
        } else {
            fs.readdir(process.env.H5P_FOLDER + req.path, (err, data) => {
                if (err) {
                    res.end('not found');
                } else {
                    res.json(data.filter(file => file.charAt(0) !== '.'));
                }
            });
        }
    }

    public h5p_upload(req: any, res: express.Response) {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const uploaded_file = req.files.file;

        // Use the mv() method to place the file somewhere on your server
        uploaded_file.mv(
            path.resolve('build/tmp') + '/' + uploaded_file.name,
            err => {
                if (err) {
                    return res.status(500).send(err);
                }

                fs.createReadStream(
                    path.resolve('build/tmp') + '/' + uploaded_file.name
                ).pipe(
                    unzip
                        .Extract({
                            path:
                                path.resolve('build/h5p') +
                                '/' +
                                uploaded_file.name
                        })
                        .on('finish', error => {
                            res.send('File uploaded!');
                        })
                );
            }
        );
    }

    public attachment(req: express.Request, res: express.Response) {
        req.url =
            process.env.DB_HOST +
            '/' +
            process.env.DB +
            '/' +
            req.params.id +
            '/' +
            req.params.attachment +
            (req.query.rev ? '?rev=' + req.query.rev : '');

        proxy.web(req, res, {
            target: process.env.DB_HOST
        });
    }
}

export default CardController;
