document.addEventListener("DOMContentLoaded", function () {
    const splashButton = document.querySelector(".splash_button");

    if (splashButton) {
        splashButton.style.display = "none";
    }

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.recent_login === true) {
            window.location.href = "/tasklist/";
        } else {
            if (splashButton) {
                splashButton.style.display = "block";
            }
        }
    })
    .catch(error => {
        console.error("Error:", error);
        if (splashButton) {
            splashButton.style.display = "block";
        }
    });

    if (splashButton) {
        splashButton.addEventListener("click", function () {
            window.location.href = "/auth/login/";
        });
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
