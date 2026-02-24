# SSH Hardening

## Threat Model

Public servers are constantly targeted by automated bots attempting SSH brute-force attacks using password authentication.

## Risk

If password authentication is enabled:
- attackers can guess weak passwords
- credential leaks lead to server compromise
- root account becomes primary attack target

## Mitigation

Disabled password authentication and root login.
PasswordAuthentication no
PermitRootLogin no

## Why This Works

SSH key authentication relies on asymmetric cryptography instead of passwords, making brute-force attacks infeasible.

## Result

Only users possessing a valid private SSH key can access the server.
