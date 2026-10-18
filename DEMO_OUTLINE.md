# Demo Speaking Outline

- **Status:** Group review draft, October 18, 2026.
- **Target:** Around 6–8 minutes, with roughly balanced participation.
- Use this as a quick speaking aid alongside the [full script](DEMO.md).
- Choose products and quantities freely. Explain actual displayed results rather than memorizing example totals.

## Preparation

- Record using OBS Studio, the tool listed in the assignment.
- Open the storefront, service logs, RabbitMQ Management, analytics endpoints, Azure resource group, and [final diagram](README.md#architecture).
- Start or warm up the services and confirm the intended consumer is active.
- Keep local/cloud consumers from competing for the same queue during the demonstration.
- Note the existing analytics baseline; an empty dataset is not required.
- Keep credentials out of view and do not purge a shared queue.

## 1. Collin — Overview and Messaging Pattern

- Introduce the group and the Order Analytics Service.
- Explain the gap being filled: orders published to RabbitMQ are consumed and exposed as analytics.
- Cover language and libraries: Node.js, Express, amqplib.
- Identify responsibilities:
  - `index.js`: startup, HTTP routes, current calculations.
  - `receiver.js`: broker connection, deliveries, acknowledgements.
  - `orders.js`: shared in-memory storage.
- Explain the continuous consumer, durable `order_queue`, and default-exchange publisher.
- Justify the simple queue-based pattern for the current analytics subscriber.
- Distinguish shared-queue workers from fanout pub/sub with independent subscriber queues.
- Explain recording before acknowledgement, and REST requests reading stored results.
- Hand over to Azubair.

## 2. Azubair — Local and Azure Demonstrations

### Local

- Identify the local services and show their addresses.
- Show `/health` and the current orders/summary baseline.
- Submit several orders through the storefront using selections of your choice.
- Show received-message logs and observable broker activity.
- Refresh and explain:
  - `/orders`: new received entries.
  - `/analytics/summary`: count, revenue, average, and change from baseline.
  - `/analytics/products`: order count and revenue grouped by name.
  - `/analytics/top-products`: ranking by total units sold.
- Compare results with the actual selections; distinguish order count from quantity.

### Azure

- Show the shared resource group, backend App Services, and VM resources.
- Show deployed storefront/API addresses and the existing analytics baseline.
- Submit orders of your choice; they need not match the local selections.
- Show processing evidence and matching deployed API changes.
- Describe success only after checking the results.
- Hand over to David.

## 3. David — Architecture and Conclusion

- Follow the diagram:
  - Browser downloads the Vue storefront.
  - Browser retrieves products through HTTPS.
  - Order Service accepts HTTP POST requests and publishes over AMQP.
  - RabbitMQ buffers orders in `order_queue`.
  - Receiver records orders and acknowledges deliveries.
  - Express routes read the same in-memory state.
- Explain why the receiver and routes share one Node.js process.
- Describe actual App Service/VM hosting and the approved frontend VM alternative.
- Explain that the frontend and RabbitMQ share the Ubuntu VM; identify the frontend server actually deployed.
- Relate the design to codebase, dependencies, environment configuration, and attached backing services.
- Explain restart data loss and possible redelivery; do not claim exactly-once processing.
- Briefly mention persistence and duplicate detection as possible future improvements.
- Point to README evidence, contributions, and the group's actual AI review.
- Close by referring to the observed local/Azure demonstrations and thank the viewer.

## Rehearsal

- Time the real navigation and speaking; keep the total around 6–8 minutes.
- Adapt explanations to the data on screen.
- Preserve the evidence that orders reached analytics when trimming.
- Add the final unlisted video link to the README after recording.
- **AI assistance:** OpenAI Codex prepared this outline on October 18, 2026, at David Yin's request. Record the group's review and edits in the [README disclosure](README.md#ai-assistance-and-student-review).
