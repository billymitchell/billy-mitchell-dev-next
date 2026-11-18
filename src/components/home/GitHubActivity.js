import Link from 'next/link';

const USER = 'billymitchell';
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;
const EVENTS_URL = `https://api.github.com/users/${USER}/events/public?per_page=100`;
const COMMIT_LIMIT = 6;

// Repos whose commits are about this site or profile rather than shipped work.
// Their messages tend to be about site copy, so they stay out of the public feed.
const HIDDEN_REPOS = new Set([
  `${USER}/billy-mitchell-dev-next`,
  `${USER}/billy-mitchell-design-next`,
  `${USER}/${USER}`,
]);

// Safety net for any other commit message about employment or job searching.
const HIDDEN_MESSAGE = /full[\s-]?time|salary|compensation|\bjobs?\b|hiring|recruit|r[eé]sum[eé]|employ|availability|open to|pricing/i;

async function loadActivity(url) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json', 'User-Agent': 'billy-mitchell-dev-next' },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendar(contributions) {
  const counts = new Map(contributions.map(({ date, count }) => [date, Number(count) || 0]));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const days = [];
  for (let day = new Date(start); day <= today; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = dateKey(day);
    const count = counts.get(date) || 0;
    days.push({ date, count, level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4 });
  }
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) weeks.push(days.slice(index, index + 7));

  let longestStreak = 0;
  let run = 0;
  for (const { count } of days) {
    run = count ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }
  // A quiet today shouldn't break a streak that's still alive from yesterday.
  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0; index--) {
    if (days[index].count) currentStreak++;
    else if (index !== days.length - 1) break;
  }

  return {
    weeks,
    total: days.reduce((sum, day) => sum + day.count, 0),
    activeDays: days.filter(({ count }) => count).length,
    longestStreak,
    currentStreak,
  };
}

async function loadCommits() {
  const events = await loadActivity(EVENTS_URL);
  // GitHub's public Events API no longer reliably includes commit details in PushEvent payloads.
  // Fetch the latest commits from recently pushed public repositories instead.
  const recentRepos = Array.isArray(events)
    ? [...new Set(events.filter(({ type }) => type === 'PushEvent').map(({ repo }) => repo.name))]
      .filter((repo) => !HIDDEN_REPOS.has(repo))
      .slice(0, 8)
    : [];
  const recentCommits = await Promise.all(recentRepos.map(async (repo) => {
    const result = await loadActivity(`https://api.github.com/repos/${repo}/commits?per_page=5`);
    return Array.isArray(result) ? result.map(({ sha, commit }) => ({
      sha, message: commit?.message?.split('\n')[0], repo,
      created_at: commit?.author?.date,
    })) : [];
  }));
  return recentCommits.flat()
    .filter(({ sha, message, created_at }) => sha && message && created_at && !HIDDEN_MESSAGE.test(message) && !/^Merge (branch|pull request|remote)/.test(message))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, COMMIT_LIMIT);
}

function ContributionCalendar({ calendar }) {
  if (!calendar) return <p className="terminal-note">Contribution calendar temporarily unavailable.</p>;
  const { weeks, total } = calendar;
  return (
    <div className="contribution-calendar">
      <p className="terminal-command" aria-hidden="true">$ github --contributions</p>
      {/* Right-to-left scroller starts narrow screens on the most recent weeks. */}
      <div className="contribution-scroll" role="img" aria-label={`GitHub contribution calendar: ${total} contributions in the past year`}>
        <div className="contribution-weeks">
          {weeks.map((week) => (
            <div className="contribution-week" key={week[0].date}>
              {week.map(({ date, count, level }) => (
                <span key={date} className={`contribution-day contribution-level-${level}`}
                  title={`${date}: ${count} contribution${count === 1 ? '' : 's'}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="contribution-footer">
        <Link href={`https://github.com/${USER}`} target="_blank" rel="noopener noreferrer">github.com/{USER} ↗</Link>
        <span className="contribution-legend">Less {Array.from({ length: 5 }, (_, level) => <i key={level} className={`contribution-day contribution-level-${level}`} />)} More</span>
      </div>
    </div>
  );
}

export default async function GitHubActivity() {
  const [contributions, commits] = await Promise.all([loadActivity(CONTRIBUTIONS_URL), loadCommits()]);
  const calendar = contributions?.contributions?.length ? buildCalendar(contributions.contributions) : null;
  const stats = calendar ? [
    ['Contributions', calendar.total.toLocaleString('en-US')],
    ['Active days', calendar.activeDays],
    ['Longest streak', `${calendar.longestStreak}d`],
    ['Current streak', `${calendar.currentStreak}d`],
  ] : [];

  return (
    <section id="github-activity" className="home-page-section outer-container" aria-labelledby="github-activity-title">
      <div className="inner-width-1000">
        <h2 id="github-activity-title" className="h3">Building in public</h2>
        <p className="github-intro">A year of commits, pull requests, and shipped code on GitHub.</p>
        <div className="github-panel">
          {stats.length > 0 && (
            <dl className="github-stats">
              {stats.map(([label, value]) => (
                <div key={label}><dd>{value}</dd><dt>{label}</dt></div>
              ))}
            </dl>
          )}
          <ContributionCalendar calendar={calendar} />
          <div className="recent-commits">
            <p className="terminal-command" aria-hidden="true">$ git log --oneline -{COMMIT_LIMIT}</p>
            {commits.length ? (
              <ul>
                {commits.map(({ sha, message, repo, created_at }) => (
                  <li key={`${repo}-${sha}`}>
                    <a href={`https://github.com/${repo}/commit/${sha}`} target="_blank" rel="noopener noreferrer">
                      <code>{sha.slice(0, 7)}</code> <span>{message}</span>
                    </a>
                    <small>{repo.split('/').pop()} · {new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</small>
                  </li>
                ))}
              </ul>
            ) : <p className="terminal-note">No recent public commits available.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
