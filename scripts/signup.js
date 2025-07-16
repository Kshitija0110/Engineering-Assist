const URL = "https://engineering-assist-lh3f.onrender.com";
// const URL = "http://localhost:8080";

async function initializeGoogleAuth() {
    const cidresponse=await fetch(`${URL}/cid`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const ciddata=await cidresponse.json();
    if(!cidresponse.ok){
        alert('An error occurred. Please try again.');
        return;
    }

    google.accounts.id.initialize({
        client_id: ciddata.cid,
        callback: handleGoogleCallback
    });
    google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        {  size: 'large' }
    );
}

async function handleGoogleCallback(response) {
    try {
        // Send Google token to your backend
        console.log(response.credential);
        const backendResponse = await fetch(`${URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: response.credential
            }),
            credentials: 'include'
        });

        if (backendResponse.ok) {
            // Your backend should verify the Google token and return your app's JWT
            const responseData = await backendResponse.json();
            setCookie('token', responseData.token, 2);
            setCookie('userId', responseData.userId, 2);
            setCookie('email', responseData.email, 2);
            setCookie('username', responseData.username, 2);
            await storetosession();
            window.location.href = './homepage.html';
        } else {
            const errorData = await backendResponse.json();
            alert(errorData.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeGoogleAuth()
    const form = document.getElementById('auth-form');
    if (form) {
        form.action = `${URL}/auth/signup`;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const password = form.querySelector('input[name="password"]').value;
            const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });


                if (response.ok) {
                    const responseData = await response.json();
                    setCookie('token', responseData.token, 2);
                    setCookie('userId', responseData.userId, 2);
                    setCookie('email', responseData.email, 2);
                    setCookie('username', responseData.username, 2);
                    await storetosession();
                    window.location.href = './homepage.html';
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Sign up failed. Please try again.');
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
        });
    }
});

function setCookie(cname, cvalue, exhr) {
    const d = new Date();
    d.setTime(d.getTime() + (exhr*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function storetosession(){
    sessionStorage.setItem('token', getCookie('token'));
    sessionStorage.setItem('userId', getCookie('userId'));
    sessionStorage.setItem('email', getCookie('email'));
    sessionStorage.setItem('username', getCookie('username'));
    return;
}