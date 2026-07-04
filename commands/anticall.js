//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                                                                                                        //
//                                                             GAAJU-X𝐌𝐃 𝐁𝐎𝐓                                                                                                     //
//                                                                                                                                                                                        //
//                                                                  𝐕 : 1.0.0                                                                                                             //
//                                                                                                                                                                                        //
//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//* 
//  * project_name : GAAJU-XMD
//  * author : gaajutech
//  * youtube : https://www.youtube.com/Xchristech
//  * description : GAAJU-XMD ,A Multi-Device whatsapp user bot.
//*

/**
 * GAAJU-XMD - Anti-Call Command
 * Features: Audio/Video detection | Group call detection (incl. small groups) | DM fallback | Decline | Block | Warn
 */

const fs = require('fs');
const settings = require('../settings');

const ANTICALL_PATH = './data/anticall.json';
const CALL_WARN_PATH = './data/callWarnings.json';

const defaultConfig = {
    enabled: false,
    mode: 'decline',
    warnLimit: 3,
    message: `╭──❍「 *CALL DETECTED* 」❍\n├\n├• 👋 Hello @{caller}\n├• 📞 Your call was auto-declined\n├• 💬 Please send a text message\n├• 🤖 I'll respond when available\n├\n╰───★─☆─♪♪─❍\n\n╭──❍「 *GAAJU-XMD* 」❍\n╰───★─☆─♪♪─❍`
};

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363409838427367@newsletter',
            newsletterName: 'TAHA MD',
            serverMessageId: -1
        }
    }
};

// ═══════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════

function readState() {
    try {
        const configHash = JSON.stringify(defaultConfig);
        let data = { ...defaultConfig };
        let needsUpdate = false;
        if (fs.existsSync(ANTICALL_PATH)) {
            data = { ...defaultConfig, ...JSON.parse(fs.readFileSync(ANTICALL_PATH, 'utf8')) };
            if (data._hash !== configHash) needsUpdate = true;
        }
        if (!fs.existsSync(ANTICALL_PATH) || needsUpdate) {
            const dir = './data';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const preserved = { enabled: data.enabled, mode: data.mode, warnLimit: data.warnLimit };
            const updated = { ...defaultConfig, ...preserved, _version: settings.version || '1.0.0', _hash: configHash };
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify(updated, null, 2));
            return updated;
        }
        return data;
    } catch {
        const configHash = JSON.stringify(defaultConfig);
        const fallback = { ...defaultConfig, _version: settings.version || '1.0.0', _hash: configHash };
        try { fs.writeFileSync(ANTICALL_PATH, JSON.stringify(fallback, null, 2)); } catch (e) {}
        return fallback;
    }
}

function writeState(config) {
    try {
        const dir = './data';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const configHash = JSON.stringify(defaultConfig);
        fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ ...defaultConfig, ...config, _version: settings.version || '1.0.0', _hash: configHash }, null, 2));
    } catch (error) { console.error('❌ Error writing anticall config:', error); }
}

// ═══════════════════════════════════════
// CALL WARNING SYSTEM
// ═══════════════════════════════════════

function readWarnings() {
    try { if (fs.existsSync(CALL_WARN_PATH)) return JSON.parse(fs.readFileSync(CALL_WARN_PATH, 'utf8')); } catch (e) {}
    return {};
}

function writeWarnings(data) {
    try { const dir = './data'; if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(CALL_WARN_PATH, JSON.stringify(data, null, 2)); } catch (e) {}
}

function addCallWarning(callerJid) {
    const warnings = readWarnings();
    const caller = callerJid.split('@')[0];
    if (!warnings[caller]) warnings[caller] = { count: 0, lastCall: 0 };
    warnings[caller].count++;
    warnings[caller].lastCall = Date.now();
    writeWarnings(warnings);
    return warnings[caller].count;
}

function resetCallWarnings(callerJid) {
    const warnings = readWarnings();
    const caller = callerJid.split('@')[0];
    if (warnings[caller]) { delete warnings[caller]; writeWarnings(warnings); }
}

// ═══════════════════════════════════════
// MESSAGE BUILDERS
// ═══════════════════════════════════════

