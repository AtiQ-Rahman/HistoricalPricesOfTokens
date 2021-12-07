const Excel = require('exceljs')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko({
    timeout: 90000,
    autoRetry: true,
});

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
//Tue Apr 21 2020 18:00:00 GMT+0000
//1587405600
let timeStamp = 1587405600, dateDDMMYYYY, historyData, tokenSymbolPriceUSD = 0, tokenSymbolPriceEUR = 0;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
let workbook = new Excel.Workbook()
var fs = require('fs');
let flag = true;
let csvFormatData;
let halum=[];
let index=86400;
const pricingMap = new Map();
var writeCSV = async () => {
    let i;
    for (i = timeStamp; i < Math.floor(Date.now() / 1000) ; i = i + 86400) {
       
        index+=86400;
        if(index!=i){

        }
        dateDDMMYYYY = dateConvertInDDMMYYYY(i);
        console.log(dateDDMMYYYY,"---------Date")
        csvFormatData=dateDDMMYYYY+",";
        let id;
        try {
            for (id in coinID) {
                historyData = await CoinGeckoClient.coins.fetchHistory(coinID[id], {
                    date: dateDDMMYYYY
                });
                if (typeof historyData.data.market_data !== "undefined") {
                    tokenSymbolPriceUSD = historyData.data.market_data.current_price.usd;
                    tokenSymbolPriceEUR = historyData.data.market_data.current_price.eur;

                }
                else {
                    tokenSymbolPriceUSD = " ";
                    tokenSymbolPriceEUR = " ";
                }
                
                console.log(coinID[id],"---",dateDDMMYYYY, "---", tokenSymbolPriceUSD, "---", tokenSymbolPriceEUR);
                csvFormatData+=coinID[id]+","+tokenSymbolPriceUSD+"USD,"+tokenSymbolPriceEUR+"EUR,";
               
                
            }
            pricingMap.set(dateDDMMYYYY,csvFormatData);
            //halum.push(csvFormatData);
        }
        catch (e) {
            
            flag=false;
            console.log('wait before');
            i=i-86400;
            sleep(60000);
            console.log('wait after');
            console.log(e)
        }
        //csvFormatData+="\n";
       

    }
    let csv;
    for(i = timeStamp; i < Math.floor(Date.now() / 1000) ; i = i + 86400){
        pricingMap.get(dateConvertInDDMMYYYY(i));
        csv+=  pricingMap.get(dateConvertInDDMMYYYY(i))+"\n";
    }
    var stream = fs.createWriteStream("HistoricalPriceInSingleSheet.csv");
    stream.once('open', function (fd) {
        stream.write(csv);

        stream.end();
    });
    console.log("Complete");
}
var fetchHistory = async () => {


    for (let id in coinID) {
        console.log(coinID[id], "\n");
        let worksheet = workbook.addWorksheet(coinID[id]);
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'USD', key: 'usd', width: 20 },
            { header: 'EUR', key: 'eur', width: 20 },
        ]

        for (let i = timeStamp; i < Math.floor(Date.now() / 1000); i = i + 86400) {
            index++;
            dateDDMMYYYY = dateConvertInDDMMYYYY(i);

            try {
                historyData = await CoinGeckoClient.coins.fetchHistory(coinID[id], {
                    date: dateDDMMYYYY
                });

            }
            catch (e) {
                console.log('wait before');
                sleep(60000);
                console.log('wait after');
                console.log(e)
            }

            if (typeof historyData.data.market_data !== "undefined") {
                tokenSymbolPriceUSD = historyData.data.market_data.current_price.usd;
                tokenSymbolPriceEUR = historyData.data.market_data.current_price.eur;

            }
            worksheet.addRow([dateDDMMYYYY, tokenSymbolPriceUSD, tokenSymbolPriceEUR]);
            console.log(dateDDMMYYYY, "---", tokenSymbolPriceUSD, "---", tokenSymbolPriceEUR);
        }

    }
    await workbook.xlsx.writeFile('HistoricalPrice.xlsx')
    console.log("complete")


}


var marketRange = async () => {
    let fromDate = Math.floor(Date.now() / 1000) - 86400;
    let toDate = Math.floor(Date.now() / 1000);
    for (let id in coinID) {
        console.log(coinID[id]);
        let worksheet = workbook.addWorksheet(coinID[id]);
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'EUR', key: 'eur', width: 20 },
        ]

        let marketData = await CoinGeckoClient.coins.fetchMarketChartRange(coinID[id], {
            from: fromDate, //Tue Apr 21 2020 18:00:00 GMT+0000

            to: toDate,//Mon Jun 29 2020 18:00:00 GMT+0000
            vs_currencies: ['eur', 'usd'],
        });
        console.log(marketData, "market data")
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
                console.log(dateConvertInDDMMYYYY(i), " Date - Price EUR", pricingMap.get(dateConvertInDDMMYYYY(i)));
                // worksheet.addRow([dateConvertInDDMMYYYY(i), pricingMap.get(dateConvertInDDMMYYYY(i))]);

            }
        }
        else console.log("No Data");


    }
    //await workbook.xlsx.writeFile(dateConvertInDDMMYYYY(fromDate)+'_HistoricalPriceJPY_'+dateConvertInDDMMYYYY(toDate)+'.xlsx')
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
//marketRange();
writeCSV();
