from api.gitquery import GitHubCommitSearchQuery, GitHubCommitSearchParams
from datetime import datetime, timedelta

def run_search():
    gq = GitHubCommitSearchQuery()
    params = GitHubCommitSearchParams()

    params.author_username = 'vsunkavalli@gmail.com'

    return gq.get_commits(params)

