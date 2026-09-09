# Remix of Remix of Fictional Banking Hub

FICTIONAL BANK RP PLATFORM

Full System Framework / Lovable Build Specification

Build a highly detailed fictional banking RP platform that simulates both the customer-facing banking experience and the internal bank employee/representative system.

IMPORTANT:

This is a fictional roleplay/simulation platform.

All customer information, identification numbers, account numbers, card numbers, addresses, transactions, employees, and other records must be fictional.

Do not use real banking institutions, real customer data, or real financial accounts.

The UI should feel like a serious professional financial institution's internal software, while clearly functioning as a simulation.

1. CORE ARCHITECTURE

Create the platform as a full-stack web application with:

Customer Portal

Employee / Representative Portal

Manager Portal

Compliance / Fraud Portal

System Administration Portal

Authentication System

Role and permission system

Central customer database

Banking product database

Transaction engine

Fixed deposit engine

Card management engine

Loan management engine

Identity/KYC simulation system

Case/ticket system

Audit logging system

Notification system

Suspicious activity monitoring system

Search system

Global activity timeline

All portals must use the same underlying fictional data.

A change made by an employee must immediately be reflected in the relevant customer account.

Example:

Customer reports a card as lost
→ employee opens customer profile
→ employee blocks card
→ card status becomes BLOCKED
→ customer portal displays card as blocked
→ case is created
→ audit log records the employee action
→ notification is generated.

2. MAIN USER TYPES

Implement a role-based access system.

Customer

Can:

Log in

View profile

View accounts

View balances

View transactions

View cards

View fixed deposits

View loans

Request card blocking

Request card replacement

Request account services

Contact bank

Complete identity verification

View notifications

View statements

Update allowed personal information

Review security activity

Teller

Can:

Search customers

View permitted customer information

View accounts

View balances

View transactions

Create service cases

Add customer notes

Perform permitted account services

Customer Service Representative

Can:

View complete customer profile

View identity information

View account relationships

Manage cards

Initiate service requests

Perform identity verification

Create and resolve cases

Add internal notes

View customer communication history

Branch Manager

Can:

Access customer service tools

Approve selected account actions

Freeze/unfreeze accounts

Approve account opening/closure

Review employee actions

Review branch activity

Review suspicious activity alerts

Fraud / Security Officer

Can:

Review suspicious transactions

Review login activity

Review unusual account behavior

Lock accounts

Escalate investigations

Review identity verification events

Review related accounts

Create investigation cases

Compliance Officer

Can:

Review customer identity records

Review KYC information

Review risk classifications

Review suspicious activity cases

Review account history

Review audit logs

System Administrator

Can:

Manage users

Manage roles

Manage permissions

Manage branches

Manage products

Manage simulation settings

View system logs

Manage fictional data

Configure alerts

View full system activity

3. DATABASE STRUCTURE

Create a relational database structure.

customers

Fields:

id

customer_id

first_name

middle_name

last_name

full_name

preferred_name

gender

date_of_birth

age

occupation

employer

marital_status

nationality

residential_address

mailing_address

city

postal_code

phone_number

email

mother's_name

father's_name

emergency_contact

customer_since

branch_id

customer_status

risk_level

verification_status

created_at

updated_at

All information is fictional.

4. CUSTOMER IDENTITY / KYC

Create a dedicated identity record.

identity_records

Fields:

identity_id

customer_id

identification_type

fictional_document_number

issuing_country

issue_date

expiry_date

verification_status

verification_date

verification_method

verified_by

verification_notes

Possible statuses:

NOT_VERIFIED

PENDING

VERIFIED

FAILED

EXPIRED

REVIEW_REQUIRED

Create a simulated identity verification workflow.

The employee can select:

"Begin Verification"

The system displays configurable questions based on the customer's fictional profile.

Examples:

Confirm customer's full name

Confirm date of birth

Confirm address

Confirm mother's name

Confirm occupation

Confirm account-opening information

Confirm selected account details

Do NOT treat this as real-world authentication.

