export function convert_files_url(markdown: string, card_id: string): string {
    if (markdown) {
        return markdown.replace(/.\//g, '/files/' + card_id + '/');
    }
    return undefined;
}
