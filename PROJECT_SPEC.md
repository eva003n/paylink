## M-Pesa Paylink & Receipt Mini-App
### Problem statement
Freelancers or small service providers who need a professional way to invoice clients and collect mobile money payments instantly without writing complex integration code.

<!-- Invoicing - sending a formal document to request payment for goods or services provided
Communication  via formal channels eg email, whatsapp e.t.c
Mobile money - most popular in kenya is Mpesa -->

### Idea
A web platform that enables business owners eg freelancers, small service providers to professionally invoice clients a collect mobile money payment via secure and sharable link


### use cases
- Business owner creates a unique link and shares with client
- Client does the  entire mpesa checkout gracefully
- On successful payment a branded receipt is generated and sent to the client


### Functional requirements
1. Generate payment link(Branded/custom )
2. Communicate to clients via email, to send invoices and receipt 
3. Generate PDF documents for a receipts and invoices

 Clients that receive the url are anonymous

### Non functional requirements
1. Security - since we are dealing wiht payment we must ensure the generated links can be trusted by users through branding, for the payment security that is handled by Mpesa
2. Reliabiity - ensure that the the system performs functions stated above even in the occurences of failures
3. Avaliability - the system should have no down time so ensure quality of service

### Technologies and tools

- Node(Backend)
- React(Frontend)
- Mpesa API
- WEbhooks
- PDFkit(Invoices and receipt) https://pdfkit.org/
- Docker(Easier deployment)

### Architecture design
This system have adopt a client server architecture which will include a client(that users interact with) and a server(whose complexity(mpesa integration code) will be abstracted via an API service)


![Diagram representing the high level design of paylink]()

### Component design
#### Payment link
##### Merchant's side
- Merchant generates a sharable link, this link contains all the metadata required to process payment, one link per client
- Sends the link to client via any method eg email, whatsapp, sms but for know we use the official communication which is email for mvp app

- Payment links can be customized for specific needs one time link that expires after a period of time
- Mpesa sends back a confirmation response via webhooks
- Then paylink will generate a receipt and send it via email

##### How it works on the client's side
- When the link is tapped, client receives an mpesa ussd prompt where they enter their mpesa pin
- On success the mpesa confirmation sms message is received
### References
- [Article from stripe on invoicing](https://stripe.com/resources/more/when-to-invoice-a-customer#how-stripe-invoicing-can-help)

