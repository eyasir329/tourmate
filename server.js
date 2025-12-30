const { readFileSync } = require("fs");
const { createServer } = require("http");
const { parse } = require("url");
const {renderToString} = require("react-dom/server");
const React = require("react");

const pizzas = [
  {
    name: "Focaccia",
    price: 6,
  },
  {
    name: "Pizza Margherita",
    price: 10,
  },
  {
    name: "Pizza Spinaci",
    price: 12,
  },
  {
    name: "Pizza Funghi",
    price: 12,
  },
  {
    name: "Pizza Prosciutto",
    price: 15,
  },
];

function Home() {
  return (
    <div>
      <h1>🍕 Fast React Pizza Co.</h1>
      <p>This page has been rendered with React on the server 🤯</p>

      <h2>Menu</h2>
      <ul>
        {pizzas.map((pizza) => (
          <MenuItem pizza={pizza} key={pizza.name} />
        ))}
      </ul>
    </div>
  );
}

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <span>{count}</span>
    </div>
  );
}

function MenuItem({ pizza }) {
  return (
    <li>
      <h4>
        {pizza.name} (${pizza.price})
      </h4>
      <Counter />
    </li>
  );
}

const htmlTemplate = readFileSync(`${__dirname}/index.html`, "utf-8");

const server = createServer((req, res) => {
  const pathname = parse(req.url, true).pathname;

  if (pathname === "/") {
    const renderedHtml = renderToString(<Home />);

    const finalHtml = htmlTemplate.replace("%%%CONTENT%%%", renderedHtml);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(finalHtml);

  } else if (pathname === "/test") {
    res.end("Testing!");
  } else {
    res.end("Something else!");
  }
});

server.listen(8000, () => console.log("Server is listening on port 8000"));
