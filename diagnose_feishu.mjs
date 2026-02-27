import dotenv from "dotenv";
dotenv.config();
import * as Lark from "@larksuiteoapi/node-sdk";

const appId = process.env.FEISHU_APP_ID;
const appSecret = process.env.FEISHU_APP_SECRET;

console.log(`[Diagnostic] Start diagnosing Feishu application: ${appId}`);

const client = new Lark.Client({
  appId,
  appSecret,
  domain: Lark.Domain.Feishu,
});

async function runDiagnostics() {
  try {
    console.log("1. Testing Authentication (Tenant Access Token)...");
    const tokenRes = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: appId,
        app_secret: appSecret,
      },
    });

    if (tokenRes.code !== 0) {
      console.error("❌ Authentication Failed!");
      console.error("Response:", tokenRes);
      return;
    }
    console.log("✅ Authentication Successful!");

    console.log("\n2. Fetching Bot Information...");
    const botInfo = await client.bot.v3.info.get();
    if (botInfo.code !== 0) {
      console.error("❌ Failed to fetch bot info.");
      console.error("Response:", botInfo);
    } else {
      console.log("✅ Bot Info retrieved successfully!");
      console.log(`   App Name: ${botInfo.bot?.app_name}`);
      console.log(`   Status: ${botInfo.bot?.status}`);
    }

    console.log("\n3. Testing WebSocket Connection...");
    const eventDispatcher = new Lark.EventDispatcher({
      encryptKey: "", // Testing without encrypt key first
    }).register({
      "im.message.receive_v1": async (data) => {
        console.log("🔔 [TEST] Received a message event via WebSocket!", data);
      },
    });

    const wsClient = new Lark.WSClient({
      appId,
      appSecret,
      domain: Lark.Domain.Feishu,
    });

    void wsClient.start({ eventDispatcher }).catch((error) => {
      console.error("❌ WebSocket client failed to start:", error);
      process.exit(1);
    });
    console.log(
      "✅ WebSocket client initialized and started. Waiting for 3 seconds to check for errors...",
    );

    // Keep alive to see if it throws any WebSocket errors
    setTimeout(() => {
      console.log(
        "\n[Diagnostic] Finished checking Feishu capabilities. If you see this, the long connection API is able to start.",
      );
      console.log(
        "\n⚠️ IMPORTANT: If WebSocket started successfully but you are NOT receiving messages in OpenClaw, the issues could be:",
      );
      console.log(
        "1. OpenClaw Gateway isn't running or channel is skipped (e.g., OPENCLAW_SKIP_CHANNELS=1)",
      );
      console.log(
        "2. Event 'im.message.receive_v1' was not added to the subscription list in Feishu Developer Portal",
      );
      console.log(
        "3. A specific version of the Feishu bot was not published after configuring Event Subscriptions",
      );
      process.exit(0);
    }, 3000);
  } catch (err) {
    console.error("❌ Exveption thrown during diagnostics:");
    console.error(err.message);
    if (err.response) {
      console.error("API Response Details:", err.response.data);
    }
    process.exit(1);
  }
}

void runDiagnostics();
