//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                                                                            //
//                                                             GAAJU-X𝐌𝐃 𝐁𝐎𝐓                                                                         //
//                                                                                                                                                            //
//                                                                  𝐕 : 1.0.0                                                                                 //
//                                                                                                                                                            //
//                                                                                                                                                            //
//                ██╗    ██╗ █████╗ ██╗     ██╗  ██╗   ██╗   ██╗ █████╗ ██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗      ███╗   ███╗██████╗                    //
//                ██║    ██║██╔══██╗██║     ██║  ╚██╗ ██╔╝   ██║██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝██╔════╝██║  ██║      ████╗ ████║██╔══██╗                   //
//                ██║ █╗ ██║███████║██║     ██║   ╚████╔╝    ██║███████║ ╚████╔╝    ██║   █████╗  ██║     ███████║█████╗██╔████╔██║██║  ██║                   //
//                ██║███╗██║██╔══██║██║     ██║    ╚██╔╝██   ██║██╔══██║  ╚██╔╝     ██║   ██╔══╝  ██║     ██╔══██║╚════╝██║╚██╔╝██║██║  ██║                   //
//                ╚███╔███╔╝██║  ██║███████╗███████╗██║ ╚█████╔╝██║  ██║   ██║      ██║   ███████╗╚██████╗██║  ██║      ██║ ╚═╝ ██║██████╔╝                   //
//                 ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝      ╚═╝     ╚═╝╚═════╝                    //
//                                                                                                                                                            //
//                                                                 𝐂𝐎𝐏𝐘𝐑𝐈𝐆𝐇𝐓 2026                                                                            //
//                                                                                                                                                            //
//                                                                                                                                                            //
//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//* 
//  * project_name : GAAJU-XMD
//  * author : Xchristech
//  * youtube : https://www.youtube.com/Xchristech
//  * description : GAAJU-XMD ,A Multi-Device whatsapp user bot.
//*
//*
//re-upload? recode? copy code? give credit to wallyjaytech 2026:)
//Instagram: Xchristech
//Telegram: t.me/Official_ChrisGaaju
//GitHub: Xchristech2 
//WhatsApp: +2348069675806
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@Xchristech
//   * Created By Github: Xchristech2.
//   * Credit To Chris Gaaju 
//   * © 2026 GAAJU-XMD.
// ⛥┌┤
// */
require('dotenv').config();
const settings = {
  packname: 'TAHA-XMD',
  author: '‎TAHA KHAN',
  botName: "TAHA-XMD",
  botOwner: 'TAHA KHAN', 
  timezone: 'Asia/Karachi',
  prefix: '.',
  ownerNumber: '92347471404', //Set your number here without + symbol, just add country code & number without any space
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "TAHA-XMD ,A Multi-Device whatsapp user bot",
  version: "1.0.0",
  updateZipUrl: "https://github.com/Xchristech2/TAHA-MD/archive/refs/heads/main.zip",
  removeBgApi: {
    enabled: true,
    apiKey: "dyrbNSNtMf1CE84he61DR7Wx", // Your remove.bg API key That's currently mine it expire anytime remember to put yours if expired just go to remove.bg site sign up and get your api key 
    apiUrl: "https://api.remove.bg/v1.0/removebg"
  }
};

global.sessionid = process.env.SESSION_ID || "GAAJU-MD:eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0FtcE5MUUM5RklIbUV1Y2tSV2JENHhLR2kwUHZvcEdWVGxvQlFNRWdYcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0JzZUMwZ0ZUQVVONkxCZDR0NnFRMkFyYnVsY0U5MnJLSGxVQ1lINXNnWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPUGtVZjFBcEFkQzdiYklxQ1lMcmlpR0tORlBycTlaczZaR010dzlhVlVFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0VGZHbXlUeTFJWlV6bndMb0NiSW81bjlNQVRSMjY2S0t0VXRYV1MyMkRBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlQRHppOFRkYTlGNjJKWjZrSmxyTEdiS0I5VFhTTFB5d1lDUnlka1NvbmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikg2Y1laQS9nUnhjVkljdlZoWlN3c0ZlRHNrNFNPVVVsMG1TendmSTZtVE09In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUJ4YXAxaUxBL3BOM29jQVlLcjhQVmdYTTVRYlFSQldtZ2pkVE5kQlAxVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN3VuSDdSUzdETEZ5WFhudnllTHMwRVdzSXFXaDR0MWxYVHRsSlVhcnVGQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1MNUswczl1dm9acUZaWGZha2cwTlZnbThXRUc0c3FoT2MxanI3eU5HNUZEaGh6WWhwbnJQTnJ4MUdMT3NRbW9ST2ZwVmZ3L0d1WDh2MW43T1dKTUJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTQsImFkdlNlY3JldEtleSI6IkY0elFDR1grV2cvYUNiRnpabCtuSWx1NHJvckVPek0xSkwrbW5mSTluSlU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMiwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMyLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IlVHUEdSRk5XIiwibWUiOnsiaWQiOiI5MjMyOTE0ODkwNTU6MThAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiSSdtIG5vdCB5b3VyIiwibGlkIjoiMTQ2NjY5NjA5OTkyMjY4OjE4QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3kycWVzREVNbm9wZElHR0FNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiTFFQYXN6dnpTMFBBNnhoNG56WThqV2xQU0hlYnFMMnYxUExiZVVuMDJVRT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiQXZwQWc0Z1JVcnRTL3FwblNia0o2TGs3b2pqVUZnRDR3aXIvY0xBS1Z2WnJBaU4yb1JQUHV4djIxZmZHUXVZSlBCVXp0eHRqT0daaEY3aWtTRlUrQmc9PSIsImRldmljZVNpZ25hdHVyZSI6IngxaU44OWxrVDY3NXBDUTlXWEhLSUJyQ1htNEk2MFR4a3JMcmEzMTM0M3E3VG50Vy9qYml0bkZxMnRORDlRbjhkZjFUN1o2clgveTUyQ1F0Ui9sMkJ3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzMjkxNDg5MDU1OjE4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlMwRDJyTTc4MHREd09zWWVKODJQSTFwVDBoM202aTlyOVR5MjNsSjlObEIifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElFZ2dDIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc4MzE5ODgwNCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMOHcifQ==";
module.exports = settings;
