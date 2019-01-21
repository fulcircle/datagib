from django.conf import settings
from github import Github
from github.NamedUser import NamedUser as PyGitNamedUser
from github.Event import Event as PyGitEvent
from github.Repository import Repository as PyGitRepository
from github.Commit import Commit as PyCommit
from github.GitCommit import GitCommit as PyGitCommit
from github.GitAuthor import GitAuthor as PyGitAuthor
from typing import List
import datetime
import maya

class Commit:

    user_avatar_url: str = None
    author_name: str = None
    author_email: str = None
    message: str = None
    url: str = None
    date: datetime.datetime = None
    repo: str = None
    repo_url: str = None


class GitHubCommitSearchParams:

    author_email: str = None
    author_username: str = None
    repo: str = None
    since: datetime.datetime  = None
    until: datetime.datetime = None

    def has_author(self):
        return self.author_email is not None or self.author_username is not None

    def has_repo(self):
        return self.repo is not None

    def get_author(self):
        if self.author_email:
            return self.author_email
        elif self.author_username:
            return self.author_username
        else:
            raise ValueError("Attempting to call get_author() when we have no author")


class GitHubCommitSearchQuery:

    def __init__(self):
        self.github = Github(settings.GITHUB_ACCESS_TOKEN)

    def get_commits(self, gitquery_params: GitHubCommitSearchParams) -> List[Commit]:

        assert gitquery_params.has_author() or gitquery_params.has_repo()

        if gitquery_params.has_repo() and gitquery_params.has_author():
            return self.get_repo_commits_for_author(gitquery_params.repo,
                                                    gitquery_params.get_author(),
                                                    gitquery_params.since,
                                                    gitquery_params.until)

        elif gitquery_params.has_repo() and not gitquery_params.has_author():
            return self.get_repo_commits(gitquery_params.repo, gitquery_params.since, gitquery_params.until)

        elif not gitquery_params.has_repo() and gitquery_params.has_author():
            return self.get_user_commits(gitquery_params.get_author(), gitquery_params.since, gitquery_params.until)


    def get_repo_commits(self, repo: str, since: datetime.datetime=None, until: datetime.datetime=None) -> List[Commit]:
        return self._get_repo_commits(repo, since, until)

    def get_repo_commits_for_author(self, repo: str, author: str, since: datetime.datetime=None, until: datetime.datetime=None) -> List[Commit]:
        return self._get_repo_commits(repo, since, until, author)

    def _get_repo_commits(self, repo: str, since: datetime.datetime=None, until: datetime.datetime=None, author: str=None) -> List[Commit]:
        github_repo: PyGitRepository = self.github.get_repo(repo)
        kwargs = {}
        if since:
            kwargs['since'] = since
        if until:
            kwargs['until'] = until
        if author:
            kwargs['author'] = author

        commit: PyCommit
        result_commits = github_repo.get_commits(**kwargs)
        commits: List[Commit] = []
        # TODO: Assume user and author are the same since we use the users's avatar url for the author's commit
        for commit in result_commits:
            git_commit: PyGitCommit = commit.commit
            commit_author: PyGitAuthor = commit.committer
            git_commit_author: PyGitNamedUser = git_commit.committer
            c = Commit()
            c.message = git_commit.message
            c.author_email = commit_author.email
            c.author_name = commit_author.name
            c.user_avatar_url = git_commit_author.avatar_url
            c.url = git_commit.url
            c.date = commit_author.date
            c.repo = github_repo.name
            c.repo_url = github_repo.url

            commits.append(commit)

        return commits

    # TODO: Assumes only a login, not email
    def get_user_commits(self, username: str, since: datetime.datetime=None, until: datetime.datetime=None):
        user: PyGitNamedUser = self.github.get_user(username)

        events = user.get_events()
        event: PyGitEvent
        push_events = [event for event in events if event.type == 'PushEvent']

        if since:
            push_events = [event for event in events if event.created_at >= since]
        if until:
            push_events = [event for event in events if event.created_at <= until]

        commits = []
        for event in push_events:
            repo: PyGitRepository = event.repo
            if since and not event.created_at >= since or until and not event.created_at <= until:
                continue
            # TODO: Only a maximum of 20 commits
            # TODO: Assume commit author and user are the same because we use the user's avatar url for the author's commit
            # TODO: Might be that this user's push events push commit by someone else
            # TODO: We use the push event created date for the commit date, probably wrong, maybe better to look up the commits directly by hash and get date from that (?)
            if 'commits' in event.payload:
                for commit in event.payload['commits']:
                    c = Commit()
                    c.date = event.created_at
                    c.author_email = commit['author']['email']
                    c.author_name = commit['author']['name']
                    c.message = commit['message']
                    c.url = commit['url']
                    c.user_avatar_url = user.avatar_url
                    c.repo = repo.name
                    c.repo_url = repo.url

                    commits.append(c)

        return commits

    def _get_user_from_email(self, email: str):
        results = self.github.search_users(f'{email} in:email')

    def _get_date_string_from_datetime(self, date: datetime.datetime):
        return maya.MayaDT.from_datetime(date).iso8601().split('T', 1)[0]


