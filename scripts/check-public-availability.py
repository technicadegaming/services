#!/usr/bin/env python3
"""Public, unauthenticated Technicade availability diagnostics; no tokens or login."""
import socket
import sys
import urllib.error
import urllib.request
from urllib.parse import urlsplit

URLS = [
    "https://technicade.tech/",
    "https://technicade.tech/portfolio.html",
    "https://technicade.tech/projects/arcade-tools.html",
    "https://technicade.tech/sitemap.xml",
    "https://tools.technicade.tech/arcade-tools",
]
FAILURES = []
for url in URLS:
    hostname = urlsplit(url).hostname
    try:
        addresses = sorted({entry[4][0] for entry in socket.getaddrinfo(hostname, 443, type=socket.SOCK_STREAM)})
        print(f"DNS {hostname}: {', '.join(addresses)}")
    except OSError as exc:
        print(f"FAIL DNS {hostname}: {exc}")
        FAILURES.append(f"DNS: {url}")
        continue
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "Technicade-public-availability/1.0"})
        with urllib.request.urlopen(request, timeout=15) as response:
            status = response.status
            dest = response.geturl()
            print(f"HTTP {status}: {url} -> {dest}")
            if status >= 400:
                FAILURES.append(f"HTTP {status}: {url}")
    except urllib.error.HTTPError as exc:
        print(f"FAIL HTTP {exc.code}: {url}")
        FAILURES.append(f"HTTP {exc.code}: {url}")
    except Exception as exc:
        print(f"FAIL REQUEST {url}: {type(exc).__name__}: {exc}")
        FAILURES.append(f"REQUEST: {url}")
print(f"Checked {len(URLS)} URLs; {len(FAILURES)} failure(s)")
if FAILURES:
    print("Unverified or failing destinations:")
    for failed in FAILURES:
        print(" -", failed)
sys.exit(bool(FAILURES))
