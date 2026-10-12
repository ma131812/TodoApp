document.querySelector(".go_done").addEventListener("click", function(e) 
{window.location.href = "/show_done/";});

document.querySelector(".log_out").addEventListener("click", function(e) 
{window.location.href = "/auth/logout/";});

document.querySelector(".go_developers").addEventListener("click", function(e) 
{window.location.href = "/developers/";});

document.querySelector(".edit_info").addEventListener("click", function(e) 
{window.location.href = "/auth/edit_info/";});

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("remove")) return;

    e.preventDefault();

    const taskBox = e.target.closest(".task_box");
    const taskId = taskBox.dataset.taskId;

    console.log("delete task:", taskId);

    fetch("/tasklist/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
            delete_all: false,
            id: taskId
        })
    })
    .then(res => {
        if (res.ok) {
            taskBox.remove(); 
            location.reload();

        } else {
            console.error("delete failed");
        }
    });
});


document.querySelector(".delete_all").onclick = function (e) {
    e.preventDefault();

    fetch("/tasklist/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({ delete_all: true })
    })
    .then(res => {
        if (res.ok) {
            location.reload();
        } else {
            console.error("delete failed");
        }
    });
};

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
let currentTaskId = null;
document.getElementById("addTaskBtn").addEventListener("click", function () {
    currentTaskId = null;

    taskTitle.value = "";
    taskDescription.value = "";

    editBox.classList.remove("display_none");
    taskTitle.focus();
});
document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", function () {
        const taskBox = this.closest(".task_box");

        currentTaskId = taskBox.dataset.taskId;

        taskTitle.value = taskBox.querySelector(".subject").textContent;
        taskDescription.value = taskBox.querySelector(".content").textContent;

        editBox.classList.remove("display_none");
        taskTitle.focus();
    });
});
document.getElementById("saveBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        alert("عنوان تسک الزامی است");
        return;
    }

    const isEdit = currentTaskId !== null;

    const url = isEdit ? `/tasklist/` : `/tasklist/`;
    const method = isEdit ? "PUT" : "POST";

    const payload = {
        title: title,
        description: description,
        id: currentTaskId
    };

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("خطا در ذخیره");

        location.reload();
    } catch (err) {
        alert(err.message);
    }
});

document.addEventListener("change", async function (e) {

    if (!e.target.classList.contains("checkbox")) return;

    const checkbox = e.target;
    const taskId = checkbox.dataset.taskId;

    checkbox.disabled = true;

    try {
        const response = await fetch("/tasklist/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                id: taskId,
                toggle_done: true
            })
        });

        if (!response.ok) throw new Error("server error");

        const taskBox = checkbox.closest(".task_box");
        taskBox.classList.toggle("completed", checkbox.checked);

    } catch (err) {
        checkbox.checked = !checkbox.checked;
        alert("خطا در تغییر وضعیت تسک");
    } finally {
        checkbox.disabled = false;
    }
    location.reload();
});
//---
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggleButton = document.querySelector(".ToggleMode");

  if (!toggleButton) return;

  toggleButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    setCookie("theme", next, 365);
  });
});

document.addEventListener("pointerdown", function (e) {
  const logoMore = document.querySelector(".logo_more");
  const avatarMore = document.querySelector(".avatar_more");
  const headerBox = document.querySelector(".header_box");

  if (!logoMore || !avatarMore || !headerBox) return;

  const inLogo = e.target.closest(".logo_more");
  const inAvatar = e.target.closest(".avatar_more");

  if (!e.target.closest(".header_box")) {
    logoMore.blur();
    avatarMore.blur();
    return;
  }

  if (inLogo) {
    e.preventDefault();

    if (document.activeElement === logoMore) {
      logoMore.blur();
    } else {
      avatarMore.blur();
      logoMore.focus();
    }
    return;
  }

  if (inAvatar) {
    e.preventDefault();

    if (document.activeElement === avatarMore) {
      avatarMore.blur();
    } else {
      logoMore.blur();
      avatarMore.focus();
    }
    return;
  }
});
//---


document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('footer .search input');
  const taskBoxes = Array.from(document.querySelectorAll('main .task_box'));
  const main = document.querySelector('main');

  if (!searchInput || !main || taskBoxes.length === 0) return;

  function filterTasks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    taskBoxes.forEach((box) => {
      const subjectEl = box.querySelector('.subject');
      const title = (subjectEl?.textContent || '').toLowerCase();

      if (searchTerm === '' || title.includes(searchTerm)) {
        box.style.display = '';
        visibleCount++;
      } else {
        box.style.display = 'none';
      }
    });

    const existingMsg = document.getElementById('noResultsMessage');
    if (visibleCount === 0) {
      if (!existingMsg) {
        const msg = document.createElement('p');
        msg.id = 'noResultsMessage';
        msg.textContent = 'نتیجه‌ای یافت نشد';
        msg.style.marginTop = '16px';
        msg.style.textAlign = 'center';
        msg.style.color = '#727272';
        main.appendChild(msg);
      }
    } else {
      existingMsg?.remove();
    }
  }

  searchInput.addEventListener('input', filterTasks);
  filterTasks();
});

document.getElementById("cancelBtn").addEventListener("click", function () {
    editBox.classList.add("display_none");
});
document.addEventListener('DOMContentLoaded', function() {
    const editBox = document.getElementById('editBox');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (!editBox || !cancelBtn) {
        console.error('المان‌های editBox یا cancelBtn پیدا نشدند');
        return;
    }
    
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('دکمه لغو کلیک شد');
        editBox.classList.add('display_none');
        
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !editBox.classList.contains('display_none')) {
            editBox.classList.add('display_none');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!editBox.classList.contains('display_none') && 
            !editBox.contains(e.target) && 
            !document.getElementById('addTaskBtn').contains(e.target) &&
            !e.target.classList.contains('edit')) {
            editBox.classList.add('display_none');
        }
    });
});

