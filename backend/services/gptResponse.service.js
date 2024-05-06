const { OpenAI } = require('openai');
const User = require('../database/user.model');
const jwt = require('jsonwebtoken')
require("dotenv").config();

const followPoints = `Follow these points: When interacting with fans, focus on building emotional connections and enhancing their experience. Highlight the effort and time the creator invests in their content, fostering appreciation and support. Always respect the fan's preferences and be mindful of their financial circumstances, avoiding direct pressure to purchase. Instead, subtly introduce value-oriented options that support the creator, ensuring the conversation remains respectful and engaging.`

const wordNotuse = `Word not to use : abduct, abducted, abducting, abduction, admireme, animal, asphyxia, asphyxiate, asphyxiation, asphyxicate, asphyxication, bait, ballbusting, bareback, Bestiality, blacked, blackmail, bleeding, blood, bloodplay, Bukkake, caned, caning, Cannibal, Cashapp, cbt, cervics, Cerviks, Cervix, child, chloroform, chloroformed, chloroforming, choke, choking, coma, comatose, Consent, cp, cycle, diapers, dog, doze, drinking, Drunk, Drunken, eleven, enema, entrance, Escort, Escorting, fancentro, fanfuck, Farm, Fecal, Fetal, fisted, fisting, flogging, foetal, Forced, Forcedbi, Forceful, Forcing, Fuckfan, gangbang, gangbangs, gaping, golden, hardsports, hooker, Hypno, Hypnotize, Hypnotized, Hypnotizing, Inbreed. Inbreeded, Inbreeding, Incapacitate, Incapacitation, Incest, Intox, Inzest, Jail, Jailbait, kidnap, kidnapped, kidnapping, knock, knocked, lactate, Lactation, lolicon, lolita, manyvids, medicalplay, menstrate, menstrual, menstruate, menstruating, menstruation, Meet, Molest, Molested, Molesting, mutilate, mutilation,, paddling, paralyzed, passed, paypal, pee, Peeplay, Pegging, Piss, Pissing, Poo, Poop, Preteen, Prostituted, Prostituting, Prostitution, Pse, scat, showers, Skat, Snuff, Strangled, Strangling, Strangulation, Suffocate, Suffocation, Teen, Toilet, Toiletslave, Toiletslavery, Torture, tortured, trance, twelve, unconscious, unconsciousness, Unwilling, Venmo, Vomit, vomitted, vomitting, watersports, whipping, young,Zoophilia,Abduction, Abduct, Abducting, Abducted, Animal, Admireme, Asphyxiation, Asphyxiated, Asphyxiate, Asphyxiating, Ballbusting, Bait, Bareback, Blackmail, Beastiality, Bleeding, Blood, Bloodplay, Blooded, Blacked, Bukkake, Bestaility, Canned, Canning, CBT, Cashapp, Cannibal, Cervix, Cervicks, Comatose, Coma, Child, Chocked, Choke, Choking, Chokes, Chloroform, Chloroformed, Chloroforming, Cycle, CP, Consent, Drink, Drinking, Drunken, Drunk, Diapers, Doze, Dog, Eleven, Entrance, Escort, Escorted, Escorting, Enema, Fuckfan, Fanfucked, Fecal, Facentro, Foetal, Fisted, Fist, Fisting, Farm, Flogging, Forcing, Force, Forced, Forcing, Forceful, Forcedbi, Fifteen, Gaping, Golden, Gangbang, Gangbanging, Gangbanged, Gangbangs, Hardsports, Hypno, Hypnotize, Hypnotization, Hypnotizing, Hypnotized, Hooker, Inbreed, Inbreeding, Incapacitation, Incapacitate, Inzest, Incest, Intox, Jail, Jailed, Jailbait, Kidnap, Kidnapped, Kidnapping, Kidnapper, Knocked, Knock, Knocking, Lactation, Lactating, Lactate, Lolicon, Lalita, Menstruate, Menstruating, Menstruation, Menstrual, Manyvids, Medical play, Molested, Molesting, Molest, Meet, Mutilated, Mutilate, Mutilating, Mutilation, Necrophilia, Nigger, Paralyze, Paralyzed, Paralyzation, Pee, Peeplay, Pissed, Poo, Pissing, Piss, Poop, Pooped, Pooping, Pegging, Paddling, Paypal, Passed, Prostitution, Prostitute, Prostituting, Pse,  Preteen, Pre-scat, Rapped, Rapping, Rape, Rapist, Restricted, Snuff, Showers, Skat, Strangle, Strangling, Strangled, Suffocate, Suffocation, Suffocated, Teen, Toilet, Torture, Toilet slave, Toilet slavery, Torturing, Tortured, Trance, Twelve, Unconsciousness, Unconscious, Unwilling, Underage, Vomit, Vomited, Vomiting, Vomino, Venmo, Whipped, Whipping, Watersports, Young, Zoophilia.`

