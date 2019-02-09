export interface IAdminTour {
    step: number;
    show: boolean;
}

export interface IState {
    tour: {
        admin: IAdminTour;
    };
}
