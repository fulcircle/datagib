import React, {ChangeEvent, Component} from 'react';
export var nlp = require('compromise');
import './Datagib.scss';
import {Api} from "./api/Api";
import {Commit} from "./data/commit.interface";


type State = {
    commits: Array<Commit>,
    value: string,
    typing: boolean,
    typingTimeout: any
    searching: boolean

}
class Datagib extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {commits: [], value: "", typing: false, typingTimeout: 0, searching: false};

    }

    componentDidMount(): void {
    }

    onChange(event: ChangeEvent<HTMLInputElement>) {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        const oldText = this.state.value;
        const newText = event.target.value;

        this.setState({
            value: event.target.value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.dispatchSearch(oldText, newText)
            }, 500)
        });

    }

    async dispatchSearch(oldText: string, newText:string) {
        if (this.state.searching) {
            return
        }

        if (newText === null || newText === "") {
            this.setState({value: newText, commits: [], searching: false})

        } else if (oldText === "" || oldText === null || oldText !== newText) {
            this.setState({searching: true}, async () => {
                let commit_data = await Api.search({author_username: 'fulcircle', repo: 'fulcircle/topper'});
                this.setState({value: newText, commits: commit_data.commits, searching: false});
            });
        }
    }


    render() {

        let commitElements = this.state.commits.slice(0,5).map((commit: Commit, idx: number) => {
            return <div className="result" key={idx}>
                {commit.date}: {commit.message}
            </div>
        });

        return (
            <div className="DatagibApp">
                {/*{nlp('all commits with message containing hello').nouns().out('txt')}*/}
                <div className="datagib_container">
                    <div className="datagib_content">
                        <input disabled={this.state.searching} className="query_box" value={this.state.value} onChange={(event) => this.onChange(event)}/>
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
