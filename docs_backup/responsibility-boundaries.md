# Responsibility Boundaries



## 1. Purpose



The Private Communication Protocol (PCP) is designed to provide reusable cryptographic security and privacy-preserving communication capabilities to applications.



To maintain that purpose, PCP must have clearly defined responsibility boundaries.



PCP must not become an application backend, account management platform, centralized messaging service, or infrastructure provider.



This document defines the responsibilities of:



- Applications integrating PCP

- The PCP client and SDK

- Cryptographic components

- Transport implementations

- Relay and mailbox operators

- Infrastructure operators

- The PCP project and its maintainers



The goal is to keep PCP modular, independently deployable, and reusable across different applications.



## 2. Core Principle



**Applications own their users and application logic. PCP provides communication security and privacy-preserving transport capabilities.**



An application should be able to integrate PCP without surrendering control over its accounts, database, user relationships, interface, or business logic.



PCP should not require applications to adopt a particular user-management system, database, hosting provider, or application framework.



## 3. Application Responsibilities



The application integrating PCP remains responsible for its own functionality and user experience.



### 3.1 Identity and Account Management



The application controls:



- User registration and account creation

- Login and authentication

- Username and profile management

- Account recovery

- Account suspension and deletion

- Application-level authorization



PCP may provide cryptographic device identities and key-management capabilities, but these are not replacements for application accounts.



An application account and a PCP cryptographic identity are separate concepts.



### 3.2 Contacts and Social Relationships



The application controls:



- Contact discovery

- Contact lists

- Friend requests and approvals

- Blocking and reporting

- Groups and group membership

- Social circles and access policies

- Relationship management



PCP does not maintain a global user directory or require applications to publish their users.



### 3.3 Presence and Application Events



The application controls:



- Online and offline status

- Last-seen information

- Typing indicators

- Read receipts

- Delivery receipts

- Application notifications

- User-defined status events



Applications may send these events through PCP as encrypted and authenticated application-defined payloads.



PCP can protect the contents and provide secure transport, but the application decides what events exist, who receives them, and how they are interpreted.



### 3.4 Data and Storage



The application controls its own database and storage policies.



It may store:



- User profiles

- Contacts and relationships

- Group information

- Application settings

- Message history

- User preferences

- Other application-specific records



PCP does not require a particular database or storage provider.



If an application stores decrypted message content, the application and its storage environment become part of the plaintext trust boundary.



PCP does not automatically protect plaintext after it has been delivered to the application.



### 3.5 User Interface and Business Logic



The application controls:



- User interface and design

- Message presentation

- Notifications and interaction flows

- Application-specific features

- Business rules

- Content policies

- Retention and deletion policies



PCP provides communication capabilities rather than prescribing how an application must behave.



## 4. PCP Client and SDK Responsibilities



The PCP client and SDK provide the integration layer between an application and the protocol.



Their responsibilities include:



- Cryptographic identity and device-key management

- Secure session establishment

- Session-state management

- Message encryption and decryption

- Message authentication and integrity verification

- Secure message-envelope construction and parsing

- Protocol validation

- Metadata minimization where supported

- Transport abstraction

- Secure delivery integration

- Cryptographic error handling



The SDK should expose documented interfaces that applications can integrate without needing to implement cryptographic primitives themselves.



The SDK must not take ownership of application accounts, contacts, profiles, groups, or business logic.



### 4.1 Plaintext Boundary



The PCP SDK operates inside an application-controlled environment.



Before encryption, the application provides message content to the SDK.



After successful decryption, the SDK returns plaintext to the application.



Therefore:



- The application can access plaintext before encryption.

- The application can access plaintext after decryption.

- The SDK must protect cryptographic secrets and enforce protocol validation.

- A compromised application or device can expose plaintext independently of PCP's cryptographic protections.



PCP can secure communication between endpoints, but it cannot guarantee the integrity of every application that integrates it.



## 5. Cryptographic Layer Responsibilities



