let currentSortField = 'registrationTime'; // 默认排序字段为 'Created At'
let currentSortOrder = 'desc'; // 默认排序顺序为降序

// 获取所有用户信息并展示在表格中
function fetchAllUsers() {
    fetch('https://script.google.com/macros/s/AKfycbyQLjxSByVgzhSby7ptQzsyYixHlMp34C1DN2P7Iz_EvL7SdkkvhYoajmPnhiipsajf/exec', {
        method: 'POST',
        body: new URLSearchParams({ action: 'getAllUsers' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const users = data.users;
            const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
            const countUserList = document.getElementById('countUserList');
            const newUserTodayCount = document.getElementById('newUserTodayCount'); // 新用户数量显示
            const lastLoginTodayCount = document.getElementById('lastLoginTodayCount'); // 今天最后登入用户数量显示

            // 获取当前日期并清除时间部分（只保留年、月、日）
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 清除小时、分钟、秒和毫秒
                
            let newUsersToday = 0;  // 记录今天注册的新用户数量
            let lastLoginToday = 0; // 记录最后登录时间是今天的用户数量

            // 更新用户总数
            countUserList.innerText = users.length; // 显示用户总数
            tableBody.innerHTML = ''; // 清空表格内容

            // 默认按 Created At 降序排序
            users.sort((a, b) => new Date(b.registrationTime) - new Date(a.registrationTime));

            users.forEach((user, index) => {
                const registrationDate = new Date(user.registrationTime);
                registrationDate.setHours(0, 0, 0, 0); // 只保留年、月、日

                const lastLoginDate = new Date(user.lastLoginDate);
                lastLoginDate.setHours(0, 0, 0, 0); // 只保留年、月、日

                // 统计今天注册的新用户
                if (registrationDate.getTime() === today.getTime()) {
                    newUsersToday++;
                }

                // 统计最后登录时间是今天的用户
                if (lastLoginDate.getTime() === today.getTime()) {
                    lastLoginToday++;
                }

                const row = tableBody.insertRow();

                // 添加文本区域并设置为禁用状态
                row.insertCell(0).innerText = user.username; // 用户名不可更改
                row.insertCell(1).innerHTML = `<textarea id="password-${index}" disabled>${user.password}</textarea>`;
                row.insertCell(2).innerHTML = `<textarea id="fullName-${index}" disabled>${user.fullName}</textarea>`;
                row.insertCell(3).innerHTML = `<textarea id="wanumber-${index}" disabled>${user.wanumber}</textarea>`;
                row.insertCell(4).innerHTML = `<textarea id="instaID-${index}" disabled>${user.instaID}</textarea>`;
                row.insertCell(5).innerHTML = `<textarea id="wallet-${index}" disabled>${user.walletAmount}</textarea>`;
                
                // 使用自定义的日期格式化
                row.insertCell(6).innerText = formatDateTime(new Date(user.lastLoginDate));
                row.insertCell(7).innerText = formatDateTime(new Date(user.registrationTime));

                // 账户状态下拉菜单（禁用）
                const statusCell = row.insertCell(8);
                const statusSelect = document.createElement('select');
                statusSelect.id = `status-${index}`;
                statusSelect.disabled = true; // 默认禁用

                // 创建下拉菜单选项
                const activeOption = new Option('Active', 'Active');
                const inactiveOption = new Option('Inactive', 'Inactive');

                // 根据用户状态设置选中项和颜色
                if (user.accountStatus === 'Active') {
                    activeOption.selected = true;
                    statusSelect.style.color = '#90EE90'; // Active 状态字体为绿色
                } else if (user.accountStatus === 'Inactive') {
                    inactiveOption.selected = true;
                    statusSelect.style.color = 'red'; // Inactive 状态字体为红色
                }

                // 将选项添加到下拉菜单
                statusSelect.appendChild(activeOption);
                statusSelect.appendChild(inactiveOption);

                // 将下拉菜单添加到单元格
                statusCell.appendChild(statusSelect);

                // 添加 Edit 按钮
                const actionCell = row.insertCell(9);
                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.classList.add('edit-save-button'); // 添加样式类
                editButton.onclick = function() {
                    if (editButton.innerText === 'Edit') {
                        // 点击 Edit 时解锁输入框并将按钮改为 Save
                        toggleInputs(index, false);
                        editButton.innerText = 'Save';
                    } else {
                        // 点击 Save 时保存用户的更改并禁用输入框
                        saveUserChanges(user.username, index);
                        toggleInputs(index, true);
                        editButton.innerText = 'Edit';
                    }
                };
                actionCell.appendChild(editButton);
            });
            // 更新页面中的统计数据
            newUserTodayCount.innerText = newUsersToday; // 显示今天的新用户数量
            lastLoginTodayCount.innerText = lastLoginToday; // 显示今天最后登录的用户数量
        } else {
            alert('Failed to retrieve users.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// 日期格式化函数
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// 搜索用户
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('usersTable').getElementsByTagName('tbody')[0].rows;

    for (let i = 0; i < rows.length; i++) {
        const username = rows[i].cells[0].innerText.toLowerCase();
        const fullName = rows[i].cells[2].querySelector('textarea').value.toLowerCase();

        // 检查用户名或全名是否包含搜索词
        if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
            rows[i].style.display = ''; // 显示匹配的行
        } else {
            rows[i].style.display = 'none'; // 隐藏不匹配的行
        }
    }
}

// 切换输入框的禁用状态
function toggleInputs(index, isDisabled) {
    document.getElementById(`password-${index}`).disabled = isDisabled;
    document.getElementById(`fullName-${index}`).disabled = isDisabled;
    document.getElementById(`wanumber-${index}`).disabled = isDisabled;
    document.getElementById(`instaID-${index}`).disabled = isDisabled;
    document.getElementById(`wallet-${index}`).disabled = isDisabled;
    document.getElementById(`status-${index}`).disabled = isDisabled; // 解锁状态下拉菜单
}

// 保存用户更改
function saveUserChanges(username, index) {
    const newPassword = document.getElementById(`password-${index}`).value;
    const newFullName = document.getElementById(`fullName-${index}`).value;
    const newWanumber = document.getElementById(`wanumber-${index}`).value;
    const newInstaID = document.getElementById(`instaID-${index}`).value;
    const newWalletAmount = document.getElementById(`wallet-${index}`).value;
    const newStatus = document.getElementById(`status-${index}`).value;

    fetch('https://script.google.com/macros/s/AKfycbyQLjxSByVgzhSby7ptQzsyYixHlMp34C1DN2P7Iz_EvL7SdkkvhYoajmPnhiipsajf/exec', {
        method: 'POST',
        body: new URLSearchParams({
            action: 'updateUserDetails',
            username: username,
            password: newPassword,
            fullName: newFullName,
            wanumber: newWanumber,
            instaID: newInstaID,
            walletAmount: newWalletAmount,
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User updated successfully.');
        } else {
            alert('Failed to update user.');
        }
    })
    .catch(error => console.error('Error:', error));

    // 保存成功后，重新获取所有用户数据并刷新表格
    fetchAllUsers();
}

// 排序功能
function sortTable(field) {
    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

    // 获取当前用户数据
    const users = Array.from(tableBody.rows).map(row => {
        return {
            username: row.cells[0].innerText,
            password: row.cells[1].querySelector('textarea').value,
            fullName: row.cells[2].querySelector('textarea').value,
            wanumber: row.cells[3].querySelector('textarea').value,
            instaID: row.cells[4].querySelector('textarea').value,
            walletAmount: parseFloat(row.cells[5].querySelector('textarea').value), // 转换为数字
            lastLoginDate: new Date(row.cells[6].innerText),
            registrationTime: new Date(row.cells[7].innerText),
            accountStatus: row.cells[8].querySelector('select').value
        };
    });

    // 确定排序方式
    if (currentSortField === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'; // 切换排序顺序
    } else {
        currentSortField = field; // 更新当前排序字段
        currentSortOrder = 'asc'; // 默认升序
    }

    // 排序用户数据
    users.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (currentSortOrder === 'asc') {
            return valueA < valueB ? -1 : 1;
        } else {
            return valueA > valueB ? -1 : 1;
        }
    });

    // 更新表格
    tableBody.innerHTML = ''; // 清空表格内容
    users.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = user.username; // 用户名不可更改
        row.insertCell(1).innerHTML = `<textarea id="password-${index}" disabled>${user.password}</textarea>`;
        row.insertCell(2).innerHTML = `<textarea id="fullName-${index}" disabled>${user.fullName}</textarea>`;
        row.insertCell(3).innerHTML = `<textarea id="wanumber-${index}" disabled>${user.wanumber}</textarea>`;
        row.insertCell(4).innerHTML = `<textarea id="instaID-${index}" disabled>${user.instaID}</textarea>`;
        row.insertCell(5).innerHTML = `<textarea id="wallet-${index}" disabled>${user.walletAmount}</textarea>`;
        row.insertCell(6).innerText = user.lastLoginDate.toLocaleString();
        row.insertCell(7).innerText = user.registrationTime.toLocaleString();
        const statusCell = row.insertCell(8);
        const statusSelect = document.createElement('select');
        statusSelect.id = `status-${index}`;
        statusSelect.disabled = true; // 默认禁用
        const activeOption = new Option('Active', 'Active', user.accountStatus === 'Active');
        const inactiveOption = new Option('Inactive', 'Inactive', user.accountStatus === 'Inactive');
        statusSelect.appendChild(activeOption);
        statusSelect.appendChild(inactiveOption);
        statusCell.appendChild(statusSelect);
        const actionCell = row.insertCell(9);
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.classList.add('edit-save-button'); // 添加样式类
        editButton.onclick = function() {
            if (editButton.innerText === 'Edit') {
                toggleInputs(index, false);
                editButton.innerText = 'Save';
            } else {
                saveUserChanges(user.username, index);
                toggleInputs(index, true);
                editButton.innerText = 'Edit';
            }
        };
        actionCell.appendChild(editButton);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeUserBtn = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("logoutBtn");

    // 检测登录状态
    const username = localStorage.getItem("username"); // 从浏览器存储中获取用户名
    const walletAmount = localStorage.getItem("walletAmount");
  
    if (username) {
      // 如果已登录
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";
      welcomeUserBtn.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
      welcomeUserBtn.innerText = `${username}`;
  
      // 点击 welcomeUser 按钮后跳转到 profile.html
      welcomeUserBtn.addEventListener("click", function() {
        window.location.href = "profile.html";
      });
  
      // 登出按钮功能
      logoutBtn.addEventListener("click", function() {
        // 清除所有用户相关的信息
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("fullName");
        localStorage.removeItem("wanumber");
        localStorage.removeItem("instaID");
        localStorage.removeItem("walletAmount");
  
        location.reload(); // 刷新页面
      });
    } else {
      // 如果未登录
      loginBtn.style.display = "inline-block";
      registerBtn.style.display = "inline-block";
      welcomeUserBtn.style.display = "none";
      logoutBtn.style.display = "none";
    }
  
    // 侧边栏菜单的切换功能
    document.getElementById('toggleMenu').addEventListener('click', function() {
      const menu = document.getElementById('sideMenu');
      menu.classList.toggle('open');
    });
  
    document.getElementById('closeMenu').addEventListener('click', function() {
      const menu = document.getElementById('sideMenu');
      menu.classList.remove('open');
    });

    document.addEventListener("DOMContentLoaded", function() {
        const currentPath = window.location.pathname;

        // 检查路径是否以 .html 结尾
        if (currentPath.endsWith('.html')) {
            const newPath = currentPath.slice(0, -5);
            history.replaceState(null, '', newPath);
        }
    });
});

  // 监听按钮点击事件，显示注册表单和遮罩
  document.getElementById("addUser").addEventListener("click", function() {
    var overlay = document.getElementById("formOverlay");
    overlay.style.display = "flex";  // 显示遮罩和表单
  });

  // 关闭表单
  document.getElementById("closeForm").addEventListener("click", function() {
    var overlay = document.getElementById("formOverlay");
    overlay.style.display = "none";  // 隐藏遮罩和表单
  });

  // 监听表单提交事件
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单的默认提交行为
    submitRegister(); // 调用注册函数
  });

  // 提交注册表单
  async function submitRegister() {
    const submitButton = document.querySelector('.userList-addUser-submit'); // 使用相应的类名
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
  
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const fullName = document.getElementById('registerFullName').value;
    const wanumber = document.getElementById('registerWaNumber').value; // 获取 wanumber 的值
    const instaID = document.getElementById('registerInstagramID').value; // 获取 instaID 的值
  
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzasmeVkZVhxYl4sTGRBqPmnC39CI3aUmY3jWgEF6ZVDJpTdKvKtDqD3CqcI-pD7ZGO/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            action: 'register',
            username: username,
            password: password,
            fullName: fullName,
            wanumber: wanumber, // 发送 wanumber
            instaID: instaID    // 发送 instaID
          })
        });
    
        const result = await response.json();
        if (result.success) {
          document.getElementById('addUserMessage').textContent = result.message;
          location.reload(); // 注册成功后刷新页面
        } else {
          document.getElementById('addUserMessage').textContent = 'Failed to add user: ' + result.message;
        }
      } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('addUserMessage').textContent = 'Add User failed. Please try again.';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Add'; // 确保按钮文本恢复
      }
    }
  

// 页面加载时调用获取用户信息的函数，并按创建时间降序排序
window.onload = function() {
    fetchAllUsers();
};

document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-btn");
  
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener("click", function (e) {
        e.preventDefault();
  
        // 切换下拉菜单显示状态
        const dropdownContent = this.nextElementSibling;
        const icon = this.querySelector('.bx-chevron-down, .bx-chevron-up');
  
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
          icon.classList.remove('bx-chevron-up');
          icon.classList.add('bx-chevron-down');
        } else {
          dropdownContent.style.display = "block";
          icon.classList.remove('bx-chevron-down');
          icon.classList.add('bx-chevron-up');
        }
      });
    });
  });

document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
  
    // 检查路径是否以 .html 结尾
    if (currentPath.endsWith('.html')) {
        const newPath = currentPath.slice(0, -5);
        history.replaceState(null, '', newPath);
    }
  });
  
  document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = localStorage.getItem("username"); // 假设存储了用户名
  
    // 如果用户不是 admin，重定向到 index.html
    if (loggedInUser !== "admin") {
        window.location.href = "index.html"; // 重定向到 index.html
    } else {
        // 如果是 admin，显示 avatarMenu
        document.getElementById("adminSideBar").style.display = "block";
    }
    });