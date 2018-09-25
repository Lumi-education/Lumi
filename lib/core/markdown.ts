import * as markdownit from 'markdown-it';
import markdownItLatex from 'markdown-it-latex';

const md = new markdownit();

md.use(markdownItLatex);

export default md;