function buildDMMessage(callType, callerNumber, mode, warnCount, warnLimit) {
    const isVideo = callType === 'video';
    const typeLabel = isVideo ? 'VIDEO' : 'AUDIO';
    const typeIcon = isVideo ? '📹📞' : '🔉📞';
    const typeAction = isVideo ? '🎥 Your video call was auto-declined' : '📞 Your audio call was auto-declined';

    if (mode === 'block') {
        return `╭──❍「 *${typeLabel} CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├• ${typeAction}
├• 🚫 You are now *BLOCKED*
├• 🤖 Owner may unblock you later
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
    }
    if (mode === 'warn') {
        if (warnCount >= warnLimit) {
            return `╭──❍「 *${typeLabel} CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├• ${typeAction}
├• ⚠️ Warning *${warnCount}/${warnLimit}*
├• 🚫 You are now *BLOCKED*
├• 🤖 Owner may unblock you later
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
        }
        return `╭──❍「 *${typeLabel} CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├• ${typeAction}
├• ⚠️ Warning *${warnCount}/${warnLimit}*
├• 🚫 Blocked after ${warnLimit - warnCount} more call(s)
├• 💬 Please send a text message
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
    }
    return `╭──❍「 *${typeLabel} CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├• ${typeAction}
├• 💬 Please send a text message
├• 🤖 I'll respond when available
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
}

