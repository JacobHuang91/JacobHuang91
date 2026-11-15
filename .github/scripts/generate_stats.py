#!/usr/bin/env python3
"""Generate SVG stats cards for a hand-picked list of repos.

Unlike contribution-graph-based tools, this reads an explicit list of
"owner/repo" entries (see .github/stats/repos.txt), so it also works for
repos the account contributes to but does not own, or contributed to under
a different GitHub account.
"""

import json
import os
import sys
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
REPOS_FILE = REPO_ROOT / ".github" / "stats" / "repos.txt"
OUT_DIR = REPO_ROOT / "generated"

API_BASE = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("ACCESS_TOKEN")

LANGUAGE_COLORS = {
    "Python": "#3572A5",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "Go": "#00ADD8",
    "Rust": "#dea584",
    "Java": "#b07219",
    "C++": "#f34b7d",
    "C": "#555555",
    "Shell": "#89e051",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Dockerfile": "#384d54",
}
DEFAULT_COLOR = "#8884d8"


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
    languages = api_get(f"/repos/{full_name}/languages")
    return {
        "full_name": full_name,
        "url": info.get("html_url", f"https://github.com/{full_name}"),
        "stars": info.get("stargazers_count", 0),
        "forks": info.get("forks_count", 0),
        "languages": languages,
    }


def esc(text):
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def render_overview(repo_stats):
    total_stars = sum(r["stars"] for r in repo_stats)
    total_forks = sum(r["forks"] for r in repo_stats)
    row_height = 24
    header_height = 50
    rows = [("Stars", total_stars), ("Forks", total_forks), ("Repositories", len(repo_stats))]
    height = header_height + row_height * (len(rows) + 1 + len(repo_stats)) + 20
    width = 480

    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" font-family="Helvetica,Arial,sans-serif">',
        f'<rect x="0" y="0" width="{width}" height="{height}" rx="8" fill="#ffffff" stroke="#e1e4e8"/>',
        f'<text x="20" y="30" font-size="16" font-weight="bold" fill="#0969da">Contributed Project Stats</text>',
    ]

    y = header_height
    for label, value in rows:
        lines.append(f'<text x="20" y="{y}" font-size="13" fill="#24292f">{esc(label)}</text>')
        lines.append(
            f'<text x="{width - 20}" y="{y}" font-size="13" fill="#24292f" text-anchor="end">{value:,}</text>'
        )
        y += row_height

    y += 6
    lines.append(f'<line x1="20" y1="{y - 14}" x2="{width - 20}" y2="{y - 14}" stroke="#e1e4e8"/>')
    lines.append(f'<text x="20" y="{y}" font-size="12" font-weight="bold" fill="#57606a">Per-repository</text>')
    y += row_height
    for r in sorted(repo_stats, key=lambda r: r["stars"], reverse=True):
        lines.append(f'<text x="20" y="{y}" font-size="12" fill="#24292f">{esc(r["full_name"])}</text>')
        lines.append(
            f'<text x="{width - 20}" y="{y}" font-size="12" fill="#24292f" text-anchor="end">'
            f'★ {r["stars"]:,}</text>'
        )
        y += row_height

    lines.append("</svg>")
    return "\n".join(lines)


def render_languages(repo_stats):
    totals = {}
    for r in repo_stats:
        for lang, size in r["languages"].items():
            totals[lang] = totals.get(lang, 0) + size
    grand_total = sum(totals.values()) or 1
    sorted_langs = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)[:10]

    width = 480
    bar_y = 70
    bar_height = 14
    height = bar_y + bar_height + 20 + 20 * len(sorted_langs) + 20

    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" font-family="Helvetica,Arial,sans-serif">',
        f'<rect x="0" y="0" width="{width}" height="{height}" rx="8" fill="#ffffff" stroke="#e1e4e8"/>',
        f'<text x="20" y="30" font-size="16" font-weight="bold" fill="#24292f">Languages Used (Contributed Repos)</text>',
    ]

    x = 20
    bar_width = width - 40
    for lang, size in sorted_langs:
        pct = size / grand_total
        seg_width = max(bar_width * pct, 1)
        color = LANGUAGE_COLORS.get(lang, DEFAULT_COLOR)
        lines.append(f'<rect x="{x:.1f}" y="{bar_y}" width="{seg_width:.1f}" height="{bar_height}" fill="{color}"/>')
        x += seg_width

    y = bar_y + bar_height + 30
    for lang, size in sorted_langs:
        pct = 100 * size / grand_total
        color = LANGUAGE_COLORS.get(lang, DEFAULT_COLOR)
        lines.append(f'<circle cx="26" cy="{y - 4}" r="5" fill="{color}"/>')
        lines.append(
            f'<text x="38" y="{y}" font-size="12" fill="#24292f">{esc(lang)} {pct:.2f}%</text>'
        )
        y += 20

    lines.append("</svg>")
    return "\n".join(lines)


def main():
    repos = read_repo_list()
    if not repos:
        print("No repos listed in .github/stats/repos.txt", file=sys.stderr)
        sys.exit(1)

    repo_stats = []
    for full_name in repos:
        print(f"Fetching {full_name}...", file=sys.stderr)
        repo_stats.append(fetch_repo_stats(full_name))

    OUT_DIR.mkdir(exist_ok=True)
    (OUT_DIR / "contributed-overview.svg").write_text(render_overview(repo_stats))
    (OUT_DIR / "contributed-languages.svg").write_text(render_languages(repo_stats))
    print(f"Wrote stats for {len(repo_stats)} repos to {OUT_DIR}", file=sys.stderr)


if __name__ == "__main__":
    main()
