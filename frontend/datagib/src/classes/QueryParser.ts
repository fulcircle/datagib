export interface CommitterInfo {
    author_username?: string;
    author_email?: string;
}

export interface RepoInfo {
    repo?: string;
}

export class QueryParser {

    query: string;
    repoRegexp = new RegExp(
        /(\brepo\s+)(\w+\/?\w+)/i
    );

    emailRegexp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );



    constructor(query:string) {
        this.query = query;
    }

    get committerInfo(): CommitterInfo {
        let email;

        let matches = this.emailRegexp.exec(this.query);
        if (matches) {
            email = matches[0]
        }

        return {
            author_username: "",
            author_email: this._matches(this.emailRegexp)
        }

    }

    get repoInfo(): RepoInfo {
        console.log(this._matches(this.repoRegexp, 2));
        return {
            repo: this._matches(this.repoRegexp, 2)
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