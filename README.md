# WhatsApp's Lottie Custom Animation

Create WhatsApp lottie animated stickers (`.was`).

> [!IMPORTANT]  
> WhatsApp disabled secondary animations on lottie stickers.
> You can still use the code to send lottie stickers, but no one will be able to see the secondary animations.

## Installation

Clone the repo or download the project.

```sh
git clone https://github.com/VinniTheCat/wa-lottie-custom-anim.git
cd wa-lottie-custom-anim
```

Install required dependencies.

```sh
npm install archiver baileys pino qrcode-terminal
```

You can now start using the program.

## How to use

Type the phone number to where the sticker will be sent to and optionally have a valid lottie JSON animation file.
If no lottie JSON animation file is provided, a placeholder will be used instead.

You can make your own lottie animations on the [LottieFiles](https://lottiefiles.com/) website.

```sh
node . "+55 11 99999-9999" "./animation.json"
```

When it is the first time using the program, a QR code will be generated. Scan it by opening WhatsApp app > Menu > Linked Devices > Connect device.
The connection will close with a 515 status code and will automatically reconnect.
When connected again, it will send the sticker to the provided phone number through your WhatsApp account and will show the following on the console:

```
Sticker sent
If the sticker sent is not visible on the WhatsApp app, check WhatsApp Web
```

## Credits

Part of the source code comes from [Pedrozz13755/Lottie-Whatsapp](https://github.com/Pedrozz13755/Lottie-Whatsapp).