function buildGroupMessage(callType, callerNumber, mode, warnCount, warnLimit) {
    const isVideo = callType === 'video';
    const typeLabel = isVideo ? 'VIDEO' : 'AUDIO';
    const typeIcon = isVideo ? '📹📞' : '🔉📞';
    const typeAction = isVideo ? '🎥 Your video call was auto-declined' : '📞 Your call was auto-declined';

    if (mode === 'block') {
        return `╭──❍「 *${typeLabel} GROUP CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├
├• 🧑‍🧑‍🧒 Can't pick group calls for now
├• ${typeAction}
├• 🚫 You are now *BLOCKED*
├• 🤖 Owner may unblock you later
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
    }
    if (mode === 'warn') {
        if (warnCount >= warnLimit) {
            return `╭──❍「 *${typeLabel} GROUP CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├
├• 🧑‍🧑‍🧒 Can't pick group calls for now
├• ${typeAction}
├• ⚠️ Warning *${warnCount}/${warnLimit}*
├• 🚫 You are now *BLOCKED*
├• 🤖 Owner may unblock you later
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
        }
        return `╭──❍「 *${typeLabel} GROUP CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├
├• 🧑‍🧑‍🧒 Can't pick group calls for now
├• ${typeAction}
├• ⚠️ Warning *${warnCount}/${warnLimit}*
├• 🚫 Blocked after ${warnLimit - warnCount} more call(s)
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
    }
    return `╭──❍「 *${typeLabel} GROUP CALL DETECTED* 」❍
├
├•       ${typeIcon} .........................
├
├• 👋 Hello @${callerNumber}
├
├• 🧑‍🧑‍🧒 Can't pick group calls for now
├• ${typeAction}
├• 💬 Please send a text message
├• 🤖 I'll respond when available
├
╰───★─☆─♪♪─❍

╭──❍「 *GAAJU-XMD* 」❍
╰───★─☆─♪♪─❍`;
}

// ═══════════════════════════════════════
// COMMAND HANDLER
// ═══════════════════════════════════════

function getModeText(mode, warnLimit) {
    switch(mode) {
        case 'block': return '🚫 Block Immediately';
        case 'warn': return `⚠️ Warn & Block (${warnLimit} calls)`;
        default: return '📵 Decline Only';
    }
}

async function anticallCommand(sock, chatId, message, args) {
    try {
        const state = readState();
        const sub = (args || '').trim().toLowerCase();
        const parts = sub.split(' ');
        const action = parts[0];

        if (!action) {
            const status = state.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const statusIcon = state.enabled ? '🟢' : '🔴';
            await sock.sendMessage(chatId, {
                text: `📞 *ANTI-CALL SETTINGS*\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `${statusIcon} *Status:* ${status}\n` +
                      `⚙️ *Mode:* ${getModeText(state.mode, state.warnLimit)}\n` +
                      `🔢 *Warn Limit:* ${state.warnLimit} calls\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `📖 *Commands:*\n` +
                      `└ .anticall on - Enable anti-call\n` +
                      `└ .anticall off - Disable anti-call\n` +
                      `└ .anticall decline - Decline only\n` +
                      `└ .anticall block - Block immediately\n` +
                      `└ .anticall warn - Warn then block\n` +
                      `└ .anticall warncount <1-10> - Set warn limit\n` +
                      `└ .anticall message <text> - Custom message\n` +
                      `└ .anticall status - Show settings\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `💡 *Example:*\n` +
                      `└ .anticall warncount 5\n` +
                      `└ .anticall warn`,
                ...channelInfo
            }, { quoted: message });
            return;
        }

        if (action === 'status') {
            const status = state.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const statusIcon = state.enabled ? '🟢' : '🔴';
            const msgPreview = state.message.substring(0, 80) + (state.message.length > 80 ? '...' : '');
            await sock.sendMessage(chatId, {
                text: `📞 *ANTI-CALL STATUS*\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `${statusIcon} *Status:* ${status}\n` +
                      `⚙️ *Mode:* ${getModeText(state.mode, state.warnLimit)}\n` +
                      `🔢 *Warn Limit:* ${state.warnLimit} calls\n\n` +
                      `💬 *Message:*\n_${msgPreview}_\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━\n` +
                      `💡 Use @{caller} to mention the caller.`,
                ...channelInfo
            }, { quoted: message });
            return;
        }

        if (action === 'on') {
            if (state.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Anti-Call is already *ON*.\n\n💡 Use .anticall off to disable.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, enabled: true });
            await sock.sendMessage(chatId, { text: `✅ *ANTI-CALL ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Calls will be auto-handled.\n⚙️ Mode: ${getModeText(state.mode, state.warnLimit)}\n\n💡 Use .anticall block/decline/warn to change.`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'off') {
            if (!state.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Anti-Call is already *OFF*.\n\n💡 Use .anticall on to enable.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, enabled: false });
            await sock.sendMessage(chatId, { text: `❌ *ANTI-CALL DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Calls will no longer be handled.`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'decline') {
            if (state.mode === 'decline' && state.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY SET*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Anti-Call is already in *Decline Mode*.\n\n💡 Use .anticall block or .anticall warn to switch.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, mode: 'decline', enabled: true });
            await sock.sendMessage(chatId, { text: `📵 *DECLINE MODE ACTIVATED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Calls will be declined.\n👤 Callers will NOT be blocked.\n💬 Custom message will be sent.`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'block') {
            if (state.mode === 'block' && state.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY SET*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Anti-Call is already in *Block Mode*.\n\n💡 Use .anticall decline or .anticall warn to switch.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, mode: 'block', enabled: true });
            await sock.sendMessage(chatId, { text: `🚫 *BLOCK MODE ACTIVATED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Calls will be rejected.\n👤 Callers will be blocked immediately.\n💬 Block message will be sent.`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'warn') {
            if (state.mode === 'warn' && state.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY SET*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Anti-Call is already in *Warn Mode* (${state.warnLimit} calls).\n\n💡 Use .anticall decline or .anticall block to switch.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, mode: 'warn', enabled: true });
            await sock.sendMessage(chatId, { text: `⚠️ *WARN MODE ACTIVATED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Calls will be declined with warning.\n👤 Callers blocked after *${state.warnLimit}* calls.\n\n💡 Use .anticall warncount <number> to change limit.`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'warncount') {
            const count = parseInt(parts[1]);
            if (!count || count < 1 || count > 10) {
                await sock.sendMessage(chatId, { text: `⚠️ *INVALID COUNT*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 Choose between 1-10 calls.\n\n✨ *Example:*\n└ .anticall warncount 5`, ...channelInfo }, { quoted: message });
                return;
            }
            if (state.warnLimit === count) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY SET*\n\n━━━━━━━━━━━━━━━━━━━━\n🔢 Warn limit is already *${count}* calls.\n\n💡 No changes needed.`, ...channelInfo }, { quoted: message }); return; }
            writeState({ ...state, warnLimit: count });
            await sock.sendMessage(chatId, { text: `🔢 *WARN LIMIT UPDATED*\n\n━━━━━━━━━━━━━━━━━━━━\n📞 Callers will be blocked after *${count}* calls.\n\n⚙️ Current mode: ${getModeText(state.mode, count)}`, ...channelInfo }, { quoted: message });
            return;
        }

        if (action === 'message') {
            const newMessage = sub.substring(7).trim();
            if (!newMessage) {
                await sock.sendMessage(chatId, { text: `⚠️ *USAGE*\n\n━━━━━━━━━━━━━━━━━━━━\n📖 .anticall message <text>\n\n✨ *Example:*\n└ .anticall message Hello @{caller}, I'm busy!\n\n💡 Use @{caller} to mention the caller.`, ...channelInfo }, { quoted: message });
                return;
            }
            writeState({ ...state, message: newMessage });
            await sock.sendMessage(chatId, { text: `💬 *CUSTOM MESSAGE SET*\n\n━━━━━━━━━━━━━━━━━━━━\n📝 *New Message:*\n_${newMessage}_\n\n💡 @{caller} will be replaced with caller's name.`, ...channelInfo }, { quoted: message });
            return;
        }

    } catch (error) { console.error('❌ Anti-call command error:', error); }
}

