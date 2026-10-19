# Social material · ledsav_dev

Channel and social assets for the **ledsav_dev** handle. The brand is Alberto Valdés Rey
(logo, colours and type in [../LOGO.md](../LOGO.md)); ledsav_dev is the video/social handle.

## YouTube

| File | What |
|---|---|
| `youtube/youtube-banner.png` | Channel banner, 2560 × 1440, upload this one |
| `youtube/banner.html` | Source. Edit text here, then re-render (command at the top of the file) |
| `youtube/preview-desktop.png` | What desktop shows (2560 × 423 strip) |
| `youtube/preview-mobile-safe-area.png` | What every device shows (1546 × 423 safe area) |

YouTube rules: 2560 × 1440, max 6 MB. Only the centred 1546 × 423 area is visible on all
devices, so the logo and text live there; the ember glow fills the rest (seen on TV).
Open `banner.html?guides` in a browser to see the crop guides.

Upload: YouTube Studio → Customization → Branding → Banner image.

### Video watermark

| File | What |
|---|---|
| `youtube/youtube-watermark.png` | **Upload this one.** 600 × 600, transparent, small-cut Nest on a dark rounded tile. Readable on light, dark and busy footage |
| `youtube/youtube-watermark-white.png` | One-colour white backup. Only for always-dark videos (vanishes on light footage) |
| `youtube/watermark.html` | Source (`?mono` for the white version) |

YouTube rules: square, at least 150 × 150, PNG, max 1 MB. On desktop it doubles as a subscribe button.
Upload: YouTube Studio → Customization → Branding → Video watermark → display time **Entire video**.
