/** ERROR: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server' is not defined by "exports" ~ react-router-dom */
// #. { StaticRouter } react-router-dom/server => react-router-dom 으로 변경
import ReactDOMServer from "react-dom/server";
import express from "express";
//import { StaticRouter } from "react-router-dom/server"; // #. Error [ERR_PACKAGE_PATH_NOT_EXPORTED]
import { StaticRouter } from "react-router-dom";
import App from "./App";
import path from "path"; // #. 정정 파일 제공하기

const app = express();

const serverRender = (req, res, next) => {
  const context = {};
  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const root = ReactDOMServer.renderToString(jsx);
  res.send(root);
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
