import raven from './raven';

export function avg(a: number, c: number, i: number, ar: number[]): number {
    return a + c / ar.length;
}

export function sum(a: number, c: number, i: number, ar: number[]): number {
    return a + c;
}

export function alphabetically(
    a: { name: string },
    b: { name: string }
): number {
    try {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    } catch (error) {
        raven.captureException(error);
        return 0;
    }
}

export function convert_files_url(markdown: string, ref_id: string): string {
    try {
        return markdown
            ? markdown.replace(
                  /\.\//g,
                  '/api/v0/core/attachment/' + ref_id + '/'
              )
            : undefined;
    } catch (error) {
        raven.captureException(error);
        return '';
    }
}

export function get_grade_color(p: number): string {
    if (p === null) {
        return '#FFFFFF';
    }
    if (p >= 85) {
        return '#bbeebb';
    }
    if (p >= 70) {
        return '#ccffcc';
    }
    if (p >= 55) {
        return '#ffffbb';
    }
    if (p >= 45) {
        return '#ffeeaa';
    }
    if (p >= 20) {
        return '#ffaaaa';
    }
    return '#c0392b';
}