5. ACCOUNTS

Create an accounts table.

accounts

Fields:

id

account_id

customer_id

account_number

account_type

currency

balance

available_balance

opened_date

branch_id

status

account_nickname

interest_rate

overdraft_limit

last_activity

closed_date

closure_reason

Account types:

Savings

Current

Student

Premium

Business

Salary

Fixed Deposit linked account

Statuses:

ACTIVE

DORMANT

FROZEN

SUSPENDED

CLOSED

UNDER_REVIEW

6. ACCOUNT DETAIL PAGE

The employee account view should show:

Header:

CUSTOMER NAME
CUSTOMER ID
ACCOUNT NUMBER
STATUS
RISK LEVEL

Sections:

ACCOUNT SUMMARY

Current balance

Available balance

Currency

Opened date

Account type

Branch

Relationship status

TRANSACTION ACTIVITY

Date

Time

Reference

Description

Type

Amount

Balance after transaction

Status

Channel

ACCOUNT HISTORY

Opening

Changes

Restrictions

Previous status

Staff actions

RELATED PRODUCTS

Cards

Fixed deposits

Loans

7. TRANSACTION SYSTEM

Create a fictional transaction engine.

transactions

Fields:

transaction_id

account_id

customer_id

transaction_reference

transaction_type

amount

currency

description

merchant_name

channel

location

transaction_date

status

resulting_balance

risk_flag

created_at

Transaction types:

Deposit

Withdrawal

Transfer

Card purchase

ATM withdrawal

Fee

Interest

Refund

Loan payment

FD placement

FD maturity

Adjustment

Channels:

Branch

ATM

Online

Mobile

Card

System

Employee

Statuses:

COMPLETED

PENDING

DECLINED

REVERSED

UNDER_REVIEW

8. CARD MANAGEMENT

Create a full fictional card-management system.

cards

Fields:

card_id

customer_id

linked_account_id

card_type

fictional_card_number

masked_card_number

issue_date

expiry_date

card_status

card_holder_name

replacement_count

block_reason

blocked_at

blocked_by

pin_status

card_limit

daily_cash_limit

Card types:

Debit

ATM

Premium Debit

Business Debit

Card statuses:

ACTIVE

BLOCKED

EXPIRED

REPLACEMENT_PENDING

CANCELLED

SUSPENDED

Employee actions:

View card

Block card

Unblock card

Replace card

Cancel card

Mark lost

Mark stolen

Change limits

Initiate PIN reset

Review card activity

Display card numbers as fictional values and allow a detailed employee view because this is a simulation.

9. FIXED DEPOSITS

Create a complete FD module.

fixed_deposits

Fields:

fd_id

customer_id

linked_account_id

principal_amount

interest_rate

tenure

start_date

maturity_date

expected_interest

maturity_amount

payout_instruction

status

early_withdrawal_allowed

created_by

created_at

Statuses:

ACTIVE

MATURED

CLOSED

BROKEN

RENEWED

Employee actions:

Open FD

View FD

Renew FD

Close FD

Review maturity

Change payout instruction

View interest calculation

View FD history

10. LOANS

Create a loan management module.

loans

Fields:

loan_id

customer_id

account_id

loan_type

original_amount

outstanding_amount

interest_rate

monthly_payment

start_date

maturity_date

payment_status

loan_status

branch_id

Loan types:

Personal

Vehicle

Education

Business

Home

Loan statuses:

ACTIVE

PAID

OVERDUE

DEFAULT

UNDER_REVIEW

CLOSED

11. CUSTOMER MASTER PROFILE

This is the most important employee screen.

When a representative searches for a customer, display a comprehensive customer record.

HEADER:

[PROFILE PHOTO PLACEHOLDER]

FULL NAME
Customer ID
Customer Status
Risk Level
Verification Status

MAIN INFORMATION:

Personal Information

Full name

Gender

Date of birth

Age

Occupation

Employer

Marital status

Nationality

Contact Information

Phone

Email

Residential address

Mailing address

