from api.gitquery import GitHubCommitSearchQuery, GitHubCommitSearchParams
from datetime import datetime, timedelta

def run_search():
    gq = GitHubCommitSearchQuery()
    params = GitHubCommitSearchParams()

    params.author_username = 'vsunkavalli@gmail.com'
    params.repo = 'fulcircle/datagib'
    params.since = datetime.now() - timedelta(days=30)

    return gq.get_commits(params)

