const Excel = require('exceljs')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

let coinID = [];
//symbol id
coinID.push("celo-euro");
coinID.push("celo-dollar");
coinID.push("celo");
coinID.push("ubeswap");
coinID.push("bitcoin");
coinID.push("moola-market");
coinID.push("mobius");
coinID.push("weth");
coinID.push("wrapped-bitcoin");
coinID.push("knoxedge");
coinID.push("poofcash");
coinID.push("resource-protocol");
coinID.push("solana");
coinID.push("truefeedbackchain");
coinID.push("premio");
coinID.push("usd-coin");
coinID.push("chubbyakita");
coinID.push("chubbydoge");
coinID.push("allbridge");
coinID.push("compound-ether");
coinID.push("saber");
coinID.push("fantom");
coinID.push("avalanche-2");
coinID.push("wmatic");
coinID.push("binancecoin");
coinID.push("aave");
coinID.push("curve-dao-token");
coinID.push("celostarter");
coinID.push("sushi");
coinID.push("moola-celo-atoken");

let timeStamp = 1483207200, dateDDMMYYYY, historyData, tokenSymbolPrice = 0;; //01-01-2017


let workbook = new Excel.Workbook()


var func = async () => {


    for (let id in coinID) {
        console.log(coinID[id],"\n");
        let worksheet = workbook.addWorksheet(coinID[id]);
        worksheet.columns = [
            { header: 'Date', key: 'date' },
            { header: 'Price', key: 'price' },
            { header: 'USD', key: 'usd' },
            { header: 'EUR', key: 'eur' },
        ]
        for (let i = timeStamp; i < (86400 * 2) + timeStamp; i = i + 86400) {

            dateDDMMYYYY = dateConvertInDDMMYYYY(i);
            historyData = await CoinGeckoClient.coins.fetchHistory(coinID[id], {
                date: dateDDMMYYYY
            });
            if(typeof historyData.data.market_data !== "undefined") {
                tokenSymbolPrice = historyData.data.market_data.current_price.usd;
            }
            
            worksheet.addRow([dateDDMMYYYY, tokenSymbolPrice, "USD"]);
            console.log(dateDDMMYYYY, "---", tokenSymbolPrice)
        }
        
    }
    await workbook.xlsx.writeFile('test.xlsx')
    console.log("complete")

}



function dateConvertInDDMMYYYY(ts) {
    var ts_ms = ts * 1000;
    var date_ob = new Date(ts_ms);
    var year = date_ob.getFullYear();
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var date = ("0" + date_ob.getDate()).slice(-2);
    var dateDDMMYYYY = date + "-" + month + "-" + year
    return dateDDMMYYYY;
}
func();