Family / Reference

Mother's name

Father's name

Emergency contact

Identity

Identification type

Fictional ID number

Verification status

Verification date

BANKING RELATIONSHIP:

Total accounts

Total balances

Active cards

Fixed deposits

Active loans

Customer since

Home branch

SECURITY:

Risk level

Last login

Failed login attempts

Suspicious activity count

Open investigations

Account restrictions

12. CUSTOMER PROFILE NAVIGATION

Use tabs:

Overview
Personal
Identity
Accounts
Cards
Fixed Deposits
Loans
Transactions
Cases
Notes
Security
Documents
Activity
Audit

The employee should be able to move between all related information without leaving the customer profile.

13. SEARCH SYSTEM

Create a powerful global customer search.

Search by:

Customer ID

Full name

First name

Last name

Account number

Card number

Phone

Email

Fictional ID number

Address

Transaction reference

Search results should show:

Customer
Customer ID
Primary account
Status
Risk
Branch
Last activity

Add filters:

Active

Suspended

Frozen

Under review

High risk

Recently active

New customers

14. EMPLOYEE DASHBOARD

Create an internal dashboard.

Top navigation:

Dashboard
Customers
Accounts
Cards
Fixed Deposits
Loans
Transactions
Cases
Fraud & Security
Reports
Audit
Administration

Dashboard widgets:

TOTAL CUSTOMERS
ACTIVE ACCOUNTS
ACTIVE CARDS
TOTAL FICTIONAL DEPOSITS
OPEN CASES
SUSPICIOUS ACTIVITY
PENDING VERIFICATIONS
ACCOUNTS UNDER REVIEW

Activity feed:

Recent customer activity
Recent employee actions
Recent alerts
Recent cases
Recent account changes

15. CASE / SERVICE REQUEST SYSTEM

Create:

cases

Fields:

case_id

customer_id

assigned_employee

category

priority

status

subject

description

created_at

updated_at

resolved_at

Categories:

Card issue

Account issue

Identity verification

Transfer issue

FD request

Loan request

Suspicious activity

Complaint

General inquiry

Statuses:

OPEN

ASSIGNED

IN_PROGRESS

WAITING_CUSTOMER

ESCALATED

RESOLVED

CLOSED

16. NOTES SYSTEM

Employees can add internal notes to customers.

Every note should contain:

Author

Employee ID

Timestamp

Note type

Content

Visibility

Related case

Types:

Customer service note

Identity note

Fraud note

Account note

Manager note

17. AUDIT LOG SYSTEM

EVERY IMPORTANT SYSTEM ACTION MUST CREATE AN AUDIT RECORD.

audit_logs

Fields:

log_id

employee_id

employee_name

action

entity_type

entity_id

customer_id

timestamp

IP placeholder

session placeholder

description

previous_value

new_value

severity

Examples:

CARD_BLOCKED
ACCOUNT_FROZEN
CUSTOMER_PROFILE_VIEWED
IDENTITY_VERIFICATION_STARTED
IDENTITY_VERIFICATION_PASSED
FD_CREATED
ACCOUNT_CLOSED
CUSTOMER_NOTE_ADDED
RISK_LEVEL_CHANGED
SUSPICIOUS_ACTIVITY_FLAGGED

Create a dedicated audit log interface with filtering and search.

18. SUSPICIOUS ACTIVITY MODULE

Create a fictional monitoring system.

Automatically generate alerts based on configurable simulation rules.

Examples:

Unusually large transaction

Rapid consecutive transactions

Unusual transaction location

Multiple failed login attempts

Repeated card declines

Sudden account activity

Unusual withdrawal activity

suspicious_alerts

Fields:

alert_id

customer_id

account_id

transaction_id

alert_type

severity

status

detected_at

assigned_to

description

resolution

Statuses:

NEW

REVIEWING

ESCALATED

CLEARED

CONFIRMED

CLOSED

Severity:

LOW

MEDIUM

HIGH

CRITICAL

19. FRAUD / SECURITY CASE VIEW

