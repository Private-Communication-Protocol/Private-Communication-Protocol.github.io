# Security Model

## 1. Purpose

This document defines the security objectives, threat model, trust assumptions, attack surfaces, guarantees, and limitations of the Private Communication Protocol (PCP).

PCP is designed to provide cryptographically secure communication and privacy-preserving transport capabilities to applications.

Its security model must be explicit, testable, and independently reviewable.

PCP must not rely on undocumented assumptions, security through obscurity, or claims that cannot be demonstrated through implementation and testing.

## 2. Security Objectives

PCP has five primary security objectives.

### 2.1 End-to-End Encryption

Message content must remain encrypted between authorized communication endpoints.

Intermediate infrastructure, including relays and mailbox operators, must not require access to message plaintext or endpoint decryption keys.

### 2.2 Authentication and Integrity

Messages must be cryptographically authenticated so that receiving endpoints can detect unauthorized modification.

The protocol must prevent unauthorized parties from successfully impersonating an established communication identity within the guarantees of the selected cryptographic protocol.

### 2.3 Forward Secrecy

Compromise of a current cryptographic key should not automatically expose previously protected messages.

PCP should use established session protocols that provide forward secrecy and clearly document their key lifecycle and security properties.

### 2.4 Metadata Minimization

PCP should minimize the amount of identifying and communication-related metadata exposed to infrastructure and network observers.

This includes unnecessary exposure of:

- Stable user identifiers

- Device identifiers

- Communication relationships

- Message routing information

- Connection timing

- Message sizes

- Delivery patterns

Metadata minimization is a design objective, not a guarantee that all metadata can be eliminated.

### 2.5 Transport Privacy

PCP should support privacy-preserving network transports that reduce the ability of network observers and infrastructure operators to associate communication endpoints with each other.

Transport privacy must be evaluated independently from message encryption.

## 3. Assets to Protect

PCP must identify the assets that require protection.

| Asset | Security objective |

|---|---|

| Message plaintext | Confidentiality |

| Identity private keys | Confidentiality and integrity |

| Session secrets | Confidentiality and integrity |

| Pre-keys and key material | Controlled lifecycle and authenticity |

| Message authentication data | Integrity and authenticity |

| Device identity | Authentication and controlled disclosure |

| Communication relationships | Metadata minimization |

| Routing information | Metadata minimization |

| Encrypted message envelopes | Integrity and confidentiality of protected fields |

| Session state | Integrity and consistency |

| Protocol configuration | Integrity and secure defaults |

The application may also contain sensitive information such as profiles, contact lists, message history, and account credentials.

Those assets remain under application ownership, although PCP integrations may influence how they are protected during communication.

## 4. Threat Actors

The security model considers the following potential attackers.

### 4.1 Passive Network Observer

An attacker monitoring network traffic may attempt to identify communication patterns.

Potential observations include:

- Source and destination network addresses

- Connection timing

- Traffic volume

- Packet sizes

- Connection duration

- Repeated communication patterns

The attacker may not be able to decrypt message contents but may still infer information from traffic characteristics.

### 4.2 Malicious Relay Operator

A relay operator may attempt to:

- Read stored message content

- Modify message envelopes

- Drop or delay messages

- Replay previously observed traffic

- Correlate communication activity

- Collect unnecessary routing metadata

End-to-end encryption and message authentication should prevent a relay from reading or silently modifying protected message content.

Availability and metadata exposure require separate protections.

### 4.3 Malicious Infrastructure Operator

An infrastructure operator may control the server environment where relay or mailbox components run.

Potential attacks include:

- Unauthorized access to stored ciphertext

- Manipulation of server software

- Collection of operational metadata

- Modification of routing behavior

- Injection of malicious updates

- Compromise of deployment credentials

PCP should minimize the trust required in infrastructure operators, but cannot guarantee the integrity of infrastructure it does not control.

### 4.4 Active Network Attacker

An active attacker may attempt to interfere with communication.

Potential attacks include:

- Packet interception

- Traffic modification

- Connection redirection

- Replay attacks

- Connection disruption

- Man-in-the-middle attacks

Authenticated cryptographic sessions and secure transport implementations should protect against unauthorized message modification and impersonation.

### 4.5 Malicious or Compromised Endpoint

An endpoint may be compromised through:

- Malware

- Operating-system vulnerabilities

- Physical access

- Credential theft

- Debugging or memory inspection

- Malicious application code

A compromised endpoint may expose plaintext, private keys, or session state.

PCP cannot guarantee message confidentiality after an endpoint has been compromised.

### 4.6 Malicious Application

An application integrating PCP may intentionally or unintentionally expose user information.

