import {CommitData} from "../data/Commit.interface";
import {SearchParams} from "../data/SearchParams.interface";

export class Api {

    static async search(params:SearchParams): Promise<CommitData> {
        let response = await fetch('/api/search/commits',
            {method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)});

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        let json = await response.json();

        return json as CommitData;
    }
}