Create a professional investigation interface.

Display:

Customer profile
Risk profile
Flagged transaction
Transaction timeline
Account timeline
Login activity
Card activity
Previous alerts
Related cases
Employee notes
Investigation status

Actions:

Assign investigator

Lock fictional account

Block fictional card

Mark alert as reviewed

Escalate

Clear alert

Create investigation

Add internal note

20. EMPLOYEE CUSTOMER TIMELINE

Every major event should appear in one chronological timeline.

Example:

09 Sep 2026 08:32
Customer account opened

09 Sep 2026 08:45
Debit card issued

12 Sep 2026 14:22
Online banking activated

16 Sep 2026 09:13
Customer updated address

18 Sep 2026 19:02
ATM withdrawal

18 Sep 2026 19:05
Fraud monitoring alert created

18 Sep 2026 19:12
Representative reviewed alert

19 Sep 2026 10:34
Case closed

Use icons and event categories.

21. CUSTOMER PORTAL

Create a separate clean customer-facing interface.

Dashboard:

Welcome back, [Name]

Total Available Balance
Accounts
Cards
Fixed Deposits
Loans

Quick actions:

Transfer
View Transactions
Manage Cards
Open FD
Statements
Contact Bank

Sections:

Accounts
Cards
Fixed Deposits
Loans
Transactions
Profile
Security
Messages

22. CUSTOMER CARD PAGE

Display:

Card name
Masked number
Expiry
Status
Linked account

Actions:

Block Card
Unblock Card when permitted
Request Replacement
Report Lost
Request PIN Reset

Show recent card activity.

23. CUSTOMER SECURITY

Create:

Security overview
Recent logins
Active sessions
Password status
Verification status
Security questions
Alerts

Display fictional activity such as:

Chrome — Windows
Colombo
Today 17:42

Mobile App
Android
Yesterday 10:22

24. CUSTOMER NOTIFICATION CENTER

Notifications categories:

Security

Account

Card

Transaction

FD

Loan

Service Request

Examples:

"Your debit card has been blocked."

"Your fixed deposit is approaching maturity."

"Identity verification is required for your pending request."

25. ADMINISTRATION SYSTEM

System administrators can manage:

Users
Employees
Roles
Permissions
Branches
Products
Customer records
Simulation data
Alert rules
System configuration

Administration dashboard should NOT look like the customer banking website.

It should resemble enterprise internal software.

26. BRANCH MANAGEMENT

Create fictional branches.

Fields:

branch_id

branch_code

branch_name

address

telephone

manager

status

Employee profiles should belong to a branch.

27. EMPLOYEE PROFILE

Fields:

employee_id

employee_code

name

role

branch

department

status

last_login

permissions

Display:

Employee Information
Access Level
Recent Actions
Cases
Audit History

28. PERMISSION SYSTEM

Use granular permissions.

Examples:

customer.view
customer.edit
customer.search
identity.verify
account.view
account.freeze
account.unfreeze
account.open
account.close
card.view
card.block
card.unblock
card.replace
fd.view
fd.create
fd.close
loan.view
case.create
case.assign
fraud.view
fraud.manage
audit.view
admin.manage

Every employee role should inherit specific permissions.

29. UI / VISUAL DESIGN

The system should look like a legitimate enterprise financial operations application.

Do NOT make it flashy like a gaming website.

Style:

Clean

Dense

Professional

Information-heavy

Structured

Enterprise

Modern

Slightly conservative

Use:

Left sidebar navigation

Top utility bar

Breadcrumbs

Data tables

Status badges

Search bars

Filter panels

Modal dialogs

Tabs

Cards

Timelines

Activity feeds

Confirmation dialogs

Toast notifications

Desktop-first.

Responsive for tablets and mobile where practical.

30. STATUS COLORS

Use a consistent status system.

Green:
Active / Verified / Completed / Cleared

Amber:
Pending / Review / Warning

Red:
Blocked / Suspended / Failed / Critical

Blue:
Informational / Processing

