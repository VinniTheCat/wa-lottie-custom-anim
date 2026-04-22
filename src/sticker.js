const fs = require("fs");
const archiver = require("archiver");
const zip = archiver("zip");

function buildSticker(baseFolder, output) {
	if (!fs.existsSync(baseFolder))
		throw new Error(`${baseFolder} not found`);

	const wasOutput = fs.createWriteStream(output);

	zip.on("error", (err) => { throw err })
		.directory(baseFolder, false)
		.pipe(wasOutput);

	zip.finalize();
}

async function sendSticker(sock, phoneNumber, wasPath) {
	const sanitizedPN = phoneNumber.replace(/\D/g, "");
	const waPN = `${sanitizedPN}@s.whatsapp.net`;
	const buffer = fs.readFileSync(wasPath);

	await sock.sendMessage(waPN, {
		sticker: buffer,
		mimetype: "application/was",
	});
}

module.exports = {
	buildSticker,
	sendSticker,
};
