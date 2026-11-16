# BloodLink: Blood Donor Finder & Management System

An Analysis and Design of Algorithms classroom project. BloodLink keeps a small donor directory in the browser, filters available red-cell donors by compatibility, ranks matches, and demonstrates a greedy attempt with a backtracking fallback when the requested set would repeat a location.

## Run the demo

1. Install Python 3 if needed.
2. From this folder, run `python -m http.server 8000`.
3. Open `http://localhost:8000` in a browser.

No package installation, account, server database, or network connection is required. The app uses fictional sample records and stores edits in the current browser's local storage. **Do not enter real donor contact details.**

## Features

- Add, edit, remove, filter, and update availability for donor records; donor IDs must be unique.
- Filter by red-cell compatibility and availability.
- Rank by distance, priority, or donor ID.
- Try the first `k` ranked candidates greedily. When the one-donor-per-location constraint is violated, backtracking searches ranked alternatives.
- Export the directory as CSV; reset to the bundled fictional sample data.
- Display the compatibility rules, algorithm steps, selected donor set, and measured search time.

## Inputs and outputs

Inputs: donor ID, name, optional contact, blood group, location, distance, priority, availability, required recipient blood group, requested donor count, ranking rule, and location-diversity constraint.

Outputs: compatible available donors, ranked candidate list, selected donors, selection strategy, search states explored, and elapsed time.

## Algorithms and complexity

Let `N` be the donor count, `M` the compatible and available candidates, and `k` the requested donor count.

| Stage | Method | Time | Extra space |
| --- | --- | --- | --- |
| Compatibility and availability | Linear scan | `O(N)` | `O(M)` |
| Candidate ranking | Merge sort | `O(M log M)` | `O(M)` buffers and `O(log M)` recursion stack |
| Greedy attempt | Take the first `k` ranked candidates | `O(k)` | `O(k)` |
| Constraint fallback | Depth-first combination search | `O(2^M)` worst case | `O(M)` recursion and selection state |

The main path is `O(N + M log M)`. Backtracking may dominate when it must explore many combinations. The program returns the first feasible combination in ranked order, so the fallback favors higher-ranked donors while enforcing one donor per location.

## Benchmark

Run `node benchmark.mjs` to recreate `results/benchmark.csv`. The script uses deterministic synthetic records, warms up each input, and reports the median per-query time across 15 runs of 50 queries each. The scenario makes the first 12 candidates share a location to trigger fallback search. Timings depend on the computer and runtime; they are observations, not guarantees. The benchmark measures execution time only, not memory.

## Manual verification cases

- Empty directory or no compatible donor: show a clear no-match message.
- Unavailable compatible donor: exclude it.
- Duplicate donor ID: reject the record.
- Top `k` donors from one location with alternatives elsewhere: invoke backtracking and return a location-diverse set.
- Fewer than `k` distinct eligible locations: return a location-diverse partial set and state the shortfall.
- Editing and deleting a donor: update counts and search results.
- CSV export: include the current records and header row.

## Scope and safety

This is an educational matching demo, not a clinical service. The compatibility table represents simplified red-cell ABO/Rh rules. A qualified transfusion service must verify blood type, crossmatch, donation eligibility, component type, and all clinical decisions. The browser-only app is not a secure system for real personal data. A production version would need authenticated roles, secure storage, audit logs, consent, and hospital/blood-bank integration.

## Course

Analysis and Design of Algorithms (ADA)

