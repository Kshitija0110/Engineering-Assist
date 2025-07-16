const URL = "https://engineering-assist-lh3f.onrender.com";

const userId=sessionStorage.getItem('userId');
const token=sessionStorage.getItem('token');
const email=decodeURIComponent(sessionStorage.getItem('email'));
const username = decodeURIComponent(sessionStorage.getItem('username'));
const flask_url = 'https://vikas2900-engineering-assist.hf.space';
const textbook=sessionStorage.getItem('topic');


document.getElementById('temperature').oninput = function() {
    document.getElementById('temperatureValue').innerHTML = parseFloat(this.value).toFixed(2);
}
document.getElementById('tokenSize').oninput = function() {
    document.getElementById('tokenSizeValue').innerHTML = this.value;
}
const backButton = document.getElementById('back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.location.href = './homepage.html';
    });
}

const adminButton = document.getElementById('admin_button');
if (adminButton) {
    adminButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${URL}/auth/isadmin?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                window.location.href = './admin.html';
            } else {
                alert('You are not an admin.');
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const temperatureSlider = document.getElementById('temperature');
            const temperatureValue = parseFloat(temperatureSlider.value);

            try {
                const response = await fetch(`${flask_url}/settemperature`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ temperature: temperatureValue })
                });

                if (response.ok) {
                    alert('Temperature setting saved successfully.');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to save temperature setting. Please try again.');
                }
            } catch (error) {
                console.error('Error saving temperature setting:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }