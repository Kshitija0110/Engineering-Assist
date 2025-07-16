const URL = "https://engineering-assist-lh3f.onrender.com";
// const URL = "http://localhost:8080";

const userId=sessionStorage.getItem('userId');
const token=sessionStorage.getItem('token');
const email=decodeURIComponent(sessionStorage.getItem('email'));
const username = decodeURIComponent(sessionStorage.getItem('username'));
const flask_url = 'https://vikas2900-engineering-assist.hf.space';
const textbook=sessionStorage.getItem('topic');

document.getElementById('settings_button').addEventListener('click', function() {
    window.location.href = './settings.html';
});
document.getElementById('home_button').addEventListener('click', function() {
    window.location.href = './homepage.html';
});
document.querySelector('.logout').addEventListener('click', async function() {
    clearCookies();
    window.location.href = './index.html';
});

function clearCookies() {
    const cookies = document.cookie.split(";");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('fetchedUrl');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

let chatid = null;

document.addEventListener("DOMContentLoaded",async ()=>{
    document.getElementById('headtitle').textContent=`${textbook}`;
    document.querySelector('.user_info .username').textContent = username;
    await fetchChats();
    document.getElementById('newchat_button').addEventListener('click', async function() {
        const newChatName = prompt('Enter the name for the new chat:');
        if (newChatName) {
            const payload = {
                name: newChatName,
                owner: userId,
                topic: textbook
            };

            try {
                const response = await fetch(`${URL}/chats/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const newChat = await response.json();
                    appendChat(newChat); // Append the new chat to the list
                    alert('New chat created successfully.');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to create new chat. Please try again.');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });
    document.querySelector('.submit-button').addEventListener('click', async () => {
        const textarea = document.querySelector('.query-input');
        const messageContent = textarea.value.trim();
        if (!messageContent || !chatid) {
            return;
        }
    
        try {
            const response = await fetch(`${URL}/chats/${chatid}/messages`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageContent })
                
            });
    
            if (response.ok) {
                const responseData = await response.json();
                const messageSpace = document.querySelector('.message_space');
    
                const userTemplate = document.getElementById('user_message');
                const userClone = userTemplate.content.cloneNode(true);
                const userMessageText = userClone.querySelector('p');
                userMessageText.innerHTML = messageContent;
                messageSpace.appendChild(userClone);
    
                const aiTemplate = document.getElementById('ai_message');
                const aiClone = aiTemplate.content.cloneNode(true);
                const aiMessageText = aiClone.querySelector('p');
                aiMessageText.innerHTML = responseData.message;
                messageSpace.appendChild(aiClone);
    
                textarea.value = '';
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
    
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];

    document.querySelector('.submit_audio').addEventListener('click', async () => {
        const textarea = document.querySelector('.query-input');
        const recordButton = document.querySelector('.submit_audio');
        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support audio recording.');
            return;
        }

        if (isRecording) {
            // Stop recording
            mediaRecorder.stop();
            isRecording = false;
            recordButton.classList.remove('recording');
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
                    const wavBuffer = bufferToWave(audioBuffer, audioBuffer.length);
                    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

                    const formData = new FormData();
                    formData.append('audio', wavBlob);

                    try {
                        const response = await fetch(`${flask_url}/voicetotext`, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            const responseData = await response.json();
                            textarea.value = responseData.text;
                        } else {
                            const errorData = await response.json();
                            alert(errorData.message || 'Failed to convert audio to text. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error converting audio to text:', error);
                        alert('An error occurred. Please try again.');
                    }
                };

                mediaRecorder.start();
                isRecording = true;
                recordButton.classList.add('recording');
            } catch (error) {
                console.error('Error accessing microphone:', error);
                alert('An error occurred while accessing the microphone. Please try again.');
            }
        }
    });

})

async function fetchChats() {
    try {
        const response = await fetch(`${URL}/chats?topic=${textbook}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const chats = await response.json(); // Assuming you have a container for chat entries

            chats.forEach(chat => {
                appendChat(chat);
            });
        } else {
            console.error('Failed to fetch chats');
        }
    } catch (error) {
        console.error('Error fetching chats:', error);
    }
}

function appendChat(chat) {
    const chatContainer = document.querySelector('.sidecont .chats');

    const template = document.getElementById('chat_entry');
    const clone = template.content.cloneNode(true);
    const chatDiv = clone.querySelector('.chat_ent');
    const chatTitle = clone.querySelector('h3');
    const deleteButton = clone.querySelector('.del_img');

    chatDiv.id = `a${chat._id}`;
    chatTitle.textContent = chat.name;
    chatDiv.addEventListener('click', async (e) => {
        // Prevent triggering chat click when delete button is clicked
        if (!e.target.closest('.del_img')) {
            await fetchMessages(chat._id);
        }
    });

    // Add delete button event listener
    deleteButton.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent chat click event from firing
        try {
            const response = await fetch(`${URL}/chats/${chat._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove chat from the list
                chatDiv.remove();
                
                if (chatid === chat._id) {
                    chatid = null;
                    const messageSpace = document.querySelector('.message_space');
                    messageSpace.innerHTML = '';
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete chat. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            alert('An error occurred while deleting the chat. Please try again.');
        }
    });

    chatContainer.appendChild(clone);
}

async function fetchMessages(chatId) {
    chatid=chatId;
    try {
        const response = await fetch(`${URL}/chats/${chatId}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const messages = await response.json();
            const messageSpace = document.querySelector('.message_space');
            messageSpace.innerHTML = '';
            if(messages.length==0){
                return;
            }
            messages.forEach(message => {
                const templateId = message.user === 'assistant' ? 'ai_message' : 'user_message';
                const template = document.getElementById(templateId);
                const clone = template.content.cloneNode(true);
                const messageText = clone.querySelector('p');


                messageText.innerHTML = message.message;

                messageSpace.appendChild(clone);
            });
        } else {
            console.error('Failed to fetch messages');
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
function bufferToWave(abuffer, len) {
    let numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        offset = 0,
        pos = 0;
    
    let i,sample;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample * 0.5) * 0xffff; // scale to 16-bit unsigned int
            sample = Math.max(0, Math.min(0xffff, sample)); // clamp again
            view.setUint16(pos, sample, true); // write 16-bit sample
            pos += 2;
        }
        offset++; // next source sample
    }

    return buffer;

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

