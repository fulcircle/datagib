from api.gitquery import GitQuery, GitQueryParams
import pprint
from datetime import datetime, timedelta

pp = pprint.PrettyPrinter()
gq = GitQuery()
params = GitQueryParams()

params.author_name = "vik+sunkavalli"
# params.start_date = datetime.now() - timedelta(days=50)

json = gq.query(params)
pp.pprint(json)
