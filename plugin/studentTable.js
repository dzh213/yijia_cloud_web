layui.define(['table', 'common'], function (exports) {
    var table = layui.table;
    var common = layui.common;

    table.render({
        elem: '#studentTable',
        url: common.admin + "/student/list",
        method: "post",
        contentType: "application/json",
        request: {
            pageName: 'pageIndex', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": res.code, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.records //解析数据列表
            };
        },
        response: {
            statusCode: 200 //规定成功的状态码，默认：0
        },
        toolbar: '#applytoolbar',
        cellMinWidth: 95,
        page: true,
        height: "full-20",
        limit: 20,
        limits: [10, 15, 20, 25],
        // id : "systemLog",
        cols: [[
            {type:'radio'},
            { field: '', title: '序号', type: 'numbers' },
            { field: 'applyDate', title: '报名日期', width: 110 },
            { field: 'studentNumber', title: '学员编号', align: "center" },
            { field: 'studentName', title: '姓名' },
            { field: 'idCard', title: '身份证号' },
            { field: 'sex', title: '性别' },
            { field: 'licenceType', title: '车型' },
            { field: 'phoneNumber', title: '电话' },
            { field: 'address', title: '住址', width: 200 },
            { field: 'introducerName', title: '介绍人' },
            { field: 'tuition', title: '金额' },
            { field: 'addToPrice', title: '追加金额' },
            { field: 'addToPriceDate', title: '追加日期' },
            {
                field: 'stage', title: '阶段', templet: function (param) {

                }
            },
            { field: 'dropOutDate', title: '退学日期' },
            { field: 'refundPrice', title: '退学金额' },
            { field: 'remarkA', title: '备注A' },
            { field: 'remarkC', title: '备注C' },
            { field: 'insureDate', title: '起保日期', width: 110 },
            { field: 'trainDate', title: '培训日期', width: 110 }
            // {field: 'method', title: '操作方式', align:'center',templet:function(d){
            //     if(d.method.toUpperCase() == "GET"){
            //         return '<span class="layui-blue">'+d.method+'</span>'
            //     }else{
            //         return '<span class="layui-red">'+d.method+'</span>'
            //     }
            // }},
            // {field: 'ip', title: '操作IP',  align:'center',minWidth:130},
            // {field: 'timeConsuming', title: '耗时', align:'center',templet:function(d){
            //     return '<span class="layui-btn layui-btn-normal layui-btn-xs">'+d.timeConsuming+'</span>'
            // }},
            // {field: 'isAbnormal', title: '是否异常', align:'center',templet:function(d){
            //     if(d.isAbnormal == "正常"){
            //         return '<span class="layui-btn layui-btn-green layui-btn-xs">'+d.isAbnormal+'</span>'
            //     }else{
            //         return '<span class="layui-btn layui-btn-danger layui-btn-xs">'+d.isAbnormal+'</span>'
            //     }
            // }},
            // {field: 'operator',title: '操作人', minWidth:100, templet:'#newsListBar',align:"center"},
            // {field: 'operatingTime', title: '操作时间', align:'center', width:170}
        ]]
    });

    //头工具栏事件
    table.on('toolbar(studentTable)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'addStudentBtn':
                var data = checkStatus.data;
                layer.alert(JSON.stringify(data));
                break;
            case 'editStudentBtn':
                var data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');
                break;
            case 'isAll':
                layer.msg(checkStatus.isAll ? '全选' : '未全选');
                break;
        };
    });

    exports('studentTable', {});
})