Examples include:

- Logging plaintext messages

- Sending decrypted content to external services

- Exposing contact relationships

- Storing sensitive information insecurely

- Misusing cryptographic identities

- Manipulating recipient information before encryption

PCP must document the application trust boundary and avoid claiming protection against malicious applications.

### 4.7 Traffic Analysis Adversary

An attacker may attempt to correlate communication activity by observing traffic at multiple network locations.

Even when message content is encrypted and network routing is privacy-preserving, timing and volume patterns may reveal communication relationships.

PCP should treat traffic analysis as a distinct threat rather than assuming encryption or onion routing eliminates it.

## 5. Trust Model

PCP aims to reduce the amount of trust users must place in intermediate communication infrastructure.

However, no communication system operates without trust assumptions.

The following components have different trust requirements.

| Component | Trust assumption |

|---|---|

| Sending endpoint | Trusted to protect plaintext and keys |

| Receiving endpoint | Trusted to protect plaintext and keys |

| PCP cryptographic implementation | Must correctly implement reviewed cryptographic protocols |

| Application | Trusted with plaintext and application-level identity |

| Relay | Not trusted with message confidentiality |

| Mailbox | Not trusted with message confidentiality |

| Transport provider | Depends on transport-specific privacy guarantees |

| Infrastructure operator | Must be considered in deployment threat analysis |

| PCP maintainers | Must publish reviewable code and specifications; users should not need to trust maintainers blindly |

### 5.1 Reduced Infrastructure Trust

A relay or mailbox should not need message decryption keys.

This reduces the consequences of infrastructure compromise because stored message content remains encrypted.

It does not eliminate the possibility of metadata collection, message deletion, traffic analysis, or service disruption.

### 5.2 Endpoint Trust

The endpoints remain critical security boundaries.

If an attacker controls either endpoint, end-to-end encryption cannot prevent that endpoint from exposing the plaintext it legitimately receives.

## 6. Cryptographic Security

PCP must rely on established and reviewed cryptographic designs.

### 6.1 Key Agreement

Key agreement must establish shared secrets between authorized communication endpoints without exposing those secrets to intermediate infrastructure.

PCP's initial implementation direction is the Signal Protocol through the official libsignal implementation.

### 6.2 Session Security

Session management should support:

- Authenticated communication

- Forward secrecy

- Ratcheting

- Message ordering and replay protection

- Session recovery and re-establishment

- Key rotation

- Secure handling of pre-keys

The exact guarantees depend on the selected protocol version and implementation.

### 6.3 Encryption and Authentication

Messages must use authenticated encryption through established cryptographic implementations.

PCP must not introduce custom encryption algorithms or custom key-agreement constructions.

### 6.4 Key Storage

Private keys and session secrets must be protected against unauthorized access.

Implementations should use available platform security facilities where appropriate.

Private keys must not be transmitted to relays or stored in ordinary server-side application databases.

### 6.5 Cryptographic Agility

PCP should support carefully designed cryptographic upgrades.

Future support for post-quantum cryptography may use standardized algorithms such as ML-KEM where appropriate.

Cryptographic upgrades must preserve interoperability and require reviewed protocol designs.

Cryptographic agility must not become an excuse for insecure fallback behavior.

## 7. Metadata Protection Model

Message encryption protects content. It does not automatically hide communication metadata.

PCP should evaluate metadata exposure at each infrastructure boundary.

### 7.1 Potentially Exposed Metadata

Depending on the transport and deployment, observers may learn:

- Network addresses

- Connection times

- Traffic volume

- Packet sizes

- Connection duration

- Relay identifiers

- Mailbox identifiers

- Temporary routing information

- Delivery activity

### 7.2 Metadata Minimization Techniques

Potential techniques include:

- Short-lived routing identifiers

- Separation of identity and routing information

- Minimal relay logging

- Limited ciphertext retention

- Onion routing

- Reduced stable identifiers

- Padding where practical

- Batching or delayed delivery where appropriate

- Mixnet-based transport for higher-latency use cases

Each technique has performance, complexity, and operational trade-offs.

PCP should introduce these capabilities through documented and testable modules.

### 7.3 Onion Routing

Tor/Arti may be used as an initial transport implementation.

Onion routing separates knowledge of the communication path across multiple relays.

It can reduce direct association between the originating network address and destination.

However, it does not guarantee protection against every traffic-correlation attack, compromised endpoint, malicious application, or global passive observer.

### 7.4 Mix Networks

Mix networks may be evaluated as a future transport option for applications that prioritize stronger resistance to timing correlation over low latency.

They may introduce batching delays, cover traffic, and other techniques to make traffic analysis more difficult.

