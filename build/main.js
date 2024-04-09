"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//必要なパッケージをインポートする
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
//.envファイルを読み込む
dotenv_1.default.config();
//Botで使うGatewayIntents、partials
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel],
});
//Botがきちんと起動したか確認
client.once("ready", () => {
    console.log("Ready!!");
    if (client.user) {
        console.log(client.user.tag);
    }
});
/// Notionからadd
function addReference(title, url, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Client } = require("@notionhq/client");
        const notion = new Client({ auth: process.env.NOTION });
        try {
            const response = yield notion.pages.create({
                parent: { database_id: process.env.DBID },
                properties: {
                    Name: { title: [{ text: { content: title } }] },
                    URL: { url },
                    Tag: { multi_select: [{ name: tag }] },
                },
            });
            console.log("Success! Entry added.");
        }
        catch (error) {
            console.error(error);
        }
    });
}
/// Discordメッセージの処理
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.content.includes("!ref")) {
        let messageArray = message.content.split(",");
        yield addReference(messageArray[1], messageArray[2], message.author.displayName);
        message.channel.send("登録したよん👼\nhttps://www.notion.so/8d4b8fc1929a44e9b0016631dc635a0b?v=83fe71c4546d4c3b9e004e1c430d6888");
    }
    else {
        return;
    }
}));
//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
//# sourceMappingURL=main.js.map