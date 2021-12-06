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


let nameFileExcel = 'History.xlsx'
var workbook = new Excel.Workbook();

var marketRange = async () => {
    let fromDate = 1622484000;
    let toDate = 1622829600    ;
    for (let id in coinID) {
        console.log(coinID[id]);
       

        let marketData = await CoinGeckoClient.coins.fetchMarketChartRange(coinID[id], {
            from: fromDate, //Tue Apr 21 2020 18:00:00 GMT+0000

            to: toDate,//Mon Jun 29 2020 18:00:00 GMT+0000
            vs_currency: ['usd'],
        });
        if (typeof marketData.data.prices !== "undefined") {
            // console.log(marketData.data.prices," Data");
            const pricingMap = new Map();
            for (let i in marketData.data.prices) {
                var nameArr = marketData.data.prices[i].toString()
                //console.log(marketData.data.prices,"sss");
                nameArr = nameArr.split(',');
                let date = dateConvertInDDMMYYYY(nameArr[0] / 1000);
                pricingMap.set(date, nameArr[1]);

            }
            for (let i = fromDate; i < toDate + 100; i = i + 86400) {
                workbook.xlsx.readFile(nameFileExcel)
                    .then(function () {
                        var worksheet = workbook.getWorksheet(coinID[id]);
                        var lastRow = worksheet.lastRow;
                        var getRowInsert = worksheet.getRow(++(lastRow.number));
                        getRowInsert.getCell('A').value = dateConvertInDDMMYYYY(i);
                        getRowInsert.getCell('B').value =pricingMap.get(dateConvertInDDMMYYYY(i));
                        getRowInsert.commit();
                        return workbook.xlsx.writeFile(nameFileExcel);
                    });
                console.log(dateConvertInDDMMYYYY(i), " Date - Price USD", pricingMap.get(dateConvertInDDMMYYYY(i)));
                //worksheet.addRow([dateConvertInDDMMYYYY(i), pricingMap.get(dateConvertInDDMMYYYY(i))]);

            }
        }
        else console.log("No Data");


    }
    //await workbook.xlsx.writeFile(dateConvertInDDMMYYYY(fromDate) + '_HistoricalPrice_' + dateConvertInDDMMYYYY(toDate) + '.xlsx')
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
//fetchHistory();
marketRange();