const asyncHandler = require("express-async-handler");
const async = require("async");
var { GRAPH_ME_ENDPOINT } = require('../authConfig');
var fetch = require('../fetch');
require('dotenv').config();



exports.reloadTeams = asyncHandler(async (req, res, next) => {
    try {
        const teams = await fetch(
            `${GRAPH_ME_ENDPOINT}/joinedteams?\$select=id,displayName,description,isArchived`, 
            req.session.accessToken
        );
        for (let key in teams.value) {
            console.log(`${teams.value[key].id} => ${teams.value[key].displayName}`);
            // Get channels for teams
            try {
                const channels = await fetch(
                    `${process.env.GRAPH_API_ENDPOINT}v1.0/teams/${teams.value[key].id}/channels?$select=id,displayName,description`,
                    req.session.accessToken
                );
                //console.log(channels.value);
                teams.value[key].channels = channels.value;
            } catch (error){
                console.log('error getting channels');
                console.log(error);
                res.json(error);
            }
            // Get role in team
            try {
                // This is actually groups functionallity
                const owners = await fetch(                    
                    `${process.env.GRAPH_API_ENDPOINT}v1.0/groups/${teams.value[key].id}/owners?$select=id,displayName,userPrincipalName`,
                    req.session.accessToken
                );
                console.log(owners.value);
            } catch (error){
                console.log('error getting role');
                console.log(error);
                res.json(error);
            }
        }
        console.log(teams);
        res.json(teams);
    } catch (error) {
        console.log("error joined teams");
        console.log(error);
        res.json(error);
    }
});


