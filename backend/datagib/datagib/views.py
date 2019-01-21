from django.http import JsonResponse, HttpResponseNotAllowed
from datagib.api.gitquery import GitHubCommitSearchQuery, GitHubCommitSearchParams
from django.views.decorators.csrf import csrf_exempt
import json


# @csrf_exempt
def commit_query(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        params = GitHubCommitSearchParams.from_dict(data)

        q = GitHubCommitSearchQuery()
        commits = q.get_commits(params)
        json_commits = [commit.__dict__ for commit in commits]
        return JsonResponse({'commits': json_commits})
    else:
        return HttpResponseNotAllowed(permitted_methods=['POST'])

