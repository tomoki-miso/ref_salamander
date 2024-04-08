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

//!timeと入力すると現在時刻を返信するように
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (message.content === "!time") {
    const date1 = new Date();
    message.channel.send(date1.toLocaleString());
  } else if (message.content.includes("!ref")) {
    message.channel.send("参照ウオ！");
  } else {
    return;
  }
});

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
