import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
    /* tslint:disable:interface-name */
    interface Theme {
        background: {
            gradient: string;
        };
        state: {
            info: string;
            success: string;
            warning: string;
            error: string;
        };
    }
}

function createMyTheme(options) {
    return createMuiTheme({
        ...options
    });
}

const gradient_background = 'linear-gradient(45deg, #1abc9c 0%, #3498db 100%)';
const theme = createMyTheme({
    typography: {
        useNextVariants: true
    },
    props: {
        MuiAppBar: {
            style: {
                background: gradient_background
            }
        },
        MuiTab: {
            style: {
                background: gradient_background
            }
        }
    },

    palette: {
        primary: {
            main: '#3498db'
        },
        secondary: {
            main: '#1abc9c'
        },
        background: {
            paper: 'white'
        },
        error: {
            main: '#e74c3c'
        }
    },
    background: {
        gradient: gradient_background
    },
    state: {
        info: '#3498db',
        success: '#1abc9c',
        warning: '#e67e22',
        error: '#c0392b'
    }
});

export default theme;
