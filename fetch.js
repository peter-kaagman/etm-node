/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var axios = require('axios');

/**
 * Attaches a given access token to a MS Graph API call
 * @param endpoint: REST API endpoint to call
 * @param accessToken: raw access token string
 */
exports.get = async function (endpoint, accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log(`request made to ${endpoint} at: ` + new Date().toString());

    try {
        const response = await axios.get(endpoint, options);
        return await response.data;
    } catch (error) {
        throw new Error(error);
    }
}

exports.post = async (endpoint, accessToken, body) => {
    console.log(body);
    axios.post(endpoint, body,
        /*
        {
            "body": {
                "content": "Dit is een test"
            }
        },
        */
        {
            "headers": {
                "Authorization": `Bearer ${accessToken}`,
                "content-type": "application/json"        
            }
        }
    )
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}
