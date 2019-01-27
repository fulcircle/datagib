export interface CommitData {
    commits: Commit[]
}

export interface Commit {
    url: string;

    sha: string;

    message: string;

    date: Date;

    repo: string;
    repo_url: string;

    author_name: string;
    author_email: string;

    user_login: string;
    user_url: string;
    user_avatar_url: string;
}