// ═══════════════════════════════════════
// GROUP PARTICIPANT CACHE
// ═══════════════════════════════════════

let groupParticipantCache = {};
let cacheLastUpdated = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function refreshGroupCache(sock) {
    const now = Date.now();
    if (now - cacheLastUpdated < CACHE_TTL && Object.keys(groupParticipantCache).length > 0) {
        console.log(`   ├─ 📦 Using cached group data (${Object.keys(groupParticipantCache).length} groups)`);
        return; // Cache still fresh
    }

    console.log(`   ├─ 🔄 Refreshing group cache...`);
    const store = require('../lib/lightweight_store');
    const allChats = store.chats?.all
        ? store.chats.all()
        : Object.values(store.chats || {});

    const groupChats = allChats.filter(c => c.id && c.id.endsWith('@g.us'));
    const newCache = {};
    
    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    // Process groups in small batches to avoid rate limits
    const BATCH_SIZE = 3;
    const BATCH_DELAY = 2000; // 2 seconds between batches

    for (let i = 0; i < groupChats.length; i += BATCH_SIZE) {
        const batch = groupChats.slice(i, i + BATCH_SIZE);
        
        const batchResults = await Promise.allSettled(
            batch.map(async (chat) => {
                try {
                    const meta = await sock.groupMetadata(chat.id);
                    if (meta && meta.participants) {
                        // Extract just the participant IDs for quick lookup
                        const participants = meta.participants.map(p => ({
                            id: p.id,
                            number: p.id.split('@')[0].split(':')[0]
                        }));
                        newCache[chat.id] = {
                            participants: participants,
                            memberCount: participants.length
                        };
                        successCount++;
                    }
                } catch (e) {
                    if (e.message?.includes('rate-overlimit')) {
                        errorCount++;
                    } else {
                        skipCount++;
                    }
                }
            })
        );

        // Delay between batches to avoid rate limits
        if (i + BATCH_SIZE < groupChats.length) {
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
    }

    groupParticipantCache = newCache;
    cacheLastUpdated = now;
    
    console.log(`   ├─ ✅ Cache refreshed: ${successCount} groups, ${errorCount} rate-limited, ${skipCount} skipped`);
    console.log(`   ├─ 📦 Total groups cached: ${Object.keys(newCache).length}`);
}

// ═══════════════════════════════════════
// GROUP LOOKUP v3 - With Caching
// ═══════════════════════════════════════

async function findGroupJid(sock, callerJid, callerPn) {
    try {
        // Extract numbers for matching
        const callerNumber = callerJid.split('@')[0].split(':')[0];
        const pnNumber = callerPn ? callerPn.split('@')[0].split(':')[0] : null;
        
        console.log(`   ├─ 🔍 Looking for caller in groups...`);
        console.log(`   ├─ callerNumber: ${callerNumber}`);

        // Try cache first
        if (Object.keys(groupParticipantCache).length === 0 || 
            Date.now() - cacheLastUpdated >= CACHE_TTL) {
            await refreshGroupCache(sock);
        }

        // Search through cached groups
        for (const [groupJid, groupData] of Object.entries(groupParticipantCache)) {
            const { participants, memberCount } = groupData;
            
            // Skip 1-member groups (announcement channels)
            if (memberCount <= 1) continue;

            const found = participants.find(p => {
                const pNum = p.number;
                return (
                    p.id === callerJid ||
                    p.id === callerPn ||
                    pNum === callerNumber ||
                    pNum === pnNumber
                );
            });

            if (found) {
                console.log(`   ├─ ✅ Found in group: ${groupJid} (${memberCount} members)`);
                return {
                    groupJid: groupJid,
                    memberCount: memberCount
                };
            }
        }

        // If not found in cache, try fresh lookup for remaining groups
        console.log(`   ├─ 🔄 Not found in cache, trying fresh lookup...`);
        
        const store = require('../lib/lightweight_store');
        const allChats = store.chats?.all
            ? store.chats.all()
            : Object.values(store.chats || {});
        
        const groupChats = allChats.filter(c => c.id && c.id.endsWith('@g.us'));
        const uncachedGroups = groupChats.filter(c => !groupParticipantCache[c.id]);

        if (uncachedGroups.length > 0) {
            console.log(`   ├─ Checking ${uncachedGroups.length} uncached groups...`);
            
            // Check uncached groups in small batches
            for (let i = 0; i < uncachedGroups.length; i += 2) {
                const batch = uncachedGroups.slice(i, i + 2);
                
                for (const chat of batch) {
                    try {
                        const meta = await sock.groupMetadata(chat.id);
                        if (meta && meta.participants && meta.participants.length > 1) {
                            const found = meta.participants.find(p => {
                                const pNum = p.id.split('@')[0].split(':')[0];
                                return p.id === callerJid || p.id === callerPn || 
                                       pNum === callerNumber || pNum === pnNumber;
                            });
                            
                            if (found) {
                                // Update cache
                                groupParticipantCache[chat.id] = {
                                    participants: meta.participants.map(p => ({
                                        id: p.id,
                                        number: p.id.split('@')[0].split(':')[0]
                                    })),
                                    memberCount: meta.participants.length
                                };
                                
                                console.log(`   ├─ ✅ Found in group: ${chat.id} (${meta.participants.length} members)`);
                                return {
                                    groupJid: chat.id,
                                    memberCount: meta.participants.length
                                };
                            }
                        }
                    } catch (e) {
                        // Skip rate-limited groups
                    }
                }
                
                // Small delay between batches
                if (i + 2 < uncachedGroups.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        console.log(`   ├─ ❌ Caller not found in any group`);
    } catch (e) {
        console.error(`   ├─ ❌ Group lookup error:`, e.message);
    }
    return null;
}
          // ═══════════════════════════════════════
// CALL HANDLER - Fixed LID Detection Priority
// ═══════════════════════════════════════

const processedCalls = new Set();

async function handleAnticall(sock, calls) {
    try {
        const state = readState();
        if (!state.enabled) return;

        for (const call of calls) {
            const callId = call.id || call.callId;
            if (callId && processedCalls.has(callId)) continue;
            if (callId) { 
                processedCalls.add(callId); 
                setTimeout(() => processedCalls.delete(callId), 10000); 
            }

            // ✅ Get the caller's real JID (phone number format)
            const callerJid = call.callerPn || call.from || call.peerJid;
            if (!callerJid) continue;

            // ✅ Get raw JID for rejecting the call (may be LID format)
            const rawCallerJid = call.from || call.peerJid || callerJid;

            // ✅ Check if raw JID is a LID (individual user) FIRST
            const isLidCall = rawCallerJid && rawCallerJid.endsWith('@lid');

            // ✅ FIXED: Only check for group call if NOT a LID call
            // @lid = individual user's Local Identifier (NOT a group)
            // @g.us = actual WhatsApp group
            const isDirectGroupCall = !isLidCall && (
                                     call.isGroup === true || 
                                     (call.from && call.from.endsWith('@g.us')) ||
                                     (call.peerJid && call.peerJid.endsWith('@g.us')) ||
                                     (rawCallerJid && rawCallerJid.endsWith('@g.us'))
                                   );

            // ✅ Detect call type: video or audio
            const isVideo = call.isVideo === true || call.video === true;
            const callType = isVideo ? 'video' : 'audio';

            console.log(`\n📞 === CALL DETECTED ===`);
            console.log(`   ├─ Type: ${callType}`);
            console.log(`   ├─ Caller (Phone): ${callerJid}`);
            console.log(`   ├─ Raw JID: ${rawCallerJid}`);
            console.log(`   ├─ Is LID Call: ${isLidCall}`);
            console.log(`   ├─ Is Direct Group Call: ${isDirectGroupCall}`);
            console.log(`   ├─ Call ID: ${callId}`);

            // ✅ Reject the call immediately using raw JID (LID or phone)
            try {
                if (typeof sock.rejectCall === 'function' && call.id) {
                    await sock.rejectCall(call.id, rawCallerJid);
                    console.log(`   ├─ ✅ Call rejected successfully`);
                } else if (typeof sock.sendCallOfferAck === 'function' && call.id) {
                    await sock.sendCallOfferAck(call.id, rawCallerJid, 'reject');
                    console.log(`   ├─ ✅ Call rejected via ack`);
                }
            } catch (e) {
                console.error(`   ├─ ❌ Error rejecting call:`, e.message);
            }

            try {
                const callerNumber = callerJid.split('@')[0];
                const limit = state.warnLimit || 3;

                let sendTo;
                let finalIsGroup = false;

                // ✅ Determine where to send the response
                if (isDirectGroupCall) {
                    // True group call (ends with @g.us)
                    sendTo = rawCallerJid;
                    finalIsGroup = true;
                    console.log(`   ├─ 📨 Direct group call → sending to group: ${sendTo}`);
                } else if (isLidCall || true) {
                    // LID call or regular DM - ALWAYS check store for group membership
                    console.log(`   ├─ 🔍 Checking store for group membership...`);
                    const groupInfo = await findGroupJid(sock, callerJid, call.callerPn);
                    
                    if (groupInfo) {
                        // Found caller in a group - route to group
                        const { groupJid, memberCount } = groupInfo;
                        sendTo = groupJid;
                        finalIsGroup = true;
                        
                        console.log(`   ├─ 👥 Found caller in group: ${groupJid}`);
                        console.log(`   ├─ 👤 Group member count: ${memberCount}`);
                        
                        if (memberCount <= 2) {
                            console.log(`   ├─ ⚠️ Small group (${memberCount} members) - call appears as DM`);
                            console.log(`   ├─ 📨 Routing to group anyway: ${groupJid}`);
                        } else {
                            console.log(`   ├─ 📨 Routing to group: ${groupJid}`);
                        }
                    } else {
                        // True DM call - no group found
                        sendTo = callerJid;
                        finalIsGroup = false;
                        console.log(`   ├─ 📨 True DM call → sending to: ${callerJid}`);
                    }
                }

                let msg;

                if (state.mode === 'block') {
                    msg = finalIsGroup
                        ? buildGroupMessage(callType, callerNumber, 'block', 0, limit)
                        : buildDMMessage(callType, callerNumber, 'block', 0, limit);
                    
                    setTimeout(async () => {
                        try { 
                            await sock.updateBlockStatus(callerJid, 'block');
                            console.log(`   └─ 🚫 Blocked caller: ${callerJid}`);
                        } catch (e) {
                            console.error(`   └─ ❌ Error blocking caller:`, e.message);
                        }
                    }, 2000);

                } else if (state.mode === 'warn') {
                    const warnCount = addCallWarning(callerJid);
                    msg = finalIsGroup
                        ? buildGroupMessage(callType, callerNumber, 'warn', warnCount, limit)
                        : buildDMMessage(callType, callerNumber, 'warn', warnCount, limit);
                    
                    console.log(`   ├─ ⚠️ Warning ${warnCount}/${limit} for caller: ${callerJid}`);
                    
                    if (warnCount >= limit) {
                        setTimeout(async () => {
                            try { 
                                await sock.updateBlockStatus(callerJid, 'block');
                                console.log(`   └─ 🚫 Blocked caller after ${warnCount} warnings: ${callerJid}`);
                            } catch (e) {
                                console.error(`   └─ ❌ Error blocking caller:`, e.message);
                            }
                            resetCallWarnings(callerJid);
                        }, 2000);
                    } else {
                        console.log(`   └─ ⚠️ Warning sent (${warnCount}/${limit})`);
                    }

                } else {
                    // decline mode
                    msg = finalIsGroup
                        ? buildGroupMessage(callType, callerNumber, 'decline', 0, limit)
                        : buildDMMessage(callType, callerNumber, 'decline', 0, limit);
                    console.log(`   └─ 📵 Call declined`);
                }

                // ✅ Send message with mention
                await sock.sendMessage(sendTo, {
                    text: msg,
                    mentions: [callerJid]
                });
                
                console.log(`   └─ ✅ Message sent to: ${sendTo} (${finalIsGroup ? 'GROUP' : 'DM'})\n`);

            } catch (e) { 
                console.error(`   └─ ❌ Error handling call message:`, e.message); 
            }
        }
    } catch (error) { 
        console.error('❌ Error in handleAnticall:', error); 
    }
} 
module.exports = { anticallCommand, readState, handleAnticall };
