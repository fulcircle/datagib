import React, {ChangeEvent, Component} from 'react';
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
                    alert("Error searching");
                    this.setState({searching: false})
                }

            });
        }
    }


    render() {

        let commitElements = this.state.commits.slice(0,30).map((commit: Commit, idx: number) => {
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
                        {name} committed to <a href={commit.repo_url} target="_blank">{commit.repo}</a> on {commit.date}
                    </div>
                </div>
            </div>
        });

        return (
            <div className="DatagibApp">
                {/*{nlp('all commits with message containing hello').nouns().out('txt')}*/}
                <div className="datagib_container">
                    <div className="datagib_content">
                        <input
                            disabled={this.state.searching}
                            className="query_box"
                            value={this.state.value}
                            onChange={(event) => this.onChange(event)}
                            onKeyPress={(event: any) => this.onKeyPress(event)}
                        />
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
