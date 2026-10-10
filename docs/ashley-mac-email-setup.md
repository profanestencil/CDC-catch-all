# Ashley — Mac email setup (`ashley@c-p-consulting.xyz`)

## Status (checked 2026-10-10)

| Address | Inbox status |
|---|---|
| `hello@c-p-consulting.xyz` | **Not working** — no MX / mail host on the domain |
| `ashley@c-p-consulting.xyz` | **Not working** — no MX / mail host on the domain |
| `tim@c-p-consulting.xyz` | **Not working** — no MX / mail host on the domain |

Vercel hosts the **website** for `c-p-consulting.xyz`. That does **not** create mailboxes. Until MX (and usually SPF/DKIM) records point at an email provider, mail to these addresses will bounce or never arrive.

---

## Part A — Admin: create the mailboxes first

Pick one provider. For Mac users, **iCloud Custom Email Domain** is the simplest path into Apple Mail / iPhone Mail.

### Option 1 (recommended for Mac): iCloud+ Custom Email Domain

Needs an Apple ID with **iCloud+** that supports Custom Email Domain (typically iCloud+ or Apple One).

1. On a Mac or iCloud.com, open **[iCloud Custom Email Domain](https://www.icloud.com/icloudplus)** → **Custom Email Domain**.
2. Add domain: `c-p-consulting.xyz`.
3. Choose to create addresses:
   - `hello@c-p-consulting.xyz` (shared / public — assign to Tim or a shared Apple ID if needed)
   - `ashley@c-p-consulting.xyz` (Ashley’s Apple ID)
   - `tim@c-p-consulting.xyz` (Tim’s Apple ID)
4. Apple will show DNS records to add (MX, TXT/SPF, DKIM). Add them in **Vercel → Domains → c-p-consulting.xyz → DNS**.
5. Wait for Apple to verify (often minutes, sometimes up to 24h).
6. Invite Ashley’s Apple ID to use `ashley@…` if the domain is owned on Tim’s iCloud.

**Do not remove** the existing Vercel website DNS (ALIAS / `*` records). Only **add** the email records Apple shows.

### Option 2: Google Workspace

1. Create Google Workspace for `c-p-consulting.xyz`.
2. Create users: `hello@`, `ashley@`, `tim@` (or aliases).
3. Add Google’s MX + SPF/DKIM TXT records in Vercel DNS.
4. Continue with Part B using Google’s IMAP/SMTP (or Google’s “Sign in with Google” in Mail if offered).

### Option 3: Temporary forwarding (ImprovMX / similar)

If you only need mail **delivered to existing inboxes** for now:

1. Sign up at a forwarder (e.g. ImprovMX).
2. Add their MX records in Vercel DNS.
3. Forward:
   - `hello@` → primary ops inbox  
   - `ashley@` → Ashley’s personal Gmail/iCloud  
   - `tim@` → Tim’s personal inbox  
4. Sending *as* `@c-p-consulting.xyz` still needs a proper mailbox or SMTP later.

---

## Part B — Ashley: set up on a Mac (Apple Mail)

Do this **after** Part A shows the address as active for her Apple ID (iCloud) **or** she has Workspace login credentials.

### If using iCloud Custom Email Domain

1. Update macOS if needed, then open **System Settings → [your name] → iCloud**.
2. Confirm she is signed into the Apple ID that owns / was invited to `ashley@c-p-consulting.xyz`.
3. Open **System Settings → iCloud → iCloud Mail** (wording varies by macOS) and ensure Mail is on.
4. Open **Mail** (Applications → Mail).
5. Menu **Mail → Settings → Accounts**.
6. Select the iCloud account → confirm **ashley@c-p-consulting.xyz** appears under email addresses / aliases.
7. Set **Outgoing** defaults so new messages send from `ashley@c-p-consulting.xyz` when desired:
   - Compose a test → From: choose `ashley@c-p-consulting.xyz`.
8. On iPhone/iPad (optional): **Settings → [name] → iCloud → Mail** on; same Apple ID.

### If using Google Workspace (manual account in Mail)

1. Open **Mail → Add Account → Google** (or **Other Mail Account**).
2. Sign in with `ashley@c-p-consulting.xyz` and the Workspace password (complete 2FA if prompted).
3. Enable Mail (and Notes if you want).
4. **Mail → Settings → Accounts → [account] → Email Address**: confirm `ashley@…`.
5. Under **Outgoing Mail Server (SMTP)**, use Google’s SMTP (`smtp.gmail.com`, port 465 or 587) if Mail did not auto-configure.

Typical Google values (only if manual setup is required):

| Field | Value |
|---|---|
| Email | `ashley@c-p-consulting.xyz` |
| Incoming (IMAP) | `imap.gmail.com` · Port `993` · SSL |
| Outgoing (SMTP) | `smtp.gmail.com` · Port `587` · STARTTLS |
| Username | full address `ashley@c-p-consulting.xyz` |

---

## Part C — Confirm the mailbox works

From a **different** email account (not Ashley’s):

1. Send a message **to** `ashley@c-p-consulting.xyz` with subject `CPC inbox test`.
2. Ashley should receive it in Mac Mail within a few minutes.
3. Ashley replies from `ashley@c-p-consulting.xyz`.
4. Confirm the reply arrives and the From address is correct (not a personal Gmail).

Repeat for `hello@` and `tim@` once those mailboxes exist.

Quick DNS check (should show MX after setup):

```bash
dig +short c-p-consulting.xyz MX
```

Empty MX = still no mail. Non-empty MX pointing at iCloud/Google/etc. = DNS side OK.

---

## Notes

- Website DNS stays on Vercel; email DNS is additional MX/TXT records on the same domain.
- Creating addresses on the marketing site (`mailto:` links) does not create inboxes.
- Keep personal passwords off shared docs; Ashley should use her own Apple ID / Workspace login.
