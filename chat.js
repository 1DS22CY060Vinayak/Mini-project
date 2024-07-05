document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.querySelector('#chat-form');
    const messagesDiv = document.querySelector('#messages');

    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }

    // Fetch and display previous messages
    fetch('/api/messages', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = message.text;
            messagesDiv.appendChild(messageElement);
        });
    })
    .catch(error => console.error('Error fetching messages:', error));
});

function handleChatSubmit(event) {
    event.preventDefault();
    const messageInput = document.querySelector('#message-input');
    const messageText = messageInput.value;

    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ text: messageText })
    })
    .then(response => response.json())
    .then(data => {
        const messagesDiv = document.querySelector('#messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = data.text;
        messagesDiv.appendChild(messageElement);
        messageInput.value = '';
    })
    .catch(error => console.error('Error sending message:', error));
}
// app.js

document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const recipientTypeSelect = document.getElementById('recipient-type');
    const emailRecipientDiv = document.getElementById('email-recipient');

    // Show/hide email input based on recipient type selection
    recipientTypeSelect.addEventListener('change', function() {
        const selectedRecipient = recipientTypeSelect.value;
        if (selectedRecipient === 'email') {
            emailRecipientDiv.style.display = 'block';
        } else {
            emailRecipientDiv.style.display = 'none';
        }
    });

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recipientType = recipientTypeSelect.value;
        let recipient;
        
        if (recipientType === 'email') {
            recipient = document.getElementById('email').value;
        } else {
            recipient = 'Username'; // Replace with actual username logic
        }
        
        const message = document.getElementById('message').value;

        // Here you can implement sending the message to the selected recipient
        sendMessage(recipientType, recipient, message);

        // Clear message input after sending
        document.getElementById('message').value = '';
    });

    // Example function to simulate sending message (replace with actual backend logic)
    function sendMessage(recipientType, recipient, message) {
        // Example: Display message in chat (replace with actual sending logic)
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.innerHTML = `<strong>${recipientType} (${recipient}):</strong> ${message}`;
        chatMessages.appendChild(newMessage);
    }
});
