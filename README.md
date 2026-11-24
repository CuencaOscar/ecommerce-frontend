# E-commerce Frontend 🛍️

Web client for an online store built with **React** and **React Router**. It provides the application shell,
authentication screens and a light/dark theme, and is designed to consume the
[ecommerce-backend](https://github.com/CuencaOscar/ecommerce-backend) REST API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

## Features

- Client-side routing for Home, Sign In and Sign Up.
- Light/dark theme with a React Context (`ThemeContext`) and a memoized provider.
- Reusable, prop-typed components (`Button`) and controlled forms.
- Environment-specific configuration through `.env.development`, `.env.test` and `.env.production`
  (`REACT_APP_API_URL`).
- Scalable folder layout: components, pages, context, hooks, services and utils.

## Getting started

Requirements: Node.js 18+.

```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build
npm test
```

## Project structure

```
src/
├── components/    # Reusable UI (Button)
├── context/       # ThemeContext
├── pages/         # Home, SignIn, SignUp
├── hooks/  services/  utils/
├── App.jsx        # Routes and layout
└── index.jsx
```

## Roadmap

Product catalog connected to the API, cart and checkout.

---

**Oscar Cuenca** · [LinkedIn](https://www.linkedin.com/in/ocuenca-moreno/)
