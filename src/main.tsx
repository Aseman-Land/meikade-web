import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Cookies } from "react-cookie";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import MenuInBottomLayout from './layouts/menu-in-bottom';
import { theme } from "./utils/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CookiesProvider } from "react-cookie";
import './i18n';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { checkRedirections } from './utils/redirections';

import HomePage from './views/home/home-page';
import SearchPage from './views/search/search-page';
import ExplorePage from './views/explore/explore-page';
import ProfilePage from './views/profile/profile-page';
import TestPage from './views/test/test-page';

const cookies = new Cookies();
const session_token = cookies.get('session_token');

const router = createBrowserRouter([
    {
        path: "/",
        element: <MenuInBottomLayout />,
        children: [
            {
                index: true,
                path: "",
                element: <HomePage />,
            },
            {
                path: "home",
                element: <HomePage />,
            },
            {
                path: "search",
                element: <SearchPage />,
            },
            {
                path: "explore",
                element: <ExplorePage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ]
    }, {
        path: "/test",
        element: <TestPage />,
    },
]);

const query_client = new QueryClient();

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

function RTL(props: any) {
    if (theme.direction == 'rtl')
        return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
    else
        return <>{props.children}</>;
}

const App = () => {
    const [updatePackages, setUpdatePackages] = React.useState(false);

    useEffect(() => {
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });

        checkRedirections(setUpdatePackages);
    }, []);

    return (
        <React.StrictMode>
            <RTL>
                <QueryClientProvider client={query_client}>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <CssBaseline />
                    <ThemeProvider theme={theme}>
                        <CookiesProvider>
                            <RouterProvider router={router} />
                        </CookiesProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </RTL>
        </React.StrictMode>
    );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

reportWebVitals();
