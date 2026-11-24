# E-commerce Frontend 🛍️

Web client for an online store built with **React** and **React Router**. It provides the application shell,
authentication screens and a light/dark theme, and is designed to consume the
[ecommerce-backend](https://github.com/CuencaOscar/ecommerce-backend) REST API.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

![Catalog in light and dark theme, served by the ecommerce-backend API](docs/catalog-themes.png)

## Features

- Product catalog loaded from the ecommerce-backend API, with loading skeletons, error + retry and empty states.
- Sign-in and sign-up forms with client-side validation.
- Light/dark theme that follows the system preference, with a manual toggle (`ThemeContext`).
- Reusable, prop-typed components (`Button`, `ProductCard`) and a `useProducts` data hook.
- Environment-specific configuration through `.env.development`, `.env.test` and `.env.production`
  (`REACT_APP_API_URL`).
- Scalable folder layout: components, pages, context, hooks, services and utils.

## Getting started

Requirements: Node.js 18+ and a running [ecommerce-backend](https://github.com/CuencaOscar/ecommerce-backend)
(`REACT_APP_API_URL` in `.env.development` points to `http://localhost:8000/api`).

```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build
npm test
```

## Project structure

```
src/
├── components/    # Button, ProductCard
├── context/       # ThemeContext (system preference + toggle)
├── hooks/         # useProducts
├── pages/         # Home (catalog), SignIn, SignUp
├── services/      # API client
├── utils/
├── App.jsx        # Routes and layout
└── index.jsx
```

## Roadmap

Accounts API integration, cart and checkout.

## License

[MIT](LICENSE) © Oscar Cuenca · [LinkedIn](https://www.linkedin.com/in/ocuenca-moreno/)
