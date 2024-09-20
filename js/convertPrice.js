function toDedust() {
	let unit = 1e9
	if (desc == 1) {
		unit = fromToken.name == 'USDT' ? 1e6 : 1e9
		window.open(
			`https://dedust.io/swap/${fromToken.address}/${toToken.address}?amount=${myInput.value * unit}`
		)
	} else {
		unit = toToken.name == 'USDT' ? 1e6 : 1e9
		window.open(
			`https://dedust.io/swap/${toToken.address}/${fromToken.address}?amount=${myInput.value * unit}`
		)
	}
}

function updateOtherValue() {
	if (desc == 1) {
		$('#logo1').attr('src', fromToken.logo)
		$('#token1').html(fromToken.name)
		$('#logo2').attr('src', toToken.logo)
		$('#token2').html(toToken.name)
		$('#logo11') && $('#logo11').attr('src', fromToken.logo)
		$('#token11') && $('#token11').html(fromToken.name)
		$('#logo22') && $('#logo22').attr('src', toToken.logo)
		$('#token22') && $('#token22').html(toToken.name)
	} else {
		$('#logo1').attr('src', toToken.logo)
		$('#token1').html(toToken.name)
		$('#logo2').attr('src', fromToken.logo)
		$('#token2').html(fromToken.name)
		$('#logo11') && $('#logo11').attr('src', toToken.logo)
		$('#token11') && $('#token11').html(toToken.name)
		$('#logo22') && $('#logo22').attr('src', fromToken.logo)
		$('#token22') && $('#token22').html(fromToken.name)
	}
	let getPrice = 0
	if (desc == 1) {
		let price = tradePrice[fromToken.name.toLowerCase()][toToken.name.toLowerCase()]
		$('#computed') && $('#computed').html(
			`1${fromToken.name}≈${tradePrice[fromToken.name.toLowerCase()][toToken.name.toLowerCase()]}${toToken.name}`
		)
		getPrice = (myInput.value * price).toFixed(4)

	} else {
		let price = tradePrice[toToken.name.toLowerCase()][fromToken.name.toLowerCase()]
		$('#computed') && $('#computed').html(
			`1${toToken.name}≈${tradePrice[toToken.name.toLowerCase()][fromToken.name.toLowerCase()]}${fromToken.name}`
		)
		getPrice = (myInput.value * price).toFixed(4)

	}
	if ((toToken.name == 'USDT' && desc == 1) || (fromToken.name == 'USDT' && desc == 2)) {
		$('#doller1') && $('#doller1').html('≈$' + getPrice)
		$('#doller2') && $('#doller2').html('≈$' + getPrice)
	} else if ((fromToken.name == 'USDT' && desc == 1) || (desc == 2 && toToken.name == 'USDT')) {
		$('#doller1') && $('#doller1').html('≈$' + (myInput.value || 0))
		$('#doller2') && $('#doller2').html('≈$' + (myInput.value || 0))
	} else {
		$('#doller1') && $('#doller1').html('≈$0')
		$('#doller2') && $('#doller2').html('≈$0')
	}
	$('#getPrice') && $('#getPrice').html(getPrice)
}

function setCheckToken(item) {
	console.log(type, item);
	console.log(type, desc);
	if ((type == 1 && desc == 1) || (type == 2 && desc == 2)) {
		fromToken = item
	} else {
		toToken = item
	}
	updateOtherValue()
	assetModal.style.animation = "slideUp 0.4s forwards"; // 应用上滑动画
	setTimeout(function() {
		assetPopup.style.display = "none";
	}, 40); // 动画完成后隐藏模态框 
}

function renderTokens() {
	let tokenText = ''
	console.log(55, tokensList);
	fromToken = fromToken || tokensList[0]
	toToken = toToken || tokensList[1]
	tokensList.forEach(item => {
		tokenText += `
					<div class="flex-bw">
						<div class="flex" data-token='${JSON.stringify(item)}'>
							<div class="dot"></div>
							<img src="${item.logo}"></img>
							<span>${item.name}</span>
						</div>
					</div>`
	})
	listWrap.innerHTML = tokenText
	// 动态添加事件监听器  
	listWrap.querySelectorAll('.flex').forEach(element => {
		element.addEventListener('click', function() {
			const item = JSON.parse(this.getAttribute('data-token'));
			setCheckToken(item);
		});
	});
	document.querySelectorAll('.dot').forEach(item => {
		var randomColor = 'rgb(' +
			(Math.floor(Math.random() * 256)) + ',' +
			(Math.floor(Math.random() * 256)) + ',' +
			(Math.floor(Math.random() * 256)) + ')';
		item.style.backgroundColor = randomColor;
	})
}

function tradePriceInfo() {
	apiHttp($, "/api/contract/index/tradePriceInfo").then(res => {
		if (res.code == 1) {
			tradePrice = res.data
		}
	})
}