The cryptographic layer is responsible for the security of communication between authorized endpoints.



Its responsibilities include:



- Key generation

- Key agreement

- Session establishment

- Forward secrecy

- Post-compromise security where supported

- Message encryption

- Message authentication

- Replay and message-order protection where required

- Key rotation and lifecycle management

- Cryptographic identity verification

- Secure session termination and state handling



PCP should use established, reviewed cryptographic protocols and implementations rather than introducing custom cryptographic algorithms.



Cryptographic implementations must be independently testable and replaceable through carefully defined interfaces where protocol compatibility permits.



## 6. Transport Layer Responsibilities



The transport layer is responsible for moving protected communication data between endpoints and the relevant delivery infrastructure.



Its responsibilities include:



- Establishing network connections

- Supporting transport implementations

- Routing protected envelopes

- Handling connection failures

- Managing transport-specific retries

- Exposing transport status to the PCP client

- Supporting privacy-preserving network paths



Transport implementations must not require access to message decryption keys.



### 6.1 Transport Independence



PCP must not permanently depend on a single transport.



Potential transport implementations may include:



- Tor/Arti

- Direct encrypted network connections

- Application-operated relay networks

- Other reviewed privacy-preserving transports

- Future transport implementations contributed by the community



The PCP core should define transport interfaces rather than tightly coupling cryptographic operations to one networking system.



### 6.2 Tor and Arti Boundary



Tor/Arti provides onion routing and network-path privacy.



It is responsible for routing network traffic through the Tor network.



Tor onion routers are not PCP message-storage services and do not manage PCP application accounts or message queues.



PCP applications may use Tor/Arti to reach application-operated relay or mailbox infrastructure.



These are separate responsibilities:



- Tor/Arti routes network traffic.

- PCP protects communication data and defines protocol behavior.

- PCP relay or mailbox infrastructure handles application-level forwarding or temporary ciphertext storage.



Using Tor does not automatically eliminate all traffic-analysis or endpoint risks.



## 7. Relay and Mailbox Operator Responsibilities



A PCP deployment may use relay or mailbox infrastructure to support communication and offline delivery.



These components are operated by the application owner, an independent infrastructure operator, or another party selected by the deployment.



Their responsibilities may include:



- Accepting protected message envelopes

- Forwarding envelopes to intended destinations

- Temporarily storing ciphertext for offline recipients

- Managing delivery acknowledgements

- Enforcing storage limits and expiry policies

- Removing expired or successfully delivered ciphertext according to deployment policy



Relay and mailbox components must not require message plaintext or endpoint decryption keys.



They should collect and retain only the operational information necessary for their function.



### 7.1 Relay Visibility



Depending on the deployment and routing design, a relay may observe:



- Its network connection information

- Incoming and outgoing traffic timing

- Packet sizes

- Temporary routing identifiers

- Destination or mailbox identifiers required for delivery

- Ciphertext envelopes

- Operational errors and service metrics



Encryption protects message content, but does not automatically conceal every routing or traffic characteristic.



PCP should minimize unnecessary metadata exposure and document what each infrastructure component can observe.



## 8. Infrastructure Operator Responsibilities



Infrastructure operators control the systems on which PCP components run.



They may be responsible for:



- Server deployment

- Network configuration

- Operating-system security

- Access control

- Service availability

- Resource management

- Firewall configuration

- Server-side logging

- Backup and recovery policies

- Operational monitoring



Infrastructure operators may have access to network-level metadata, service logs, and stored ciphertext depending on their deployment.



PCP should provide secure deployment guidance and logging recommendations, but it cannot independently guarantee that an operator follows them.



Applications and infrastructure operators remain responsible for their own operational security.



## 9. PCP Project and Maintainer Responsibilities



The PCP project maintains the open-source protocol ecosystem.



Its responsibilities include:



- Publishing protocol specifications

- Maintaining reference implementations

- Maintaining SDKs

- Publishing technical documentation

- Providing interoperability guidelines

