import { h } from "preact";
import { useState } from "preact/hooks";
import { Dehydrate } from "@ninetales/ninetales";
import { Meta, Title, Style } from "@ninetales/head";

import center from "~/components/test";
import MyComponent from "~/components/MyComponent";

export default function Page({ page, site, isAbout, onlyUsedDehydrate }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("World");
  const [bold, setBold] = useState(false);

  return (
    <div className="root">
      <Meta charset="utf-8" />
      <Dehydrate>
        <Title>Title is {bold ? "Bold" : "Not Bold"}!</Title>
      </Dehydrate>
      {bold && (
        // conditionally rendered head tag
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      )}
      <Meta
        name="description"
        content={`a cool page (with a ${bold ? "bold" : "not bold"} title)`}
      />
      <Style>{`body { background: lightyellow }`}</Style>

      {/* TODO: use classNames (npm package) */}
      <h1 className={`title ${bold ? "bold" : ""}`}>
        {page.title} - {site.title}
      </h1>
      <h2>Hello {name} from Preact!</h2>
      <p>Button pressed {count} times</p>
      <button
        onClick={() => {
          setCount(count + 1);
          setBold(!bold);
        }}
      >
        Press me!
      </button>
      <input
        placeholder="name"
        value={name}
        onInput={event => setName(event.target.value)}
      />

      {"a"}
      <Dehydrate>
        b<p>{isAbout ? <a href="/">Home</a> : <a href="/about">About</a>}</p>
        <button>demo button wow</button>
        <p>{onlyUsedDehydrate}</p>c
      </Dehydrate>
      {"d"}

      <Dehydrate>
        <MyComponent />
      </Dehydrate>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: sans-serif;
        }
      `}</style>

      <style jsx>{`
        .root {
          text-align: ${center};
        }
        .title {
          font-weight: 300;
        }
        .bold {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export async function getData(req) {
  const isAbout = Boolean(req.path.match(/^\/about\/?/));
  return {
    status: 200, // optional, default to 200
    lang: "en",
    props: {
      page: { title: isAbout ? "About" : "Home" },
      site: { title: "My Website", unused: "test" },
      isAbout,
      unusedTopLevel: true,
      onlyUsedDehydrate: "foo bar xyz",
    },
  };
}
