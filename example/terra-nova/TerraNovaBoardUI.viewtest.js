import TerraNovaBoardUI from "./TerraNovaBoardUI.js";

const anToTokens = {};

const element = React.createElement(TerraNovaBoardUI, { anToTokens });
ReactDOM.render(element, document.getElementById("board"));
