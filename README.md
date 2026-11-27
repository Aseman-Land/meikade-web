
# Meikade Web

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**Meikade Web** is the browser-based edition of [Meikade](https://github.com/Aseman-Land/Meikade), an open-source collection of Persian poetry and literary works.

🌐 **Live application:** <https://app.meikade.com>

## About Meikade

Meikade brings Persian poetry together in one place. Readers can browse poets, explore their available books and collections, and navigate through literary works from a web browser.

This repository contains the **web frontend** of Meikade. It is the web counterpart of the existing native application, which is built with Qt/QML. The web edition does not replace or discontinue the native application; both clients can continue to exist as part of the Meikade project.

The application is frontend-only. Backend services and data APIs are maintained separately and are not part of this repository.

## Technology Stack

The web application is built with:

- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for development and production builds
- [Material UI](https://mui.com/) for the UI components
- [React Router](https://reactrouter.com/) for client-side routing
- [TanStack Query](https://tanstack.com/query) and [Axios](https://axios-http.com/) for data fetching
- [i18next](https://www.i18next.com/) for internationalization

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- **Node.js:** `20.19+` or `22.12+` (required by the Vite version used in this project)
- **npm:** included with Node.js
- **Git**

### Install Dependencies

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Aseman-Land/meikade-web.git
cd meikade-web
npm ci
```

### Run the Development Server

Start the local development server:

```bash
npm run dev
```

Vite is configured to listen on port `3000`. Once the server is ready, open:

<http://localhost:3000>

## Production Build

To type-check the project and create an optimized production build, run:

```bash
npm run build
```

The generated static assets are placed in the `dist/` directory.

### Preview the Production Build

You can serve the generated build locally before deploying it:

```bash
npm run preview
```

Vite will print the local URL in the terminal.

## Deployment

Meikade Web is a frontend application and can be deployed to a static hosting provider or any web server capable of serving the generated files.

1. Run `npm ci` to install dependencies.
2. Run `npm run build` to generate the production bundle.
3. Publish the contents of the `dist/` directory.
4. Configure the hosting provider to fall back to `index.html` for client-side application routes. This is necessary for direct navigation to, or refreshing, nested routes.

The live web application is available at <https://app.meikade.com>.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port `3000`. |
| `npm run build` | Runs the TypeScript compiler and creates the production build. |
| `npm run preview` | Serves the production build locally for verification. |

## Related Projects

- **Native Meikade application:** <https://github.com/Aseman-Land/Meikade>
- **Meikade Web:** <https://github.com/Aseman-Land/meikade-web>
- **Live web application:** <https://app.meikade.com>

## License

Meikade Web is free and open-source software, licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for the full license text.
