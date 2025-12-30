require("@babel/register")({
  extensions: [".js", ".jsx"],
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server.js");
