import { INotification, NotificationVariants } from './types';

export class Notification implements INotification {
    public _id: string;
    public message: string;
    public variant: NotificationVariants;

    constructor(message: string, variant?: NotificationVariants) {
        this.message = message;
        this.variant = variant || 'info';
    }
}
