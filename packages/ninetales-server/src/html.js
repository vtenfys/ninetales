// TODO: open bug report about this in eslint-plugin-react
// eslint-disable-next-line no-unused-vars
import { h, Fragment } from "preact";
import serialize from "serialize-javascript";

// TODO: head/meta components (lang, title etc)
function HTML({ full, app, appProps, styles, bundles }) {
  return (
    <html>
      <head>{full && styles}</head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: full && app }} />
        {full && (
          <>
            <script
              id="props"
              type="application/json"
              dangerouslySetInnerHTML={{
                __html: serialize(appProps, { isJSON: true }),
              }}
            />
            {bundles.map(bundle => (
              <script key={bundle} src={`/.bundles/${bundle}`} />
            ))}
          </>
        )}
      </body>
    </html>
  );
}

export const doctype = "<!DOCTYPE html>";
export default HTML;
