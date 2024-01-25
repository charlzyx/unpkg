/**
 * {
  "name": "fk302",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "gunzip-maybe": "^1.4.2",
    "https": "^1.0.0",
    "url": "^0.11.3"
  }
}

 */
import url from "url";
import https from "https";
function get(options) {
	return new Promise((accept, reject) => {
		https.get(options, accept).on("error", reject);
	});
}
import gunzip from "gunzip-maybe";
const agent = new https.Agent({
	keepAlive: true,
});
function bufferStream(stream) {
	return new Promise((accept, reject) => {
		const chunks = [];

		stream
			.on("error", reject)
			.on("data", (chunk) => chunks.push(chunk))
			.on("end", () => accept(Buffer.concat(chunks)));
	});
}

const tarballURL = "https://registry.npmmirror.com/jquery/-/jquery-1.7.2.tgz";
const got = async (tarballURL) => {
	const { hostname, pathname } = url.parse(tarballURL);
	const options = {
		agent: agent,
		hostname: hostname,
		path: pathname,
	};

	const res = await get(options);
	if (res.statusCode === 200) {
		const content = await bufferStream(res.pipe(gunzip()));
		console.log(content);
		// console.log(res.pipe(gunzip()));
	}
	if (res.statusCode === 302) {
		console.log(res.headers.location);
		await got(res.headers.location);
		// const res = await get(options);
	}
};

await got(tarballURL);
