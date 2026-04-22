const os = require("os");
const fs = require("fs");
const path = require("path");
const logger = require("pino");
const qrcode = require("qrcode-terminal");
const {
	default: makeWASocket,
	useMultiFileAuthState,
	Browsers,
	fetchLatestBaileysVersion,
} = require("baileys");
const { buildSticker, sendSticker } = require("./sticker");

const DEFAULT_STICKER = path.resolve(__dirname, "chomp");
const TEMP_DIR = fs.realpathSync(os.tmpdir());
const OUTPUT_DIR = path.resolve(TEMP_DIR, "output_sticker");
const WAS_PATH = path.resolve(TEMP_DIR, "sticker.was");

async function connect(phoneNumber) {
	const { state, saveCreds } = await useMultiFileAuthState("auth_info");
	const { version } = await fetchLatestBaileysVersion();

	const sock = makeWASocket({
		version,
		browser: Browsers.ubuntu("Chrome"),
		auth: state,
		syncFullHistory: false,
		logger: logger({ level: "fatal" }),
	});

	sock.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect, qr } = update;

		if (qr) {
			console.log("Scan QR code:");
			qrcode.generate(qr, { small: true });
			return;
		}

		if (connection === "open") {
			await sendSticker(sock, phoneNumber, WAS_PATH);
			console.log("Sticker sent\nIf the sticker sent is not visible on the WhatsApp app, check WhatsApp Web");

			// return;
			process.exit(0);
		}

		if (connection === "close") {
			const statusCode = lastDisconnect.error.output.statusCode;
			console.log(`Closed, status code: ${statusCode}`);

			if (statusCode === 515) {
				console.log("Status code is 515, reconnecting is required\nReconnecting...");
				setTimeout(() => connect(phoneNumber), 5000);
			} else {
				process.exit(1);
			}
		}
	});

	sock.ev.on("creds.update", saveCreds);
}

(async function () {
	if (typeof require !== "undefined" && require.main === module) {
		const phoneNumber = process.argv[2].replace(/\D/g, "");
		const animationPath = process.argv[3];

		if (!phoneNumber)
			throw new Error("Provide a phone number");
		// if (!animationPath)
		// 	throw new Error("Provide a valid animation_secondary.json");

		if (animationPath && !fs.existsSync(animationPath))
			throw new Error(`${animationPath} not found`);

		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		fs.cpSync(DEFAULT_STICKER, OUTPUT_DIR, { recursive: true });
		if (animationPath)
			fs.copyFileSync(animationPath, path.resolve(OUTPUT_DIR, "animation", "animation_secondary.json"));
		buildSticker(OUTPUT_DIR, WAS_PATH);

		console.log("WhatsApp's Chomp Custom Animation");

		await connect(phoneNumber);
	}
})();
