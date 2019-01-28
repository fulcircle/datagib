import React, {ChangeEvent, Component, ReactNode} from 'react';
import './Datagib.scss';
import {Api} from "./api/Api";
import {Commit} from "./data/Commit.interface";
import {QueryParser} from "./classes/QueryParser";


type State = {
    commits: Array<Commit>,
    oldValue: string,
    value: string,
    searching: boolean

}
class Datagib extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {commits: [], oldValue: "", value: "", searching: false};

    }

    componentDidMount(): void {
    }

    onChange(event: ChangeEvent<HTMLInputElement>) {

        const oldText = this.state.value;
        const newText = event.target.value;

        this.setState({
            oldValue: oldText,
            value: newText,
        });

    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.dispatchSearch(this.state.oldValue, this.state.value)
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Backspace') {
            this.setState((prevState) => {

                let commits = prevState.commits;
                if (prevState.value === "") {
                    commits = [];
                }
                return {
                    commits: commits
                }
            });
        }
    }

    async dispatchSearch(oldText: string, newText:string) {
        if (this.state.searching) {
            return
        }

        if (newText === null || newText === "") {
            this.setState({value: newText, commits: [], searching: false})

        } else if (oldText === "" || oldText === null || oldText !== newText) {
            this.setState({searching: true}, async () => {
                let query = new QueryParser(newText);
                let data = {...query.authorInfo, ...query.repoInfo, ...query.dateInfo};

                try {
                    let commit_data = await Api.search(data);
                    this.setState({commits: commit_data.commits, searching: false});
                } catch(e) {
                    this.setState({commits: [], searching: false})
                }

            });
        }
    }

    get showingResults() {
        return this.state.commits.length > 0;
    }


    render() {

        let commitElements: Array<ReactNode> = [];
        if (this.state.value !== "") {
            commitElements = this.state.commits.slice(0, 30).map((commit: Commit, idx: number) => {
                let name;
                if (commit.user_login) {
                    name = commit.user_login;
                } else if (commit.author_name) {
                    name = commit.author_name;
                } else if (commit.author_email) {
                    name = commit.author_email;
                }
                return <div className="result" key={idx}>
                    <img className="avatar" src={commit.user_avatar_url}/>
                    <div className="result__commit">
                        <div className="result__message">
                            {commit.message}
                        </div>
                        <div className="result__commit_info">
                            {name} committed to <a href={commit.repo_url}
                                                   target="_blank">{commit.repo}</a> on {commit.date}
                        </div>
                    </div>
                </div>
            });
        }

        return (
            <div className="DatagibApp">
                <div className="datagib_container">
                    <div className="datagib_content">
                        <div className="title">
                            datagib
                        </div>
                        <div className="subtitle">
                            search for Github commits using English
                        </div>
                        <input
                            disabled={this.state.searching}
                            className="query_box"
                            value={this.state.value}
                            onChange={(event) => this.onChange(event)}
                            onKeyPress={(event: any) => this.onKeyPress(event)}
                            onKeyUp={(event: any) => this.onKeyUp(event)}
                        />
                        {!this.showingResults && !this.state.searching &&
                        <div className="subtext_container">
                            <div className="subtext">
                                ex: 'commits to repo datagib'
                            </div>
                            <div className="subtext">
                                ex: 'commits by fulcircle in the last 3 months'
                            </div>
                            <div className="subtext">
                                ex: 'commits by fulcircle to repo datagib from dec 2018 to jan 2019'
                            </div>
                        </div>}
                        {this.state.searching &&
                        <div className="spinner">
                            <div className="rect1"></div>
                            <div className="rect2"></div>
                            <div className="rect3"></div>
                            <div className="rect4"></div>
                            <div className="rect5"></div>
                        </div>}
                        {!this.state.searching && commitElements}
                    </div>
                </div>
            </div>
        );
    }
}

export default Datagib;
