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


def read_repo_list():
    repos = []
    for line in REPOS_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        repos.append(line)
    return repos


def api_get(path):
    req = urllib.request.Request(f"{API_BASE}{path}")
    req.add_header("Accept", "application/vnd.github+json")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def fetch_repo_stats(full_name):
    info = api_get(f"/repos/{full_name}")
    return {
        "full_name": full_name,
        "name": info.get("name", full_name.split("/")[-1]),
        "url": info.get("html_url", f"https://github.com/{full_name}"),
        "stars": info.get("stargazers_count", 0),
        "forks": info.get("forks_count", 0),
        "archived": info.get("archived", False),
        "description": (info.get("description") or "").strip(),
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
        "| Repository | Stars | Forks |",
        "| --- | ---: | ---: |",
    ]
    for r in ordered:
        name = f"[{r['name']}]({r['url']})"
        if r["archived"]:
            name += " _(archived)_"
        lines.append(f"| {name} | {r['stars']:,} | {r['forks']:,} |")

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
    for full_name in repos:
        print(f"Fetching {full_name}...", file=sys.stderr)
        repo_stats.append(fetch_repo_stats(full_name))

    update_readme(render_repositories(repo_stats))
    print(f"Updated README.md with stats for {len(repo_stats)} repos", file=sys.stderr)


if __name__ == "__main__":
    main()
