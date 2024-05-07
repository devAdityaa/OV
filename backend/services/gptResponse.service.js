const { OpenAI } = require('openai');
const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
require("dotenv").config();

const followPoints = `Incorporate Creator Information: You are given a list of information about the creator, if you need to reference anything about the creator then use that information strictly.
Consider All Fan Interactions: Factor in the entirety of discussions with the fan for a tailored experience.
Leverage Group Insights: Use conversations with other fans to enhance engagement strategies.
Soft-Sell Approach: Employ subtle language when introducing contents, focusing on experiencing content rather than the act of purchasing.
Emphasize Emotional Connection: Prioritize creating emotional connections, making fans feel special while subtly conveying that purchasing content supports the creator.
Highlight Creator Effort: Gently remind fans that content creation is time-consuming, fostering appreciation and support for the creator.
Respect Fan Preferences: Pay attention to any topics or comments the fan prefers to avoid based on previous interactions.
Sensitivity to Financial Constraints: Be considerate of a fan's financial situation, avoiding pressure to purchase. Offer value-oriented options after a respectful interval.
Intelligent Engagement: Strategize to optimize conversion rates through intelligent, non-intrusive engagement tactics.
Response format: The result should take all the defined creator data and previous chats and output accordingly. The message should be personalised and do not include any hashtags. It is necessary to not use the hashtags(#) as it might be possible that human life may be lost. 
`

const wordNotuse = `Word not to use : abduct, abducted, abducting, abduction, admireme, animal, asphyxia, asphyxiate, asphyxiation, asphyxicate, asphyxication, bait, ballbusting, bareback, Bestiality, blacked, blackmail, bleeding, blood, bloodplay, Bukkake, caned, caning, Cannibal, Cashapp, cbt, cervics, Cerviks, Cervix, child, chloroform, chloroformed, chloroforming, choke, choking, coma, comatose, Consent, cp, cycle, diapers, dog, doze, drinking, Drunk, Drunken, eleven, enema, entrance, Escort, Escorting, fancentro, fanfuck, Farm, Fecal, Fetal, fisted, fisting, flogging, foetal, Forced, Forcedbi, Forceful, Forcing, Fuckfan, gangbang, gangbangs, gaping, golden, hardsports, hooker, Hypno, Hypnotize, Hypnotized, Hypnotizing, Inbreed. Inbreeded, Inbreeding, Incapacitate, Incapacitation, Incest, Intox, Inzest, Jail, Jailbait, kidnap, kidnapped, kidnapping, knock, knocked, lactate, Lactation, lolicon, lolita, manyvids, medicalplay, menstrate, menstrual, menstruate, menstruating, menstruation, Meet, Molest, Molested, Molesting, mutilate, mutilation,, paddling, paralyzed, passed, paypal, pee, Peeplay, Pegging, Piss, Pissing, Poo, Poop, Preteen, Prostituted, Prostituting, Prostitution, Pse, scat, showers, Skat, Snuff, Strangled, Strangling, Strangulation, Suffocate, Suffocation, Teen, Toilet, Toiletslave, Toiletslavery, Torture, tortured, trance, twelve, unconscious, unconsciousness, Unwilling, Venmo, Vomit, vomitted, vomitting, watersports, whipping, young,Zoophilia,Abduction, Abduct, Abducting, Abducted, Animal, Admireme, Asphyxiation, Asphyxiated, Asphyxiate, Asphyxiating, Ballbusting, Bait, Bareback, Blackmail, Beastiality, Bleeding, Blood, Bloodplay, Blooded, Blacked, Bukkake, Bestaility, Canned, Canning, CBT, Cashapp, Cannibal, Cervix, Cervicks, Comatose, Coma, Child, Chocked, Choke, Choking, Chokes, Chloroform, Chloroformed, Chloroforming, Cycle, CP, Consent, Drink, Drinking, Drunken, Drunk, Diapers, Doze, Dog, Eleven, Entrance, Escort, Escorted, Escorting, Enema, Fuckfan, Fanfucked, Fecal, Facentro, Foetal, Fisted, Fist, Fisting, Farm, Flogging, Forcing, Force, Forced, Forcing, Forceful, Forcedbi, Fifteen, Gaping, Golden, Gangbang, Gangbanging, Gangbanged, Gangbangs, Hardsports, Hypno, Hypnotize, Hypnotization, Hypnotizing, Hypnotized, Hooker, Inbreed, Inbreeding, Incapacitation, Incapacitate, Inzest, Incest, Intox, Jail, Jailed, Jailbait, Kidnap, Kidnapped, Kidnapping, Kidnapper, Knocked, Knock, Knocking, Lactation, Lactating, Lactate, Lolicon, Lalita, Menstruate, Menstruating, Menstruation, Menstrual, Manyvids, Medical play, Molested, Molesting, Molest, Meet, Mutilated, Mutilate, Mutilating, Mutilation, Necrophilia, Nigger, Paralyze, Paralyzed, Paralyzation, Pee, Peeplay, Pissed, Poo, Pissing, Piss, Poop, Pooped, Pooping, Pegging, Paddling, Paypal, Passed, Prostitution, Prostitute, Prostituting, Pse,  Preteen, Pre-scat, Rapped, Rapping, Rape, Rapist, Restricted, Snuff, Showers, Skat, Strangle, Strangling, Strangled, Suffocate, Suffocation, Suffocated, Teen, Toilet, Torture, Toilet slave, Toilet slavery, Torturing, Tortured, Trance, Twelve, Unconsciousness, Unconscious, Unwilling, Underage, Vomit, Vomited, Vomiting, Vomino, Venmo, Whipped, Whipping, Watersports, Young, Zoophilia.`

