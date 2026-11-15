#!/usr/bin/env python3
"""Update README.md with a stats table for a hand-picked list of repos.

Unlike contribution-graph-based tools, this reads an explicit list of
"owner/repo" entries (see .github/stats/repos.txt), so it also works for
repos the account contributes to but does not own, or contributed to under
a different GitHub account.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
REPOS_FILE = REPO_ROOT / ".github" / "stats" / "repos.txt"
README_FILE = REPO_ROOT / "README.md"

START_MARKER = "<!-- STATS:START -->"
END_MARKER = "<!-- STATS:END -->"

API_BASE = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("ACCESS_TOKEN")
USERNAME = os.environ.get("STATS_USERNAME", "JacobHuang91")


def read_repo_list():
    """Returns a list of (full_name, author_override_or_None)."""
    repos = []
    for line in REPOS_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        full_name = parts[0]
        author = parts[1] if len(parts) > 1 else None
        repos.append((full_name, author))
    return repos


def api_get(path):
    req = urllib.request.Request(f"{API_BASE}{path}")
    req.add_header("Accept", "application/vnd.github+json")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req) as resp:
        body = resp.read()
        return resp.status, (json.loads(body) if body else None)


def fetch_commit_count_by_login(full_name, login):
    """GitHub computes contributor stats async; a 202 means "try again"."""
    for _ in range(5):
        try:
            status, data = api_get(f"/repos/{full_name}/stats/contributors")
        except urllib.error.HTTPError as e:
            print(f"Warning: failed to fetch stats for {full_name}: {e}", file=sys.stderr)
            return None
        if status == 202 or data is None:
            time.sleep(2)
            continue
        for contributor in data:
            contributor_login = (contributor.get("author") or {}).get("login")
            if contributor_login and contributor_login.lower() == login.lower():
                return contributor.get("total", 0)
        return 0
    print(
        f"Warning: contributor stats for {full_name} never finished computing",
        file=sys.stderr,
    )
    return None


def fetch_commit_count_by_email(full_name, email):
    """Uses commit search instead, since the contributors endpoint only
    groups by GitHub login, not by raw commit author email."""
    query = urllib.parse.quote(f"repo:{full_name} author-email:{email}")
    try:
        _, data = api_get(f"/search/commits?q={query}&per_page=1")
    except urllib.error.HTTPError as e:
        print(f"Warning: commit search failed for {full_name}: {e}", file=sys.stderr)
        return None
    return data.get("total_count", 0) if data else None


def fetch_commit_count(full_name, author):
    if "@" in author:
        return fetch_commit_count_by_email(full_name, author)
    return fetch_commit_count_by_login(full_name, author)


def fetch_repo_stats(full_name, author):
    _, info = api_get(f"/repos/{full_name}")
    return {
        "full_name": full_name,
        "name": info.get("name", full_name.split("/")[-1]),
        "url": info.get("html_url", f"https://github.com/{full_name}"),
        "stars": info.get("stargazers_count", 0),
        "forks": info.get("forks_count", 0),
        "archived": info.get("archived", False),
        "description": (info.get("description") or "").strip(),
        "commits": fetch_commit_count(full_name, author or USERNAME),
    }


def render_repositories(repo_stats):
    total_stars = sum(r["stars"] for r in repo_stats)
    total_forks = sum(r["forks"] for r in repo_stats)
    ordered = sorted(repo_stats, key=lambda r: (r["archived"], -r["stars"]))

    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        f"**{total_stars:,}** stars · **{total_forks:,}** forks · **{len(repo_stats)}** repositories "
        f"_(last updated {updated})_",
        "",
        "| Repository | Stars | Forks | My Commits |",
        "| --- | ---: | ---: | ---: |",
    ]
    for r in ordered:
        name = f"[{r['name']}]({r['url']})"
        if r["archived"]:
            name += " _(archived)_"
        commits = "—" if r["commits"] is None else f"{r['commits']:,}"
        lines.append(f"| {name} | {r['stars']:,} | {r['forks']:,} | {commits} |")

    return "\n".join(lines)


def update_readme(table_markdown):
    content = README_FILE.read_text()
    if START_MARKER not in content or END_MARKER not in content:
        print(
            f"README.md is missing {START_MARKER} / {END_MARKER} markers",
            file=sys.stderr,
        )
        sys.exit(1)

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER), re.DOTALL
    )
    replacement = f"{START_MARKER}\n{table_markdown}\n{END_MARKER}"
    README_FILE.write_text(pattern.sub(replacement, content))


def main():
    repos = read_repo_list()
    if not repos:
        print("No repos listed in .github/stats/repos.txt", file=sys.stderr)
        sys.exit(1)

    repo_stats = []
    for full_name, author in repos:
        print(f"Fetching {full_name}...", file=sys.stderr)
        repo_stats.append(fetch_repo_stats(full_name, author))

    update_readme(render_repositories(repo_stats))
    print(f"Updated README.md with stats for {len(repo_stats)} repos", file=sys.stderr)


if __name__ == "__main__":
    main()
