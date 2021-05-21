# ballometer.github.io

Hosts the source code for https://ballometer.io/.

## install

I use

```bash
node --version
# v14.7.0
npm --version
# 6.14.7
```

```bash
npm i
```

## develop
```bash
PORT=3000 npm start
```

## build
```bash
npm run build
```

## deploy (GitHub Action Workflow)

With a GitHub actions workflow the website is built on push to `main` and deployed to the `gh-pages` branch by [`build-deploy.yml`](https://github.com/ballometer/ballometer.github.io/blob/main/.github/workflows/build-deploy.yml).

