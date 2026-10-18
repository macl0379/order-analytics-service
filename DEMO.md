# Demo Video Script

**Status:** Group review draft, October 18, 2026.

**Target length:** Around 6–8 minutes, including screen changes and live actions. Timing and speaker allocation are flexible.

This is a script for the completed demonstration. Only narrate successful processing after seeing matching results. Replace bracketed text with verified details. Stage directions are not spoken. The script does not establish that the demonstrations have already succeeded.

| Approximate time | Suggested speaker | Section |
| --- | --- | --- |
| About 2 minutes | Collin MacLeod | Overview, technology, consumer pattern |
| About 2–3 minutes | Azubair Dawd | Local and Azure demonstrations |
| About 2 minutes | David Yin | Architecture, design limits, conclusion |

The structure covers the [assignment's presentation topics](https://github.com/ramymohamed10/26F_CST8915_Midterm_Project#video-presentation). Use the [README architecture diagram](README.md#architecture), reconciled with the final deployment, during section 3.

For shorter speaking prompts, use the accompanying [bullet-point outline](DEMO_OUTLINE.md).

## Before Recording

Record using OBS Studio, as listed in the assignment. Prepare the storefront, API tabs, RabbitMQ Management, Azure resource group, and diagram. Warm up the applications beforehand. Use separate local/cloud broker environments, or stop the other consumer when switching environments.

Choose products and quantities naturally during the demonstration. No particular product, order sequence, quantity, price, or final total is prescribed by this script. Use the actual catalog and explain the results visible on screen.

Note the existing analytics state before submitting orders. The dataset does not need to start empty; explain changes from the baseline if it already contains data. Allow processing to finish and compare the received orders and calculated results with what you actually submitted. Do not purge a shared queue to prepare the recording.

## 1. Collin — Overview and Messaging Pattern

**Approximate time:** About 2 minutes.

*[Show the project title, group names, and repository.]*

“Hello, we're Collin MacLeod, Azubair Dawd, and David Yin. Our project extends the Algonquin Pet Store with an Order Analytics Service.

The existing application lets customers browse products and place orders. Order Service publishes those orders to RabbitMQ. Our new service receives the messages and exposes useful results, including the 5 exposed endpoints: consumed orders, total revenue, average order value, revenue by product, and the products with the highest quantities sold.”

*[Show `index.js`, `receiver.js`, and `orders.js` briefly.]*

“We chose Node.js with Express for the HTTP API and amqplib for RabbitMQ communication. This keeps the implementation small and uses JavaScript, which is already used by Order Service since the Lab 3 change.

The files have separate responsibilities. `index.js` starts the application and defines the routes. `receiver.js` handles RabbitMQ deliveries. `orders.js` provides the shared in-memory array used by both.

The messaging is a continuous consumer attached to the durable `order_queue`. Order Service publishes through RabbitMQ's default exchange, and RabbitMQ pushes available messages to our registered callback.

We chose this because analytics is currently the only service that needs to process this queue. We can preserve the existing publisher instead of introducing additional exchanges and queues.

With multiple workers on the same queue, deliveries would be shared between them. A fanout publish-subscribe design would be useful if separate services, such as analytics and notifications, each needed their own copy of every order.

Our consumer acknowledges a message after recording it. HTTP requests then read the stored data; they do not consume messages themselves.

I'll now hand over to Azubair to demonstrate the complete flow locally and on Azure.”

## 2. Azubair — Local and Azure Demonstrations

**Approximate time:** About 2–3 minutes.

*[Show local service terminals and the local storefront, with local addresses visible.]*

“First, this is our local environment. Product Service, Order Service, the storefront, RabbitMQ, and analytics are running.

Let's look at the state before placing new orders. The health endpoint shows that the HTTP API is responding. To verify processing, we'll also check received messages and the actual order data.”

*[Show `/health`, the current orders, and the current summary. Do not assume an empty dataset.]*

“We'll now place several orders through the storefront. We can choose different products and quantities from the current catalog. As each order is submitted, we can see the selected product, quantity, and displayed total.”

*[Submit orders of your choice. Briefly describe the selections actually made.]*

“Next, we'll check what reached analytics.”

*[Show available receiver logs and RabbitMQ consumer, delivery, or acknowledgement activity. Allow processing to finish.]*

“The received-message logs and broker activity help us trace the delivery. We'll compare those with the API responses so we can confirm the submitted orders were recorded.”

*[Show `/orders`, `/analytics/summary`, `/analytics/products`, and `/analytics/top-products`.]*

“The orders endpoint shows the received orders and their quantities and totals. We can compare the newly added entries with what we just submitted.

The summary shows the current order count, revenue, and average order value. If the service already contained orders, these results include that earlier data as well.

The product endpoint groups orders by product name. Its order count measures how many orders contain that product, while top-products ranks the total units sold. Those are different measurements, so the ranking does not have to match the order count or revenue.”

*[Briefly explain the actual changes and confirm their arithmetic before describing the results as correct. Switch to Azure Portal and the deployed storefront.]*

“Now we'll repeat the workflow on Azure. Here are our backend applications and the VM resources used by the deployment.

We'll first note the current deployed results, then place orders through the deployed storefront. The cloud dataset does not need to match the local one.”

*[Show the deployed baseline. Submit orders of your choice through the deployed storefront; they do not need to repeat the local selections.]*

“These requests use the deployed storefront and public HTTPS APIs. We'll now check the received orders and refresh the analytics.”

*[Show deployed logs or broker activity where available, then deployed orders, summary, product grouping, and top-products.]*

“We can compare the new entries and analytics changes with the orders just submitted. Together, the storefront actions, message-processing evidence, and matching API data demonstrate the Azure workflow.

David will now explain how these components communicate.”

*Only describe the workflow as successful after seeing matching results. If results do not match, investigate and repeat the demonstration before recording a success claim.*

## 3. David — Architecture and Conclusion

**Approximate time:** About 2 minutes.

*[Show the final architecture diagram. Follow the arrows with the cursor.]*

“Starting on the left, the browser downloads the Vue storefront from our frontend host.

The browser then calls Product Service directly over HTTPS to retrieve the catalog. When a customer places an order, it sends an HTTP POST request to Order Service.

Order Service publishes the order to RabbitMQ over AMQP. RabbitMQ holds it in the durable `order_queue` until a consumer can process it.

Inside the Analytics Service, the receiver records the order in the shared in-memory store and acknowledges the delivery. The Express routes read that same store to return orders and calculated results.

These responsibilities run in one Node.js process. Running the receiver and API as separate processes would give them separate in-memory arrays, so we keep them together.”

*[Point to the Azure hosting boundaries.]*

“The backend services are hosted on Azure App Service. The storefront and RabbitMQ share an Ubuntu VM. Our storefront uses the instructor-approved VM alternative because Static Web Apps is unavailable in our Azure Student subscription.”

*[Point to the shared VM containing the storefront and RabbitMQ.]*

“Analytics has its own repository, dependencies are declared in the package manifest and lockfile, configuration comes from environment variables, and RabbitMQ is an attached backing service selected through its connection string. Therefore our configuration follows the first four Twelve-Factor principles.”

*[Point to the shared store and acknowledgement arrow.]*

“One limitation is that the analytics data is held in memory. Restarting the service resets it, and acknowledged messages cannot be replayed from the queue to restore that history.

Acknowledgements also do not make processing exactly once. A connection failure around acknowledgement can cause redelivery.

For this assignment, the single-process design keeps the system understandable and meets our current scope. Persistence and reliable duplicate detection would be possible future improvements if the scope and architecture demands them.

Our README records the service repositories, deployment evidence, contributions, and AI assistance. [Briefly describe the actual student review and verification completed.]

That completes our demonstration of order publication, consumption, and analytics locally and on Azure.”

## Rehearsal and Review

Time one complete run with the actual clicks. Trim repeated navigation before trimming the evidence showing orders reaching analytics. Timing is an estimate until rehearsed; the assignment allows 5–10 minutes, and this script targets the group's requested 6–8 minutes.

The group should confirm the speaker allocation, final file responsibilities, hosting arrangement, numeric results, and actual AI review before recording. Upload the completed recording as an unlisted YouTube video and replace the README's video placeholder with its link.

**AI assistance:** This script was drafted and revised with OpenAI Codex on October 18, 2026, at David Yin's request. Student review and rehearsal remain to be completed. Include this assistance in the final [README disclosure](README.md#ai-assistance-and-student-review).
