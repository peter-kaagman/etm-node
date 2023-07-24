const asyncHandler = require("express-async-handler");
const async = require("async");
const { v4: uuidv4} = require('uuid');
var { GRAPH_ME_ENDPOINT } = require('../authConfig');
var fetch = require('../fetch');
require('dotenv').config();



exports.reloadTeams = asyncHandler(async (req, res, next) => {
    try {
        const teams = await fetch.get(
            `${GRAPH_ME_ENDPOINT}/joinedteams?\$select=id,displayName,description,isArchived`, 
            req.session.accessToken
        );
        for (let key in teams.value) {
                const channels = await fetch.get(
                    `${process.env.GRAPH_API_ENDPOINT}v1.0/teams/${teams.value[key].id}/channels?$select=id,displayName,description`,
                    req.session.accessToken
                );
                teams.value[key].channels = channels.value;
                // This is actually groups functionallity
                let role = 'member';
                const owners = await fetch.get(                    
                    `${process.env.GRAPH_API_ENDPOINT}v1.0/groups/${teams.value[key].id}/owners?$select=userPrincipalName`,
                    req.session.accessToken
                );
                for (let key in owners.value){
                    if (owners.value[key].userPrincipalName == req.session.account.username) {
                        role = 'owner';
                    }
                }
                teams.value[key].role = role;
        }
        res.json(teams);
    } catch (error) {
        console.log("error joined teams");
        console.log(error);
        next(error);
    }
});

// Send a message to a channel
exports.sendMessage = asyncHandler(async(req,res,next) =>{
    console.log('sendMessage');
    const data = req.body;
    const guid = uuidv4();
    // data.id => team id
    // data.generalid => chennel id
    //console.log(data);
    const generalid = encodeURIComponent(data.generalid);
    const url= `${process.env.GRAPH_API_ENDPOINT}/v1.0/teams/${data.id}/channels/${generalid}/messages`;
        const card = {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "TextBlock",
                    "id": guid,
                    "text": "Hello World",
                    "wrap": true
                }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.0",
            "padding": "None"
        };
        const message = {
            subject: null,
            body: {
                contentType: 'application/vnd.microsoft.card.thumbnail',
                content: `<attachment id=\"${guid}\"></attachment>`
            },
            attachments: [
                {
                    id: '74d20c7f34aa4a7fb74e2b30004247c5',
                    contentType: 'application/vnd.microsoft.card.thumbnail',
                    contentUrl: null,
                    content: card,
                    name: null,
                    thumbnailUrl: null
                }
            ]       
        };
    try{
        const reply = await fetch.post(url, req.session.accessToken, message);
    } catch (error){
        console.log("error sendmessage");
        console.log(error);
        next(error);
    }

  });

// Send notAuthorized
exports.notAuthorized = asyncHandler(async(req,res,next) =>{
    let message = {
        "_rc": "401",
        "_message": "Not authorized to use API"
    };
    res.json(message);
});