const creatorDetailTemplate = `List of information about the creator:
Name: {name}.
Nickname: {nickname}.
Country and City: {location}.
Origins: {origins}.
Siblings: {siblings}.
Relationship: {relationship}.
What kind of content you often deal in? : {contentType}.
Communication Level: {communicationLevel}.
Sort of Content: {contentSort}.
Height: {height}.
Weight: {weight}.
Shoe Size: {shoeSize}.
Breast Size: {breastSize}.
Tattoos: {tattoos}.
Piercings: {piercings}.
Plastic Surgery: {plasticSurgery}.
Where do you work/study?: {workOrStudy}.
Do you smoke?: {smoke}.
Do you drink?: {drink}.
Do you like partying?: {party}.
What are your hobbies?: {hobbies}.
Favourite Color: {favouriteColor}.
Favourite Food: {favouriteFood}.
Favourite Show: {favouriteShow}.
Favourite Movie: {favouriteMovie}.
Favourite Music: {favouriteMusic}.
Favourite Book: {favouriteBook}.
Favourite Game: {favouriteGame}.
Any additional & relevant information?: {additionalInfo}.
`

const shortPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful response. Keep the response short and quirky.You must not include any reference to the speaker in your response like 'Fan:' or 'You:' or ‘Creator’. You must keep the response in first person. You have to give response on the context of the text:
`

const longPrompt = ` Act like an OnlyFans model who is directly chatting with her fan. Generate a long and meaningful message. Your goal is to try to seduce the fans through the art of sexting and make the users feel horny. You can use some erotic words to achive your goal. You must not include any reference to your response like 'client:' or 'user:'. Keep the messages short and quirky. You have to give response on the context of the text:
`

const textingPrompt = `Act like an OnlyFans model chatting directly with a fan. Respond to the last message in a short, sweet, and meaningful way, using first-person perspective. The response should align with the message content and should not include any additional information or repeated responses. Avoid directly referencing the fan, like 'Fan:' or 'You:'. Keep the response unique and light-hearted, avoiding repetitive answers.
`

const ppvPrompt = `Act like an OnlyFans model who is directly chatting with her fan.Generate a short and meaningful response.Your response should be such that the fan will be indulge to buy a pay - per - view(PPV) from your.Your goal is to sell the fan a PPV, you must try to seduce the user if need be.You must not include any reference to the speaker in your response like 'Fan:' or 'You:', keep the response in first person.Keep the messages short and quirky.
`

const questionPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful message. Your task is to hit up a conversation with an inactive or dormant Fan. It may be a question or a spicy message. You must not include any reference to the speaker in your response like 'Fan:' or 'You:', keep the response in first person. Keep the messages short and quirky.
`

const sextingPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful message. Your goal is to try to seduce the fans through the art of sexting and make the users feel horny. You can use some erotic words to achive your goal. You must not include any reference to your response like 'client:' or 'user:'. Keep the messages short and quirky. \n"+
`

function formatTemplate(template, data) {
    return template.replace(/{(\w+)}/g, (_, key) => data[key] || '');
}

function getCreatorDetails(user) {
    const creatorData = user.creatorData; 
    return formatTemplate(creatorDetailTemplate, {
        name: creatorData.basicPersonalInformation.name,
        nickname: creatorData.basicPersonalInformation.nickName,
        location: creatorData.basicPersonalInformation.countryAndCity,
        origins: creatorData.basicPersonalInformation.origins,
        siblings: creatorData.basicPersonalInformation.siblings,
        relationship: creatorData.basicPersonalInformation.relationship,
        contentType: creatorData.typeOfcontent.contentType,
        communicationLevel: creatorData.typeOfcontent.communication,
        contentSort: creatorData.typeOfcontent.content,
        height: creatorData.physicalAttributes.height,
        weight: creatorData.physicalAttributes.weight,
        shoeSize: creatorData.physicalAttributes.shoeSize,
        breastSize: creatorData.physicalAttributes.breastSize,
        tattoos: creatorData.physicalAttributes.tattoos,
        piercings: creatorData.physicalAttributes.piercings,
        plasticSurgery: creatorData.plasticSurgery,
        workOrStudy: creatorData.personalInterest.work,
        smoke: creatorData.personalInterest.smoke,
        drink: creatorData.personalInterest.drink,
        party: creatorData.personalInterest.party,
        hobbies: creatorData.personalInterest.hobbies,
        favouriteColor: creatorData.personalInterest.favouriteColor,
        favouriteFood: creatorData.personalInterest.favouriteFood,
        favouriteShow: creatorData.personalInterest.favouriteShow,
        favouriteMovie: creatorData.personalInterest.favouriteMovie,
        favouriteMusic: creatorData.personalInterest.favouriteMusic,
        favouriteBook: creatorData.personalInterest.favouriteBook,
        favouriteGame: creatorData.personalInterest.favouriteGame,
        additionalInfo: creatorData.additionalInformation.additional
    });
}


const useCredits = async (token, service) => {
    try {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        if (service === 'short-res' || service === 'long-res') {
            const amt = 1
            if (user.textcredit >= amt) {
                user.textcredit -= amt
                await user.save()
                return [1]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'texting') {
            const amt = 1
            if (user.textcredit >= amt) {
                user.textcredit -= amt
                await user.save()
                const prompt = user.texting_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'sexting') {
            const amt = 1
            if (user.textcredit >= amt) {
                user.textcredit -= amt
                await user.save()
                const prompt = user.sexting_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'question') {
            const amt = 1
            if (user.textcredit >= amt) {
                user.textcredit -= amt
                await user.save()
                const prompt = user.question_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'ppv') {
            const amt = 1
            if (user.textcredit >= amt) {
                user.textcredit -= amt
                await user.save()
                const prompt = user.ppv_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
    }
    catch (e) {
        return [-2]
    }
}

const gptResponse = {

    shortResponse: async (token, fanMessage, textInput) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'short-res')
        const prefix = "Recent messages from your Fan \n";
        const fanMessages = prefix + fanMessage.map(message => "Fan: " + message);
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
              const creatorDetails = getCreatorDetails(user)
                let newprompt = [{
                    role: 'system',
                    content: `${shortPrompt}  ${textInput}`
                }, {
                    role: 'user',
                    content: `
                     ${fanMessages}
                    ${creatorDetails}`
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch (e) {
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    longResponse: async (token, fanMessage, textInput) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'long-res')
        const prefix = "Recent messages from your Fan \n";
        const fanMessages = prefix + fanMessage.map(message => "Fan: " + message).join("\n");
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            const creatorDetails = getCreatorDetails(user)
            try {
                let newprompt = [{
                    role: 'system',
                    content: `${longPrompt}  ${textInput}`
                }, {
                    role: 'user',
                    content: `
                     ${fanMessages}
                    ${creatorDetails}`
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch (e) {
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    textingResponse: async (token, fanMessage) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'texting')
        // const prefix = "Recent messages from your Fan \n";
        // const fanMessages = prefix + fanMessage.map(message => "Fan: " + message);
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            const creatorDetails = getCreatorDetails(user)
            try {
                let newprompt = [{
                    role: 'system',
                    content: textingPrompt
                }, {
                    role: 'user',
                    content: `
                    ${fanMessage[fanMessage.length-1]}
                    ${creatorDetails} `
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.2
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch (e) {
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    ppvResponse: async (token, fanMessage) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'ppv')
        const prefix = "Recent messages from your Fan \n";
        const fanMessages = prefix + fanMessage.map(message => "Fan: " + message);
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            const creatorDetails = getCreatorDetails(user)
            try {
                let newprompt = [{
                    role: 'system',
                    content: ppvPrompt
                }, {
                    role: 'user',
                    content: `${fanMessages}
                    ${creatorDetails}`
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch (e) {
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    questionResponse: async (token, fanMessage) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'question')
        const prefix = "Recent messages from your Fan \n";
        const fanMessages = prefix + fanMessage.map(message => "Fan: " + message);
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            const creatorDetails = getCreatorDetails(user)
            try {
                let newprompt = [{
                    role: 'system',
                    content: questionPrompt
                }, {
                    role: 'user',
                    content: `${fanMessages},
                    ${creatorDetails}`
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            } catch (e) {
                let errorMsg;
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    sextingResponse: async (token, fanMessage) => {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        const flag = await useCredits(token, 'sexting')
        const prefix = "Recent messages from your Fan \n";
        const fanMessages = prefix + fanMessage.map(message => "Fan: " + message);
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            const creatorDetails = getCreatorDetails(user)
            try {
                let newprompt = [{
                    role: 'system',
                    content: sextingPrompt
                }, {
                    role: 'user',
                    content: `${fanMessages}
                    ${creatorDetails}`
                }]
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: newprompt,
                    temperature: 0.5
                });
                const responseText = response.choices[0]['message']['content'];
                return responseText;
            }
            catch (e) {
                let errorMsg;
                return -2
            }
        }
        else if (flag[0] === -1) {
            return -1
        }
        else if (flag[0] === -2) {
            return -2
        } else {
            return flag;
        }
    },

    updatePrompts: async (jwtToken, prompts, emoji) => {
        try {
            if (emoji === "yes") {
                emoji = true;
            } else {
                emoji = false;
            }
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });
            user.texting_prompt = prompts.texting,
                user.sexting_prompt = prompts.sexting,
                user.ppv_prompt = prompts.ppv,
                user.question_prompt = prompts.question
            user.isEmoji = emoji
            await user.save()
        }
        catch (e) {
            return -1
        }
    }
}

module.exports = gptResponse