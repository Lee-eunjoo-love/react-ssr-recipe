/** ERROR: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server' is not defined by "exports" ~ react-router-dom */
// #. { StaticRouter } react-router-dom/server => react-router-dom 으로 변경
import ReactDOMServer from "react-dom/server";
import express from "express";
//import { StaticRouter } from "react-router-dom/server"; // #. Error [ERR_PACKAGE_PATH_NOT_EXPORTED]
import { StaticRouter } from "react-router-dom";
import App from "./App";
import path from "path"; // #. 정적 파일 제공하기
import fs from "fs"; // #. JS 와 CSS 파일 불러오기
// #. redux
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import rootReducer, { rootSaga } from "./modules";
// #. PreloadContext
import PreloadContext from "./lib/PreloadContext";
// #. redux-saga
import createSagaMiddleware, { END } from "redux-saga";
// #. @loadable
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server"; // #. [청크 파일 경로 추출]

// #. [청크 파일 경로 추출]
const statsFile = path.resolve("./build/loadable-stats.json");

const sagaMiddleware = createSagaMiddleware();

// #. [청크 파일 경로 추출]
/*
function createPage(root, tags) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      ${tags?.styles || ""}
      ${tags?.links || ""}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${root}</div>
      ${tags?.scripts || ""}
    </body>
  </html>
  `;
} //*/
// #. JS 와 CSS 파일 불러오기
//*
const manifest = JSON.parse(
  fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf-8")
);
function createPage(root, stateScript) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <title>React App</title>
      <link href="${manifest.files["main.css"]}" rel="stylesheet" />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${root}</div>
      ${stateScript || ""}
      <script src="${manifest.files["main.js"]}"></script>
    </body>
  </html>
  `;
} //*/

const app = express();

const serverRender = async (req, res, next) => {
  const context = {};
  const store = createStore(
    rootReducer, // #.
    applyMiddleware(
      thunk, // #.
      sagaMiddleware // #.
    )
  );

  const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();

  const preloadContext = {
    done: false,
    promises: [],
  };

  // #. [청크 파일 경로 추출]
  const extractor = new ChunkExtractor({ statsFile });

  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  );

  ReactDOMServer.renderToStaticMarkup(jsx);
  store.dispatch(END);
  try {
    await sagaPromise;
    await Promise.all(preloadContext.promises);
  } catch (e) {
    return res.status(500);
  }
  preloadContext.done = true;

  const root = ReactDOMServer.renderToString(jsx);
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
  const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`;
  res.send(createPage(root, stateScript));
  /*const tags = {
    scripts: stateScript + extractor.getScriptTags(),
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  };
  res.send(createPage(root), tags);*/
};

// #. 정적 파일 제공하기
const serve = express.static(path.resolve("./build"), { index: false }); // #. 경로에서 index.html 보여주지 않음 설정
app.use(serve);

app.use(serverRender);

app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});

/*
import ReactDOMServer from "react-dom/server";

const html = ReactDOMServer.renderToString(
  <div>Hello Server Side Rendering!</div>
);

console.log(html); //*/
