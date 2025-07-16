const URL = "https://engineering-assist-lh3f.onrender.com";

const userId=sessionStorage.getItem('userId');
const token=sessionStorage.getItem('token');
const email=decodeURIComponent(sessionStorage.getItem('email'));
const username = decodeURIComponent(sessionStorage.getItem('username'));
const flask_url = "https://vikas2900-engineering-assist.hf.space";
const textbook=sessionStorage.getItem('topic');


const backButton = document.getElementById('back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.location.href = './homepage.html';
    });
}

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
        option.value = college.name;
        option.textContent = college.name;
        collegeDropdown.appendChild(option);
    });
})
.catch(error => {
    console.error('Error fetching colleges:', error);
});

const confirmCollegeButton = document.getElementById('confirm_college');
if (confirmCollegeButton) {
    confirmCollegeButton.addEventListener('click', async () => {
        const collegeInput = document.getElementById('college');
        const collegeName = collegeInput.value.trim();

        if (!collegeName) {
            return;
        }

        try {
            const response = await fetch(`${URL}/available/colleges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: collegeName })
            });

            if (response.ok) {
                alert('College added successfully.');
                const collegeDropdown = document.getElementById('college_dropdown');
                const option = document.createElement('option');
                option.value = collegeName;
                option.textContent = collegeName;
                collegeDropdown.appendChild(option);
                collegeInput.value = ''; // Clear the input field
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to add college. Please try again.');
            }
        } catch (error) {
            console.error('Error adding college:', error);
            alert('An error occurred. Please try again.');
        }
    });
}
const confirmFileButton = document.getElementById('confirm_file');
if (confirmFileButton) {
    confirmFileButton.addEventListener('click', async () => {
        const fileInput = document.getElementById('file_upload');
        const collegeDropdown = document.getElementById('college_dropdown');
        const selectedCollege = collegeDropdown.value;

        if (!fileInput.files.length || !selectedCollege) {
            return; // Do nothing if no file is uploaded or no college is selected
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', new File([file], newFileName));
        formData.append('type', '1');

        try {
            const response = await fetch(`${flask_url}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('File uploaded successfully.');
                fileInput.value = ''; // Clear the file input
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to upload file. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred. Please try again.');
        }
    });
}


