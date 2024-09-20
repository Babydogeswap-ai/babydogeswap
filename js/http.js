const baseUrl = 'https://ton.babysdogeswap.net'
let token = localStorage.getItem('token') || ''
let baseLang = localStorage.getItem('lang') || 'CN'
let bdsAddress = ''
let burnAddress = ''
let exchangeAddress = ''
let usdtAddress = ''
let tokensList = []
let myAddress = ''

function initTokens() {
	tokensList = [{
			name: 'BDS',
			address: bdsAddress,
			logo: './images/bds.png'
		}, {
			name: 'USDT',
			address: usdtAddress,
			logo: './images/usdt.png'
		}, {
			name: 'TON',
			address: 'TON',
			logo: './images/ton.png'
		}, {
			name: 'DOGS',
			address: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS',
			logo: './images/dogs.png'
		}, {
			name: 'NOT',
			address: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT',
			logo: './images/not_logo.png'
		}, {
			name: 'REDO',
			address: 'EQBZ_cafPyDr5KUTs0aNxh0ZTDhkpEZONmLJA2SNGlLm4Cko',
			logo: './images/resistance-dog.png'
		},
		// {
		// 	name: 'HAMSTER',
		// 	address: 'EQACdLIfYndNS6mQ-Mb31mJjj0RBabGxqDQMBQAqSw5xbuer',
		// 	logo: './images/hams.png'
		// }, 
		{
			name: 'STON',
			address: 'EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO',
			logo: './images/ston.png'
		}
	]
}

$('#setLang').text(baseLang)
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
	manifestUrl: 'https://babydogeswap-ai.github.io/babydogeswap/tonconnect-manifest.json',
	buttonRootId: 'ton-connect'
});
getTonProof()

function getTonProof() {
	apiHttp($, "/api/contract/auth/getCodeInfo").then(res => {
		if (res.code == 1) {
			tonConnectUI.setConnectRequestParameters({
				state: 'loading'
			});
			tonConnectUI.setConnectRequestParameters({
				state: "ready",
				value: {
					tonProof: res.data.payload
				}
			});
		}
	})
}

function updateToken() {
	var tokenPramas = { // 要发送给后端的数据
		'token': token,
		lang: baseLang == 'EN' ? 'en' : 'zh-cn'
	}
	return tokenPramas
}

function trsAddress(address) {
	let addr = TonConnectSDK.toUserFriendlyAddress(address)
	localStorage.setItem('userAddress', addr)
	$('#walletAddress').text(sliceAddress(addr, 4, 4))
	return addr
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
	bdsAddress = data.bdsAddress
	burnAddress = data.burnAddress
	exchangeAddress = data.exchangeAddress
	usdtAddress = data.usdtAddress
	localStorage.setItem('usdtAddress', usdtAddress)
	localStorage.setItem('burnAddress', burnAddress)
	localStorage.setItem('exchangeAddress', exchangeAddress)
	localStorage.setItem('bdsAddress', bdsAddress)
	initTokens()
	let ourCommunity = document.getElementById('ourCommunity')
	let dt1 = document.getElementById('dt1')
	let dt2 = document.getElementById('dt2')
	let dt3 = document.getElementById('dt3')
	
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

function getIframeEle(elementId, frameId = 'modalFrame') {
	var iframe = document.getElementById(frameId);
	var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	// 获取iframe中的元素
	var elementInIframe = iframeDoc.getElementById(elementId); // 假设iframe.html中有一个id为'elementId'的元素
	return elementInIframe
};

function showMore(e) {
	morePopup.style.display = 'flex';
	moreModal.style.animation = "toLeftAnimate 0.4s forwards"; // 应用上滑动画  
}
// 点击模态框外部时，也关闭它  
window.onclick = function(event) {
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
	document.getElementById("toastModal").style.display = "block";
	document.getElementById("toastMsg").innerHTML = msg
	setTimeout(() => {
		document.getElementById("toastModal").style.display = "none";
	}, 1000)
}

async function copy() {
	copyTextToClipboard(myAddress)
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
	} catch (err) {
	}

	// 移除textarea  
	document.body.removeChild(textarea);
}
let signPayload = ''
window.addEventListener('ton-connect-connection-completed', (event) => {
	console.log('Transaction init==============', event, event.detail.wallet_address);
	if (tonConnectUI.connector._wallet.connectItems) {
		let oriAddress = tonConnectUI.connector._wallet.account.address
		let network = tonConnectUI.connector._wallet.account.chain
		let public_key = tonConnectUI.connector._wallet.account.publicKey
		let state_init = tonConnectUI.connector._wallet.account.walletStateInit
		let proof = tonConnectUI.connector._wallet.connectItems.tonProof.proof
		proof.state_init = state_init
		signPayload = {
			address: oriAddress,
			network,
			public_key,
			proof
		}

	}
	let inviteCode = extractInviteCode(location.href)
	let address = event.detail.wallet_address
	let preAddress = localStorage.getItem('address')
	localStorage.setItem('address', address)
	let addr = TonConnectSDK.toUserFriendlyAddress(address)
	$('#walletAddress') && $('#walletAddress').text(sliceAddress(addr, 4, 4))
	myAddress = addr
	if (!token || preAddress != address) {
		setTimeout(() => {
			login(addr, inviteCode)
		}, 500)
	} else {
		loadData()
	}
});
window.addEventListener('ton-connect-connection-started', (event) => {
	// console.log('链接钱包前-------------', event, event.detail.wallet_address);

});

window.addEventListener('ton-connect-disconnection', (event) => {
	// console.log('断开连接！！！！！！！', event.detail.wallet_address);
	localStorage.clear()
	token = ''
});

function login(address, inviteCode) {
	let res = md5(address);
	let sign = md5(res);
	apiHttp($, "/api/contract/auth/login", {
		address: address,
		inviteCode: inviteCode || '',
		sign: sign,
		 body: JSON.stringify(signPayload)

	}).then(res => {
		if (res.code == 1) {
			token = res.data.userInfo.token
			updateToken()
			localStorage.setItem('token', res.data.userInfo.token)
			localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
			setTimeout(() => {
				loadData()
			}, 100)
		} else {
			tonConnectUI.disconnect();
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

async function showLoading() {
	document.getElementById("loadingModal").style.display = "block";
}

function hideLoading() {
	document.getElementById("loadingModal").style.display = "none";
}
let setLang = document.getElementById('setLang')
if (setLang) {
	setLang.addEventListener('click', () => {
		let lang = $('#setLang').text()
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
let balance = ''
async function initWallet() {
	let tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
		apiKey: '682589248b2c93bda9856a97cca0179ed0d0f3a0c7a8829e671b049fdf408754'
	}));
	const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
		address: usdtAddress
	});
	const jettonAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(myAddress));
	let jettonWalletAddress = jettonAddress.toString(true, true, true)
	return jettonWalletAddress

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
		$('#moreText6') && $('#moreText6').html('payment password')

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
		$('#moreText6') && $('#moreText6').html('支付密码')
		$('#loadText') && $('#loadText').html('加载中...')

	}
}