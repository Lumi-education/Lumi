export function convert_attachment_url(
    markdown: string,
    card_id: string
): string {
    return markdown.replace(
        /\/attachment\//g,
        '/api/v0/' +
            window.location.pathname.split('/')[1] +
            '/cards/' +
            card_id +
            '/attachment/'
    );
}
