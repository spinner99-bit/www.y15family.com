const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzasmeVkZVhxYl4sTGRBqPmnC39CI3aUmY3jWgEF6ZVDJpTdKvKtDqD3CqcI-pD7ZGO/exec'; // 替换为你的 Google Apps Script URL

// 显示注册表单，隐藏登录表单
function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

// 显示登录表单，隐藏注册表单
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

// 提交注册表单
async function submitRegister() {
  const submitButton = document.querySelector('.loginSubmitBtn');
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const fullName = document.getElementById('registerFullName').value;
  let wanumber = document.getElementById('registerWaNumber').value;
  let instaID = document.getElementById('registerInstagramID').value;

  // 检查 Username 是否包含空格
  if (username.includes(' ')) {
    document.getElementById('registerMessage').textContent = 'Username tidak boleh mengandungi ruang.';
    submitButton.disabled = false;
    submitButton.textContent = 'Sign Up';
    return;
  }

  // 检查 Instagram ID 是否以 '@' 开头，如果没有则自动添加
  if (!instaID.startsWith('@')) {
    instaID = '@' + instaID;
    document.getElementById('registerInstagramID').value = instaID; // 更新输入框的值
  }

  // 检查 waNumber 开头并进行修改
  if (wanumber.startsWith('1')) {
    wanumber = '60' + wanumber; // 如果以1开头，添加60
  } else if (wanumber.startsWith('0')) {
    wanumber = '6' + wanumber; // 如果以0开头，添加6并保留0
  } else if (!wanumber.startsWith('6')) {
    // 如果不是以6开头的其他情况，可以根据需要处理
    console.warn('Wasap number must start with 6, 0, or 1.');
  }

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'register',
        username: username,
        password: password,
        fullName: fullName,
        wanumber: wanumber,
        instaID: instaID
      })
    });

    const result = await response.json();
    if (result.success) {
      // 保存所有信息到 localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('wanumber', wanumber);
      localStorage.setItem('instaID', instaID);
      localStorage.setItem('walletAmount', 0.00);

      // 登录成功后跳转到 profile.html
      window.location.href = 'index';
    } else {
      document.getElementById('registerMessage').textContent = result.message;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    document.getElementById('registerMessage').textContent = 'Registration failed. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Sign Up';
  }
}


// 提交登录表单
async function submitLogin() {
  const submitButton = document.querySelector('.loginSubmitBtn'); // 使用相应的类名
  submitButton.disabled = true;
  submitButton.textContent = 'Logging in.....';

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'login',
        username: username,
        password: password,
      })
    });

    const result = await response.json();

    if (result.success) {
      // 登录成功后，保存所有用户信息到 localStorage
      localStorage.setItem('username', result.data.username);
      localStorage.setItem('password', result.data.password);
      localStorage.setItem('fullName', result.data.fullName);
      localStorage.setItem('wanumber', result.data.wanumber);
      localStorage.setItem('instaID', result.data.instaID);  // 确保这里保存 instaID
      localStorage.setItem('walletAmount', result.data.walletAmount);

      // 跳转到 profile.html
      window.location.href = 'index';
    } else {
      alert('Login failed. Please check your username and password.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred while logging in. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Sign In'; // 确保按钮文本恢复
  }
}

// 登出功能
function logout() {
  localStorage.clear();
  updateUI(); // 更新 UI 状态
  // 重新显示登录或注册按钮
  document.getElementById('loginBtn').style.display = 'block';
  document.getElementById('registerBtn').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'none';
}

// 事件监听
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginBtn').addEventListener('click', showLoginForm);
    document.getElementById('registerBtn').addEventListener('click', showRegisterForm);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

    // 侧边栏菜单的切换功能
    document.getElementById('toggleMenu').addEventListener('click', function() {
      const menu = document.getElementById('sideMenu');
      menu.classList.toggle('open');
    });
  
    document.getElementById('closeMenu').addEventListener('click', function() {
      const menu = document.getElementById('sideMenu');
      menu.classList.remove('open');
    });

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
