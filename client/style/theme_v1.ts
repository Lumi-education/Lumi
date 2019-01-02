import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    props: {
        MuiAppBar: {
            style: {
                background: 'linear-gradient(45deg, #1abc9c 0%, #3498db 100%)'
            }
        }
    },

    palette: {
        background: {
            default: 'linear-gradient(45deg, #1abc9c 0%, #3498db 100%)',
            paper: 'white'
        },
        error: {
            main: '#e74c3c'
        }
    }
});

export default theme;
