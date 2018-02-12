export function get_collection_id(location: string): string {
    if (location) {
        return location.split('/')[3];
    }
    return 'no collection';
}

export function get_card_id(location: string): string {
    if (location) {
        return location.split('/')[5];
    }
    return 'no card';
}
