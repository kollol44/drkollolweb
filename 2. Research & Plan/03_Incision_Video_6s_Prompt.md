# Incision Stroke Video — 6s (Option 1: left hand retreats) — 2026-09-29
Start frame = Frame 3 image (blade tip on white surface, left hand beside it). Video shows ONLY hand motion; incision line, opening and text are added by code on top, synced frame-by-frame.

## Second-by-second
| Time | Right hand (scalpel) | Left hand | Code layer (later) |
|---|---|---|---|
| 0–1 s | Exactly the start image. Blade tip on surface; tiny downward press, knuckles tense slightly. | Presses down, index+middle fingers tighten, stretching the surface. | nothing |
| 1–2 s | Begins a slow straight stroke to the RIGHT; tip stays in contact. | Starts sliding back to the right ahead of the blade, keeping fingers spread and pressure on. | line starts |
| 2–3.5 s | Steady constant speed along one perfectly straight horizontal line; wrist locked, forearm moves. | Keeps retreating at the same pace, always ~2 finger-widths ahead of the blade. | line draws, starts opening |
| 3.5–4.5 s | Slows smoothly and stops at the end of the stroke. | Stops, still pressing. | opening widens, headline appears |
| 4.5–5.5 s | Lifts blade tip gently off the surface a few cm, same pencil grip. | Relaxes pressure, stays on surface. | name/title appear |
| 5.5–6 s | Holds still. | Holds still. | CTA appears |

## PROMPT
```
Photorealistic 6-second single continuous shot, 16:9. The attached image is the exact first frame — match it perfectly: pure white studio background and white surface, soft light from the upper left, soft natural shadows, locked static camera, two forearms in green-teal woven surgical gown sleeves and cream latex surgical gloves entering from the right edge. The right hand holds a stainless-steel scalpel with a straight pointed blade in a pencil grip, blade tip touching the white surface; the left hand rests flat on the surface just to the right of the blade tip, index and middle fingers spread.

This is an experienced surgeon making one single, straight, precise incision stroke from left to right, filmed in real time.

0–1 s: Hold the first frame. The surgeon settles in: the right hand applies a slight downward pressure on the blade tip, and the left hand presses down, index and middle fingers stretching the surface taut.
1–2 s: The right hand begins drawing the blade slowly to the RIGHT in a perfectly straight horizontal line, the tip never leaving the surface. At the same moment the left hand begins sliding backward to the right, ahead of the blade, still pressing down and keeping the surface stretched — it moves out of the blade's path.
2–3.5 s: Both hands travel to the right together at the same steady, constant speed. The blade stays about two finger-widths behind the left hand's fingertips at all times and never touches the left hand. The wrist of the right hand stays locked; the movement comes from the forearm and shoulder. The blade angle and the pencil grip never change.
3.5–4.5 s: The stroke slows smoothly and stops. The left hand stops as well, still pressing on the surface.
4.5–5.5 s: The right hand gently lifts the blade tip a few centimetres off the surface, keeping the exact same pencil grip. The left hand relaxes its pressure and stays resting on the surface.
5.5–6 s: Both hands hold completely still.

Realism: real human motion with gentle acceleration and deceleration, tiny natural micro-movements, calm and confident. The camera never moves. Plain real lighting.

The white surface stays completely clean and untouched: no cut, no line, no mark, no blood appears anywhere — only the hands move.
```

## NEGATIVE
```
cut line, incision mark, scratch, groove, blood, red liquid, wound, skin, flesh, blade touching the left hand, fingers crossing the blade path, hands overlapping, grip changing, scalpel changing shape, scalpel disappearing, second scalpel, curved blade, glint, glow, sparkle, extra fingers, missing fingers, fused fingers, morphing hands, deformed hands, glove colour change, gown colour change, other people, tray, table edge, drape, grey background, camera movement, zoom, camera shake, fast motion, jerky motion, motion blur, slow-motion effect, scene cuts, text, watermark, CGI look, cartoon.
```

## Notes
- Upload ONLY this image as start frame (no end frame) so the tool doesn't force a wrong ending.
- Generate 4–6 times; pick the one where the left hand clearly retreats and the blade line stays straight.
- Export 1920×1080, 24–30fps MP4 → put in `3. Demos/`. I will map blade-tip position per frame and sync the code line + opening + text.

