# Project Guidelines & Rules

## Donation & Payment QR Codes
- **Static Assets Requirement**: The donation modal must strictly use the static JPG files located at:
  - PayPal: `assets/donate/paypal.jpg` (or `public/assets/donate/paypal.jpg`)
  - PayMe: `assets/donate/payme.jpg` (or `public/assets/donate/payme.jpg`)
  - AlipayHK: `assets/donate/alipayhk.jpg` (or `public/assets/donate/alipayhk.jpg`)
  - WeChat Pay: `assets/donate/wechatpay.jpg` (or `public/assets/donate/wechatpay.jpg`)
- **Strict Prohibition**: **DO NOT** replace these images with dynamic QR generation libraries, canvas drawings, or synthetic overlays in any future edits. Always preserve direct `<img>` rendering with `object-fit: contain` to protect QR code scanning integrity.
