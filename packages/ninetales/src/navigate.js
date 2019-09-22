import { render } from "preact";

// TODO: handle 404s
async function transition({ html, data, bundles }) {
  // fetch bundles before destroying current page
  const bundleScripts = await Promise.all(
    bundles.map(async bundle => {
      const src = `/.bundles/${bundle}`;
      const response = await fetch(src);
      return await response.text();
    })
  );

  // destroy existing root node
  render(null, document.getElementById("app"));

  const domparser = new DOMParser();
  const newDocument = domparser.parseFromString(html, "text/html");
  document.documentElement.replaceChild(newDocument.head, document.head);
  document.documentElement.replaceChild(newDocument.body, document.body);

  // TODO: handle status code?
  const propsScript = document.createElement("script");
  propsScript.id = "props";
  propsScript.type = "application/json";
  propsScript.innerHTML = JSON.stringify(data.props);
  document.body.appendChild(propsScript);

  bundleScripts.forEach(text => {
    const bundleScript = document.createElement("script");
    bundleScript.innerHTML = text;
    document.body.appendChild(bundleScript);
  });
}

// TODO: support POST
async function navigate(href, push = true) {
  if (push) {
    history.pushState(null, document.title, href);
  }

  const { pathname, search } = new URL(href, location.origin);
  const dataURL = `/.data${pathname}${search}`;

  try {
    const response = await fetch(dataURL);
    const data = await response.json();
    await transition(data);
  } catch (e) {
    location.reload();
  }
}

export default navigate;