Gray:
Closed / Archived / Inactive

31. DATA TABLE DESIGN

Tables should support:

Search

Filtering

Sorting

Pagination

Column selection

Row click

Export placeholder

Status filtering

Example:

CUSTOMER ID | NAME | ACCOUNT | STATUS | RISK | LAST ACTIVITY

32. MODAL WORKFLOWS

Important actions should open confirmation modals.

Example:

BLOCK CARD

Customer:
[Name]

Card:
[Masked Card Number]

Reason:
[Lost / Stolen / Security / Customer Request]

Notes:
[Textarea]

Confirmation:

[Cancel] [Block Card]

After confirmation:

Update card status

Create audit log

Create notification

Update case when applicable

33. MOCK DATA

Generate substantial fictional seed data.

Create:

100+ fictional customers

Multiple branches

Multiple employees

Multiple accounts per customer

Cards

Fixed deposits

Loans

Transactions

Cases

Audit logs

Security events

Suspicious activity alerts

Make the data internally consistent.

For example:

A customer with an account should be able to have cards linked to that account.

A customer with an FD should have corresponding FD transactions.

A blocked card should display as blocked everywhere.

34. GLOBAL CONSISTENCY RULE

This is extremely important.

Never create isolated fake UI data.

All screens should reference shared underlying records.

Changing:

Card status
→ updates customer profile
→ updates card page
→ updates dashboard counts
→ creates audit record
→ creates notification.

Changing:

Account status
→ updates customer profile
→ updates account screen
→ creates audit record
→ updates customer access.

Creating an FD
→ creates FD record
→ creates transaction
→ updates customer product summary
→ updates dashboard metrics.

35. RP / SIMULATION FEATURES

Create an optional simulation layer.

Allow administrators to:

Create fictional customers

Generate transactions

Trigger alerts

Change customer status

Simulate customer requests

Create branch activity

Generate system events

Advance simulated dates

Generate random but consistent activity

Add a simulation clock if practical.

36. SECURITY / PRIVACY FOR THE SIMULATION

Because this is an RP platform:

Clearly use fictional data.

Never connect to real bank accounts.

Never process real payments.

Never store real financial credentials.

Never require real identity documents.

Do not use real people's private information.

The application is a simulation only.

37. IMPLEMENTATION ORDER

Build the system in this order:

PHASE 1
Authentication
Database
Roles
Permissions
Base layout

PHASE 2
Customer records
Customer search
Customer master profile

PHASE 3
Accounts
Transactions
Cards

PHASE 4
Fixed deposits
Loans

PHASE 5
Cases
Notes
Notifications

PHASE 6
Identity verification
Security events

PHASE 7
Suspicious activity
Fraud investigations

PHASE 8
Audit system

PHASE 9
Customer portal

PHASE 10
Administration
Branch management
Simulation controls

38. CORE NAVIGATION STRUCTURE

EMPLOYEE:

Dashboard
Customers
└ All Customers
└ Search
└ Recently Viewed

Accounts
Cards
Fixed Deposits
Loans
Transactions

Cases
Fraud & Security

Reports
Audit Logs

Administration
└ Employees
└ Roles
└ Branches
└ Products
└ Simulation

CUSTOMER:

Dashboard
Accounts
Cards
Fixed Deposits
Loans
Transactions
Statements
Messages
Notifications
Security
Profile

39. FINAL PRODUCT GOAL

The finished application should feel like a complete fictional bank information system rather than a basic banking dashboard.

A representative should be able to:

Search for a customer
→ open their master profile
→ inspect their identity
→ inspect personal information
→ inspect accounts
→ inspect cards
→ inspect fixed deposits
→ inspect loans
→ inspect transactions
→ inspect security activity
→ review suspicious activity
→ create cases
→ add notes
→ perform permitted actions
→ see the complete audit trail.

The customer should have their own polished banking portal connected to the exact same fictional records.

The entire system should behave as one interconnected banking simulation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dabd226a-526a-4102-a914-ed53048d818d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
