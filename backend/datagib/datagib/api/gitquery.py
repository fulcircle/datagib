from django.conf import settings
import requests
import datetime
import maya
import pprint

class GitQueryParams:

    type: str = 'commits'
    author_name: str = None
    author_email: str = None
    author_username: str = None
    org: str = None
    repo: str = None
    search_string: str = None
    start_date: datetime.datetime  = None
    end_date: datetime.datetime = None



class GitQuery:

    def __init__(self):
        self.key = settings.GITHUB_ACCESS_TOKEN
        self.url = 'https://api.github.com/search/commits'
        self.printer = pprint.PrettyPrinter()

    def query(self, gitquery_params: GitQueryParams):
        query = self._construct_commit_search_query(gitquery_params)
        self.printer.pprint(query)
        result = requests.get(self.url,
                              params={'access_token': settings.GITHUB_ACCESS_TOKEN, 'q': query},
                              headers={'Accept': 'application/vnd.github.cloak-preview'})
        print(result.url)
        return result.json()

    def _construct_commit_search_query(self, gitquery_params: GitQueryParams):
        query = []

        date_query_param = 'committer-date:'

        if gitquery_params.start_date or gitquery_params.end_date:
            if gitquery_params.start_date:
                date_query_param += f'"{self._get_date_string_from_datetime(gitquery_params.start_date)}..'
            else:
                date_query_param += '"*..'

            if gitquery_params.end_date:
                date_query_param += f'{self._get_date_string_from_datetime(gitquery_params.end_date)}"'
            else:
                date_query_param += '*"'

            query.append(date_query_param)
        if gitquery_params.search_string:
            query.append(f'"{gitquery_params.search_string}"')
        if gitquery_params.author_email:
            query.append(f'author-email:"{gitquery_params.author_email}"')
        elif gitquery_params.author_username:
            query.append(f'author:"{gitquery_params.author_username}"')
        elif gitquery_params.author_name:
            query.append(f'author-name:"{gitquery_params.author_name}"')

        if gitquery_params.repo:
            query.append(f'repo:"{gitquery_params.repo}"')
        elif gitquery_params.org:
            query.append(f'org:"{gitquery_params.org}"')

        return "+".join(query)

    def _get_date_string_from_datetime(self, date: datetime.datetime):
        return maya.MayaDT.from_datetime(date).iso8601().split('T', 1)[0]