- Maintaining test suites

- Reviewing community contributions

- Publishing security advisories

- Coordinating vulnerability disclosures

- Managing releases and compatibility

- Encouraging independent audits



The PCP project does not need to operate a centralized communication service.



It does not own application users, application databases, user messages, or deployment infrastructure.



Applications and operators remain independent of the PCP maintainers.



## 10. Responsibility Matrix



| Component | Primary responsibility | Does not own |

|---|---|---|

| Application | Accounts, contacts, UI, business logic and data | PCP protocol internals |

| PCP SDK | Protocol integration and secure communication APIs | Application accounts and user relationships |

| Cryptographic layer | Identity keys, sessions, encryption and authentication | Application authorization |

| Transport layer | Secure network connectivity and routing | Message plaintext and application logic |

| PCP relay | Forwarding protected envelopes | Decryption keys and application accounts |

| PCP mailbox | Temporary ciphertext storage and delivery | Plaintext message history |

| Tor/Arti | Onion routing and network-path privacy | PCP message storage and application identity |

| Infrastructure operator | Hosting and operational security | Application business logic |

| PCP project | Specifications, SDKs, reference code and governance | Centralized ownership of application data |



## 11. Example: Sending a Message



Consider an application that uses PCP to send a private message.



1\. The application authenticates its user.

2\. The application applies its own authorization rules to determine whether the recipient is allowed.

3\. The application passes the message content and recipient context to the PCP SDK.

4\. The PCP SDK establishes or retrieves the appropriate cryptographic session.

5\. The cryptographic layer encrypts and authenticates the message.

6\. The PCP SDK constructs a protected message envelope.

7\. The selected transport sends the envelope toward the recipient's delivery infrastructure.

8\. A relay forwards the envelope or a mailbox temporarily stores it if the recipient is offline.

9\. The receiving PCP client validates and decrypts the message.

10\. The plaintext is delivered to the receiving application.

11\. The application decides how to display, store, notify, or delete the message.



PCP handles secure communication. The application handles the meaning and management of the interaction.



## 12. Security and Trust Boundaries



PCP must document the trust assumptions of each component.



The following boundaries are particularly important:



### Application Boundary



A malicious or compromised application may expose plaintext, manipulate recipient information, or misuse decrypted data.



### Endpoint Boundary



A compromised device may expose cryptographic keys, session state, or message content.



### Relay Boundary



A relay may observe operational metadata and ciphertext. It should not possess the keys needed to decrypt message content.



### Transport Boundary



A transport may observe network-level information. Its privacy guarantees depend on the specific implementation and deployment.



### Infrastructure Boundary



An infrastructure operator may control server software, logs, and deployment configuration. Their access must be included in the deployment's threat model.



PCP must not claim that using the protocol automatically makes an entire application secure or anonymous.



## 13. Design Rules



The following rules guide future PCP development:



1\. PCP must not require a centralized account directory.

2\. PCP must not own application user accounts.

3\. PCP must not impose a particular application database.

4\. PCP must not manage application contacts or groups.

5\. PCP must not require a specific user interface or framework.

6\. PCP must not require applications to use one hosting provider.

7\. PCP cryptographic components must not expose private keys through ordinary application APIs.

8\. Relays must not require message decryption keys.

9\. Transport implementations must remain modular.

10\. Security and privacy claims must be tied to documented, testable guarantees.

11\. Application-defined events must remain application-controlled.

12\. The PCP project must not require applications to depend on a centrally operated PCP service.



## 14. Conclusion



PCP is intended to be an independent communication protocol and software foundation.



Applications remain responsible for their users, data, relationships, and functionality. PCP provides the cryptographic and transport capabilities needed to communicate securely while minimizing unnecessary metadata exposure.



Relay operators and infrastructure providers remain independent deployment participants.



The PCP project maintains the protocol, specifications, SDKs, and reference implementations without becoming the owner of the applications built on top of it.



**PCP secures communication. Applications control their own ecosystems.**

