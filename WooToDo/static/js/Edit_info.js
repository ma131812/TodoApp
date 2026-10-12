document.querySelector(".back").addEventListener("click", function(e) 
{window.location.href = "/tasklist/";});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
document.addEventListener('DOMContentLoaded', function() {

    const confirmBtn = document.querySelector('.next_step');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            updateProfile();
        });
    }

    loadUserData();
});

async function loadUserData() {
    try {
        const response = await fetch('/auth/edit_info/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function updateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    if (!username || !email) {
        alert('لطفاً نام کاربری و ایمیل را وارد کنید.');
        return;
    }

    if (password && password.length < 8) {
        alert('رمز عبور باید حداقل 8 کاراکتر باشد.');
        return;
    }

    const formData = {
        username: username,
        email: email
    };

    if (password) {
        formData.password = password;
    }

    try {
        const response = await fetch('/auth/edit_info/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
            
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            alert('اطلاعات با موفقیت به‌روزرسانی شد.');
            location.reload();
        } else {
            alert(data.message || 'خطایی رخ داده است.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('خطا در ارتباط با سرور');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo();
});

function loadUserInfo() {
    fetch(window.location.href, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.username) {
            document.getElementById("username").value = data.username;
        }
        if (data.email) {
            document.getElementById("email").value = data.email;
        }
    })
    .catch(err => {
        console.error("Error loading user info:", err);
    });
}

