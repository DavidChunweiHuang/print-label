async function fetchData() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic RGx5SWtwRHJtbHd3Q3lUQ0FLNXpSbitNNDFCTzBoS050ODN4OS9yVm8vclNLRmxDOTRTYURicmdyczdUa2t5b0xyUjlrM0UzUlVFPQ==");
    myHeaders.append("Cookie", "JSESSIONID=node0baq2q3668zvejyqjpz47x2y59128.node0");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const productName = [];
    const price = [];
    const barcode = [];

    await fetch("https://ap11.ragic.com/thesunalley/for-testing/13?PAGEID=V0C", requestOptions)
        .then((response) => { return response.json() })
        .then((result) => {
            console.log(result)
            const length = Object.keys(result).length

            Object.keys(result).forEach(key => {
                const elementData = result[key];
                console.log(`屬性 ${key} 的值：`, elementData);
                Object.keys(elementData).forEach((data, index) => {
                    if (data === "商品名稱") {

                        productName.push(elementData[data])
                    }
                    if (data === "售價") {

                        price.push(elementData[data])
                    }
                    if (data === "商品條碼") {

                        barcode.push(elementData[data])
                    }
                })
            });

        })
        .catch((error) => console.error(error));

    console.log(`Product: ${productName}`);
    console.log(`price: ${price}`);
    console.log(`barcode: ${barcode}`);

    const main_container = document.querySelector(".main-container")
    barcode.forEach((code, index) => {
        // 建立一個容器 div，方便排版
        const div = document.createElement("div");
        div.classList.add("container");
        // div.classList.add("single-page");

        // 建立上方的方形區域
        const top_box = document.createElement("div");
        top_box.classList.add("box");
        top_box.classList.add("top-box");

        // 上方的文字
        const inline_name = document.createElement("p");
        inline_name.classList.add("inline-name");
        inline_name.innerHTML = productName[index]

        const inline_code = document.createElement("p");
        inline_code.innerHTML = barcode[index]

        const inline_price = document.createElement("p")
        const formatter = new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            maximumFractionDigits: 0 // 不顯示小數
        })
        inline_price.innerHTML = `${formatter.format(price[index])}`

        // 建立下方的方形區域
        const bottom_box = document.createElement("div");
        bottom_box.classList.add("box");
        bottom_box.classList.add("bottom-box");
        bottom_box.id = "bottom-box"
        // 使用動態 id，避免重複
        bottom_box.id = "bottom-box-" + index;


        // 將 SVG 加入 bottom box 中，再加入容器中
        top_box.append(inline_code, inline_name, inline_price)
        // bottom_box.appendChild(svg);
        div.append(top_box, bottom_box)

        main_container.appendChild(div);

        new QRCode(bottom_box, {
            text: code,               // 使用迴圈中 barcode 陣列的每個字串
            width: 45,                // QRCode 寬度，57 像素大約等於 15mm (依據 96 DPI 計算)
            height: 45,               // QRCode 高度
            colorDark: "#000000",     // QRCode 主要顏色
            colorLight: "#ffffff",    // QRCode 背景顏色
            correctLevel: QRCode.CorrectLevel.H  // 高容錯等級
        });

    });

}

// 頁面載入時自動呼叫 fetchData
window.onload = fetchData
