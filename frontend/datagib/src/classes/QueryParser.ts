import chrono from 'chrono-node/chrono';

export interface DateInfo {
    since?: Date,
    until?: Date
}

export interface AuthorInfo {
    author_username?: string;
    author_email?: string;
}

export interface RepoInfo {
    repo?: string;
}

export class QueryParser {

    query: string;

    repoRegexp = new RegExp(
        /\brepo\s+((?:\w|\d|-|_)+\/?\w+)/i
    );

    emailRegexp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    userRegexp = new RegExp(
        /\b(?:(?:user(?:name)?)|(?:by))\s+((?:\w|\d|-|_)+)/i
    );



    constructor(query:string) {
        this.query = query;
    }

    get authorInfo(): AuthorInfo {

        let authorInfo: AuthorInfo;

        let author_username = this._matches(this.userRegexp, 1);
        let author_email = this._matches(this.emailRegexp);

        authorInfo = {author_email: author_email, author_username: author_username};

        return authorInfo;

    }

    get repoInfo(): RepoInfo {
        let repoInfo: RepoInfo = {};

        let repo = this._matches(this.repoRegexp, 1);

        if(repo) {
            repoInfo = {repo: repo};
        }

        return repoInfo
    }

    get dateInfo(): DateInfo {
        let parsed = chrono.parse(this.query);

        if (parsed.length > 0) {
            let dateInfo: DateInfo = { since: parsed[0].start.date() };

            let until;
            if (parsed[0].hasOwnProperty('end')) {
                until = parsed[0].end.date();
            } else if (parsed.length > 1) {
                until = parsed[1].start.date();
            }

            if (until) {
                // @ts-ignore
                if (until < dateInfo.since) {
                    dateInfo.until = dateInfo.since;
                    dateInfo.since = until;
                } else {
                    dateInfo.until = until;
                }
            }

            return dateInfo;

        } else {
            return {};
        }
    }

    _matches(regexp: RegExp, match_index=0) {
        let matches = regexp.exec(this.query);
        let result;

        if (matches) {
            result =  matches[match_index]
        }

        return result;

    }
}