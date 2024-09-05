const baseUrl = 'https://ton.babysdogeswap.net'
let token = localStorage.getItem('token') || ''
let baseLang = localStorage.getItem('lang') || 'CN'
$('#setLang').text(baseLang)
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
	manifestUrl: 'https://Babydogeswap-ai.github.io/babydogeswap/tonconnect-manifest.json',
	buttonRootId: 'ton-connect'
});

function updateToken() {
	var tokenPramas = { // 要发送给后端的数据
		'token': token,
		lang: baseLang == 'EN' ? 'en' : 'zh-cn'
	}
	return tokenPramas
}

function apiHttp($, url, params = {}) {
	let tokenPramas = updateToken()
	return new Promise((resolve, reject) => {
		$.ajax({
			url: baseUrl + url,
			dataType: "jsonp",
			jsonp: 'callback',
			data: Object.assign(tokenPramas, params),
			success: (res) => {
				resolve(res)
				if (res.code != 1) {
					toast(res.msg)
				}
			},
			error: (error) => {
				console.log('error', error);

				reject(error)
			},
		})
	})
}

function setFooter(data) {
	document.querySelectorAll('.twaName').forEach(item => {
		item.innerHTML = data.name
	})
	document.title = data.name;
	let ourCommunity = document.getElementById('ourCommunity')
	let dt1 = document.getElementById('dt1')
	let dt2 = document.getElementById('dt2')
	let dt3 = document.getElementById('dt3')
	// let addr = localStorage.getItem('address')
	// let walletAddress = document.getElementById('walletAddress')
	// if (walletAddress) {
	// 	walletAddress.innerHTML = sliceAddress(addr, 4, 4)
	// }
	if (dt1) {
		dt1.innerHTML = ''
		data.article1.forEach(item => {
			const li = document.createElement('li');
			li.innerHTML = item.title
			dt1.appendChild(li);
			li.addEventListener('click', () => {
				window.open(item.url)
			})
		})
	}
	if (dt2) {
		dt2.innerHTML = ''
		data.article2.forEach(item => {
			const li = document.createElement('li');
			li.innerHTML = item.title
			dt2.appendChild(li);
			li.addEventListener('click', () => {
				window.open(item.url)
			})
		})
	}
	if (dt3) {
		dt3.innerHTML = ''
		data.article3.forEach(item => {
			const li = document.createElement('li');
			li.innerHTML = item.title
			dt3.appendChild(li);
			li.addEventListener('click', () => {
				window.open(item.url)
			})
		})
	}
	if (ourCommunity) {
		ourCommunity.innerHTML = ''
		data.article4.forEach((item, i) => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const img = document.createElement('img');
			div.classList.add('flex')
			span.innerHTML = item.title
			img.src = './images/us' + i + '.png'
			div.appendChild(img);
			div.appendChild(span);
			ourCommunity.appendChild(div);
			div.addEventListener('click', () => {
				window.open(item.url)
			})
		})
	}

}
let popup = document.getElementById('popup')
let popup1 = document.getElementById('popup1')
let morePopup = document.getElementById('morePopup')
let moreModal = document.getElementById('moreModal')
let bindWallet = document.getElementById('bindWallet')
let walletWrap = document.getElementById('walletWrap')

function closeModal() {
	popup.style.display = 'none';
}

function extractInviteCode(url) {
	// 使用正则表达式匹配 inviteCode= 后面的数字  
	let match = ''
	if (url.indexOf('tgWebAppStartParam') != -1) {
		match = url.match(/tgWebAppStartParam=(\d+)/);
	}
	if (url.indexOf('inviteCode') != -1) {
		match = url.match(/inviteCode=(\d+)/);
	}
	if (match) {
		// 如果匹配成功，返回匹配到的数字  
		return match[1];
	}
	// 如果没有匹配到，返回 null 或其他你希望的值  
	return null;
}

function showMore(e) {
	console.log('xxxxx', location.href);
	morePopup.style.display = 'flex';
	moreModal.style.animation = "toLeftAnimate 0.4s forwards"; // 应用上滑动画  
}
// 点击模态框外部时，也关闭它  
window.onclick = function(event) {
	console.log('window.onclick10011111111111111');
	if (event.target == popup) {
		popup.style.display = "none";
	} else if (event.target == popup1) {
		popup1.style.display = "none";
	} else if (event.target == morePopup) {
		moreModal.style.animation = "toRightAnimate 0.4s forwards"; // 应用上滑动画  
		setTimeout(() => {
			morePopup.style.display = "none";
		}, 200)
	}
}

function sliceAddress(address, num1 = 4, num2 = 5) {
	if (!address) {
		return ''
	}
	return address.substr(0, num1) + '****' + address.substring(address.length - num2)
};

function formatTimestamp(timestamp, type) {
	// 创建一个Date对象  
	const date = new Date(timestamp * 1000); // 注意：JavaScript中的Date期望毫秒为单位，所以可能需要乘以1000  

	// 提取年月日时分秒  
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要+1  
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// 拼接成目标格式  
	if (type == 'date') {
		return `${year}-${month}-${day}`
	} else if (type == 'time') {
		return `${hours}:${minutes}:${seconds}`;
	}
}

