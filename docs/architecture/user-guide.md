# Lineari — User Guide

Lineari is a workspace for managing your organisation's reporting lines. Add
employees, set who reports to whom, and explore the org chart visually.

## 1. Creating your account

On the login page, click **Create an account**.

You'll need:
- First name and last name
- Email address (used for sign-in and your Gravatar avatar)
- A password — at least 8 characters with upper- and lower-case letters, a
  number, and a symbol
- To tick the **terms of use** checkbox

You're signed in automatically and land on **Overview**.

## 2. Signing in

Go to `/login`, enter your email and password, and click **Sign in**.

Sessions last **7 days**. After 15 minutes of inactivity the app quietly
refreshes in the background. You only sign in again if you haven't used the
app for 7 days.

## 3. The Overview page

The home page shows:
- Your name, email, and role
- Your **reporting line** — who you report to, plus managers above
- **Your team** — people who report directly to you
- **Workspace stats** — headcount, top-level employees, manager-report pairs

The three buttons next to your name jump to **Organisation**,
**Employees**, and **Account**.

## 4. Adding an employee

From **Employees**, click **Add employee** in the top right. Fill in:

- First name and surname
- Email (for their Gravatar avatar)
- Employee number (unique across the org)
- Role or position
- Date of birth (must be in the past)
- Salary (0 or more)
- Who they report to — pick an existing employee, or leave as "No manager"

Click **Add employee**. The new person appears in the directory and the org
chart immediately.

## 5. Editing an employee

In **Employees**, click the **pencil icon** on someone's row. Every field
is pre-filled; change what you need and click **Save changes**.

- Changing their **manager** moves them in the org chart.
- You can't set someone as their own manager, or create a circular reporting
  line (A reports to B while B reports to A). The app rejects this.
- Changing their **email** or **employee number** to one already in use
  shows a friendly error; nothing is lost.

## 6. Deleting an employee

Click the **trash icon** on someone's row.

- No reports → confirm and delete.
- Has reports → choose:
  - **Leave them with no manager** — they become top-level.
  - **Move them to another manager** — pick one from the dropdown. The
    dropdown won't offer anyone who reports to the person being deleted,
    since that would create a loop.

Confirm to delete. This cannot be undone.

## 7. Browsing the directory

The **Employees** page lets you:

- **Search** by name, role, email, or employee number
- **Sort** by clicking a column header (Name, Role, Manager, Email); click
  again to reverse
- **Jump to the org chart** for a person with the tree icon on their row

The count above the table shows how many match your search out of the total.

## 8. Exploring the organisation chart

Open **Organisation** from the top nav. Two view modes, togglable with the
pill buttons next to the search bar:

### List view

An indented tree. Click the caret next to any manager to expand or collapse
their reports. Each row shows name, role, and report count.

### Graph view

A visual org chart. You can:

- **Drag** the canvas to pan
- **Scroll** to zoom
- **Click** the caret next to any manager to fold their branch

Both views support the same **search**. Type a name or role and the tree
prunes to that person and their management chain above them.

Your preferred view is remembered on this browser.

### Jumping to a specific person

From Employees, click the tree icon on anyone's row. You land on
Organisation focused on that person, with their row highlighted.

## 9. Your account

Click **Account** next to your name on the Overview page, or go to
`/account`.

- **Profile** — change your first name, last name, or email.
- **Password** — enter your current password to set a new one.

Changing your password ends every **other** signed-in session, but keeps
your current one working.

## 10. Changing the theme

Click the **sun/moon button** in the top right of the nav bar. The app
switches instantly between dark and light mode. Your choice is remembered on
this browser.

## 11. Signing out

Click **Sign out** in the top right. You land back on the login page and
your session cookies are cleared.

On a shared computer, always sign out — otherwise the browser keeps the
session alive for up to 7 days.

## 12. Troubleshooting

- **"Couldn't load the organisation"** — check that the API is running at
  `localhost:8000`, then refresh.
- **"No employees yet"** on a fresh install — an admin can run
  `uv run python seed.py` from `api/` to load a sample org, or add
  employees manually.
- **"You are not signed in"** when you expect to be — your session expired.
  Sign in again.
- **Blank page after switching to Graph** — switch to List and back, or
  refresh.