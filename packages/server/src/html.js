import { h } from "preact";
import serialize from "serialize-javascript";

export const DOCTYPE = "<!DOCTYPE html>";

export default function HTML({ app, lang, head, props, markers, assets }) {
  assets = assets.map(asset => `/.assets/${asset}`);

  const scripts = assets.filter(asset => asset.endsWith(".js"));
  const styles = assets.filter(asset => asset.endsWith(".css"));

  return (
    <html lang={lang}>
      <head>
        {head}
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
        {markers}
        {scripts.map(script => (
          <script key={script} src={script} />
        ))}
      </body>
    </html>
  );
}
