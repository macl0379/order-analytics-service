# Demo Video Script

**Status:** Group review draft, October 18, 2026.

**Target length:** About 7 minutes 20 seconds, including screen changes and live actions. Suggested speakers can be swapped.

This is a script for the completed demonstration. Only narrate successful processing after seeing matching results. Replace bracketed text with verified details. Stage directions are not spoken. The script does not establish that the demonstrations have already succeeded.

| Time | Suggested speaker | Section |
| --- | --- | --- |
| 0:00–2:20 | Collin MacLeod | Overview, technology, consumer pattern |
| 2:20–5:00 | Azubair Dawd | Local and Azure demonstrations |
| 5:00–7:20 | David Yin | Architecture, design limits, conclusion |

The structure covers the [assignment's presentation topics](https://github.com/ramymohamed10/26F_CST8915_Midterm_Project#video-presentation). Use the [README architecture diagram](README.md#architecture), reconciled with the final deployment, during section 3.

## Before Recording

Prepare the storefront, API tabs, RabbitMQ Management, Azure resource group, and diagram. Warm up the applications beforehand. Use separate local/cloud broker environments, or stop the other consumer when switching environments.

The example below assumes an empty analytics dataset with no old queued orders. Use a dedicated test environment; do not purge a shared queue.

Submit these three orders in each environment:

| Product | Quantity | Line total |
| --- | ---: | ---: |
| Dog Food at 19.99 | 2 | 39.98 |
| Cat Food at 34.99 | 1 | 34.99 |
| Bird Seeds at 10.99 | 3 | 32.97 |

Expected: **3 orders, 107.94 revenue, 35.98 average**. Confirm catalog prices before recording.

If an environment already contains orders, record a stable baseline and describe increases instead. The expected increases are three orders and 107.94 revenue; the overall average depends on the earlier orders. Reconcile all narrative with observed results.

## 1. Collin — Overview and Messaging Pattern

**Time:** 0:00–2:20

*[Show the project title, group names, and repository.]*

“Hello, we're Collin MacLeod, Azubair Dawd, and David Yin. Our project extends the Algonquin Pet Store with an Order Analytics Service.

The existing application lets customers browse products and place orders. Order Service publishes those orders to RabbitMQ. Our new service receives the messages and exposes useful results, including consumed orders, total revenue, average order value, revenue by product, and the products with the highest quantities sold.”

*[Show `index.js`, `receiver.js`, and `orders.js` briefly.]*

“We chose Node.js with Express for the HTTP API and amqplib for RabbitMQ communication. This keeps the implementation small and uses JavaScript, which is already used by Order Service.

The files have separate responsibilities. `index.js` starts the application and defines the routes. `receiver.js` handles RabbitMQ deliveries. `orders.js` provides the shared in-memory array used by both.

Our messaging pattern is a continuous consumer attached to the durable `order_queue`. Order Service publishes through RabbitMQ's default exchange, and RabbitMQ pushes available messages to our registered callback.

We chose this because analytics is currently the only service that needs to process this queue. We can preserve the existing publisher instead of introducing additional exchanges and queues.

With multiple workers on the same queue, deliveries would be shared between them. A fanout publish-subscribe design would be useful if separate services, such as analytics and notifications, each needed their own copy of every order.

Our consumer acknowledges a message after recording it. HTTP requests then read the stored data; they do not consume messages themselves.

I'll now hand over to Azubair to demonstrate the complete flow locally and on Azure.”

## 2. Azubair — Local and Azure Demonstrations

**Time:** 2:20–5:00

*[Show local service terminals and the local storefront.]*

“First, this is our local environment. Product Service, Order Service, the storefront, RabbitMQ, and analytics are running.

The analytics startup log shows that the consumer registered successfully.”

*[Point to the consumer-ready message. Show `/health`, then the initial summary.]*

“The summary currently contains zero orders. We'll submit three orders with different quantities so that order count and quantity sold are clearly different.”

*[Through the storefront, submit Dog Food ×2, Cat Food ×1, and Bird Seeds ×3. Allow roughly 20–25 seconds.]*

“These orders total 107 dollars and 94 cents. The expected average across three orders is 35 dollars and 98 cents.”

*[Show the receiver logs and RabbitMQ queue activity.]*

“Here are the received messages. RabbitMQ shows the registered consumer and acknowledgement activity.”

*[Only say the next paragraph after confirming the displayed values. Show `/orders`, `/analytics/summary`, `/analytics/products`, and `/analytics/top-products` in prepared tabs.]*

“The orders endpoint contains three entries. The summary matches our expected total and average.

The product endpoint groups the order counts and revenue by product name. Top-products ranks by quantity: Bird Seeds has three, Dog Food has two, and Cat Food has one. This is different from ranking by revenue.”

*[Switch to Azure Portal → shared resource group, then deployed storefront.]*

“Now we'll repeat the workflow on Azure. These are our deployed backend applications and the VM resources used by the application.”

*[Show the deployed analytics baseline, then submit the same three orders through the deployed storefront. Allow another 20–25 seconds.]*

“We are using the deployed storefront and public HTTPS APIs for this run.”

*[Show deployed `/orders`, summary, product grouping, and top-products.]*

“The deployed analytics results match the three orders we just submitted. This demonstrates the flow from the browser, through Order Service and RabbitMQ, into the analytics API.

David will now walk through how those components communicate.”

*If the Azure dataset was not empty, describe the measured increases instead: three additional orders and 107.94 additional revenue. Do not claim the overall average is 35.98. If results do not match, resolve the issue and repeat the demonstration before narrating success.*

## 3. David — Architecture and Conclusion

**Time:** 5:00–7:20

*[Show the final architecture diagram. Follow the arrows with the cursor.]*

“Starting on the left, the browser downloads the Vue storefront from our frontend host.

The browser then calls Product Service directly over HTTPS to retrieve the catalog. When a customer places an order, it sends an HTTP POST request to Order Service.

Order Service publishes the order to RabbitMQ over AMQP. RabbitMQ holds it in the durable `order_queue` until a consumer can process it.

Inside the Analytics Service, the receiver records the order in the shared in-memory store and acknowledges the delivery. The Express routes read that same store to return orders and calculated results.

These responsibilities run in one Node.js process. Running the receiver and API as separate processes would give them separate in-memory arrays, so we keep them together.”

*[Point to the Azure hosting boundaries.]*

“The backend services are hosted on Azure App Service. RabbitMQ runs on an Ubuntu VM. Our storefront uses the instructor-approved VM alternative because Static Web Apps is unavailable in our subscription.”

*[Describe the actual final arrangement: shared frontend/RabbitMQ VM, or separate VMs.]*

“Our configuration also follows the first four Twelve-Factor principles. Analytics has its own repository, dependencies are declared in the package manifest and lockfile, configuration comes from environment variables, and RabbitMQ is an attached backing service selected through its connection string.”

*[Point to the shared store and acknowledgement arrow.]*

“One limitation is that the analytics data is held in memory. Restarting the service resets it, and acknowledged messages cannot be replayed from the queue to restore that history.

Acknowledgements also do not make processing exactly once. A connection failure around acknowledgement can cause redelivery.

For this assignment, the single-process design keeps the system understandable and meets our current scope. Persistence and reliable duplicate detection would be possible future improvements.

Our README records the service repositories, deployment evidence, contributions, and AI assistance. [Briefly describe the actual student review and verification completed.]

That completes our demonstration of order publication, consumption, and analytics locally and on Azure. Thank you for watching.”

## Rehearsal and Review

Time one complete run with the actual clicks. Trim repeated navigation before trimming the evidence showing orders reaching analytics. Timing is an estimate until rehearsed; the assignment allows 5–10 minutes, and this script targets the group's requested 6–8 minutes.

The group should confirm the speaker allocation, final file responsibilities, hosting arrangement, numeric results, and actual AI review before recording. Upload the completed recording as an unlisted YouTube video and replace the README's video placeholder with its link.

**AI assistance:** This script was drafted with OpenAI Codex on October 18, 2026, at David Yin's request. Student review and rehearsal remain to be completed. Include this assistance in the final [README disclosure](README.md#ai-assistance-and-student-review).
