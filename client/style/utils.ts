export function state_color(state: string): string {
    switch (state) {
        case 'init':
        default:
            return '#2c80b9';
        case 'pending':
            return '#f39c12';
        case 'error':
            return '#c0392c';
        case 'success':
            return '#27ae60';
    }
}
