document.querySelector(".back").addEventListener("click", function(e) 
{window.location.href = "/tasklist/";});

async function toggleDone(taskId) {
    const response = await fetch("/show_done/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({ id: taskId })
    });

    if (!response.ok) {
        throw new Error("server error");
    }
}

document.addEventListener("change", async function (e) {

    if (!e.target.classList.contains("checkbox")) return;

    const checkbox = e.target;
    const taskId = checkbox.dataset.taskId;

    checkbox.disabled = true;

    try {
        await toggleDone(taskId);

        location.reload(); 

    } catch (err) {
        checkbox.checked = !checkbox.checked;
        alert("خطا در تغییر وضعیت");
    } finally {
        checkbox.disabled = false;
    }
});

document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("unarchive")) return;

    e.preventDefault();

    const taskId = e.target.dataset.taskId;
    const taskBox = e.target.closest(".task_box");

    try {
        await toggleDone(taskId);
        taskBox.remove();
    } catch (err) {
        alert("خطا در بازگرداندن تسک");
    }
});

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