import { Hono } from 'https://deno.land/x/hono@v3.4.3/mod.ts';
import { cors } from 'https://deno.land/x/hono@v3.4.3/middleware.ts';
import { serve } from 'https://deno.land/std@0.148.0/http/server.ts';
import { getParam } from './getParam.js';

const app = new Hono();

function handleRequest(c) {
    const params = getParam(c.rawRequest.url);
    const url = params.get('url') || 'https://amex.deno.dev';
    const body = params.get('body') ? JSON.parse(params.get('body')) : {};

    return fetch(url, body).then(async (response) => {
        const headers = new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': response.headers.get('Content-Type'),
        });

        return c.text(await response.text(), { headers });
    });
}

app.get('/', handleRequest);

app.all("*", cors({ origin: '*' }), (c) => {
    const params = getParam(c._req.raw.url);
    const paramsUrl = params.get('url') || 'https://amex.deno.dev';

    const rawURL = paramsUrl.split("?")[0] + c._path;
    const query = paramsUrl.split("?")[1] ? "?" + paramsUrl.split("?")[1] : "";

    return fetch(rawURL + query, {}).then(async (response) => {
        const headers = new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': "text/plain",
        });

        return c.body(await response.text(), { headers });
    });
});

serve(app.fetch, { port: 8000 });
