﻿/**********************************
* @author:       chenzx@Ctrip.com
* @description:  区域城市映射关系
*/
define([], function () {

    // 区域城市映射关系
    var AREA = {
        cityToArea: {
            // 华东
            EASTOFCHINA: ["2", "14", "82", "12", "512", "278", "13", "213", "17", "491", "578", "536", "375"],
            // 华北
            NORTHOFCHINA: ["533", "7", "479", "144", "451", "523", "142", "5", "158", "6", "1", "103", "428", "105", "141", "527", "140", "3"],
            // 华南
            SOUTHOFCHINA: ["25", "258", "406", "477", "376", "559", "206", "32", "43", "42", "447", "380", "31", "251", "553", "316", "30", "223"],
            // 华西
            WESTOFCHINA: ["28", "34", "494", "370", "109", "39", "100", "124", "41", "99", "38", "4", "10"]
        },
        areaToCn: {
            EASTOFCHINA: "华东",
            SOUTHOFCHINA: "华南",
            WESTOFCHINA: "华西",
            NORTHOFCHINA: "华北"
        }
    };

    return AREA;
});