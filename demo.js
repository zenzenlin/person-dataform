$(document).ready(function () {
    // alert('abc');
    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();

    // table hover cross color change 
    $('td').mouseover(function () {
        $(this).siblings().css('background-color', '#0c9'); //同層換色
        var ind = $(this).index(); //第幾個欄
        $('td:nth-child(' + (ind + 1) + ')').css('background-color', '#0c9'); //同欄換色
    });
    // remove bgc css style when mouseleave
    $('td').mouseleave(function () {
        $(this).siblings().css('background-color', '');
        var ind = $(this).index();
        $('td:nth-child(' + (ind + 1) + ')').css('background-color', '');
    });

    // 新增按鈕
    $("#addbutton").click(function () {
        console.log('addData')
        $("#send").click(function (e) {
            var url = "ajax/ajaxCard";
            var cnname = $("#addcnname").val();
            var enname = $("#addenname").val();
            var phone = $("#addphone").val();
            var email = $("#addemail").val();
            var sex = $('input:radio:checked[name="addsex"]').val();
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.cnname = cnname;
            ajaxobj.enname = enname;
            ajaxobj.sex = sex;
            ajaxobj.phone = phone;
            ajaxobj.email = email;
            if(phone=='' || email=='' || cnname=='') {
                if(phone=='' || phone.length < 10) {
                    alert('請填寫 phone 或長度不足10碼')
                } if(email == '') {
                    alert('請填寫 email')
                } if(cnname == '') {
                    alert('請填寫 姓名')
                } 
            } else {
                ajaxobj.add();
            }
            e.preventDefault();
        })
    })
    // 搜尋按鈕
    $("#searchbutton").click(function () {
        $("#dialog-searchconfirm").dialog({
            resizable: true,
            height: $(window).height() * 0.4,// dialog視窗度
            width: $(window).width() * 0.4,
            modal: true,
            buttons: {
                // 自訂button名稱
                "搜尋": function (e) {
                    var url = "ajax/ajaxCard";
                    // var data = $("#searchform").serialize();
                    var cnname = $("#secnname").val();
                    var enname = $("#seenname").val();
                    var sex = $('input:radio:checked[name="sesex"]').val();
                    var ajaxobj = new AjaxObject(url, 'json');
                    ajaxobj.cnname = cnname;
                    ajaxobj.enname = enname;
                    ajaxobj.sex = sex;
                    ajaxobj.search();

                    e.preventDefault(); // avoid to execute the actual submit of the form.
                },
                "重新填寫": function () {

                    $("#searchform")[0].reset();
                },
                "取消": function () {
                    $(this).dialog("close");
                }
            }
        });
    })
    // 修改鈕
    $("#cardtable").on('click', '.modifybutton', function () {
        console.log('A1')
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.modify_get();
    })
    // 刪除鈕
    $("#cardtable").on('click', '.deletebutton', function () {
        var deleteid = $(this).attr('id').substring(12);
        var url = "ajax/ajaxCard";
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.id = deleteid;
        $('#delcfmModel').modal();
        $('#delcfmModel').on('click', '#deleteConfirm', function () {
            console.log('AAA')
            ajaxobj.delete();
        });
    })
    // 點擊手機顯示資訊
    $(".phone").on('click', function () {
        console.log(this,'聯絡方式：xxxx-xxx-xxx')
    })
    // 自適應視窗
    // $(window).resize(function () {
    //     var wWidth = $(window).width();
    //     var dWidth = wWidth * 0.4;
    //     var wHeight = $(window).height();
    //     var dHeight = wHeight * 0.4;
    //     // $("#dialog-confirm").dialog("option", "width", dWidth);
    //     // $("#dialog-confirm").dialog("option", "height", dHeight);
    // });
});

