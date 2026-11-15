import Link from 'next/link';

const USER = 'billymitchell';
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;
const EVENTS_URL = `https://api.github.com/users/${USER}/events/public?per_page=100`;

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

function ContributionCalendar({ contributions }) {
  if (!contributions?.length) return <p className="terminal-note">Contribution calendar temporarily unavailable.</p>;
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
  const total = days.reduce((sum, day) => sum + day.count, 0);
  return (
    <div className="contribution-calendar">
      <p className="terminal-command" aria-hidden="true">$ github --contributions</p>
      <p className="contribution-summary">{total.toLocaleString('en-US')} contributions in the past year</p>
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
        <Link href={`https://github.com/${USER}?tab=overview`} target="_blank" rel="noopener noreferrer">View GitHub profile ↗</Link>
        <span className="contribution-legend">Less {Array.from({ length: 5 }, (_, level) => <i key={level} className={`contribution-day contribution-level-${level}`} />)} More</span>
      </div>
    </div>
  );
}

export default async function GitHubActivity() {
  const [calendar, events] = await Promise.all([
    loadActivity(CONTRIBUTIONS_URL),
    loadActivity(EVENTS_URL),
  ]);
  const commits = Array.isArray(events)
    ? events.filter(({ type }) => type === 'PushEvent').flatMap(({ repo, payload, created_at }) =>
        (payload?.commits || []).map(({ sha, message }) => ({
          sha, message: message.split('\n')[0], repo: repo.name, created_at,
        }))
      ).filter(({ sha, message }) => sha && message).slice(0, 5)
    : [];
  return (
    <section className="github-activity" aria-label="GitHub development activity">
      <ContributionCalendar contributions={calendar?.contributions} />
      <div className="recent-commits">
        <p className="terminal-command" aria-hidden="true">$ git log --all --oneline</p>
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
        ) : <p className="terminal-note">No recent public push commits available.</p>}
      </div>
    </section>
  );
}
