# site-go-rob-lacy — agent notes

- Single-file site: all markup, CSS and JS live in `index.html`. Edit with
  bracket-aware changes and run `node --check` on the extracted `mainScript` before
  every push.
- Content and business details live in the `/* KB:DATA:START */ … /* KB:DATA:END */`
  block. That block must stay pure data + pure functions (no `document` / `window` at
  top level) — `api/chat.js` evaluates it server-side to build the chat assistant's
  knowledge, so every content change there automatically reaches the assistant.
- New page copy that visitors should be able to ask about belongs in that block
  (e.g. extend `PROCESS_STEPS`, `ABOUT_COPY`, `SVC`, `IND`), not hard-coded in a
  template.
- Studio records for this client: `clients/go-rob-lacy/` in `GabrealMDHindley/business-studio`.