function refreshTable(data) {
    // var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var cnname = item.cnname;
        var enname = item.enname;
        var phone = item.phone;
        var strsex = '';
        if (item.sex == 0)
            strsex = '男';
        else
            strsex = '女';
        var row = $("<tr></tr>");// [性別]中文名子(英文名子)
        row.append($(`<td data-toggle="tooltip" data-placement="right" title="${[strsex]+cnname+(enname)}"></td>`).html(item.cnname));
        row.append($("<td></td>").html(item.enname));
        row.append($("<td></td>").html(strsex));
        row.append($(`<td class="phone" data-toggle="popover" title="聯絡方式：" data-content="${phone}"></td>`).html(''|item.phone));
        row.append($("<td></td>").html(''|item.email));
        row.append($("<td></td>").html('<button id="modifybutton' + item.s_sn + '" class="btn btn-secondary modifybutton" style="font-size:16px;font-weight:bold;">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'));
        row.append($("<td></td>").html('<button id="deletebutton' + item.s_sn + '" class="btn btn-danger deletebutton" style="font-size:16px;font-weight:bold;">刪除 <span class="glyphicon glyphicon-trash"></span></button>'));
        $("#cardtable").append(row);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
        $(function () {
            $('[data-toggle="popover"]').popover()
        })
    });
}

function initEdit(response) {
    console.log("A3")
    var modifyid = $("#cardtable").attr('id').substring(12);
    $("#mocnname").val(response[0].cnname);
    $("#moenname").val(response[0].enname);
    if (response[0].sex == 0) {
        $("#modifyman").prop("checked", true);
        $("#modifywoman").prop("checked", false);
    }
    else {
        $("#modifyman").prop("checked", false);
        $("#modifywoman").prop("checked", true);
    }
    $("#modifysid").val(modifyid);
    // edit completed and update data
    $('#editModal').modal('show')
    $("#editSend").click(function (e) {
            // $("#modifyform").submit();
            var url = "ajax/ajaxCard";
            var cnname = $("#mocnname").val();
            var enname = $("#moenname").val();
            var sex = $('input:radio:checked[name="mosex"]').val();
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.cnname = cnname;
            ajaxobj.enname = enname;
            ajaxobj.sex = sex;
            ajaxobj.id = modifyid;
            ajaxobj.modify();
            console.log("A4")

            e.preventDefault(); // avoid to execute the actual submit of the form.
            },
            // "重新填寫": function () {
            //     $("#modifyform")[0].reset();
            // },
            // "取消": function () {
            //     $(this).dialog("close");
            // }
    )

    // $("#dialog-modifyconfirm").dialog({
    //     resizable: true,
    //     height: $(window).height() * 0.4,// dialog視窗度
    //     width: $(window).width() * 0.4,
    //     modal: true,
    //     buttons: {
    //       // 自訂button名稱
    //     "修改": function (e) {
    //           // $("#modifyform").submit();
    //         var url = "ajax/ajaxCard";
    //         var cnname = $("#mocnname").val();
    //         var enname = $("#moenname").val();
    //         var sex = $('input:radio:checked[name="mosex"]').val();
    //         var ajaxobj = new AjaxObject(url, 'json');
    //         ajaxobj.cnname = cnname;
    //         ajaxobj.enname = enname;
    //         ajaxobj.sex = sex;
    //         ajaxobj.id = modifyid;
    //         ajaxobj.modify();

    //         e.preventDefault(); // avoid to execute the actual submit of the form.
    //         },
    //         "重新填寫": function () {
    //             $("#modifyform")[0].reset();
    //         },
    //         "取消": function () {
    //             $(this).dialog("close");
    //         }
    //     },
    //     error: function (exception) { alert('Exeption:' + exception); }
    // });
}
/**
 * 
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alert = function () {
    alert("Alert:");
}
AjaxObject.prototype.getall = function () {
    response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
    refreshTable(JSON.parse(response));
}
AjaxObject.prototype.add = function () {
    response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"},{"s_sn":"52","cnname":"新增帳號","enname":"NewAccount","sex":"1"}]';
    refreshTable(JSON.parse(response));
    $('#exampleModal').modal('hide')
}
AjaxObject.prototype.modify = function () {
    response =  '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
    refreshTable(JSON.parse(response));
    $('#editModal').modal('hide')
}
AjaxObject.prototype.modify_get = function () {
    console.log("A2")
    response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
    initEdit(JSON.parse(response));
}
AjaxObject.prototype.search = function () {
    response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
    refreshTable(JSON.parse(response));
    $("#dialog-searchconfirm").dialog("close");
}
AjaxObject.prototype.delete = function () {
    response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
    refreshTable(JSON.parse(response));
    $('#delcfmModel').modal('hide')
}