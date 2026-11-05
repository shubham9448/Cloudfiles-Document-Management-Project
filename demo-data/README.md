# Copperline demo data

Everything here is fictional, in the same style as the `OPP-2041-excavator-purchase` sample set: two borrowers, two deals, every document you need, and the records ready to import.

## What is in the box

| | Deal 1: the story deal | Deal 2: the happy path |
| --- | --- | --- |
| Folder | `OPP-3001-wheel-loader/` | `OPP-3002-digital-press/` |
| Account | Redwood Ridge Landscaping LLC | Mesa Verde Print Shop Inc. |
| Signatory | Elena Marquez | Daniel Okafor |
| Opportunity | OPP-3001 Wheel loader purchase, USD 121,833.60 | OPP-3002 Digital press purchase, USD 99,041.25 |
| Supplier | Summit Peak Machinery (invoice SPM-70452, Net 30) | Cascade Graphics Equipment (invoice CGE-18834, Net 45) |
| Equipment | SDLG LG933L wheel loader | Heidelberg Speedmaster SX 52 offset press |
| Licence | `EXPIRED` (02/14/2026) and `VALID` (04/18/2031) | `VALID` only (07/23/2029) |

Each folder has, like the OPP-2041 set:

- `supplier-invoice.pdf`
- `finance-application-form.pdf`
- `signed-finance-agreement.pdf`
- `utility-bill.pdf` (classified as Identity, but it is not a licence, so it is the decoy)
- `delivery-photo.jpg` (a real CC0 photograph, credited in `CREDITS.txt`)
- the licence file or files: `drivers-license-EXPIRED.pdf` and `drivers-license-VALID.pdf` for deal 1, `drivers-license-VALID.pdf` for deal 2

The licences are marked SPECIMEN, like the originals.

## Loading the records

`data/` holds the Accounts and Opportunities. Creating them fires your flows, which create the Google Drive folders and the five subfolders. Run once:

```
sf data import tree --plan demo-data/data/import-plan.json --target-org cloudFiles
```

Wait about 30 seconds, then open the deal and check the CloudFiles tab shows the five subfolders. Do not upload anything until the folders exist.

## Before you share anything: set the supplier email

`Supplier Contact Email` is left blank on purpose. Use an address you control, on the deal, or type it on the Share with Supplier screen.

## Running the demo (deal 1)

1. Upload these **into the deal folder itself**, not a subfolder: invoice, application form, signed agreement, delivery photo. Wait for the invoice fields to fill.
2. Upload `drivers-license-EXPIRED.pdf`. Wait about 60 seconds. Expect: holder Elena Marquez, number 22-117-5048, expiry 02/14/2026, red banner, `Licence Expired` ticked.
3. Click **Generate Finance Agreement**: blocked. Try the stage **Closed Won**: refused.
4. Upload `utility-bill.pdf`: it lands in Identity and the licence fields do not change.
5. Upload `drivers-license-VALID.pdf`. Expect the expiry to become 04/18/2031 and the green banner.
6. **Generate Finance Agreement**, then set **Closed Won**: the welcome letter appears in the Agreement folder.
7. **Share with Supplier**.

Deal 2 is the happy path: upload everything including `drivers-license-VALID.pdf`, and nothing is blocked.

## Resetting a deal

Delete the deal's files from Drive, clear the licence fields, set the stage back to Prospecting, and delete any generated letter or agreement. It is usually quicker to import a new pair of records.
