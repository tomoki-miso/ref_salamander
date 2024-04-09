//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from "discord.js";
import dotenv from "dotenv";

//.envファイルを読み込む
dotenv.config();

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

//Botがきちんと起動したか確認
client.once("ready", () => {
  console.log("Ready!!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

/// Notionからget
async function getReference(): Promise<void> {
  const { Client } = require("@notionhq/client");
  const notion = new Client({
    auth: process.env.NOTION,
  });

  const response = await notion.databases.retrieve({
    database_id: process.env.DBID,
  });
  console.log(response);
}

/// Notionからadd
async function addReference(
  title: string,
  url: string,
  tag: string
): Promise<void> {
  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION });

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.DBID },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        URL: { url },
        Tag: { multi_select: [{ name: tag }] },
      },
    });

    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error);
  }
}

/// Discordメッセージの処理
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (message.content.includes("!ref")) {
    let messageArray: string[] = message.content.split(",");
    await addReference(
      messageArray[1],
      messageArray[2],
      message.author.displayName
    );
    message.channel.send("参照ウオ！");
  } else {
    return;
  }
});

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
