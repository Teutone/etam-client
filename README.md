# lnb-client

| [lnb-server](https://github.com/b12f/lnb-server)
| [latenight.blue client](https://github.com/b12f/lnb-client)
| **eleventhirty.am client**
|

This is the Vue.js based client-side application for [eleventhirty.am](https://eleventhirty.am/).

## Production setup

After building, place the contents of `dist/` into the server `themeDir` directory, inside a directory that is the theme name. For example, assuming `themeDir` is set to `/lnb-server/static/`:

    /lnb-server
        /static
            /latenight.blue
                - dist contents
            /eleventhirty.am
                - dist contents

## Building

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
