# Hero Video — 8s Breakdown + Video Prompts (v1, 2026-09-29)
Frames 1, 2, 3 APPROVED (16:9). Video = Clip A (F1→F2, 0–4s) + Clip B (F2→F3, 4–8s). Most tools take only start+end frame, so 2 clips, joined at Frame 2.

## Second-by-second
| Time | What we see |
|---|---|
| 0.0–1.0 | Frame 1 exactly. Upper (right) hand pinches left glove cuff; gives one small firm tug — latex stretches, then settles tight at wrist. |
| 1.0–2.0 | Right hand releases cuff. Left hand relaxes slightly, fingers ease closed a little and drift a few cm right/down to its Frame-2 position. Right hand lifts up and back toward its Frame-2 spot, palm turning inward (toward camera-right). |
| 2.0–3.0 | Right hand rotates wrist slowly; as the palm turns, the scalpel is REVEALED from inside the curled fingers (it was hidden behind palm) — no pop-in. Fingers roll the handle into position. |
| 3.0–4.0 | Fingers settle into pencil grip: thumb + index on handle, middle finger under. Blade tilts down-left, catches a light glint. Hold = Frame 2. |
| 4.0–5.0 | Tiny pause, then both hands begin lowering together, slow and smooth. Camera very slowly tilts down / lowers (Frame 3 shows the white floor plane). |
| 5.0–6.0 | Left hand reaches the white surface first: fingertips touch, palm flattens, index + middle spread to stabilise. Soft contact shadow appears. |
| 6.0–7.0 | Right hand continues down, wrist steady, blade angle ~45°. Blade tip approaches surface; its shadow grows toward the tip. |
| 7.0–8.0 | Blade tip stops a hair above / just touching the surface. Everything still. Hold = Frame 3. |

Rules: no cuts, locked camera in Clip A, very slow tilt in Clip B, constant slow speed (for scroll scrubbing), no motion blur, no audio, background stays pure white.

## Clip A prompt (Start = Frame 1, End = Frame 2, 4s)
```
Photorealistic 4-second continuous shot, locked-off static camera, pure white studio background, soft light from upper left. Only two forearms in green-teal woven surgical gown sleeves and cream latex surgical gloves, entering from the right edge (right arm from upper-right, left arm from lower-right). 0–1s: the upper right hand pinches the cuff of the lower left glove and gives one small firm tug; the latex stretches and settles tight at the wrist. 1–2s: the right hand releases the cuff and lifts slowly up and back; the left hand relaxes and drifts slightly into its new resting position, fingers gently open. 2–3s: the right hand slowly rotates at the wrist and a stainless-steel scalpel with a straight pointed No. 11 blade is revealed from inside the curled fingers, as if it had been held in the palm — it does not pop in. 3–4s: the fingers roll the handle into a precise pencil grip, thumb and index on the handle, middle finger beneath; the blade tilts down-left and catches a soft glint of light, then holds still. Slow, smooth, calm, deliberate surgeon movement at constant speed. No cuts, no camera movement, no motion blur, no other objects, no other people, no blood, no text. Hands keep exactly five fingers, gloves and gown keep the same colour and texture throughout.
```

## Clip B prompt (Start = Frame 2, End = Frame 3, 4s)
```
Photorealistic 4-second continuous shot, pure white studio background, soft light from upper left. Only two forearms in green-teal woven surgical gown sleeves and cream latex surgical gloves, entering from the right edge. The right hand holds a stainless-steel scalpel with a straight pointed No. 11 blade in a steady pencil grip. 0–1s: a brief still pause, then both hands begin lowering together, slow and smooth, while the camera very slowly tilts down and lowers slightly to reveal a seamless pure white surface. 1–2s: the left hand reaches the white surface first; fingertips touch, the palm settles, index and middle fingers spread apart to stabilise; a soft contact shadow appears. 2–3s: the right hand keeps descending, wrist perfectly steady, blade angled about 45 degrees; the blade's shadow grows toward its tip. 3–4s: the blade tip stops just touching the white surface and everything becomes completely still — the split second before the first incision. Constant slow speed, no cuts, no motion blur, no blood, no skin, no drape, no table edge, no other objects or people, no text. Hands keep exactly five fingers, grip never changes, gloves and gown keep the same colour and texture.
```

## Negative (tools with a negative field)
extra fingers, morphing hands, flickering, glove colour change, scalpel disappearing, scalpel popping in, blade changing shape, curved blade, blood, cut, skin, camera shake, fast motion, motion blur, cuts, text, watermark, grey background.

## Tool notes
- Kling 2.x / Veo 3.1 / Runway Gen-4: "start + end frame" mode; 5s if 4s unavailable → trim to 4s.
- Generate each clip 3–5 times, pick the one with stable fingers.
- Join A+B in CapCut: cut exactly where both show Frame 2.
- Export: 1920×1080, 24–30fps, H.264 high quality. Hand the MP4 to me → I extract ~120 WebP frames (desktop) / 60–80 (phone) for scroll scrubbing.
- Phone (9:16): generate 9:16 versions of Frames 1–3 later and repeat, OR crop desktop video if hands fit.

