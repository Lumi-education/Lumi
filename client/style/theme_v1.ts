import { createMuiTheme } from '@material-ui/core/styles';

const gradient_background = 'linear-gradient(45deg, #1abc9c 0%, #3498db 100%)';
const theme = createMuiTheme({
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
            default: gradient_background,
            paper: 'white'
        },
        error: {
            main: '#e74c3c'
        }
    }
});

export default theme;
