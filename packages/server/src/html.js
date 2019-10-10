import { h } from "preact";
import serialize from "serialize-javascript";

// TODO: head/meta components (lang, title etc)
function HTML({ app, props, assets }) {
  assets = assets.map(asset => `/.assets/${asset}`);

  const scripts = assets.filter(asset => asset.endsWith(".js"));
  const styles = assets.filter(asset => asset.endsWith(".css"));

  return (
    <html>
      <head>
        {styles.map(style => (
          <link key={style} rel="stylesheet" href={style} />
        ))}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: app }} />
        <script
          id="props"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: serialize(props, { isJSON: true }),
          }}
        />
        {scripts.map(script => (
          <script key={script} src={script} />
        ))}
      </body>
    </html>
  );
}

export const doctype = "<!DOCTYPE html>";
export default HTML;