## ✅ FINAL SINGLE PROMPT (user request: one prompt, 3 reference images)
```
Create one continuous, photorealistic 8-second video, 16:9, using the three attached reference images as keyframes in this exact order: Image 1 = the first frame (0 s), Image 2 = the middle frame (4 s), Image 3 = the final frame (8 s). Match all three references exactly — same pure white studio background, same soft light from the upper left, same soft shadows, same deep green-teal woven surgical gown sleeves, same cream latex surgical gloves, same stainless-steel scalpel with a straight pointed No. 11 blade, same hands. Only two gloved forearms are visible, entering from the right edge of the frame (right arm from the upper right, left arm from the lower right). Nothing else is ever in the frame.

0–1 s: Exactly Image 1. The upper right hand pinches the cuff of the lower left glove and gives one small, firm tug; the latex stretches and settles tight at the wrist.
1–2 s: The right hand releases the cuff and lifts slowly up and back. The left hand relaxes and drifts slightly into its new resting position, fingers gently open.
2–3 s: The right hand slowly rotates at the wrist and the scalpel is revealed from inside the curled fingers, as if it had been held in the palm — it never pops in or appears from nowhere.
3–4 s: The fingers roll the handle into a precise pencil grip — thumb and index finger on the handle, middle finger underneath. The blade tilts down and to the left and catches a soft glint of light. Reach exactly Image 2 and hold for a brief moment.
4–5 s: Both hands begin to lower together, slow and smooth, while the camera very gently tilts down to reveal a seamless pure white surface.
5–6 s: The left hand touches the white surface first; the palm settles, index and middle fingers spread apart to stabilise. A soft contact shadow appears.
6–7 s: The right hand keeps descending with a perfectly steady wrist, the blade at about 45 degrees; the blade's shadow moves toward its tip.
7–8 s: The blade tip stops just touching the white surface. Everything becomes completely still — the split second before the first incision. End exactly on Image 3.

Style: calm, precise, deliberate surgeon movement at a constant slow speed throughout, one single continuous shot, locked camera except the gentle downward tilt from 4 s, premium medical brand film, natural colours, crisp focus on the hands and the blade.
```

**Negative:**
```
extra fingers, missing fingers, fused fingers, morphing hands, deformed hands, flickering, glove colour change, gown colour change, fabric change, scalpel disappearing, scalpel popping in, blade changing shape, curved blade, second scalpel, blood, cut, wound, skin, visible skin at the wrist, patient, body, face, other people, assistant hand, instrument tray, table edge, surgical drape, operating room, grey background, background change, camera shake, fast motion, sudden jumps, motion blur, scene cuts, zoom, text, subtitles, logo, watermark, cartoon, CGI look, plastic look.
```

## v3 (2026-09-29) — fix: scalpel popped out of hand + grip morphed
Fix = right hand leaves frame (to an off-screen tray) and RETURNS already holding the scalpel in pencil grip. No pop-in, no grip change on screen. No glint/glow. Full prompt delivered in chat (same session).
```
One continuous, natural, real-life 8-second video shot, 16:9, filmed like a real documentary moment in an operating theatre — no visual effects, no magic, no glow. Locked camera. Pure white background. Use the three attached images as keyframes: Image 1 at 0 s, Image 2 at 4.5 s, Image 3 at 8 s. The same two forearms throughout — green-teal woven surgical gown sleeves and cream latex surgical gloves — entering from the right side of the frame, exactly as in the references.

IMPORTANT REALISM RULES:
- The scalpel is NEVER created in the frame. It does not appear from the palm, does not materialise, does not pop in. The right hand leaves the frame empty and comes back already holding it.
- The scalpel is already held in a pencil grip when it enters the frame. The grip never changes on screen.
- Real human speed and weight: gentle acceleration and deceleration, small natural micro-movements, no robotic or sliding motion.
- Plain real studio lighting. No glints, no sparkles, no glow, no light flares.

0.0–1.5 s: Starts exactly on Image 1. The right hand gives the left glove cuff one small tug at the wrist, smooths it once with the thumb, then lets go. The left hand flexes its fingers once, feeling the fit of the glove.
1.5–3.0 s: The right hand turns and pulls back, moving up and to the right until it leaves the frame completely, as if reaching for an instrument on a tray just off-screen. For about half a second only the left hand is in the frame, relaxed and still.
3.0–4.5 s: The right hand comes back into the frame from the upper right, already holding the stainless-steel scalpel with a straight pointed blade in a pencil grip — thumb and index finger on the handle, middle finger underneath, like holding a pen. It moves in smoothly and settles into position beside the left hand. Arrive exactly at Image 2 and pause for a breath.
4.5–6.0 s: Both hands begin to lower together, slowly and steadily, as the surgeon prepares to operate. The right hand keeps the exact same pencil grip. The camera stays still; a flat white surface is now visible at the bottom of the frame.
6.0–7.0 s: The left hand reaches the white surface first; the fingertips touch down, the palm settles, and the index and middle fingers spread slightly to steady the area. A soft natural shadow forms under it.
7.0–8.0 s: The right hand lowers the last few centimetres with a steady wrist; the blade tip gently touches the white surface next to the left hand and stops. Complete stillness. End exactly on Image 3.

Overall feel: calm, confident, precise, real — like watching an experienced surgeon's hands just before the first incision.
```
Negative:
```
scalpel appearing from nowhere, scalpel emerging from palm, scalpel materialising, scalpel popping in, grip changing, fist grip, hand morphing, fingers morphing, extra fingers, missing fingers, fused fingers, deformed hands, two scalpels, curved blade, blade glint, glow, sparkle, light flare, magic effect, glove colour change, gown colour change, fabric change, blood, cut, wound, skin, other people, assistant hand, visible tray, table edge, drape, operating room, grey background, camera shake, camera movement, zoom, fast motion, robotic motion, sliding motion, motion blur, slow-motion effect, scene cuts, text, watermark, CGI look, cartoon.
```
Fallback if the tool still morphs: make 2 clips (1→2 and 2→3) with the matching part of this prompt, join in CapCut at Image 2.
