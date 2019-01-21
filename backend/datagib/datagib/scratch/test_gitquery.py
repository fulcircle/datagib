from api.gitquery import GitHubCommitSearchQuery, GitHubCommitSearchParams
from github.Commit import Commit
from github.GitCommit import GitCommit
from github.GitAuthor import GitAuthor
from github.NamedUser import NamedUser
from datetime import datetime, timedelta

def run_search():
    gq = GitHubCommitSearchQuery()
    params = GitHubCommitSearchParams()

    params.author_username = 'fulcircle'
    params.since = datetime.now() - timedelta(days=30)

    return gq.get_commits(params)

# for commit in gq.get_commits(params):
#     git_commit: GitCommit = commit.commit
#     author: GitAuthor = git_commit.author
#     committer: NamedUser = commit.committer
#     print(author.date)
#     print(git_commit.message)
