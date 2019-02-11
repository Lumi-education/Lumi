export interface IState {
    notifications: INotification[];
}

export type NotificationVariants = 'info' | 'success' | 'warning' | 'error';

export interface INotification {
    _id: string;
    message: string;
    variant: NotificationVariants;
}
