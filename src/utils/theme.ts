import { createTheme } from "@mui/material";
import { faIR } from "@mui/material/locale";

export const globalBorderRadiusValue: number = 18;
export const globalBorderRadius: string = globalBorderRadiusValue.toString() + 'px';
export const darkMode: boolean = (localStorage.getItem('theme') == 'dark' ? true : localStorage.getItem('theme') == 'light' ? false : typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

export const theme = createTheme(
    {
        direction: "rtl",
        typography: {
            fontFamily: 'Vazirmatn, vazir',
            fontSize: 12,
        },
        palette: {
            mode: darkMode ? "dark" : "light",
            background: {
                paper: darkMode ? '#222' : '#fff',
                default: darkMode ? '#000' : '#f5f5f5'
            },
            primary: {
                dark: "#e23b3b",
                light: "#881010",
                main: darkMode ? "#e23b3b" : "#881010",
                contrastText: "#fff",
            },
            secondary: {
                main: darkMode ? "#000" : "#333",
                contrastText: "#fff",
            },
            info: {
                main: "#4CAF50",
                contrastText: "#4CAF50",
            },
            error: {
                main: "#920f06",
                contrastText: "#F44336",
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '10px',
                        height: '40px',
                        fontSize: '16px',
                        textTransform: 'unset',
                    }
                }
            },
            MuiFilledInput: {
                styleOverrides: {
                    root: {
                        fontSize: '16px',
                    }
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        borderTop: '0px solid transparent',
                        borderLeft: '0px solid transparent',
                        borderRight: '0px solid transparent',
                        background: darkMode ? '#111' : '#ffff',
                        // background: darkMode? 'rgba(20,20,20,1)' : 'rgba(245,245,245,1)',
                        // backdropFilter: 'blur(8px)',
                    }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    container: {
                        // backdropFilter: 'blur(16px)',
                        // '-webkit-backdrop-filter': 'blur(16px)', 
                    },
                    paper: {
                        borderRadius: globalBorderRadius,
                        maxHeight: 'calc(100% - 100px)',
                        maxWidth: '450px',
                        padding: '16px',
                    },
                }
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        padding: '14px',
                        fontSize: '20px',
                    }
                }
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        padding: '14px',
                        paddingTop: '0px',
                    }
                }
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        elevation: 0,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                        borderRadius: globalBorderRadius,
                        minWidth: '180px',
                        background: darkMode ? '#222' : '#fff',
                    },
                }
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        width: '550px',
                        maxWidth: 'calc(100% - 20px)',
                        borderRadius: globalBorderRadius,
                        margin: '10px',
                        justifySelf: 'center',
                        background: darkMode ? '#222' : '#fff',
                    }
                }
            }
        }
    },
    faIR
);

