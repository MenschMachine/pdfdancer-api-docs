"""Pytest configuration for documentation example tests."""

import os

# Set up environment for anonymous API access
os.environ.setdefault('PDFDANCER_BASE_URL', 'https://api.pdfdancer.com')
