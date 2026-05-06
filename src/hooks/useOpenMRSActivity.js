import { useState, useEffect } from 'react';
import axios from 'axios';

const ORGS = ['openmrs'];

const useOpenMRSActivity = () => {
  const username = process.env.REACT_APP_GITHUB_USERNAME || 'Chinmay7070';
  const token = process.env.REACT_APP_GITHUB_TOKEN;

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [data, setData] = useState({
    pullRequests: 0,
    codeReviews: 0,
    issues: 0,
    commits: 0,
    contributedRepos: [],
    otherRepos: 0,
    mergedPRs: 0,
    openPRs: 0,
    orgs: ORGS.map(o => ({ login: o, avatar_url: `https://github.com/${o}.png` })),
  });

  const headers = token ? { Authorization: `token ${token}` } : {};

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Fetch org avatars
        const orgResults = await Promise.allSettled(
          ORGS.map(o => axios.get(`https://api.github.com/orgs/${o}`, { headers }))
        );
        const orgs = orgResults.map((r, i) =>
          r.status === 'fulfilled'
            ? { login: r.value.data.login, avatar_url: r.value.data.avatar_url }
            : { login: ORGS[i], avatar_url: `https://github.com/${ORGS[i]}.png` }
        );

        let totalPRs = 0, mergedPRs = 0, openPRs = 0, totalIssues = 0, totalReviews = 0;
        const seenRepos = new Set();
        const contributedRepos = [];

        for (const org of ORGS) {
          try {
            const [prRes, mergedRes, openRes, issueRes, reviewRes] = await Promise.all([
              axios.get(`https://api.github.com/search/issues?q=author:${username}+org:${org}+type:pr&per_page=30`, { headers }),
              axios.get(`https://api.github.com/search/issues?q=author:${username}+org:${org}+type:pr+is:merged`, { headers }),
              axios.get(`https://api.github.com/search/issues?q=author:${username}+org:${org}+type:pr+is:open`, { headers }),
              axios.get(`https://api.github.com/search/issues?q=author:${username}+org:${org}+type:issue`, { headers }),
              axios.get(`https://api.github.com/search/issues?q=reviewed-by:${username}+org:${org}+type:pr`, { headers }),
            ]);

            totalPRs += prRes.data.total_count;
            mergedPRs += mergedRes.data.total_count;
            openPRs += openRes.data.total_count;
            totalIssues += issueRes.data.total_count;
            totalReviews += reviewRes.data.total_count;

            prRes.data.items.forEach(item => {
              const repoName = item.repository_url.replace('https://api.github.com/repos/', '');
              if (!seenRepos.has(repoName)) {
                seenRepos.add(repoName);
                contributedRepos.push(repoName);
              }
            });
          } catch (orgErr) {
            console.warn(`Error fetching data for org ${org}:`, orgErr.message);
          }
        }

        const total = totalPRs + totalIssues + totalReviews;

        setData({
          pullRequests: total > 0 ? Math.round((totalPRs / total) * 100) : 0,
          issues: total > 0 ? Math.round((totalIssues / total) * 100) : 0,
          codeReviews: total > 0 ? Math.round((totalReviews / total) * 100) : 0,
          commits: 29,
          contributedRepos: contributedRepos.slice(0, 3),
          otherRepos: Math.max(0, contributedRepos.length - 3),
          mergedPRs,
          openPRs,
          orgs,
        });
      } catch (err) {
        console.error('Error fetching GitHub activity:', err);
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, apiError };
};

export default useOpenMRSActivity;