They should remain optional transport implementations rather than mandatory components of every PCP deployment.

## 8. Attack Surface

PCP must consider the following attack surfaces.

| Attack surface | Potential risk |

|---|---|

| Key generation | Weak or predictable key material |

| Key storage | Private-key extraction |

| Session establishment | Impersonation or key substitution |

| Message parsing | Malformed input and parser vulnerabilities |

| Envelope processing | Metadata leakage or validation failures |

| Transport implementation | Network attacks and connection manipulation |

| Relay infrastructure | Metadata collection and service disruption |

| Mailbox storage | Ciphertext exposure, deletion, or replay |

| SDK integration | Incorrect API usage or plaintext leakage |

| Application integration | Malicious handling of decrypted data |

| Build and release pipeline | Supply-chain compromise |

| Dependency management | Vulnerable or compromised dependencies |

Each attack surface should have corresponding security tests, implementation requirements, or operational controls.

## 9. Security Guarantees and Limitations

PCP must distinguish intended guarantees from protections that depend on deployment conditions.

| Security property | Intended guarantee or limitation |

|---|---|

| Message confidentiality | Provided between uncompromised authorized endpoints using correctly implemented E2EE |

| Message integrity | Provided through authenticated cryptographic protocols |

| Forward secrecy | Depends on the selected session protocol and correct key lifecycle |

| Relay confidentiality | Relays do not possess endpoint decryption keys |

| Network privacy | Depends on the selected transport and its threat model |

| Metadata protection | Minimized, but not completely eliminated |

| Anonymity | Not guaranteed against all observers |

| Traffic-analysis resistance | Depends on transport design and attacker capabilities |

| Endpoint security | Depends on device and application security |

| Availability | Cannot be guaranteed by cryptography alone |

| Message delivery | Depends on endpoint availability and relay/mailbox operation |

| Application privacy | Depends on the integrating application's behavior |

PCP must not claim absolute anonymity, perfect metadata protection, or immunity from compromise.

## 10. Security Testing Requirements

Security claims must be supported by reproducible tests.

### 10.1 Cryptographic Tests

- Correct encryption and decryption

- Rejection of incorrect keys

- Detection of modified ciphertext

- Detection of modified authentication tags

- Detection of invalid nonces

- Session establishment validation

- Forward-secrecy behavior

- Ratchet progression

- Out-of-order message handling

- Replay rejection

- Key rotation and session recovery

### 10.2 Protocol Tests

- Invalid envelope rejection

- Malformed message rejection

- Unsupported protocol version handling

- Invalid routing information rejection

- Message size limits

- Duplicate message handling

- Session-state consistency

- Interoperability between independent implementations

### 10.3 Transport Tests

- Connection failure handling

- Retry behavior

- Proxy configuration validation

- DNS leak testing

- Transport switching

- Relay disconnection handling

- Metadata exposure analysis

- Traffic-correlation evaluation where applicable

### 10.4 Security Review

Before stable releases, PCP should pursue:

- Independent code review

- Cryptographic implementation review

- Protocol design review

- Dependency audits

- Fuzz testing

- Reproducible security testing

- External security audits when feasible

Passing automated tests is necessary but does not establish that a protocol is secure.

## 11. Secure Development Principles

PCP development should follow these principles:

1\. Prefer established cryptographic protocols over custom designs.

2\. Minimize the amount of sensitive information collected and retained.

3\. Keep private keys and session secrets under endpoint control.

4\. Separate cryptographic operations from application business logic.

5\. Separate transport implementations from cryptographic implementations.

6\. Validate all protocol inputs.

7\. Use secure defaults.

8\. Avoid silent security downgrades.

9\. Document security assumptions and limitations.

10\. Make security testing reproducible.

11\. Publish vulnerabilities and fixes responsibly.

12\. Keep security-sensitive dependencies maintained and reviewable.

## 12. Future Security Improvements

Potential future improvements include:

- Post-quantum key establishment

- Stronger traffic-analysis resistance

- Mixnet transport integration

- Advanced metadata minimization

- Improved secure key storage

- Formal protocol verification

- Independent interoperability implementations

- External cryptographic audits

- Improved relay privacy and operational isolation

These are development directions, not claims about existing PCP capabilities.

## 13. Conclusion

PCP aims to provide secure communication through established cryptographic protocols, authenticated messaging, modular transport implementations, and metadata minimization.

Its security depends on correct implementation, secure endpoints, carefully designed protocol boundaries, and transparent operational assumptions.

PCP must make security claims that can be examined, tested, and independently reviewed.

**Security must be demonstrated, not advertised.**

