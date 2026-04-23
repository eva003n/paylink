## Paylink 
### Introduction 
A complete end-to-end payment link generator. Business owners can create a unique link, share it with a client, and handle the entire M-Pesa checkout process gracefully. Upon successful payment, a branded PDF receipt is automatically generated and sent to the client.

### Problem
Freelancers or small service providers who need a professional way to invoice clients and collect mobile money payments instantly without writing complex integration code.

### Features
- Link generation and management
- Payment processing(Mobile money)
- Receipt generation(Sent to email)

### Challenges
- Handling payment processing reliably 
- Creting a simple monorepo to share code bet frontend and backend, single source of truth for validation 

### Technologies 
- React + Tailwind CSS(**UI**))
- Node js + Typescript + Express(**Server logic**)
- Redis + Bull MQ(**Asynchronous payment processing**)
- Pdfkit(**Pdf generation**)
- Node mailer + Brevo(**Email sending**))
- Pm2 (**Process management**)

### Launch
#### Step 1: Clone the repository
Run inside terminal
```bash
git clone https://github.com/eva003n/paylink.git
```

####  Docker
Must have docker pre-installed
 
### Usage

### Contribution 
