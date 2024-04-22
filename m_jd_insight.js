/*
0 9,22 * * * m_jd_insight.js
 */
const {Env} = require('./magic');
const $ = new Env('M京调研问卷')
let answerList = []
$.logic = async function (m) {
    let url = 'https://answer.jd.com/community/survey/list'
    let headers = {
        "Cookie": $.cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1"
    }
    let {data} = await $.request(url, headers)
    if (data.result === true) {
        let surveyList = data?.messages?.list || [];
        if (surveyList.length === 0) {
            $.log('当前账户没有京调研问卷')
            return
        }
        for (let ele of surveyList) {
            answerList.push(...ele.surveyList)
        }
    } else {
        $.log('京洞察调研列表请求错误 返回结果为空' + JSON.stringify(data))
    }
}
$.after = async function () {
    if (answerList.length === 0) {
        $.msg.push("所有账号均无问卷")
        return
    }
    for (let i = 0; i < unp(answerList, "surveyId").length; i++) {
        let ele = unp(answerList, "surveyId")[i];
        $.msg.push(`${i + 1} 【${ele.title}】 ${ele.subTitle} ${ele.answerUrl}`)
    }
}

function unp(arr, p) {
    const m = new Map();
    for (const obj of arr) {
        const key = obj[p];
        if (!m.has(key)) {
            m.set(key, obj);
        }
    }
    return Array.from(m.values());
}
$.run({}).catch(reason => $.log(reason));