---
# v2 (2026-09-29) — LONG stroke left edge → right + natural blood (user request)
## PROMPT
```
Photorealistic 6-second single continuous shot, 16:9. The attached image is the exact first frame — match it perfectly: pure white studio background and white surface, soft light from the upper left, soft natural shadows, locked static camera, two forearms in green-teal woven surgical gown sleeves and cream latex surgical gloves entering from the right edge. The right hand holds a stainless-steel scalpel with a straight pointed blade in a pencil grip; the left hand rests on the surface to the right of the blade.

An experienced surgeon makes ONE long, single, perfectly straight incision across almost the full width of the frame, from the far LEFT side to the far RIGHT side, filmed in real time. The white surface behaves like taut skin.

0–1 s: From the first frame, the right hand lifts the blade slightly and glides smoothly to the far LEFT side of the frame (about 10% from the left edge), then lowers the blade tip onto the surface. The left hand moves with it and presses down just to the right of the blade, index and middle fingers stretching the surface taut.
1–4.5 s: The right hand draws the blade to the RIGHT in one continuous, perfectly straight horizontal line at a slow, steady, constant speed, across the whole frame until about 85% from the left edge. The tip never leaves the surface; the pencil grip, blade angle and locked wrist never change — the movement comes from the forearm and shoulder. The left hand slides backward to the right ahead of the blade the whole time, keeping the surface stretched and staying about two finger-widths ahead of the blade — the blade never touches the left hand. Behind the blade a clean, thin, straight incision opens in the white surface. Within a moment of the blade passing, fresh red blood naturally wells up along the incision: first tiny beads, then the beads slowly merge into a thin, glossy line of blood that follows the cut from left to right, with a few small droplets gently seeping out along its edges.
4.5–5.5 s: The stroke slows smoothly and stops near the right side. The right hand gently lifts the blade a few centimetres off the surface, same pencil grip; the tip of the blade has a thin natural film of blood. The left hand relaxes and stays on the surface.
5.5–6 s: Hands hold still. The blood along the full-length incision keeps slowly welling and settling, glossy and natural.

BLOOD LOOK: real fresh human blood — natural deep red with slightly darker crimson edges where it is thicker, wet and glossy with soft realistic highlights, behaving with real surface tension (beads, merges, seeps slowly). Controlled and clinical — a thin line of blood along a clean surgical incision, not gore, no splashes, no spurting, no pools.

Realism: real human motion with gentle acceleration and deceleration, tiny natural micro-movements, calm and confident. The camera never moves. Plain real lighting.
```
## NEGATIVE
```
short cut, cut only near the hand, curved line, wavy line, zig-zag, multiple cuts, blade touching the left hand, fingers crossing the blade path, hands overlapping, grip changing, scalpel changing shape, scalpel disappearing, second scalpel, curved blade, gore, splatter, spurting blood, blood pool, blood on gloves, pink blood, orange blood, brown blood, black blood, paint, ketchup look, cartoon blood, skin texture, flesh, organs, glint, glow, sparkle, extra fingers, missing fingers, fused fingers, morphing hands, deformed hands, glove colour change, gown colour change, other people, tray, table edge, drape, grey background, camera movement, zoom, camera shake, fast motion, jerky motion, motion blur, slow-motion effect, scene cuts, text, watermark, CGI look.
```
Note: code layer now only handles text (and optional opening); incision + blood come from the video.

---
# v3 (2026-09-29) — v2 blocked by video tool's content policy. Decision: video = long stroke motion only (clean surface); red fluid line is rendered in CODE, synced to blade tip per frame.
## PROMPT
```
Photorealistic 6-second single continuous shot, 16:9. The attached image is the exact first frame — match it perfectly: pure white studio background and white surface, soft light from the upper left, soft natural shadows, locked static camera, two forearms in green-teal woven surgical gown sleeves and cream latex surgical gloves entering from the right edge. The right hand holds a stainless-steel scalpel with a straight pointed blade in a pencil grip; the left hand rests on the surface to the right of the blade.

A calm, experienced surgeon demonstrates one long, perfectly straight, precise stroke across almost the full width of the frame, from the far LEFT side to the far RIGHT side, filmed in real time.

0–1 s: From the first frame, the right hand lifts the scalpel slightly and glides smoothly to the far LEFT side of the frame (about 10% from the left edge), then lowers the blade tip until it just touches the surface. The left hand moves with it and rests just to the right of the blade, index and middle fingers spread, gently steadying the surface.
1–4.5 s: The right hand draws the blade tip to the RIGHT in one continuous, perfectly straight horizontal line at a slow, steady, constant speed, across the whole frame until about 85% from the left edge. The tip stays in light contact with the surface; the pencil grip, blade angle and locked wrist never change — the movement comes from the forearm and shoulder. The left hand slides to the right ahead of the blade the whole time, always about two finger-widths ahead, so the blade never touches it.
4.5–5.5 s: The stroke slows smoothly and stops near the right side. The right hand gently lifts the blade a few centimetres, same pencil grip. The left hand relaxes and stays on the surface.
5.5–6 s: Both hands hold completely still.

Real human motion with gentle acceleration and deceleration, tiny natural micro-movements, calm and confident. The camera never moves. Plain real lighting. The white surface stays clean — nothing is drawn or left on it.
```
## NEGATIVE
```
short stroke, stroke only near the hand, curved path, wavy path, zig-zag, multiple strokes, blade touching the left hand, fingers crossing the blade path, hands overlapping, grip changing, scalpel changing shape, scalpel disappearing, second scalpel, curved blade, marks on the surface, lines on the surface, glint, glow, sparkle, extra fingers, missing fingers, fused fingers, morphing hands, deformed hands, glove colour change, gown colour change, other people, tray, table edge, drape, grey background, camera movement, zoom, camera shake, fast motion, jerky motion, motion blur, slow-motion effect, scene cuts, text, watermark, CGI look.
```