function toast(msg) {
	// alert(msg)
	// Telegra.WebApp.showAlert(msg)
	document.getElementById("toastModal").style.display = "block";
	document.getElementById("toastMsg").innerHTML = msg
	setTimeout(() => {
		document.getElementById("toastModal").style.display = "none";
	}, 1000)
}

async function copy() {
	let addr = localStorage.getItem('userAddress')
	// navigator.clipboard.writeText(addr)
	copyTextToClipboard(addr)
	if (baseLang == 'EN') {
		toast('Replicating Success')
	} else {
		toast('复制成功')
	}
}

function copyTextToClipboard(text) {
	// 创建一个临时的textarea元素  
	const textarea = document.createElement('textarea');

	// 设置textarea为不可见  
	textarea.style.position = 'fixed'; // 固定定位  
	textarea.style.opacity = 0; // 透明度为0  
	textarea.style.left = '-9999px'; // 移到屏幕外  

	// 将需要复制的文本设置到textarea中  
	textarea.value = text;

	// 将textarea添加到body中  
	document.body.appendChild(textarea);

	// 选中textarea的全部内容  
	textarea.select();

	try {
		// 执行复制操作  
		const successful = document.execCommand('copy');
		const msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.error('Oops, unable to copy', err);
	}

	// 移除textarea  
	document.body.removeChild(textarea);
}
window.addEventListener('ton-connect-connection-completed', (event) => {
	console.log('Transaction init==============', event, event.detail.wallet_address);
	let inviteCode = extractInviteCode(location.href)
	console.log('inviteCode.........', inviteCode);
	let address = event.detail.wallet_address
	localStorage.setItem('address', address)
	let addr = trsAddress(address)

	if (!token) {
		setTimeout(() => {
			login(addr, inviteCode)
		}, 500)
	} else {
		loadData()
	}
});


window.addEventListener('ton-connect-disconnection', (event) => {
	console.log('断开连接！！！！！！！', event.detail.wallet_address);
	localStorage.clear()
	token = ''
});

function login(address, inviteCode) {
	let res = md5(address);
	let sign = md5(res);
	console.log(333, sign);
	apiHttp($, "/api/contract/auth/login", {
		address: address,
		inviteCode: inviteCode || '',
		sign: sign
	}).then(res => {
		console.log(res);
		if (res.code == 1) {
			token = res.data.userInfo.token
			updateToken()
			localStorage.setItem('token', res.data.userInfo.token)
			localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
			setTimeout(() => {
				loadData()
			}, 100)
		}
	})
}

function getIndexInfo() {
	let data = localStorage.getItem('twaInfo')
	apiHttp($, "/api/contract/index/index").then(res => {
		if (res.code == 1) {
			localStorage.setItem('twaInfo', JSON.stringify(res.data))
			setFooter(res.data)
		}
	})
}

function showLoading() {
	document.getElementById("loadingModal").style.display = "block";
}

function hideLoading() {
	document.getElementById("loadingModal").style.display = "none";
}
let setLang = document.getElementById('setLang')
if (setLang) {
	setLang.addEventListener('click', () => {
		let lang = $('#setLang').text()
		console.log(lang);
		if (lang == 'CN') {
			baseLang = 'EN'
		} else {
			baseLang = 'CN'
		}
		$('#setLang').text(baseLang)
		localStorage.setItem('lang', baseLang)
		location.reload()
	})
}

function loadFooterText() {
	if (baseLang == 'EN') {
		$('#joinus') && $('#joinus').html('Join our community')
		$('#joinText1') && $('#joinText1').html('explore')
		$('#joinText2') && $('#joinText2').html('user')
		$('#joinText3') && $('#joinText3').html('develop')
		$('#tabbarText1') && $('#tabbarText1').html('transaction')
		$('#tabbarText2') && $('#tabbarText2').html('pond')
		$('#tabbarText3') && $('#tabbarText3').html('Destruction')
		$('#tabbarText4') && $('#tabbarText4').html('bridge')
		$('#tabbarText5') && $('#tabbarText5').html('Community token')
		$('#moreText1') && $('#moreText1').html('address:')
		$('#moreText2') && $('#moreText2').html('home page')
		$('#moreText3') && $('#moreText3').html('My assets')
		$('#moreText4') && $('#moreText4').html('the charts')
		$('#moreText5') && $('#moreText5').html('invite')
		$('#loadText') && $('#loadText').html('loading...')

	} else {
		$('#joinus') && $('#joinus').html('加入我们的社区')
		$('#joinText1') && $('#joinText1').html('探索')
		$('#joinText2') && $('#joinText2').html('用户')
		$('#joinText3') && $('#joinText3').html('开发')
		$('#tabbarText1') && $('#tabbarText1').html('交易')
		$('#tabbarText2') && $('#tabbarText2').html('池子')
		$('#tabbarText3') && $('#tabbarText3').html('销毁')
		$('#tabbarText4') && $('#tabbarText4').html('跨链桥')
		$('#tabbarText5') && $('#tabbarText5').html('社区代币')
		$('#moreText1') && $('#moreText1').html('钱包地址:')
		$('#moreText2') && $('#moreText2').html('首页')
		$('#moreText3') && $('#moreText3').html('我的资产')
		$('#moreText4') && $('#moreText4').html('排行榜')
		$('#moreText5') && $('#moreText5').html('邀请')
		$('#loadText') && $('#loadText').html('加载中...')

	}
}