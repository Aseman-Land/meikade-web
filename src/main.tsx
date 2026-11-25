import 'core-js/stable';
import React from 'react';

import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Cookies, CookiesProvider } from "react-cookie";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import rtlPlugin from 'stylis-plugin-rtl';
import './i18n';
import MenuInBottomLayout from './layouts/menu-in-bottom';
import { theme } from "./utils/theme";
import Home from './views/home/home';

import MainFrame from './layouts/mainframe';
import * as UserGlobal from "./services/user-global";
import { ChatStreamProvider } from './utils/chatstream';
import ErrorBoundary from './utils/errorboundary';
import AboutPage from './views/about/aboutpage';
import DonatePage from './views/about/donatepage';
import BookPage from './views/book/bookpage';
import ChatPage from './views/chat/chatpage';
import CommentPage from './views/comment/commentpage';
import ContentPage, { RandomContentPage } from './views/content/contentpage';
import ExplorePage from './views/explore/explore';
import FavoritesPage from './views/lists/favoritespage';
import ListPage from './views/lists/listpage';
import NotesPage from './views/notes/notespage';
import NotificationsPage from './views/notifications/notifications';
import ProfilePage from './views/profile/profile';
import SearchPage, { SearchOnBookPage, SearchOnContentPage, SearchOnUserPage } from './views/search/search';
import SettingsPage from './views/settings/settingspage';
import TreasurePage from './views/treasure/treasurepage';
import { DefaultSigninPage } from './views/user/signin';
import UserPage from './views/user/userpage';

const cookies = new Cookies();
const session_token = cookies.get('token');

const authRoutes = session_token && session_token.length > 0 ? [] : [
    {
        path: "login",
        element: <DefaultSigninPage />,
    }
];

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainFrame />,
        children: [
            {
                path: "/",
                element: <MenuInBottomLayout />,
                children: [
                    {
                        index: true,
                        path: "",
                        element: <Home />,
                    }, {
                        path: "home",
                        element: <Home />,
                    }, {
                        path: "explore",
                        element: <ExplorePage />,
                    }, {
                        path: "profile",
                        element: <ProfilePage />,
                    }, {
                        path: "search",
                        element: <SearchPage />,
                    }, {
                        path: "notifications",
                        element: <NotificationsPage />
                    }
                ]
            }, {
                path: "user/:user_id",
                element: <UserPage />,
            }, {
                path: "random",
                element: <RandomContentPage />,
            }, {
                path: "treasure",
                element: <TreasurePage />,
            }, {
                path: "settings",
                element: <SettingsPage />,
            }, {
                path: "about",
                element: <AboutPage />,
            }, {
                path: "donate",
                element: <DonatePage />,
            }, {
                path: "favorites",
                element: <FavoritesPage />,
            }, {
                path: "notes",
                element: <NotesPage />,
            }, {
                path: "list/:list_id",
                element: <ListPage />,
            }, {
                path: "user/:user_id/search",
                element: <SearchOnUserPage />,
            }, {
                path: "user/:user_id/random",
                element: <RandomContentPage />,
            }, {
                path: "user/:user_id/chat",
                element: <ChatPage />,
            }, {
                path: "book/:book_id",
                element: <BookPage />,
            }, {
                path: "book/:book_id/random",
                element: <RandomContentPage />,
            }, {
                path: "book/:book_id/search",
                element: <SearchOnBookPage />,
            }, {
                path: "content/:content_id",
                element: <ContentPage />,
            }, {
                path: "content/:content_id/:options",
                element: <ContentPage />,
            }, {
                path: "content/:content_id/search",
                element: <SearchOnContentPage />,
            }, {
                path: "content/:content_id/comments",
                element: <CommentPage />,
            },
            ...authRoutes,
        ]
    }
]);

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

if (session_token && session_token.length > 0) {
    await UserGlobal.reloadUser();
}

function RTL(props: any) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

const App = () => {
    return (
        <div id='meikade'>
            <React.StrictMode>
                <RTL>
                    <ChatStreamProvider token={session_token} >
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <CookiesProvider>
                                <RouterProvider router={router} />
                            </CookiesProvider>
                        </ThemeProvider>
                    </ChatStreamProvider>
                </RTL>
            </React.StrictMode>
        </div>
    );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

reportWebVitals();
