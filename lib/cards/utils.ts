export function convert_attachment_url(
    markdown: string,
    card_id: string
): string {
    if (markdown) {
        return markdown.replace(
            /\/attachment\//g,
            '/api/v0/cards/' + card_id + '/attachment/'
        );
    }
    return undefined;
}
