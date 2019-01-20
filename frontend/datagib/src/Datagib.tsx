import React, {ChangeEvent, Component} from 'react';
export var nlp = require('compromise');
import './Datagib.scss';


type State = {
    results: Array<string>,
    value: string,
    typing: boolean,
    typingTimeout: any


}
class Datagib extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {results: [], value: "", typing: false, typingTimeout: 0};

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

    dispatchSearch(oldText: string, newText:string) {
        if (newText === null || newText === "") {
            this.setState({value: newText, results: []})

        } else if (oldText === "" || oldText === null || oldText !== newText) {
            this.setState({value: newText, results: ["RESULT", "RESULT", "RESULT", "RESULT"]});
        }
    }


    render() {

        let resultElements = this.state.results.map((result: string, idx: number) => {
            return <div className="result" key={idx}>
                result
            </div>
        });

        return (
            <div className="DatagibApp">
                {/*{nlp('all commits with message containing hello').nouns().out('txt')}*/}
                <div className="datagib_container">
                    <div className="datagib_content">
                        <input className="query_box" value={this.state.value} onChange={(event) => this.onChange(event)}/>
                        {resultElements}
                    </div>
                </div>
            </div>
        );
    }
}

export default Datagib;
