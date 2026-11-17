# Marlow client-message research

A clickable research prototype for customer interviews. It shows six client conversations for the fictional studio Marlow · River North. Each scenario places the same offer in two phones: a text message on the left and RCS on the right.

This is a stimulus, not Xplor Growth. Nothing here books a class, stores a waiver, or takes payment.

## Run

```bash
cd prototypes/2026-11-17-rcs-client-message-research
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

The shareable copy is published from the `main` branch to GitHub Pages: https://aurobr1.github.io/rcs-client-message-research/

`npm run build` typechecks and writes a static build to `dist/`.

The `prototypes/` directory is gitignored in this repo, so this folder stays on the machine where it was created.

## How to use it in a session

1. Pick a scenario in the left rail. The conversation you were in is kept if you switch away and come back.
2. Let the customer use the RCS phone. The text message beside it is the same offer with one link.
3. Use **Reset conversation** to restore only the scenario on screen.
4. On **Waitlist spot**, switch **Live offer**, **Expired**, and **Spot taken**. Changing the offer state resets that conversation on both phones.
5. Use **Hide prompts** when you want the discussion line and the device note off the screen. The phones, reset, and offer-state control stay available.

### What to click

| Scenario | Text message | RCS |
| --- | --- | --- |
| Find your next class | Open the schedule link, then a class. Continue to book stops before a reservation. | Swipe or use Prev and Next. View class opens that class. Different times and Help me choose continue in the thread. |
| Waitlist spot | Open the offer link, then Accept or Pass. The result arrives as a new text. | Accept spot checks the roster in the thread, then confirms, expires, or offers Tuesday. Pass releases the spot. |
| After class | The link opens the same two-question survey on a page. | A survey card asks how class was. Each answer asks one follow-up in the thread. Could be better can request a call from the studio. |
| First class tomorrow | One link opens waiver, directions, and the guide. | Sign waiver, Directions, and First-visit guide are on the card. The waiver confirmation appears only after submit. |
| Intro offer ending | One link lists the three plans. Payment is not taken. | Compare the cards, or use Help me choose. View plan opens that plan and stops before payment. |
| Studio essentials | One link lists the three products. | Shop item opens the product. Size stays on that page. Add to bag does not check out. |

## Limits

- Rich card layout in this prototype is illustrative. Real phones vary.
- A button either sends a reply or opens the next page. Booking, the waiver, and purchase complete only where the screen says they did.
- Accept spot is the only action that checks availability before it confirms.
- There is no studio inbox, template builder, live booking system, waiver store, or payment.
- Photography and the studio are original and fictional. Do not treat the messages as campaigns from a real brand.
