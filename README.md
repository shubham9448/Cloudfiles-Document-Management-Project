# Cloudfiles Document Management Project (Copperline Finance)

A Salesforce DX project that holds the metadata for **Copperline Finance**, an equipment-finance use case built on the **CloudFiles** managed package (namespace `cldfs`). It automates the document lifecycle of a finance deal (an Opportunity): creating Drive folders, filing and reading uploaded documents, generating finance paperwork, and sharing documents with suppliers through a dataroom.

The metadata was retrieved from the org with the manifest in [`manifest/package.xml`](manifest/package.xml).

## What the use case does

| Step | Flow | Trigger | What it does |
|---|---|---|---|
| 1 | Copperline: Customer folder | Account created | Creates a customer folder and attaches it to the Account. |
| 2 | Copperline: Deal Folder | Opportunity created | Creates the deal folder and its sub-folders (Application, Identity, Agreement, Supplier Invoice, Others), then saves the folder Ids on the Opportunity. |
| 3 | Copperline: Send to Document AI | CloudFiles event created | When a file is dropped in a deal folder, creates a `Related_Document__c` record and sends the file to be read. |
| 4 | Copperline: File and read | `Related_Document__c` created | Classifies the document (driving licence, identity document, supplier invoice), reads the licence or invoice, records the document type and moves the file to the right folder. |
| 5 | Copperline: Welcome letter | Opportunity updated | Generates the welcome letter document. |
| 6 | Copperline: Generate the finance agreement | Quick action on Opportunity | Checks the deal is ready (blocks if the licence has expired), then generates the finance agreement. |
| 7 | Copperline: Share with supplier | Quick action on Opportunity | Lets the user pick documents (application, agreement, invoice), creates a dataroom and link, adds the documents and emails the supplier. |
| 8 | Copperline: Add dataroom recipient | Quick action on Opportunity | Adds more recipients to an existing dataroom, updates link access and emails them. |

## Key metadata

- **App:** `Copperline_Finance` (Account, Opportunity, Related Documents tabs, plus a utility bar).
- **Custom objects:**
  - `Related_Document__c`: a document linked to an Opportunity (document type, file name, drive Id, resource Id, library).
  - `Dataroom_Recipient__c`: an email recipient of a deal dataroom, linked to an Opportunity.
- **Opportunity fields:** deal folder Ids, agreement details, supplier and dataroom details, invoice details, equipment details (make, model, serial number, year), and licence details (`Licence_Number__c`, `Licence_Holder_Name__c`, `Licence_Expiry_Date__c`, and the formula checkbox `Licence_Expired__c`).
- **Validation rule:** `Cannot_Close_With_Expired_Licence` stops an Opportunity moving to *Closed Won* while the licence has expired.
- **Quick actions on Opportunity:** Generate Finance Agreement, Share with Supplier, Add Dataroom Recipient.
- **LWC:** `licenceStatusRefresher` polls every 5 seconds (only while the tab is visible) so the licence status on the record page updates as soon as a document is read. It is placed on `Opportunity_Record_Page`.
- **Permission set:** `Copperline_Licence_Fields`.
- **Compact layout:** `Copperline_Deal` on Opportunity.

There is no custom Apex in this project; the automation is built with Flow and the `cldfs` package actions.

## Prerequisites

- **Salesforce CLI** (`sf`). See [Install Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm).
- **VS Code with the Salesforce Extension Pack** (optional).
- **The CloudFiles managed package (`cldfs`) installed in the target org.** The flows and the CloudFiles event tab depend on it, so deployment fails without it.
- **Node.js** if you want to run the lint and LWC test scripts in `package.json`.

## Project structure

- `force-app/main/default/`: metadata source (flows, objects, LWC, flexipages, applications, quick actions, permission sets and more).
- `manifest/package.xml`: the manifest used to retrieve metadata from the org.
- `OPP-2041-excavator-purchase/`: fictional sample documents (application form, licence, utility bill, supplier invoice, signed agreement, delivery photo) for trying the flows. See `CREDITS.txt` in that folder.
- `config/`: scratch org definition.
- `scripts/`: sample Apex and SOQL scripts.
- `sfdx-project.json`: project configuration (API version 67.0).

> **Note:** the retrieve also pulled in standard org metadata (profiles, sharing rules, standard apps, layouts, flexipages, quick actions). Only the items prefixed `Copperline`, plus the two custom objects, the Opportunity customisations and the `licenceStatusRefresher` component, belong to this use case.

## Getting started

```bash
# 1. Authorise the org
sf org login web --alias cloudfiles

# 2. Retrieve the metadata listed in the manifest
sf project retrieve start --manifest manifest/package.xml --target-org cloudfiles

# 3. Deploy to another org (the cldfs package must already be installed there)
sf project deploy start --source-dir force-app --target-org <target-alias>
```

To deploy only this use case, deploy the specific components instead of the whole folder, for example:

```bash
sf project deploy start --target-org <target-alias> \
  --metadata "Flow:Copperline_*" \
  --metadata CustomObject:Related_Document__c \
  --metadata CustomObject:Dataroom_Recipient__c \
  --metadata CustomApplication:Copperline_Finance \
  --metadata LightningComponentBundle:licenceStatusRefresher
```

## Common commands

- `sf org open --target-org <alias>`: open the org in a browser.
- `sf project deploy start`: deploy metadata.
- `sf project retrieve start`: retrieve metadata.
- `npm run lint`: lint the LWC JavaScript.
- `npm run test:unit`: run LWC unit tests (if present).

## Resources

- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/)
- [Salesforce VS Code Extensions](https://developer.salesforce.com/tools/vscode/)
