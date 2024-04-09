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
    message.channel.send(
      "登録したよん👼\nhttps://www.notion.so/8d4b8fc1929a44e9b0016631dc635a0b?v=83fe71c4546d4c3b9e004e1c430d6888"
    );
  } else {
    return;
  }
});

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
