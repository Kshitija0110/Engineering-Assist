const URL = "https://engineering-assist-lh3f.onrender.com";
// const URL = "http://localhost:8080";

const userId=sessionStorage.getItem('userId');
const token=sessionStorage.getItem('token');
const email=decodeURIComponent(sessionStorage.getItem('email'));
const username = decodeURIComponent(sessionStorage.getItem('username'));

document.getElementById('settings_button').addEventListener('click', function() {
    window.location.href = './settings.html';
});

document.getElementById('logout_button').addEventListener('click', function() {
    clearCookies();
    window.location.href = './index.html';
});

sessionStorage.setItem('fetchedUrl',"https://vikas2900-engineering-assist.hf.space" );
function clearCookies() {
    const cookies = document.cookie.split(";");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

document.getElementById('tooltip').textContent = `Signed in as ${username}`;

document.getElementById('file_upload').addEventListener('change', async function(event) {
    const fileInput = event.target;
    const fileNameSpan = document.getElementById('file_name');
    
    if (fileInput.files.length > 0) {
        fileNameSpan.textContent = `Selected file: ${fileInput.files[0].name}`;
        
        // Prepare the file and data for upload
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', '0');

        // Fetch the URL from session storage
        const uploadUrl = sessionStorage.getItem('fetchedUrl') + '/upload';

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                alert('File uploaded successfully.');

                // Make a POST request to URL/available/textbooks
                const textbooksUrl = `${URL}/available/textbooks`;
                const payload = {
                    name: responseData['collection_name'],
                    userId: userId
                };

                try {
                    const textbooksResponse = await fetch(textbooksUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        },
                        body: JSON.stringify(payload)
                    });

                    if (textbooksResponse.ok) {
                        alert('Textbook information updated successfully.');
                        fileNameSpan.textContent = 'Uploaded!';
                        const t=await textbooksResponse.json();
                        const textbook=t.textbook;
                        const textbookDropdown = document.getElementById('textbook_dropdown');
                        const option = document.createElement('option');
                        option.value = textbook.id;
                        option.textContent = textbook.name;
                        textbookDropdown.appendChild(option);
                    } else {
                        const errorData = await textbooksResponse.json();
                        alert(errorData.message || 'Failed to update textbook information. Please try again.');
                        fileNameSpan.textContent = 'Failed :(';
                    }
                } catch (error) {
                    console.error('Error updating textbook information:', error);
                    alert('An error occurred while updating textbook information. Please try again.');
                    fileNameSpan.textContent = 'Failed :(';
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'File upload failed. Please try again.');
                fileNameSpan.textContent = 'Failed :(';
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred. Please try again.');
            fileNameSpan.textContent = 'Failed :(';
        }
    } else {
        fileNameSpan.textContent = '';
    }
});

fetch(`${URL}/available/textbooks?userId=${userId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => {
    const textbookDropdown = document.getElementById('textbook_dropdown');
    data.forEach(textbook => {
        const option = document.createElement('option');
        option.value = textbook.id;
        option.textContent = textbook.name;
        textbookDropdown.appendChild(option);
    });
})
.catch(error => {
    console.error('Error fetching textbooks:', error);
});

fetch(`${URL}/available/colleges`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => {
    const collegeDropdown = document.getElementById('college_dropdown');
    data.forEach(college => {
        const option = document.createElement('option');
        option.value = college.id;
        option.textContent = college.name;
        collegeDropdown.appendChild(option);
    });
})
.catch(error => {
    console.error('Error fetching colleges:', error);
});

document.getElementById('college_dropdown').addEventListener('change', async function(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    sessionStorage.setItem('topic', selectedOption.textContent);

    const fetchedUrl = "https://vikas2900-engineering-assist.hf.space";
    const payload = { "collection_name": selectedOption.textContent };

    try {
        const response = await fetch(`${fetchedUrl}/db_collection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location.href = './collegebot.html';
        } else {
            const errorData = await response.json();
            console.error('Error updating collection:', errorData.message || 'Failed to update collection.');
        }
    } catch (error) {
        console.error('Error updating collection:', error);
    }
});

document.getElementById('textbook_dropdown').addEventListener('change', async function(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    sessionStorage.setItem('topic', selectedOption.textContent);

    const fetchedUrl ='https://vikas2900-engineering-assist.hf.space' ;
    const payload = { "collection_name": selectedOption.textContent };

    try {
        const response = await fetch(`${fetchedUrl}/db_collection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location.href = './textbookbot.html';
        } else {
            const errorData = await response.json();
            console.error('Error updating collection:', errorData.message || 'Failed to update collection.');
        }
    } catch (error) {
        console.error('Error updating collection:', error);
    }
});