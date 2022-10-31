

/* Const importantes para o bot. */
const {default: makeWASocket, DisconnectReason,  MessageType, MessageOptions, Mimetype , useMultiFileAuthState ,fetchLatestBaileysVersion} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal');
const wiki = require('wikipedia')
const ttranslate = require('@vitalets/google-translate-api')
const thumb = fs.readFileSync(`./img/logo.jpg`)
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require("fetch").fetchUrl;
const { fetchJson } = require('./src/fetcher')
/* Fim */

/* Comeo das funes */
const start = async () => {
const {state,saveCreds} = await useMultiFileAuthState('./tutti.json')
const { version, isLatest } = await fetchLatestBaileysVersion();
const tutti = makeWASocket({
  version,
  printQRInTerminal: true,
  auth: state,

})

tutti.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  if(connection === 'close') {
    if((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
      start()
    } else {
      console.log('Tentando reconectar......')
    }
  }
  console.log('atualizando....', update)
})
/* Fim */
tutti.ev.on("creds.update", saveCreds);

tutti.ev.on('messages.upsert', async m => {
  const prefix = '/'
  const mek = m.messages[0]
  const pushname = mek.pushName ? mek.pushName : ""
  const from = mek.key.remoteJid
  const type = Object.keys(mek.message).find((key) => !['senderKeyDistributionMessage', 'messageContextInfo'].includes(key))
  const body = (type === 'conversation' &&
	mek.message.conversation.startsWith(prefix)) ?
	mek.message.conversation: (type == 'imageMessage') &&
	mek.message[type].caption.startsWith(prefix) ?
	mek.message[type].caption: (type == 'videoMessage') &&
	mek.message[type].caption.startsWith(prefix) ?
	mek.message[type].caption: (type == 'extendedTextMessage') &&
	mek.message[type].text.startsWith(prefix) ?
	mek.message[type].text: (type == 'listResponseMessage') &&
	mek.message[type].singleSelectReply.selectedRowId ?
	mek.message.listResponseMessage.singleSelectReply.selectedRowId: (type == 'templateButtonReplyMessage') ?
	mek.message.templateButtonReplyMessage.selectedId: (type === 'messageContextInfo') ?
	mek.message[type].singleSelectReply.selectedRowId: (type == 'tutti.sendMessageButtonMessage') &&
	mek.message[type].selectedButtonId ?
	mek.message[type].selectedButtonId: (type == 'stickerMessage') && ((mek.message[type].fileSha256.toString('base64')) !== null && (mek.message[type].fileSha256.toString('base64')) !== undefined) ? (mek.message[type].fileSha256.toString('base64')): ""
	budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
  const comando = body.slice(1).trim().split(/ +/).shift().toLowerCase()
  const args = body.trim().split(/ +/).slice(1)
  const enviar = (async (msg) =>{
		tutti.sendMessage(from,{ text: msg },{quoted:mek})
	})
  const enviarmod = (async (msg, ms1)=>{
    tutti.sendMessage(from,{ text: msg },{quoted:{
      key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },
      message: {
        groupInviteMessage: {
          groupJid: "6288213840883-1616169743@g.us",
          inviteCode: "Lula",
          groupName: "Ereke",
          caption: ms1,
          jpegThumbnail: thumb,
        },
      },
    }})
  })
  const enviarmod2 = (async (msg, ms1)=>{
    tutti.sendMessage(from,{ text: msg }, {quoted: {
      key: { participant: "0@s.whatsapp.net" },
      message: { documentMessage: { title: 'fake', jpegThumbnail: thumb } },
    }})})
  

  const menu = (pushname) => {
		return `╭────┈ 
┃│┊Tutti Bot
┃│╭────────
┃││ Prefixo: /
╰─────────────────
╭┈─────Infomação
╰─➤ Bot sendo feito.

─────────────────`
}

  switch (comando) {
    case 'menu':
      tutti.sendMessage(from, { react: { text: '🦧', key: mek.key }})
      const templateMessage = {
				text: menu(pushname),footer: `Ola ${pushname}`,
				templateButtons: [
					{index: 1, urlButton: {displayText: 'teste', url: 'https://wa.link/su6b56'}},
					{index: 3, quickReplyButton: {displayText: 'Números Br', id: '/br'}},
				  ]
				  
				}
				 tutti.sendMessage(from, templateMessage, {quoted:mek})
    break
    case 'wikipedia':
      tutti.sendMessage(from, { react: { text: '📖', key: mek.key }})
      if (args.length < 1) return enviar( `Ola, ${pushname}. Coloque um texto, Ex: /wikipedia lula`)
      var summa = await wiki.summary(`${args}`);
      ttranslate(JSON.stringify(summa.extract), {from: 'en', to: 'pt'}).then(res => {
          enviar(res.text)
      });
      break
   
        
       
			
      case'bucep':
      apu = await fetchJson(`https://brasilapi.com.br/api/cep/v1/40283270`)
      texta = `Cep: ${apu.cep}\n Estado: ${apu.state}\n Cidade: ${apu.city}\n Vizinhança: ${apu.neighborhood}\n  Rua: ${apu.street}`
      enviar(texta)
				break
      
    default:
      
      break;
  }
  
  

})
}
start()