const creatorDetail = `List of informations about the creator:
Name: Mandy Hekkins.
Relationship: Single.
What kind of content the creator often deals in with fans: Pictures, Videos,
How the creator wants to be their communication with the fans: Soft and Teasing, Naughty, Hardcore,
What are the sort of things the creator sells : Sextape, Toys,Where does the creator work/study brooklyn,Additional information provided by the creator: Keep the messages very short`

const shortPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful response. Keep the response short and quirky.You must not include any reference to the speaker in your response like 'Fan:' or 'You:' or ‘Creator’. You must keep the response in first person.
${followPoints}
${wordNotuse}
${creatorDetail}`

const longPrompt = ` Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful message. Your goal is to try to seduce the fans through the art of sexting and make the users feel horny. You can use some erotic words to achive your goal. You must not include any reference to your response like 'client:' or 'user:'. Keep the messages short and quirky.
${followPoints}
${wordNotuse}
${creatorDetail}`

const textingPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful response. Keep the response short and quirky.You must not include any reference to the speaker in your response like 'Fan:' or 'You:' or ‘Creator’. You must keep the response in first person.
${followPoints}
${wordNotuse}
${creatorDetail}`

const ppvPrompt = `Act like an OnlyFans model who is directly chatting with her fan.Generate a short and meaningful response.Your response should be such that the fan will be indulge to buy a pay - per - view(PPV) from your.Your goal is to sell the fan a PPV, you must try to seduce the user if need be.You must not include any reference to the speaker in your response like 'Fan:' or 'You:', keep the response in first person.Keep the messages short and quirky.
${followPoints}
${wordNotuse}
${creatorDetail}`

const questionPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful message. Your task is to hit up a conversation with an inactive or dormant Fan. It may be a question or a spicy message. You must not include any reference to the speaker in your response like 'Fan:' or 'You:', keep the response in first person. Keep the messages short and quirky.
${followPoints}
${wordNotuse}
${creatorDetail}`

const sextingPrompt = `Act like an OnlyFans model who is directly chatting with her fan. Generate a short and meaningful message. Your goal is to try to seduce the fans through the art of sexting and make the users feel horny. You can use some erotic words to achive your goal. You must not include any reference to your response like 'client:' or 'user:'. Keep the messages short and quirky. \n"+
${followPoints}
${wordNotuse}
${creatorDetail}`

const useCredits = async (token, service) => {
    try {
        const verifyToken = jwt.verify(token, 'secretKey')
        const user_id = verifyToken.userId
        const user = await User.findOne({ _id: user_id });
        if (service === 'short-res' || service === 'long-res') {
            const amt = 1
            if (user.textMessagesLeft >= amt) {
                user.textMessagesLeft -= amt
                await user.save()
                return [1]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'texting') {
            const amt = 1
            if (user.textMessagesLeft >= amt) {
                user.textMessagesLeft -= amt
                await user.save()
                const prompt = user.texting_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'sexting') {
            const amt = 1
            if (user.textMessagesLeft >= amt) {
                user.textMessagesLeft -= amt
                await user.save()
                const prompt = user.sexting_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'question') {
            const amt = 1
            if (user.textMessagesLeft >= amt) {
                user.textMessagesLeft -= amt
                await user.save()
                const prompt = user.question_prompt
                return [1, prompt]
            }
            else
                return ("Your have not textmessages credits")
        }
        else if (service === 'ppv') {
            const amt = 1
            if (user.textMessagesLeft >= amt) {
                user.textMessagesLeft -= amt
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
    shortResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'short-res')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${shortPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    longResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'long-res')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${longPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    textingResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'texting')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${textingPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    ppvResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'ppv')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${ppvPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    questionResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'question')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${questionPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    sextingResponse: async (token, prompt) => {
        const flag = await useCredits(token, 'sexting')
        if (flag[0] === 1) {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            try {
                let newprompt = {
                    role: 'user',
                    content: `${sextingPrompt}  ${prompt}`
                }
                const response = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [newprompt],
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

    updatePrompts: async (jwtToken, prompts, isEmoji) => {
        try {
            if (isEmoji === "yes") {
                isEmoji = true;
            } else {
                eisEmojimoji = false;
            }       
            const verifyToken = jwt.verify(jwtToken, 'secretKey')
            const user_id = verifyToken.userId
            const user = await User.findOne({ _id: user_id });
            user.texting_prompt = prompts.texting,
                user.sexting_prompt = prompts.sexting,
                user.ppv_prompt = prompts.ppv,
                user.question_prompt = prompts.question
            user.isEmoji = isEmoji
            await user.save()
        }
        catch (e) {
            return -1
        }
    }
}

module.exports = gptResponse