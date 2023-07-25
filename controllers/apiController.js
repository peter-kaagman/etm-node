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
    console.log(data);
    const generalid = encodeURIComponent(data.generalid);
    const id = 0;
    const url= `${process.env.GRAPH_API_ENDPOINT}/v1.0/teams/${data.id}/channels/${generalid}/messages`;
    const card = {
        "title": "Bericht voor de gehele groep.",
        "subtitle": "<at id=\"0\">General</at>&nbsp;Hello there!",
        "text": data.message,
    };
    const message = {
        "subject": null,
        "body": {
            "contentType": "html",
            "content": "<attachment id=\""+guid+"\"></attachment>"
        },
        "attachments": [
            {
                "id": guid,
                "contentType": "application/vnd.microsoft.card.thumbnail",
                "contentUrl": null,
                "content": JSON.stringify(card),
                "name": null,
                "thumbnailUrl": null
            }
        ],
        
        "mentions": [
            {
                "id": id,
                "mentionText": 'General',
                "mentioned": {
                    "conversation": {
                        "id": generalid,
                        "displayName": 'General',
                        "conversationIdentityType": 'channel'
                    }
                }
            }
        ] 
            
    };
    try{
        const reply = await fetch.post(url, req.session.accessToken, message);
        res.json(reply);
    } catch (error){
        console.log("error sendmessage");
        console.log(error);
        res.json(error);
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
