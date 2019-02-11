# datagib [[demo](https://datagib.fulcircle.io)]
### Search for Github commits in plain english

![datagib screenshot](https://www.fulcircle.io/images/datagib.png)

### Requirements 
---
1. docker-compose


### Running locally
---
1. Set your Github access key in `backend/datagib/datagib/settings/api_keys_default.py`.
 
2. The entire project can be run locally with docker out of the root directory with the following commands:
    ```
    docker-compose build
    docker-compose up
    ```

The frontend should be accessible at: `http://localhost:3000`
